const fileType = require('file-type')
const fs = require('fs').promises
const isSvg = require('is-svg')
const sharp = require('sharp')

const mediaConfig = oboRequire('server/config').media
const logger = oboRequire('server/logger')
const db = oboRequire('server/db')
const oboEvents = oboRequire('server/obo_events')

const MODE_INSERT_ORIGINAL_IMAGE = 'modeInsertOriginalImage'
const MODE_INSERT_RESIZED_IMAGE = 'modeInsertResizedImage'

const MIMETYPE_SVG = 'image/svg+xml'
const MIMETYPE_GIF = 'image/gif'

class Media {
	// Return true if both dimensions are supplied or if the requested targetNewSize is smaller than
	// the original size:
	static async shouldResizeMedia(originalMediaBinaryData, targetDimensions) {
		const targetNewSize = Media.getDimensionValues(targetDimensions)
		if (targetNewSize.width && targetNewSize.height) return true

		const originalImageMetadata = await sharp(originalMediaBinaryData).metadata()
		return (
			targetNewSize.width < originalImageMetadata.width ||
			targetNewSize.height < originalImageMetadata.height
		)
	}

	// Convinence method to take the metadata produced by sharp and turn it into a valid mimetype
	static getMimeTypeFromMetadata(metadata) {
		return `image/${metadata.format}`
	}

	static isMimeTypeResizable(mimeType) {
		switch (mimeType) {
			case MIMETYPE_SVG:
			case MIMETYPE_GIF:
				return false

			default:
				return true
		}
	}

