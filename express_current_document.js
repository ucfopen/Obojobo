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
	if (!req.currentDocument){
		// Set and retrieve the draft document from params
		if(req.params && req.params.draftId){
			return DraftDocument.fetchById(req.params.draftId)
			.then(draftDocument => {
				setCurrentDocument(req, draftDocument)
				return req.currentDocument
			})

		}

		// Set and retrive the draft document from body
		if(req.body && req.body.draftId){
			return DraftDocument.fetchById(req.body.draftId)
			.then(draftDocument => {
				setCurrentDocument(req, draftDocument)
				return req.currentDocument
			})

		}

		logger.warn(
			'No Session or Current DraftDocument?',
			req.currentDocument
		)
		return Promise.reject(new Error('DraftDocument Required'))
	}

	return Promise.resolve(req.currentDocument)
}

module.exports = (req, res, next) => {
	req.setCurrentDocument = setCurrentDocument.bind(this, req)
	req.requireCurrentDocument = requireCurrentDocument.bind(this, req)
	req.resetCurrentDocument = resetCurrentDocument.bind(this, req)
	next()
}
