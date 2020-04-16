const express = require('express')
const router = express.Router()
const multer = require('multer')
const mediaConfig = oboRequire('server/config').media
const MediaModel = oboRequire('server/models/media')
const {
	requireCurrentUser,
	validPageNumber,
	validPerPageNumber,
	checkValidationRules
} = oboRequire('server/express_validators')

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

// Get list of media for the current user
// mounted as /api/media/all
router
	.route('/all')
	.get([requireCurrentUser, validPageNumber, validPerPageNumber, checkValidationRules])
	.get((req, res, next) => {
		// page and per_page are validated above
		const page = parseInt(req.query.page, 10) || 1
		const per_page = parseInt(req.query.per_page, 10) || 10
		const start = page * per_page - per_page // page 1 should be items 0 - 10

		MediaModel.fetchByUserId(req.currentUser.id, start, per_page)
			.then(medias => {
				res.status(200)
				res.send(medias)
			})
			.catch(next)
	})

module.exports = router
