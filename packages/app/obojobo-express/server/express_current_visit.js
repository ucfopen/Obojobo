const VisitModel = oboRequire('server/models/visit')
const logger = oboRequire('server/logger')

// this doesn't resolve with a Visit
// internally requires the current user to be logged in!!
// also checks that the current user is the owner of this visit
// preferred method is to access currentVisit from your req object
const getCurrentVisitFromRequest = async req => {
	if (req.currentVisit) return

	// Figure out where the visitId is in this request

	let visitId = null
	if (req.params && req.params.visitId) {
		visitId = req.params.visitId
	} else if(req.query && req.query.visitId ){
		visitId = req.query.visitId
	} else {
		// In certain cases, events are sent via `navigator.sendBeacon`.
		// Request's headers cannot be set. Therefore, `req.body` is still in JSON fotmat
		try {
			req.body = JSON.parse(req.body)
		} catch (e) {} // eslint-disable-line no-empty

		if (req.body && req.body.event && req.body.event.visitId) {
			// visitId is burried in a event posted in the body
			visitId = req.body.event.visitId
		} else if (req.body && req.body.visitId) {
			// visitId posted directly to body
			visitId = req.body.visitId
		}
	}

	if (visitId === null) {
		const msg = 'Missing required Visit Id'
		logger.warn(msg)
		throw Error(msg)
	}

	// allow the current user to be loaded
	await req.requireCurrentUser()

	// fetch the requested visit
	const visit = await VisitModel.fetchById(visitId)

	// verify the visit owner is the current user
	if(req.currentUser.id !== visit.user_id){
		const msg = `Visit ${visitId} doesn't belong to current user ${req.currentUser.id}`
		logger.warn(msg)
		throw Error(msg)
	}

	// save current visit on req
	req.currentVisit = visit
}

module.exports = (req, res, next) => {
	req.getCurrentVisitFromRequest = getCurrentVisitFromRequest.bind(this, req)
	next()
}
