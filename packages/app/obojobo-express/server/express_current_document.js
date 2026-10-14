const DraftDocument = oboRequire('server/models/draft')
const logger = oboRequire('server/logger')

const setCurrentDocument = (req, draftDocument) => {
	if (!(draftDocument instanceof DraftDocument)) {
		throw new Error('Invalid DraftDocument for Current draftDocument')
	}
	req.currentDocument = draftDocument
}

const resetCurrentDocument = req => {
	req.currentDocument = null
}

const chooseSplitRunDraft = (user, draftA, draftB) => (user.createdAt % 2 === 0 ? draftA : draftB)

const requireCurrentDocument = req => {
	if (req.currentDocument) {
		return Promise.resolve(req.currentDocument)
	}

	// Figure out where the draftId is in this request
	let draftId = null

	// Check first if this is a split-run request, in which case
	//  there will be two drafts indicated as options and we need
	//  to choose one
	// Otherwise this will be a single-module request
	if (req.params && req.params.draftA && req.params.draftB) {
		draftId = chooseSplitRunDraft(req.currentUser, req.params.draftA, req.params.draftB)
	} else if (req.body && req.body.draftA && req.body.draftB) {
		draftId = chooseSplitRunDraft(req.currentUser, req.body.draftA, req.body.draftB)
	} else if (req.body && req.body.event && req.body.event.draftA && req.body.event.draftB) {
		draftId = chooseSplitRunDraft(req.currentUser, req.body.event.draftA, req.body.event.draftB)
	} else if (req.params && req.params.draftId) {
		draftId = req.params.draftId
	} else if (req.body && req.body.draftId) {
		draftId = req.body.draftId
	} else if (req.body && req.body.event && req.body.event.draft_id) {
		draftId = req.body.event.draft_id
	}

	if (draftId === null) {
		logger.warn('No Session or Current DraftDocument?', req.currentDocument)
		return Promise.reject(new Error('DraftDocument Required'))
	}

	return DraftDocument.fetchById(draftId).then(draftDocument => {
		setCurrentDocument(req, draftDocument)
		return req.currentDocument
	})
}

module.exports = (req, res, next) => {
	req.setCurrentDocument = setCurrentDocument.bind(this, req)
	req.requireCurrentDocument = requireCurrentDocument.bind(this, req)
	req.resetCurrentDocument = resetCurrentDocument.bind(this, req)
	next()
}
