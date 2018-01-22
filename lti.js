let OutcomeService = require('ims-lti/lib/extensions/outcomes').OutcomeService
let HMAC_SHA1 = require('ims-lti/lib/hmac-sha1')
let config = oboRequire('config')
let db = require('./db')
let moment = require('moment')
let insertEvent = oboRequire('insert_event')
let logger = oboRequire('logger')
let uuid = require('uuid').v4

let ERROR_NO_SECRET_FOR_KEY = new Error('No LTI secret found for key')
let ERROR_NO_LAUNCH_FOUND = new Error('No launch found')
let ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH = new Error('No LTI outcome service found for launch')
let ERROR_SCORE_IS_NULL = new Error('LTI score is null')
let ERROR_SCORE_IS_INVALID = new Error('LTI score is invalid')

let ERROR_TYPE_NO_SECRET_FOR_KEY = 'no_secret_for_key'
let ERROR_TYPE_NO_LAUNCH_FOUND = 'no_launch_found'
let ERROR_TYPE_NO_OUTCOME_FOR_LAUNCH = 'no_outcome_service_for_launch'
let ERROR_TYPE_SCORE_IS_NULL = 'score_is_null'
let ERROR_TYPE_SCORE_IS_INVALID = 'score_is_invalid'
let ERROR_TYPE_UNEXPECTED = 'unexpected'

let STATUS_TYPE_NOT_ATTEMPTED = 'not_attempted'
let STATUS_TYPE_SUCCESS = 'success'
let STATUS_TYPE_ERROR = 'error'

let tryRetrieveLtiLaunch = function(userId, draftId, logId) {
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
		.catch(error => {
			logger.error(`LTI error attempting to retrieve launch`, error, logId)
			throw ERROR_NO_LAUNCH_FOUND
		})
}

// Throws error if no key is found
let tryFindSecretForKey = (key, logId) => {
	// locate a matching key/secret pair
	let keys = Object.keys(config.lti.keys)
	for (var i = keys.length - 1; i >= 0; i--) {
		if (keys[i] == key) {
			return config.lti.keys[keys[i]]
		}
	}

	logger.error('LTI ERROR: No secret found for key: ${key}', logId)
	throw ERROR_NO_SECRET_FOR_KEY
}

