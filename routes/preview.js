var express = require('express')
var router = express.Router()
let logger = oboRequire('logger')
let { createPreviewVisit } = require('../create-visit')

// Start a preview - redirects to visit route
// mounts at /preview/:draftId
router.get('/:draftId', (req, res, next) => {
	return req
		.requireCurrentUser()
		.then(currentUser => {
			if (!currentUser.canViewEditor) throw new Error('Not authorized to preview')

			return createPreviewVisit(currentUser.id, req.params.draftId)
		})
		.then(visit => new Promise((resolve, reject) => {
			// Saving session here solves #128
			req.session.save(err => {
				if (err) return reject(err)
				resolve(visit)
			})
		}))
		.then(visit => {
			res.redirect(`/view/${req.params.draftId}/visit/${visit.id}`)
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

module.exports = router
