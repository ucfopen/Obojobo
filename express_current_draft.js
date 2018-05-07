let Draft = oboRequire('models/draft')
let logger = oboRequire('logger')

let setCurrentDraft = (req, draft) => {
	if (!(draft instanceof Draft)) throw new Error('Invalid Draft for Current draft')
	logger.info('setting current draft!')
	req.currentDraft = draft
}

let resetCurrentDraft = req => {
	req.currentDraft = null
}

// returns a Promise!!!
let getCurrentDraft = (req) => {
	if (!req.currentDraft){
		// If the draftId is not in params, we can't retrive the draft
		if(!req.params || !req.params.draftId){
			logger.warn(
				'No Session or Current Draft?',
				req.currentDraft
			)
			return Promise.reject(new Error('Draft Required'))
		}

		return Draft.fetchById(req.params.draftId)
		.then(draft => {
			setCurrentDraft(req, draft)
			return req.currentDraft
		})
	}

	return Promise.resolve(req.currentDraft)
}

let requireCurrentDraft = req => {
	// returns a promise
	return req
		.getCurrentDraft()
		.then(draft => {
			return draft
		})
		.catch(err => {
			logger.warn('requireCurrentDraft', err)
			throw new Error('Draft Required')
		})
}

module.exports = (req, res, next) => {
	req.setCurrentDraft = setCurrentDraft.bind(this, req)
	req.getCurrentDraft = getCurrentDraft.bind(this, req)
	req.requireCurrentDraft = requireCurrentDraft.bind(this, req)
	req.resetCurrentDraft = resetCurrentDraft.bind(this, req)
	next()
}
