const express = require('express')
const router = express.Router()
const multer = require('multer')
const mediaConfig = oboRequire('config').media
const MediaModel = oboRequire('models/media')
const { requireCurrentUser } = oboRequire('express_validators')

const upload = (req, res) => {
	const diskStorage = multer.diskStorage({
		destination: mediaConfig.tempUploadDestination
	})

	// single() takes the field name of the file field
	//  in the multipart form being submitted
	const multerUpload = multer({
		storage: diskStorage,
		limits: {
			fileSize: mediaConfig.maxUploadSize
		}
	}).single('userImage')

	return new Promise((resolve, reject) => {
		multerUpload(req, res, err => {
			// catches errors thrown by multerUpload
			if (err) {
				reject(err)
			}
			resolve()
		})
	})
}

const getMediaThumbnail = mediaId => {
	return MediaModel.fetchByIdAndDimensions(mediaId, 'small')
		.then(imageData => {
			return imageData
		})
		.catch(error => console.log(error))
}

// Upload media file
// mounted as /api/media/upload
router
	.route('/upload')
	.post(requireCurrentUser)
	.post((req, res, next) => {
		upload(req, res)
			.then(() => {
				return MediaModel.createAndSave(req.currentUser.id, req.file)
					.then(mediaData => res.json(mediaData))
					.catch(next) // catches errors thrown by Media Model
			})
			.catch(next) // catches errors thrown by upload
	})

// Get list of media a thumbnail
// mounted as /api/media/all
router
	.route('/all')
	.get([requireCurrentUser])
	.get((req, res) => {
		MediaModel.fetchAllById(req.currentUser.id)
			.then(medias => {
				Promise.all(
					medias.map(async media => {
						const thumbnail = await getMediaThumbnail(media.id)
						return {
							...media,
							thumbnail
						}
					})
				)
					.then(results => {
						res.send(results)
					})
					.catch(err => console.log(err))
			})
			.catch(res.status(404))
	})

// Get media file
// mounted as /api/media/:mediaId/:dimensions
router
	.route('/:mediaId/:dimensions')
	.get([requireCurrentUser])
	.get((req, res, next) => {
		MediaModel.fetchByIdAndDimensions(req.params.mediaId, req.params.dimensions)
			.then(imageData => {
				res.contentType(imageData.mimeType)
				res.send(imageData.binaryData)
			})
			.catch(next)
	})

module.exports = router
