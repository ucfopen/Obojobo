let OutcomeService = require('ims-lti/lib/extensions/outcomes').OutcomeService
let HMAC_SHA1 = require('ims-lti/lib/hmac-sha1')
let config = oboRequire('config')
let db = require('./db')
let moment = require('moment')
let insertEvent = oboRequire('insert_event')
let logger = oboRequire('logger')

// Errors
let ERROR_NO_SECRET_FOR_KEY = new Error('No LTI secret found for key')
let ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH = new Error('No LTI outcome service found for launch')

// Score sent statuses:
let SCORE_SENT_STATUS_NOT_ATTEMPTED = 'not_attempted'
let SCORE_SENT_STATUS_SUCCESS = 'success'
let SCORE_SENT_STATUS_READ_MISMATCH = 'read_mismatch'
let SCORE_SENT_STATUS_ERROR = 'error'

let retrieveLtiLaunch = function(userId, draftId) {
	return db
		.one(
			`
		SELECT id, data, lti_key
		FROM launches
		WHERE user_id = $[userId]
		AND draft_id = $[draftId]
		AND type = 'lti'
		AND created_at > $[oldestLaunchDate]
		ORDER BY created_at DESC
		LIMIT 1
	`,
			{
				userId: userId,
				draftId: draftId,
				oldestLaunchDate: moment()
					.subtract(5, 'hours')
					.toISOString()
			}
		)
		.then(result => {
			return {
				id: result.id,
				reqVars: result.data,
				key: result.lti_key
			}
		})
}

// Throws error if no key is found
let findSecretForKey = key => {
	// locate a matching key/secret pair
	let keys = Object.keys(config.lti.keys)
	for (var i = keys.length - 1; i >= 0; i--) {
		if (keys[i] == key) {
			return config.lti.keys[keys[i]]
		}
	}

	logger.error('LTI ERROR: No secret found for key: ${key}')
	throw ERROR_NO_SECRET_FOR_KEY
}

// let readResult = function() {
// 	OutcomeService.prototype.send_read_result = function(callback) {
// }

// Note that this method can throw two possible errors
let tryGetOutcomeServiceForLaunch = function(launch) {
	if (!launch.reqVars.lis_outcome_service_url) throw ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH

	return new OutcomeService({
		body: {
			lis_outcome_service_url: launch.reqVars.lis_outcome_service_url,
			lis_result_sourcedid: launch.reqVars.lis_result_sourcedid
		},
		consumer_key: launch.key,
		consumer_secret: findSecretForKey(launch.key),
		signer: new HMAC_SHA1()
	})
}

let insertReplaceResultEvent = (userId, draftId, launch, ltiResult) => {
	insertEvent({
		action: 'lti:replaceResult',
		actorTime: new Date().toISOString(),
		payload: {
			launchId: launch.id,
			launchKey: launch.key,
			body: {
				lis_outcome_service_url: launch.reqVars.lis_outcome_service_url,
				lis_result_sourcedid: launch.reqVars.lis_result_sourcedid
			},
			result: ltiResult
		},
		userId: userId,
		ip: '',
		eventVersion: '2.0.0',
		metadata: {},
		draftId: draftId
	}).catch(err => {
		logger.error('There was an error inserting the lti event')
	})
}

let sendReplaceResultRequest = (outcomeService, score) => {
	return new Promise((resolve, reject) => {
		outcomeService.send_replace_result(score, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	})
}

/* Returns a Promise<boolean>
   Resolves with Boolean - the result was sent to the outcome service
   Rejects with Error Object only when we tried to send to the service and it failed
*/

let replaceResult = function(userId, draftId, score) {
	let launch
	let outcomeService

	let result = {
		launchId: null,
		scoreSent: null,
		scoreRead: null,
		status: SCORE_SENT_STATUS_NOT_ATTEMPTED,
		error: null
	}

	// return getLtiRequestInfo(userId, draftId)
	return retrieveLtiLaunch(userId, draftId)
		.then(ltiLaunch => {
			launch = ltiLaunch
			result.launchId = launch.id

			outcomeService = tryGetOutcomeServiceForLaunch(launch)

			result.scoreSent = score
			logger.info(
				`LTI attempting replaceResult of score:"${score}" for user:"${userId}", draft:"${draftId}", assessment:"${assessmentId}" on sourcedid:"${launch
					.reqVars.lis_result_sourcedid}" to url:"${launch.reqVars
					.lis_outcome_service_url}" using key:"${launch.key}"`
			)
			return sendReplaceResultRequest(outcomeService, score)
		})
		.then(ltiRequestResult => {
			result.status = SCORE_SENT_STATUS_SUCCESS

			// @TODO - do a read!
			// @TODO - what is in ltiRequestResult?
			logger.info(`LTI replaceResult success`, ltiRequestResult)

			insertReplaceResultEvent(userId, draftId, launch, result)

			return result
		})
		.catch(error => {
			logger.warn('LTI replaceResult failed:', error)

			// Handle errors
			switch (error) {
				case ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH:
					result.error = { message: error.message }
					logger.info(`LTI No outcome service for user:"${userId}" on draft:"${draftId}"!`)
					break

				case ERROR_NO_SECRET_FOR_KEY:
					result.error = { message: error.message }
					logger.info(`LTI No request found for user:"${userId}" on draft:"${draftId}"!`)
					break

				default:
					result.status = SCORE_SENT_STATUS_ERROR
					result.error = { message: error.message, trace: error.stack }
					logger.error(`LTI error was unexpected - Stack trace: ${error.stack}`)
					break
			}

			return result
		})
}

module.exports = {
	replaceResult: replaceResult,
	findSecretForKey: findSecretForKey
}
