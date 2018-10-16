const express = require('express')
const router = express.Router()
const multer = require('multer')

const logger = oboRequire('logger')
const mediaConfig = oboRequire('config').media
const MediaModel = oboRequire('models/media')

const diskStorage = multer.diskStorage({
    destination: "./tmp/media"
});

const upload = multer({
    storage: diskStorage,
    limits: {
        fileSize: mediaConfig.maxUploadSize
    }
}).single("userImage");

const {
    requireCurrentUser,
} = oboRequire('express_validators')

// Upload media file
// mounted as /api/media/upload
router
    .route('/upload')
    .post([requireCurrentUser])
    .post((req, res, next) => {
        upload(req, res, err => {
            if(err){     
                next(new Error("An unexpected error occurred while attempting to upload the image."));
            } else {
                MediaModel
                    .createAndSave(req.currentUser.id, req.file)
                    .then(mediaId => {
                        res.send(mediaId)
                    })
                    .catch(next)
            }
        })
    })

// Get media file
// mounted as /api/media/:mediaId/:dimensions
router
    .route('/:mediaId/:dimensions')
    .get([requireCurrentUser])
    .get((req, res, next) => {
        MediaModel
            .fetchByIdAndDimensions(req.params.mediaId, req.params.dimensions)
            .then(imageData => {
                console.log(imageData);
                res.send("Success!");
            })
            .catch(next)
    })

module.exports = router
    