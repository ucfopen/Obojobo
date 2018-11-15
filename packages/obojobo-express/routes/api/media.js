const express = require('express')
const router = express.Router()
const multer = require('multer')

const mediaConfig = oboRequire('config').media
const MediaModel = oboRequire('models/media')

const diskStorage = multer.diskStorage({
	destination: mediaConfig.tempUploadDestination
})

// single() takes the field name of the file field
//  in the multipart form being submitted
const multerUpload = multer({
	storage: diskStorage,
	limits: {
		fileSize: mediaConfig.maxUploadSize
	},
	fileFilter: (req, file, cb) => {
		const isValidFile = MediaModel.isValidFileType(file.originalname, file.mimetype)

		if (!isValidFile) {
			// there is an error, do not accept the file
			cb(
				'File upload only supports the following filetypes: ' +
					mediaConfig.allowedMimeTypesRegex.split('|').join(', '),
				false
			)
		}

		// there is no error, accept the file
		return cb(null, true)
	}
}).single('userImage')

const { requireCurrentUser } = oboRequire('express_validators')

const upload = (req, res) => {
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
	.post([requireCurrentUser])
	.post((req, res, next) => {
		upload(req, res)
			.then(() => {
				return (
					MediaModel.createAndSave(req.currentUser.id, req.file)
						.then(mediaId => {
							res.send(mediaId)
						})
						// catches errors thrown by Media Model
						.catch(next)
				)
			})
			// catches errors thrown by upload
			.catch(next)
	})

// Get media file
// mounted as /api/media/:mediaId/:dimensions
router
	.route('/:mediaId/:dimensions')
	.get([requireCurrentUser])
	.get((req, res, next) => {
		MediaModel.fetchByIdAndDimensions(req.params.mediaId, req.params.dimensions)
			.then(imageData => {
				res.send(imageData)
			})
			.catch(next)
	})

module.exports = router
