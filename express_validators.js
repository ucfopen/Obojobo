const {check, validationResult} = require('express-validator/check')
const logger = oboRequire('logger')
const { matchedData } = require('express-validator/filter');
const semVerRegex = /\d+\.\d+\.\d+/

exports.getCurrentUser = (req, res, next) => {
	return req.getCurrentUser()
	.then(user => {
		next()
		return user
	})
}

// this is defined differently so it can be reused in other exports easily
const requireCurrentUser = (req, res, next, permission = null) => {
	return req.requireCurrentUser()
	.then(user => {
		if(!user || typeof user !== 'object') throw 'Missing User'
		if(permission && !user[permission]) throw 'Not Authorized'
		next()
	})
	.catch(error => {
		logger.error('Missing required current user.')
		logger.info(error)
		res.notAuthorized()
	})
}

exports.requireCurrentUser = requireCurrentUser

exports.requireCurrentDocument = (req, res, next) => {
	return req.requireCurrentDocument()
	.then(doc => {
		if(!doc || typeof doc !== 'object' || !doc.draftId) throw 'Missing Document'
	})
	.catch(error => {
		logger.error('No Session or Current DraftDocument?')
		// trigger a validation error
		// express-validator doesn't have an api to do this? so we'll do it manually
		if(!req._validationErrors) req._validationErrors = []

		req._validationErrors.push({
			location: 'session',
			param: 'Session',
			value: req.currentDocument,
			msg: 'DraftDocument Required'
		})
	})
	.then(() => {
		next() //always call next, unlike user auth, we're letting checkValidationRules handle this
	})
}

// Valitator Middleware
exports.requireDraftId = check('draftId', 'must be a valid UUID').isUUID()
exports.requireVisitId = check('visitId', 'must be a valid UUID').isUUID()
exports.requireEvent = [
	check('event.action', 'must not be empty').exists({checkNull:true,checkFalsy:true}).isString(),
	check('event.actor_time', 'must be a valid ISO8601 date string').isISO8601(),
	check('event.draft_id', 'must be a valid UUID').isUUID(),
	check('event.event_version', 'must match a valid semVer string').matches(semVerRegex),
]
exports.requireCanViewEditor = (req, res, next) => requireCurrentUser(req, res, next, 'canViewEditor')
exports.requireCanCreateDrafts = (req, res, next) => requireCurrentUser(req, res, next, 'canCreateDrafts')
exports.requireCanDeleteDrafts = (req, res, next) => requireCurrentUser(req, res, next, 'canDeleteDrafts')
exports.requireCanViewDrafts = (req, res, next) => requireCurrentUser(req, res, next, 'canViewDrafts')

exports.checkValidationRules = (req, res, next) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		const displayErrors = []
		const rawErrors = errors.mapped()
		for(let i in rawErrors){
			let e = rawErrors[i]
			displayErrors.push(`${e.param} ${e.msg}, got ${e.value}`)
		}

		const joinedErrors = displayErrors.join(', ')
		logger.error(joinedErrors)
		return res.badInput(joinedErrors)
	}

	next()
}

