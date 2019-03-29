const VisitModel = oboRequire('models/visit')
const logger = oboRequire('logger')

// this doesn't resolve with a Visit
// preferred method is to access currentVisit from your req object
const getCurrentVisitFromRequest = req => {
	if (req.currentVisit) {
		return Promise.resolve()
	}

	// Figure out where the visitId is in this request
	let visitId = null
	if (req.body && req.body.event && req.body.event.visitId) {
		// visitId is burried in a event posted in the body
		visitId = req.body.event.visitId
	} else if (req.body && req.body.visitId) {
		// visitId posted directly to body
		visitId = req.body.visitId
	}

	if (visitId === null) {
		logger.warn('Missing required Visit Id')
		return Promise.reject(new Error('Missing required Visit Id'))
	}

	return VisitModel.fetchById(visitId).then(visit => {
		req.currentVisit = visit
	})
}

module.exports = (req, res, next) => {
	req.getCurrentVisitFromRequest = getCurrentVisitFromRequest.bind(this, req)
	next()
}
