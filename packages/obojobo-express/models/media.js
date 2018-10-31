const fs = require('fs')
const sharp = require('sharp')

const mediaConfig = oboRequire('config').media
const logger = oboRequire('logger.js')
const db = oboRequire('db')

class Media {
	static parseCustomImageDimensions(dimensionsAsString) {
		let width, height

		const parsedDimensions = dimensionsAsString.split('x'),
			finalDimensions = {}

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

	static cacheImageInDb(imageBinary, imageMetadata, imageDimensions, originalImageId) {
		return (
			db
				.tx(transactionDb => {
					return transactionDb
						.one(
							`
						INSERT INTO binaries
							(blob, file_size, mime_type)
						VALUES
							($[imageBinary], $[mediaSize], $[mimeType])
						RETURNING *
						`,
							{ imageBinary, mediaSize: imageMetadata.size, mimeType: imageMetadata.format }
						)
						.then(result => {
							return transactionDb.one(
								`
								INSERT INTO media_binaries
									(media_id, binary_id, dimensions)
								VALUES
									($[mediaId], $[mediaBinariesId], $[imageDimensions])
								RETURNING *
								`,
								{ mediaId: originalImageId, mediaBinariesId: result.id, imageDimensions }
							)
						})
				})
				.then(newMediaRecord => {
					// transaction committed
					return newMediaRecord.media_id
				})
				// catches any errors from transaction queries
				.catch(err => {
					logger.error(err)
					throw err
				})
		)
	}

	static createAndSave(userId, fileInfo, dimensions = 'original') {
		let mediaBinaryData = null,
			mediaData = null

		return db
			.tx(transactionDb => {
				const file = fs.readFileSync(fileInfo.path)

				return transactionDb
					.one(
						`
						INSERT INTO binaries
							(blob, file_size, mime_type)
						VALUES
							($[file], $[file_size], $[mime_type])
						RETURNING *`,
						{ file, file_size: fileInfo.size, mime_type: fileInfo.mimetype }
					)
					.then(result => {
						mediaBinaryData = result

						return transactionDb.one(
							`
								INSERT INTO media
									(user_id, file_name)
								VALUES
									($[userId], $[filename])
								RETURNING *`,
							{ userId, filename: fileInfo.filename }
						)
					})
					.then(result => {
						mediaData = result

						return transactionDb.one(
							`
							INSERT INTO media_binaries
								(media_id, binary_id, dimensions)
							VALUES
								($[mediaId], $[mediaBinariesId], $[dimensions])
							RETURNING *`,
							{ mediaId: mediaData.id, mediaBinariesId: mediaBinaryData.id, dimensions }
						)
					})
			})
			.then(() => {
				// Delete the temporary media stored by Multer
				fs.unlinkSync(fileInfo.path)

				// ID of the user media, not the binary data
				return mediaData.id
			})
			.catch(err => {
				logger.error(err)
				throw err
			})
	}
}

module.exports = Media
