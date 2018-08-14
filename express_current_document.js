const DraftDocument = oboRequire('models/draft')
const VisitModel = oboRequire('models/visit')
const logger = oboRequire('logger')

const setCurrentDocument = (req, draftDocument) => {
	if (!(draftDocument instanceof DraftDocument)) {
		throw new Error('Invalid DraftDocument for Current draftDocument')
	}
	req.currentDocument = draftDocument
}

const resetCurrentDocument = req => {
	req.currentDocument = null
}

const requireCurrentDocument = req => optionalDraftId => {
	if (req.currentDocument) {
		return Promise.resolve(req.currentDocument)
	}

	let visitId = null

	if (optionalDraftId) {
		return DraftDocument.fetchById(optionalDraftId).then(draftDocument => {
			setCurrentDocument(req, draftDocument)
			return req.currentDocument
		})
	} else {
		if (req.body && req.body.visitId) {
			visitId = req.body.visitId
		}

		if (visitId === null) {
			logger.warn('No visitId provided')
			return Promise.reject(new Error('visitId Required'))
		}

		return VisitModel.fetchById(visitId).then(visit => {
			return DraftDocument.fetchById(visit.draft_id).then(draftDocument => {
				setCurrentDocument(req, draftDocument)
				return req.currentDocument
			})
		})
	}
}

module.exports = (req, res, next) => {
	req.setCurrentDocument = setCurrentDocument.bind(this, req)
	req.requireCurrentDocument = requireCurrentDocument(req)
	req.resetCurrentDocument = resetCurrentDocument.bind(this, req)
	next()
}
