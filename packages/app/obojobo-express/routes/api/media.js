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
