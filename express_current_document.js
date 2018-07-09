let DraftDocument = oboRequire('models/draft')
let logger = oboRequire('logger')

let setCurrentDocument = (req, draftDocument) => {
	if (!(draftDocument instanceof DraftDocument)) throw new Error('Invalid DraftDocument for Current draftDocument')
	req.currentDocument = draftDocument
}

let resetCurrentDocument = req => {
	req.currentDocument = null
}

let requireCurrentDocument = (req) => {
	if(req.currentDocument){
		return Promise.resolve(req.currentDocument)
	}

	// Figure out where the draftId is in this request
	let draftId = null
	if(req.params && req.params.draftId) {
		draftId = req.params.draftId
	} else if(req.body && req.body.draftId) {
		draftId = req.body.draftId
	} else if(req.body && req.body.event && req.body.event.draft_id){
		draftId = req.body.event.draft_id
	}

	if(draftId === null) {
		logger.warn(
			'No Session or Current DraftDocument?',
			req.currentDocument
		)
		return Promise.reject(new Error('DraftDocument Required'))
	}

	return DraftDocument.fetchById(draftId)
		.then(draftDocument => {
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