// Note that this method can throw two possible errors
let tryGetOutcomeServiceForLaunch = function(launch, logId) {
	if (!launch.reqVars.lis_outcome_service_url) throw ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH

	return new OutcomeService({
		body: {
			lis_outcome_service_url: launch.reqVars.lis_outcome_service_url,
			lis_result_sourcedid: launch.reqVars.lis_result_sourcedid
		},
		consumer_key: launch.key,
		consumer_secret: tryFindSecretForKey(launch.key, logId),
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

let insertLTIAssessmentScore = (
	assessmentScoreId,
	launchId,
	scoreSent,
	scoreSentStatus,
	error,
	errorDetails,
	logId
) => {
	return db
		.one(
			`
			INSERT INTO lti_assessment_scores (assessment_score_id, launch_id, score_sent, status, error, error_details, log_id)
			VALUES($[assessmentScoreId], $[launchId], $[scoreSent], $[scoreSentStatus], $[error], $[errorDetails], $[logId])
			RETURNING id
		`,
			{
				assessmentScoreId,
				launchId,
				scoreSent,
				scoreSentStatus,
				error,
				errorDetails,
				logId
			}
		)
		.then(result => {
			return result.id
		})
}

let insertLTIAssessmentScoreAndReplaceResultEvent = (
	userId,
	draftId,
	assessmentScoreId,
	launch,
	result,
	logId
) => {
	return insertLTIAssessmentScore(
		assessmentScoreId,
		result.launchId,
		result.scoreSent,
		result.status,
		result.error,
		result.errorDetails,
		logId
	).then(scoreId => {
		result.ltiAssessmentScoreId = scoreId
		logger.info(`LTI store "${result.status}" success - id:"${result.ltiAssessmentScoreId}"`, logId)

		insertReplaceResultEvent(userId, draftId, launch, result)

		return result
	})
}

let sendAssessmentScore = function(userId, draftId, score, assessmentScoreId) {
	let logId = uuid()

	let launch = null
	let outcomeService = null
	let didInsertAssessmentScore = false

	let result = {
		launchId: null,
		scoreSent: null,
		status: STATUS_TYPE_NOT_ATTEMPTED,
		error: null,
		errorDetails: null,
		ltiAssessmentScoreId: null
	}

	logger.info(
		`LTI attempt sendAssessmentScore for user:"${userId}", draft:"${draftId}", score:"${score}", assessmentScoreId:"${assessmentScoreId}"`,
		logId
	)

	// return getLtiRequestInfo(userId, draftId)
	return tryRetrieveLtiLaunch(userId, draftId, logId)
		.then(ltiLaunch => {
			logger.info(`LTI launch with id:"${ltiLaunch.id}" retrieved!`, logId)
			launch = ltiLaunch
			result.launchId = launch.id

			if (score === null) throw ERROR_SCORE_IS_NULL
			if (!Number.isFinite(score) || score < 0 || score > 1) throw ERROR_SCORE_IS_INVALID

			outcomeService = tryGetOutcomeServiceForLaunch(launch, logId)

			result.scoreSent = score
			logger.info(
				`LTI attempting replaceResult of score:"${score}" for assessmentScoreId:"${assessmentScoreId}" for user:"${userId}", draft:"${draftId}", sourcedid:"${launch
					.reqVars.lis_result_sourcedid}", url:"${launch.reqVars
					.lis_outcome_service_url}" using key:"${launch.key}"`,
				logId
			)
			return sendReplaceResultRequest(outcomeService, score)
		})
		.then(ltiRequestResult => {
			result.status = STATUS_TYPE_SUCCESS

			// @TODO - do a read!
			// @TODO - what is in ltiRequestResult?
			logger.info(`LTI replaceResult success`, ltiRequestResult, logId)
		})
		.then(() => {
			return insertLTIAssessmentScoreAndReplaceResultEvent(
				userId,
				draftId,
				assessmentScoreId,
				launch,
				result,
				logId
			)
		})
		.then(result => {
			didInsertAssessmentScore = true
			return result
		})
		.catch(error => {
			logger.warn('LTI error:', error, logId)

			// Handle errors
			switch (error) {
				case ERROR_NO_SECRET_FOR_KEY:
					result.error = ERROR_TYPE_NO_SECRET_FOR_KEY
					logger.info(`LTI No request found for user:"${userId}" on draft:"${draftId}"!`, logId)
					break

				case ERROR_NO_LAUNCH_FOUND:
					result.error = ERROR_TYPE_NO_LAUNCH_FOUND
					logger.info(`LTI No launch found for user:"${userId}" on draft:"${draftId}"!`, logId)
					break

				case ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH:
					result.error = ERROR_TYPE_NO_OUTCOME_FOR_LAUNCH
					logger.info(`LTI No outcome service for user:"${userId}" on draft:"${draftId}"!`, logId)
					break

				case ERROR_SCORE_IS_NULL:
					result.error = ERROR_TYPE_SCORE_IS_NULL
					logger.info(
						`LTI not sending null score for user:"${userId}" on draft:"${draftId}"!`,
						logId
					)
					break

				case ERROR_SCORE_IS_INVALID:
					result.error = ERROR_TYPE_SCORE_IS_INVALID
					logger.info(
						`LTI not sending invalid score "{$score}" for user:"${userId}" on draft:"${draftId}"!`,
						logId
					)
					break

				default:
					result.status = STATUS_TYPE_ERROR
					result.error = ERROR_TYPE_UNEXPECTED
					result.errorDetails = { message: error.message }
					logger.error(`LTI error was **unexpected** :( Stack trace:`, error.stack, logId)
					break
			}

			if (!didInsertAssessmentScore) {
				return insertLTIAssessmentScoreAndReplaceResultEvent(
					userId,
					draftId,
					assessmentScoreId,
					launch,
					result,
					logId
				).catch(result => {
					logger.error(`LTI fatal error! Unable to store record assessment record!`, result, logId)

					return result
				})
			}

			return result
		})
}

module.exports = {
	sendAssessmentScore: sendAssessmentScore,
	tryFindSecretForKey: tryFindSecretForKey
}
