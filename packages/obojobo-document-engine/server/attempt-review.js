const VisitModel = oboRequire('models/visit')

const reviewAttempts = (req, res) => {
	const attempt = req.body.attempt
	let draftDocument = null
	let currentUser = null
	let isPreview

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			return VisitModel.fetchById(req.body.visitId)
		})
		.then(visit => {
			isPreview = visit.is_preview
			return req.requireCurrentDocument()
		})
		.then(currentDocument => {
			draftDocument = currentDocument
		})
		.then(() => res.success(attempt))
}

module.exports = {
	reviewAttempts
}
