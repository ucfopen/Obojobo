const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const mediaConfig = oboRequire('config').media
const logger = oboRequire('logger.js')
const db = oboRequire('db')

const MODE_INSERT_ORIGINAL_IMAGE = 'modeInsertOriginalImage'
const MODE_INSERT_RESIZED_IMAGE = 'modeInsertResizedImage'

class Media {
	static parseCustomImageDimensions(dimensionsAsString) {
		let width
		let height

		const parsedDimensions = dimensionsAsString.split('x')
		const finalDimensions = {}

		if (parsedDimensions.length !== 2) {
			const message =
				'Invalid dimension string provided. Expecting {width}x{height} (i.e. 1200x900).'

			logger.error(message + ` Got ${dimensionsAsString} instead.`)

			throw new Error(
				'Invalid dimension string provided. Expecting {width}x{height} (i.e. 1200x900).'
			)
		}

		width = parsedDimensions[0]
		height = parsedDimensions[1]

		if (width === '*' && height === '*') {
			const message =
				'Must provide a height, width, or height and width. *.* is an invalid image dimension string.'

			logger.error(message)

			throw new Error(message)
		}

		if (width !== '*') {
			width = parseInt(width, 10)

			if (isNaN(width)) {
				const message = 'Invalid type specified for image width. Integer or * wildcard expected.'

				logger.error(message + ` Got ${dimensionsAsString} instead.`)

				throw new Error(message)
			}

			// Enforce min and max width
			finalDimensions['width'] = Math.max(
				mediaConfig.minImageSize,
				Math.min(mediaConfig.maxImageSize, width)
			)
		}

		if (height !== '*') {
			height = parseInt(height, 10)

			if (isNaN(height)) {
				const message = 'Invalid type specified for image height. Integer or * wildcard expected.'

				logger.error(message + ` Got ${dimensionsAsString} instead.`)

				throw new Error(message)
			}

			// enforce min and max height
			finalDimensions['height'] = Math.max(
				mediaConfig.minImageSize,
				Math.min(mediaConfig.maxImageSize, height)
			)
		}

		return finalDimensions
	}

	static resize(mediaBinary, dimensionsAsString) {
		let newDimensions

		switch (dimensionsAsString) {
			case 'small': {
				newDimensions = mediaConfig.presetDimensions.small
				break
			}
			case 'medium': {
				newDimensions = mediaConfig.presetDimensions.medium
				break
			}
			case 'large': {
				newDimensions = mediaConfig.presetDimensions.large
				break
			}
			default: {
				newDimensions = Media.parseCustomImageDimensions(dimensionsAsString)
			}
		}

		// maintains aspect ratio
		newDimensions['fit'] = 'inside'

		return sharp(mediaBinary)
			.resize(newDimensions)
			.toBuffer()
	}

	static fetchByIdAndDimensions(mediaId, mediaDimensions = 'large') {
		let binaryId = null

		let mediaFound = false

		return db
			.tx(transactionDb => {
				// find the users media reference
				return transactionDb
					.manyOrNone(
						`
						SELECT *
						FROM media_binaries
						WHERE media_id = $[mediaId]
						AND (dimensions = $[mediaDimensions]
						OR dimensions = $[originalMediaTag])
						ORDER BY dimensions
						`,
						{ mediaId, mediaDimensions, originalMediaTag: mediaConfig.originalMediaTag }
					)
					.then(result => {
						if (result && result.length > 0) {
							// result.length == 1 implies that the query only returned a reference to the
							// original image and a resize may be necessary to provide an image with the
							// requested dimensions
							if (result.length === 1) {
								binaryId = result[0].binary_id

								// If the original image is being requested, a resize is not necessary
								if (mediaDimensions === 'original') {
									mediaFound = true
								}
							} else if (result.length === 2) {
								// result.length == 2 implies that the query found and returned a reference to
								// an image with the requested dimensions and a resize is not necessary
								binaryId =
									result[0].dimensions === mediaConfig.originalMediaTag
										? result[1].binary_id
										: result[0].binary_id

								mediaFound = true
							} else {
								throw new Error('Too many images returned')
							}
						} else {
							throw new Error('Image not found')
						}

						return transactionDb.one(
							`
							SELECT *
							FROM binaries
							WHERE id = $[binaryId]
							`,
							{ binaryId }
						)
					})
			})
			.then(binaryData => {
				let resizedBinary = null

				// If the first query in the transaction finds a reference to the requested image with dimensions,
				// the second query returns the binary for that image with dimensions, and that binary can be
				// immediately returned.
				if (mediaFound) return binaryData.blob

				// If the first query in the transaction does not find a reference to the requested image with
				// dimensions, the second query returns the binary of the original image. To meet the request,
				// the orginal is resized and the new binary is stored in the database for future retrieval.
				// The resized image is returned.
				return Media.resize(binaryData.blob, mediaDimensions)
					.then(result => {
						resizedBinary = result
						return sharp(resizedBinary).metadata()
					})
					.then(metadata => {
						return Media.cacheImageInDb(resizedBinary, metadata, mediaDimensions, mediaId)
					})
					.then(() => {
						return resizedBinary
					})
			})
			.then(binary => {
				return binary
			})
			.catch(err => {
				logger.error(err)
				throw err
			})
	}

