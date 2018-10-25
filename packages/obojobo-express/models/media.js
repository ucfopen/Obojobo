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

		if (width !== '*') {
			width = parseInt(width, 10)

			if (isNaN(width)) {
				const message = 'Invalid type specified for image width. Integer or * wildcard expected.'

				logger.error(message + ` Got ${dimensionsAsString} instead.`)

				throw new Error(message)
			}

			finalDimensions['width'] = width
		}

		if (height !== '*') {
			height = parseInt(height, 10)

			if (isNaN(height)) {
				const message = 'Invalid type specified for image height. Integer or * wildcard expected.'

				logger.error(message + ` Got ${dimensionsAsString} instead.`)

				throw new Error(message)
			}

			finalDimensions['height'] = height
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
				newDimensions = this.parseCustomImageDimensions(dimensionsAsString)
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
						if (result) {
							if (result.length === 1) {
								binaryId = result[0].binary_id

								if (mediaDimensions === 'original') {
									mediaFound = true
								}
							} else if (result.length === 2) {
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
				if (mediaFound) return binaryData.blob
				return this.resize(binaryData.blob, mediaDimensions)
			})
			.catch(e => {
				throw e
			})
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
			.catch(e => {
				throw e
			})
	}
}

module.exports = Media
