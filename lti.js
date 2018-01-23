let OutcomeService = require('ims-lti/lib/extensions/outcomes').OutcomeService
let HMAC_SHA1 = require('ims-lti/lib/hmac-sha1')
let config = oboRequire('config')
let db = require('./db')
let moment = require('moment')
let insertEvent = oboRequire('insert_event')
let logger = oboRequire('logger')
let uuid = require('uuid').v4

let HOURS_EXPIRED_LAUNCH = 5

let ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH = new Error('No LTI outcome service found for launch')
let ERROR_SCORE_IS_NULL = new Error('LTI score is null')
let ERROR_FATAL_NO_ASSESSMENT_SCORE_FOUND = new Error('No assessment score found')
let ERROR_FATAL_NO_SECRET_FOR_KEY = new Error('No LTI secret found for key')
let ERROR_FATAL_NO_LAUNCH_FOUND = new Error('No launch found')
let ERROR_FATAL_LAUNCH_EXPIRED = new Error('Launch expired')
let ERROR_FATAL_SCORE_IS_INVALID = new Error('LTI score is invalid')

let ERROR_TYPE_NO_OUTCOME_FOR_LAUNCH = 'no_outcome_service_for_launch'
let ERROR_TYPE_SCORE_IS_NULL = 'score_is_null'
let ERROR_TYPE_FATAL_NO_ASSESSMENT_SCORE_FOUND = 'fatal_no_assessment_score_found'
let ERROR_TYPE_FATAL_NO_SECRET_FOR_KEY = 'fatal_no_secret_for_key'
let ERROR_TYPE_FATAL_NO_LAUNCH_FOUND = 'fatal_no_launch_found'
let ERROR_TYPE_FATAL_LAUNCH_EXPIRED = 'fatal_launch_expired'
let ERROR_TYPE_FATAL_SCORE_IS_INVALID = 'fatal_score_is_invalid'
let ERROR_TYPE_FATAL_UNEXPECTED = 'fatal_unexpected'

let STATUS_TYPE_NOT_ATTEMPTED = 'not_attempted'
let STATUS_TYPE_SUCCESS = 'success'
let STATUS_TYPE_ERROR = 'error'