	static storeImageInDb({ filename, binary, size, mimetype, dimensions, mode, mediaId, userId }) {
		let mediaBinaryInfo = null

		if (!binary || !size || !mimetype || !dimensions || !mode) {
			throw new Error('One or more required arguments not provided.')
		}

		if (mode === MODE_INSERT_ORIGINAL_IMAGE && !userId) {
			throw new Error('Inserting an original image, but no user id provided')
		}

		if (mode === MODE_INSERT_ORIGINAL_IMAGE && !filename) {
			throw new Error('Inserting an original image, but no filename provided')
		}

		if (mode === MODE_INSERT_RESIZED_IMAGE && !mediaId) {
			throw new Error('Inserting a resized image, but no media id of the original image provided')
		}

		return db.tx(transactionDb => {
			// The following query takes an image binary and metadata, and stores it in the binaries database table.
			// The binaries database table holds the binaries for images uploaded by a user, and stores resized
			// images derived from the orginal user uploads. There is no difference between storing an original
			// or resized image here. All entries are independent.
			return transactionDb
				.one(
					`
					INSERT INTO binaries
						(blob, file_size, mime_type)
					VALUES
						($[binary], $[size], $[mimetype])
					RETURNING *`,
					{ binary, size, mimetype }
				)
				.then(result => {
					mediaBinaryInfo = result

					// If an orginal image is being stored, this query will create a record that the user uploaded an
					// image. From this record, the user's original image and resized images derived from the original
					// can be found. All resized images derived from an original will have the same mediaId as the
					// original, so it is not necessary to store a reference to the resized images in the media table.
					if (mode === MODE_INSERT_ORIGINAL_IMAGE) {
						return transactionDb.one(
							`
							INSERT INTO media
								(user_id, file_name)
							VALUES
								($[userId], $[filename])
							RETURNING *`,
							{ userId, filename }
						)
					}
				})
				.then(result => {
					// If a resized image is being stored, a new media record was not created. The mediaId of the
					// original image the resized image was derived from must be passed in and used.
					const mediaRecordId = mode === MODE_INSERT_ORIGINAL_IMAGE ? result.id : mediaId

					// The media_binaries table links media records to their respective binary information. This
					// query creates that link. Both original and resized images must be linked. Since resized
					// images have the same id as the original they are derived from, a dimensions field is
					// stored to describe the binary the link is pointing to.
					return transactionDb.one(
						`
							INSERT INTO media_binaries
								(media_id, binary_id, dimensions)
							VALUES
								($[mediaRecordId], $[mediaBinariesId], $[dimensions])
							RETURNING *`,
						{ mediaRecordId, mediaBinariesId: mediaBinaryInfo.id, dimensions }
					)
				})
		})
	}

	static cacheImageInDb(imageBinary, imageMetadata, imageDimensions, originalImageId) {
		// sharp does not represent mimetypes as image/{mimetype}, transforming to this format keeps database consistent
		const mimetype = `image/${imageMetadata.format}`
		return (
			Media.storeImageInDb({
				binary: imageBinary,
				size: imageMetadata.size,
				mimetype,
				dimensions: imageDimensions,
				mode: MODE_INSERT_RESIZED_IMAGE,
				mediaId: originalImageId,
				userId: null
			})
				.then(newMediaRecord => {
					return newMediaRecord.media_id
				})
				// catches any errors from transaction queries
				.catch(err => {
					logger.error(err)
					throw err
				})
		)
	}
	static isValidFileType(filename, mimetype) {
		const allowedFileTypes = new RegExp(mediaConfig.allowedMimeTypesRegex)

		// test for valid mimetype
		const isAllowerMimetype = allowedFileTypes.test(mimetype)
		// test for valid extensions
		const isAllowedExt = allowedFileTypes.test(path.extname(filename).toLowerCase())

		if (!isAllowerMimetype || !isAllowedExt) {
			return false
		}

		return true
	}

	static createAndSave(userId, fileInfo) {
		let file

		try {
			file = fs.readFileSync(fileInfo.path)
		} catch (err) {
			// calling methods expect a thenable object to be returned
			return Promise.reject(err)
		}

		return Media.storeImageInDb({
			filename: fileInfo.originalname,
			binary: file,
			size: fileInfo.size,
			mimetype: fileInfo.mimetype,
			dimensions: mediaConfig.originalMediaTag,
			mode: MODE_INSERT_ORIGINAL_IMAGE,
			mediaId: null,
			userId
		})
			.then(mediaRecord => {
				// Delete the temporary media stored by Multer
				fs.unlinkSync(fileInfo.path)
				// ID of the user media, not the binary data
				return mediaRecord.media_id
			})
			.catch(err => {
				logger.error(err)
				throw err
			})
	}
}

module.exports = Media
