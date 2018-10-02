const express = require('express')
const logger = oboRequire('logger')
const MediaModel = oboRequire('models/media')
const router = express.Router()

const {
    requireCurrentUser,
    requireCurrentVisit
} = oboRequire('express_validators')

// Upload media file
// mounted as /api/media/new
router
    .route('/new')
    .post([requireCurrentUser])
    .post((req, res, next) => {
        MediaModel.createAndSave(req.currentUser.id, req.body);
    })

module.exports = router
    