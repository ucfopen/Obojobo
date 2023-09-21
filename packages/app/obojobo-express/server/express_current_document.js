const DraftDocument = oboRequire('server/models/draft')
const DraftsMetadata = require('obojobo-repository/server/models/drafts_metadata')
const logger = oboRequire('server/logger')

const _getDraftId = req => {
	// Figure out where the draftId is in this request
	if (req.params && req.params.draftId) {
		return req.params.draftId
	} else if (req.body && req.body.draftId) {
		return req.body.draftId
	} else if (req.body && req.body.event && req.body.event.draft_id) {
		return req.body.event.draft_id
	}
	return null
}

const setCurrentDocument = (req, draftDocument) => {
	if (!(draftDocument instanceof DraftDocument)) {
		throw new Error('Invalid DraftDocument for Current draftDocument')
	}
	req.currentDocument = draftDocument
}

const resetCurrentDocument = req => {
	req.currentDocument = null
}

const requireDraftWritable = req => {
	const draftId = _getDraftId(req)
	if (draftId === null) {
		logger.warn('No Session or Current DraftDocument?', req.currentDocument)
		return Promise.reject(new Error('DraftDocument Required'))
	}

	return DraftsMetadata.getByDraftIdAndKey(draftId, 'read_only').then(readOnly => {
		if (readOnly) return Promise.reject(new Error('Requested document is read-only'))
		return Promise.resolve()
	})
}

const requireCurrentDocument = req => {
	if (req.currentDocument) {
		return Promise.resolve(req.currentDocument)
	}

	// Figure out where the draftId is in this request
	const draftId = _getDraftId(req)

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
	req.requireDraftWritable = requireDraftWritable.bind(this, req)
	next()
}