	static parseCustomImageDimensions(dimensionsAsString) {
		let width
		let height

		const parsedDimensions = dimensionsAsString.split('x')
		const finalDimensions = {}

		if (parsedDimensions.length !== 2) {
			const message =
				'Invalid dimension string provided. Expecting {width}x{height} (i.e. 1200x900).'

			logger.error(message + ` Got ${dimensionsAsString} instead.`)

			throw new Error(message)
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

	static getDimensionValues(dimensionsAsString) {
		switch (dimensionsAsString) {
			case 'small':
				return mediaConfig.presetDimensions.small
			case 'medium':
				return mediaConfig.presetDimensions.medium
			case 'large':
				return mediaConfig.presetDimensions.large
			default:
				return Media.parseCustomImageDimensions(dimensionsAsString)
		}
	}

	static resize(mediaBinary, { width, height }) {
		const fit = width && height ? 'fill' : 'cover'

		return sharp(mediaBinary)
			.resize({
				fit,
				width,
				height
			})
			.toBuffer()
	}

	// targetDimensions can either be a label ['small', 'medium', 'large', 'original'] or a string
	// of specific dimensions (such as "640x*", "*x480" or "640x480").
	// If the requested dimension has already been processed and saved it is retrieved without any
	// additional processing. If a single dimension is requested (such as one of the labels like
	// 'small' which simply is a width or a specific dimension with a wildcard like '640x*') then
	// the image will be scaled proportionally up until that original image's native size. In this
	// case the image will not be upscaled (so, for example, for an image that is originally
	// 640x480 if you request the size '1080x*' you'll simply get back the original 640x480 size).
	// However, if you request two dimensions (like '640x480) the image will distort and will
	// potentially be upscaled if needed to ensure that the resulting image matches the requested
	// size.
	static async fetchByIdAndDimensions(mediaId, targetDimensions = 'large') {
		const dimensionOriginal = mediaConfig.originalMediaTag

		let originalMedia = null

		const medias = await db.manyOrNone(
			`
			SELECT *
			FROM media_binaries M
			JOIN binaries B
			ON M.binary_id = B.id
			WHERE M.media_id = $[mediaId]
			AND (M.dimensions = $[targetDimensions]
			OR M.dimensions = $[dimensionOriginal])
			ORDER BY M.dimensions
			`,
			{ mediaId, targetDimensions, dimensionOriginal }
		)

		if (!medias || !medias.length) throw new Error('Image not found')

		// Create a map to retrieve the resulting media objects by their dimension label
		const mediaByDimensions = new Map(medias.map(m => [m.dimensions, m]))
		originalMedia = mediaByDimensions.get(dimensionOriginal)

		if (!originalMedia) throw new Error('Original image size not found')

		// Return the requested size (if we have it)
		const targetMedia = mediaByDimensions.get(targetDimensions)
		if (targetMedia) {
			return {
				binaryData: targetMedia.blob,
				mimeType: targetMedia.mime_type
			}
		}

		// If the media type is not resizable of if the new size we want is larger than the
		// original size then we won't resize it, instead we'll just return the original
		// size (ignoring whatever the requested size was)
		if (
			!Media.isMimeTypeResizable(originalMedia.mime_type) ||
			!(await Media.shouldResizeMedia(originalMedia.blob, targetDimensions))
		) {
			return {
				binaryData: originalMedia.blob,
				mimeType: originalMedia.mime_type
			}
		}

		// If we are here then we didn't find the media at the size we were looking for.
		// Now we need to resize the image, store the new dimension in the database
		// for future retrieval, then return the newly resized image data.
		const resizedInfo = await Media.saveImageAtNewSize(
			mediaId,
			originalMedia.blob,
			targetDimensions
		)
		return {
			binaryData: resizedInfo.binary,
			mimeType: Media.getMimeTypeFromMetadata(resizedInfo.metadata)
		}
	}

	static fetchByUserId(userId, start, count) {
		if (!userId || !Number.isInteger(start) || !Number.isInteger(count)) {
			throw new Error('Invalid argument.')
		}

		return db
			.manyOrNone(
				`
					SELECT
						id,
						file_name as "fileName",
						created_at as "createdAt"
					FROM
						media
					WHERE
						user_id = $[userId]
					ORDER BY
						created_at DESC
					LIMIT $[count]
					OFFSET $[start]
				`,
				{
					userId,
					start,
					count: count + 1 // ask for 1 more then we need to determine if there are more
				}
			)
			.then(res => {
				const hasMore = res.length > count
				// remove the extra result if it's present
				const media = hasMore ? res.splice(0, count) : res
				return {
					media,
					hasMore
				}
			})
			.catch(err => {
				logger.error(err)
				throw err
			})
	}

	static storeImageInDb({ filename, binary, size, mimetype, dimensions, mode, mediaId, userId }) {
		let mediaBinaryId = null

		if (!binary || !size || !mimetype || !dimensions || !mode) {
			throw new Error('Inserting an image, but one or more required arguments not provided.')
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

		return db
			.tx(transactionDb => {
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
					RETURNING id`,
						{ binary, size, mimetype }
					)
					.then(insertBinaryResult => {
						mediaBinaryId = insertBinaryResult.id

						// If an orginal image is being stored, this query will create a record that the user uploaded an
						// image. From this record, the user's original image and resized images derived from the original
						// can be found. All resized images derived from an original will have the same mediaId as the
						// original, so it is not necessary to store a reference to the resized images in the media table.
						if (mode === MODE_INSERT_ORIGINAL_IMAGE) {
							return transactionDb
								.one(
									`
							INSERT INTO media
								(user_id, file_name)
							VALUES
								($[userId], $[filename])
							RETURNING id`,
									{ userId, filename }
								)
								.then(insertMediaResult => {
									// update the mediaId now that we have it
									// if we're resizing, we already have it
									mediaId = insertMediaResult.id
								})
						}
					})
					.then(() => {
						// The media_binaries table links media records to their respective binary information. This
						// query creates that link. Both original and resized images must be linked. Since resized
						// images have the same id as the original they are derived from, a dimensions field is
						// stored to describe the binary the link is pointing to.
						return transactionDb.none(
							`
							INSERT INTO media_binaries
								(media_id, binary_id, dimensions)
							VALUES
								($[mediaId], $[mediaBinaryId], $[dimensions])
							`,
							{ mediaId, mediaBinaryId, dimensions }
						)
					})
			})
			.then(() => ({
				media_id: mediaId,
				filename,
				mode,
				mimetype,
				dimensions
			}))
	}

	static async saveImageAtNewSize(originalImageId, originalImageBinary, targetDimensions) {
		const newSize = Media.getDimensionValues(targetDimensions)

		const resizedBinary = await Media.resize(originalImageBinary, newSize)
		const imageMetadata = await sharp(resizedBinary).metadata()

		await Media.storeImageInDb({
			binary: resizedBinary,
			size: imageMetadata.size,
			mimetype: Media.getMimeTypeFromMetadata(imageMetadata),
			dimensions: targetDimensions,
			mode: MODE_INSERT_RESIZED_IMAGE,
			mediaId: originalImageId,
			userId: null
		})

		oboEvents.emit(Media.EVENT_RESIZED_IMAGE_CREATED, { originalImageId, targetDimensions })

		return {
			metadata: imageMetadata,
			binary: resizedBinary
		}
	}

	static async isValidFileType(file) {
		const allowedFileTypes = new RegExp(mediaConfig.allowedMimeTypesRegex)

		// fileType looks into the file to find the true file type using magic numbers
		const fileTypeInfo = await fileType.fromBuffer(file)

		// fileType does not support SVGs because the whole buffer must be read to determine if the
		// buffer is an SVG.
		return (fileTypeInfo && allowedFileTypes.test(fileTypeInfo.ext)) || isSvg(file)
	}

	static async createAndSave(userId, fileInfo) {
		let file

		try {
			if (fileInfo.buffer) {
				// allow fileInfo to already contain a loaded buffer
				file = fileInfo.buffer
			} else {
				// load the file from disk
				file = await fs.readFile(fileInfo.path)
			}
		} catch (error) {
			// calling methods expect a thenable object to be returned
			logger.logError('Error Reading media file', error)
			throw error
		}

		const isValid = await Media.isValidFileType(file, fileInfo.originalname, fileInfo.mimetype)

		if (!isValid) {
			// Delete the temporary media stored by Multer
			if (fileInfo.path) await fs.unlink(fileInfo.path)
			throw new Error(
				`File upload only supports the following filetypes: ${mediaConfig.allowedMimeTypesRegex
					.split('|')
					.join(', ')}`
			)
		}

		try {
			const mediaRecord = await Media.storeImageInDb({
				filename: fileInfo.originalname,
				binary: file,
				size: fileInfo.size,
				mimetype: fileInfo.mimetype,
				dimensions: mediaConfig.originalMediaTag,
				mode: MODE_INSERT_ORIGINAL_IMAGE,
				mediaId: null,
				userId
			})

			// Delete the temporary media stored by Multer
			if (fileInfo.path) await fs.unlink(fileInfo.path)

			oboEvents.emit(Media.EVENT_IMAGE_CREATED, {
				userId,
				fileSize: fileInfo.size,
				mimeType: fileInfo.mimetype,
				originalName: fileInfo.originalname
			})

			// ID of the user media, not the binary data
			return mediaRecord
		} catch (error) {
			logger.logError('Error saving media file', error)
			throw error
		}
	}
}

Media.EVENT_RESIZED_IMAGE_CREATED = 'EVENT_RESIZED_IMAGE_CREATED'
Media.EVENT_IMAGE_CREATED = 'EVENT_IMAGE_CREATED'

module.exports = Media
