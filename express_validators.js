const {check, validationResult} = require('express-validator/check')
const logger = oboRequire('logger')
const { matchedData } = require('express-validator/filter');
const semVerRegex = /\d+\.\d+\.\d+/
const apiUrlRegex = /\/api\/.*/

const requireCurrentUserAndHasPermission = (req, res, next, permission) => {
	return req.requireCurrentUser()
	.then(user => {
		next()
		if(!req.currentUser[permission]) throw 'Not Authorized'
	})
	.catch(error => {
		if(req.originalUrl.match(apiUrlRegex)){
			return res.notAuthorized()
		}

		throw 'Not Authorized'
	})
}

// Valitator Middleware
exports.requireDraftId = check('draftId', 'must be a valid UUID').isUUID()
exports.requireVisitId = check('visitId', 'must be a valid UUID').isUUID()
exports.requireEvent = [
	check('event.action', 'must not be empty').exists(),
	check('event.actor_time', 'must be a valid ISO8601 date string').isISO8601(),
	check('event.draft_id', 'must be a valid UUID').isUUID(),
	check('event.event_version', 'must match a valid semVer string').matches(semVerRegex),
	// check('event.payload', 'must not be empty').exists(),
]

// Validation Middleware
exports.requireCurrentUser = (req, res, next) => {
	return req.requireCurrentUser()
	.then(user => {
		next()
	})
	.catch(error => {
		if(req.originalUrl.match(apiUrlRegex)){
			return res.notAuthorized()
		}

		throw 'Not Authorized'
	})
}

exports.requireCanViewEditor = (req, res, next) => requireCurrentUserAndHasPermission(req, res, next, 'canViewEditor')
exports.requireCanCreateDrafts = (req, res, next) => requireCurrentUserAndHasPermission(req, res, next, 'canCreateDrafts')
exports.requireCanDeleteDrafts = (req, res, next) => requireCurrentUserAndHasPermission(req, res, next, 'canDeleteDrafts')
exports.requireCanViewDrafts = (req, res, next) => requireCurrentUserAndHasPermission(req, res, next, 'canViewDrafts')

exports.checkValidation = (req, res, next) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		let displayErrors = []
		let rawErrors = errors.mapped()
		for(let i in rawErrors){
			let e = rawErrors[i]
			displayErrors.push(`${e.param} ${e.msg}, got ${e.value}`)
		}

		// if this is an /api/* route use res.badInput
		if(req.originalUrl.match(apiUrlRegex)){
			return res.badInput(displayErrors)
		}

		throw displayErrors.join(', ')
	}
	else{
		next()
	}
}