let tryRetrieveLtiLaunch = function(userId, draftId, logId) {
	return db
		.one(
			`
		SELECT id, data, lti_key, created_at
		FROM launches
		WHERE user_id = $[userId]
		AND draft_id = $[draftId]
		AND type = 'lti'
		ORDER BY created_at DESC
		LIMIT 1
	`,
			{
				userId: userId,
				draftId: draftId
			}
		)
		.then(result => {
			return {
				id: result.id,
				reqVars: result.data,
				key: result.lti_key,
				createdAt: result.created_at
			}
		})
		.catch(error => {
			logger.error(`LTI error attempting to retrieve launch`, error, logId)
			throw ERROR_FATAL_NO_LAUNCH_FOUND
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
	throw ERROR_FATAL_NO_SECRET_FOR_KEY
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

let tryGetAssessmentScoreById = assessmentScoreId => {
	return db
		.oneOrNone(
			`
			SELECT *
			FROM assessment_scores
			WHERE id = $[assessmentScoreId]
			`,
			{ assessmentScoreId }
		)
		.then(result => {
			if (!result) throw ERROR_FATAL_NO_ASSESSMENT_SCORE_FOUND

			return {
				id: result.id,
				userId: result.user_id,
				draftId: result.draft_id,
				assessmentId: result.assessment_id,
				attemptId: result.attempt_id,
				score: result.score,
				preview: result.preview
			}
		})
}

let insertReplaceResultEvent = (userId, draftId, launch, assessmentScoreData, ltiResult) => {
	insertEvent({
		action: 'lti:replaceResult',
		actorTime: new Date().toISOString(),
		payload: {
			launchId: launch ? launch.id : null,
			launchKey: launch ? launch.key : null,
			body: {
				lis_outcome_service_url: launch ? launch.reqVars.lis_outcome_service_url : null,
				lis_result_sourcedid: launch ? launch.reqVars.lis_result_sourcedid : null
			},
			assessmentScore: assessmentScoreData,
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
	assessmentScoreData,
	launch,
	result,
	logId
) => {
	return insertLTIAssessmentScore(
		assessmentScoreData.id,
		result.launchId,
		result.scoreSent,
		result.status,
		result.error,
		result.errorDetails,
		logId
	).then(scoreId => {
		result.ltiAssessmentScoreId = scoreId
		logger.info(`LTI store "${result.status}" success - id:"${result.ltiAssessmentScoreId}"`, logId)

		insertReplaceResultEvent(
			assessmentScoreData.userId,
			assessmentScoreData.draftId,
			launch,
			assessmentScoreData,
			result
		)

		return result
	})
}

let sendAssessmentScore = function(assessmentScoreId) {
	let logId = uuid()

	let launch = null
	let outcomeService = null
	let ltiScore = null

	let assessmentScoreData = {
		id: assessmentScoreId,
		userId: null,
		draftId: null,
		assessmentId: null,
		attemptId: null,
		score: null,
		preview: null
	}

	let result = {
		launchId: null,
		scoreSent: null,
		status: STATUS_TYPE_NOT_ATTEMPTED,
		error: null,
		errorDetails: null,
		ltiAssessmentScoreId: null
	}

	logger.info(`LTI begin sendAssessmentScore for assessmentScoreId:"${assessmentScoreId}"`, logId)

	return tryGetAssessmentScoreById(assessmentScoreId)
		.then(assessmentScoreResult => {
			assessmentScoreData = assessmentScoreResult

			logger.info(
				`LTI found assessment score. Details: user:"${assessmentScoreData.userId}", draft:"${assessmentScoreData.draftId}", score:"${assessmentScoreData.score}", assessmentScoreId:"${assessmentScoreId}", attemptId:"${assessmentScoreData.attemptId}", preview:"${assessmentScoreData.preview}"`,
				logId
			)

			return tryRetrieveLtiLaunch(assessmentScoreData.userId, assessmentScoreData.draftId, logId)
		})
		.then(ltiLaunch => {
			logger.info(`LTI launch with id:"${ltiLaunch.id}" retrieved!`, logId)
			logger.info(ltiLaunch)
			launch = ltiLaunch
			result.launchId = launch.id

			let hoursSinceLaunch = moment.duration(moment().diff(moment(ltiLaunch.createdAt))).asHours()
			if (hoursSinceLaunch > HOURS_EXPIRED_LAUNCH) {
				throw ERROR_FATAL_LAUNCH_EXPIRED
			}

			if (assessmentScoreData.score === null) throw ERROR_SCORE_IS_NULL

			ltiScore = assessmentScoreData.score / 100

			if (!Number.isFinite(ltiScore) || ltiScore < 0 || ltiScore > 1)
				throw ERROR_FATAL_SCORE_IS_INVALID

			outcomeService = tryGetOutcomeServiceForLaunch(launch, logId)

			result.scoreSent = ltiScore
			logger.info(
				`LTI attempting replaceResult of score:"${ltiScore}" for assessmentScoreId:"${assessmentScoreId}" for user:"${assessmentScoreData.userId}", draft:"${assessmentScoreData.draftId}", sourcedid:"${launch
					.reqVars.lis_result_sourcedid}", url:"${launch.reqVars
					.lis_outcome_service_url}" using key:"${launch.key}"`,
				logId
			)
			return sendReplaceResultRequest(outcomeService, ltiScore)
		})
		.then(ltiRequestResult => {
			result.status = STATUS_TYPE_SUCCESS

			logger.info(`LTI replaceResult success`, ltiRequestResult, logId)
		})
		.then(() => {
			return insertLTIAssessmentScoreAndReplaceResultEvent(
				assessmentScoreData,
				launch,
				result,
				logId
			)
		})
		.then(result => {
			return result
		})
		.catch(error => {
			logger.warn('LTI error:', error, logId)

			// Handle errors
			switch (error) {
				//
				// Expected possible errors:
				// In these cases we simply don't attempt to send the score.
				//
				case ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH:
					result.error = ERROR_TYPE_NO_OUTCOME_FOR_LAUNCH
					logger.info(
						`LTI No outcome service for user:"${assessmentScoreData.userId}" on draft:"${assessmentScoreData.draftId}"!`,
						logId
					)
					break

				case ERROR_SCORE_IS_NULL:
					result.error = ERROR_TYPE_SCORE_IS_NULL
					logger.info(
						`LTI not sending null score for user:"${assessmentScoreData.userId}" on draft:"${assessmentScoreData.draftId}"!`,
						logId
					)
					break
				//
				// Bad unexpected errors:
				// In these cases we didn't expect for any of these errors to happen,
				// so we set result.status to 'error'
				//
				case ERROR_FATAL_NO_SECRET_FOR_KEY:
					result.status = STATUS_TYPE_ERROR
					result.error = ERROR_TYPE_FATAL_NO_SECRET_FOR_KEY
					logger.info(
						`LTI No request found for user:"${assessmentScoreData.userId}" on draft:"${assessmentScoreData.draftId}"!`,
						logId
					)
					break

				case ERROR_FATAL_SCORE_IS_INVALID:
					result.status = STATUS_TYPE_ERROR
					result.error = ERROR_TYPE_FATAL_SCORE_IS_INVALID
					logger.info(
						`LTI not sending invalid score "${ltiScore}" for user:"${assessmentScoreData.userId}" on draft:"${assessmentScoreData.draftId}"!`,
						logId
					)
					break

				case ERROR_FATAL_NO_LAUNCH_FOUND:
					result.status = STATUS_TYPE_ERROR
					result.error = ERROR_TYPE_FATAL_NO_LAUNCH_FOUND
					logger.info(
						`LTI No launch found for user:"${assessmentScoreData.userId}" on draft:"${assessmentScoreData.draftId}"!`,
						logId
					)
					break

				case ERROR_FATAL_LAUNCH_EXPIRED:
					result.status = STATUS_TYPE_ERROR
					result.error = ERROR_TYPE_FATAL_LAUNCH_EXPIRED
					logger.error(`LTI launch expired for launch:"${launch.id}"!`, logId)
					break

				case ERROR_FATAL_NO_ASSESSMENT_SCORE_FOUND:
					result.status = STATUS_TYPE_ERROR
					result.error = ERROR_TYPE_FATAL_NO_ASSESSMENT_SCORE_FOUND
					logger.error(
						`LTI no assessment score for assessmentScoreId:"${assessmentScoreId}" found, unable to proceed!`,
						logId
					)
					break

				default:
					//Unexpected error
					result.status = STATUS_TYPE_ERROR
					result.error = ERROR_TYPE_FATAL_UNEXPECTED
					result.errorDetails = { message: error.message }
					logger.error(`LTI error was **unexpected** :( Stack trace:`, error.stack, logId)
					break
			}

			return insertLTIAssessmentScoreAndReplaceResultEvent(
				assessmentScoreData,
				launch,
				result,
				logId
			).catch(result => {
				logger.error(`LTI fatal error! Unable to store record assessment record!`, result, logId)

				return result
			})

			return result
		})
}

module.exports = {
	sendAssessmentScore: sendAssessmentScore,
	tryFindSecretForKey: tryFindSecretForKey
}
