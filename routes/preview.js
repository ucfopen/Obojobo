var express = require('express')
var router = express.Router()
let logger = oboRequire('logger')
const Visit = oboRequire('models/visit')

// Start a preview - redirects to visit route
// mounts at /preview/:draftId
router.get('/:draftId', (req, res, next) => {
	let currentUser = null
	let currentDocument = null
	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			if (!currentUser.canViewEditor) throw new Error('Not authorized to preview')

			return Visit.createPreviewVisit(currentUser.id, currentDocument.draftId)
		})
		.then(
			visit =>
				new Promise((resolve, reject) => {
					// Saving session here solves #128
					req.session.save(err => {
						if (err) return reject(err)
						resolve(visit)
					})
				})
		)
		.then(visit => {
			res.redirect(`/view/${currentDocument.draftId}/visit/${visit.id}`)
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

module.exports = router
