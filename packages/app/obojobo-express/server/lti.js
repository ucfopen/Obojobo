const OutcomeService = require('ims-lti/src/extensions/outcomes').OutcomeService
const config = oboRequire('server/config')
const db = oboRequire('server/db')
const moment = require('moment')
const insertEvent = oboRequire('server/insert_event')
const logger = oboRequire('server/logger')
const uuid = require('uuid').v4

const MINUTES_EXPIRED_LAUNCH = 300

const ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH /*  */ = 'No outcome service found for launch'
const ERROR_SCORE_IS_NULL /*                  */ = 'LTI score is null'
const ERROR_PREVIEW_MODE /*                   */ = 'Preview mode is on'
const ERROR_FATAL_REPLACE_RESULT_FAILED /*    */ = 'Replace result failed'
const ERROR_FATAL_NO_ASSESSMENT_SCORE_FOUND /**/ = 'No assessment score found'
const ERROR_FATAL_NO_SECRET_FOR_KEY /*        */ = 'No LTI secret found for key'
const ERROR_FATAL_NO_LAUNCH_FOUND /*          */ = 'No launch found'
const ERROR_FATAL_LAUNCH_EXPIRED /*           */ = 'Launch expired'
const ERROR_FATAL_SCORE_IS_INVALID /*         */ = 'LTI score is invalid'

const STATUS_SUCCESS /*                             */ = 'success'
const STATUS_NOT_ATTEMPTED_NO_OUTCOME_FOR_LAUNCH /* */ =
	'not_attempted_no_outcome_service_for_launch'
const STATUS_NOT_ATTEMPTED_SCORE_IS_NULL /*         */ = 'not_attempted_score_is_null'
const STATUS_NOT_ATTEMPTED_PREVIEW_MODE /*          */ = 'not_attempted_preview_mode'
const STATUS_ERROR_LAUNCH_EXPIRED /*                */ = 'error_launch_expired'
const STATUS_ERROR_REPLACE_RESULT_FAILED /*         */ = 'error_replace_result_failed'
const STATUS_ERROR_NO_ASSESSMENT_SCORE_FOUND /*     */ = 'error_no_assessment_score_found'
const STATUS_ERROR_NO_SECRET_FOR_KEY /*             */ = 'error_no_secret_for_key'
const STATUS_ERROR_NO_LAUNCH_FOUND /*               */ = 'error_no_launch_found'
const STATUS_ERROR_SCORE_IS_INVALID /*              */ = 'error_score_is_invalid'
const STATUS_ERROR_UNEXPECTED /*                    */ = 'error_unexpected'

const DB_STATUS_RECORDED = 'recorded'
const DB_STATUS_ERROR = 'error'

const GRADEBOOK_STATUS_ERROR_NEWER_SCORE_UNSENT /*  */ = 'error_newer_assessment_score_unsent'
const GRADEBOOK_STATUS_ERROR_STATE_UNKNOWN /*       */ = 'error_state_unknown'
const GRADEBOOK_STATUS_ERROR_INVALID /*             */ = 'error_invalid'
const GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT /*    */ = 'ok_null_score_not_sent'
const GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE /**/ = 'ok_gradebook_matches_assessment_score'
const GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE /*     */ = 'ok_no_outcome_service'
const GRADEBOOK_STATUS_OK_PREVIEW_MODE /*           */ = 'ok_preview_mode'

const OUTCOME_TYPE_UNKNOWN = 'unknownOutcome'
const OUTCOME_TYPE_NO_OUTCOME = 'noOutcome'
const OUTCOME_TYPE_HAS_OUTCOME = 'hasOutcome'

const SCORE_TYPE_NULL = 'nullScore'
const SCORE_TYPE_INVALID = 'invalidScore'
const SCORE_TYPE_SAME = 'sameScore'
const SCORE_TYPE_DIFFERENT = 'differentScore'

//
// Helper methods
//
const isScoreValid = score => Number.isFinite(score) && score >= 0 && score <= 1

const isLaunchExpired = launchDate => {
	const minsSinceLaunch = moment.duration(moment().diff(moment(launchDate))).asMinutes()
	return minsSinceLaunch > MINUTES_EXPIRED_LAUNCH
}

const getGradebookStatus = (
	outcomeType,
	scoreType,
	replaceResultWasSentSuccessfully,
	isPreview
) => {
	// Check to make sure this function wasn't called with weird and invalid inputs.
	// In other words, replaceResultWasSentSuccessfully can only be true under some conditions.
	// If these conditions are not met then we have invalid inputs and don't want to allow this.
	if (isPreview) {
		return GRADEBOOK_STATUS_OK_PREVIEW_MODE
	}

	if (
		replaceResultWasSentSuccessfully &&
		(outcomeType !== OUTCOME_TYPE_HAS_OUTCOME ||
			scoreType === SCORE_TYPE_INVALID ||
			scoreType === SCORE_TYPE_NULL)
	) {
		// Should never get here!
		return GRADEBOOK_STATUS_ERROR_INVALID
	}

	if (outcomeType === OUTCOME_TYPE_NO_OUTCOME) {
		return GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE
	}

	if (scoreType === SCORE_TYPE_NULL) {
		return GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT
	}

	if (scoreType === SCORE_TYPE_SAME || replaceResultWasSentSuccessfully) {
		return GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE
	}

	if (outcomeType === OUTCOME_TYPE_HAS_OUTCOME && scoreType === SCORE_TYPE_DIFFERENT) {
		return GRADEBOOK_STATUS_ERROR_NEWER_SCORE_UNSENT
	}

	return GRADEBOOK_STATUS_ERROR_STATE_UNKNOWN
}

//
// Fetch methods
//
const getLatestHighestAssessmentScoreRecord = (
	userId,
	draftId,
	assessmentId,
	resourceLinkId,
	isPreview = false
) => {
	return db
		.one(
			`
				SELECT
					T1.id,
					T1.user_id AS "userId",
					T1.draft_id AS "draftId",
					T1.draft_content_id AS "contentId",
					T1.assessment_id AS "assessmentId",
					T1.attempt_id AS "attemptId",
					T1.score,
					T1.score_details AS "scoreDetails",
					T1.is_preview AS "isPreview",
					T1.resource_link_id AS "resourceLinkId"
				FROM
				(
					SELECT
						assessment_scores.*,
						attempts.resource_link_id,
						COALESCE(score, -1) AS coalesced_score
					FROM assessment_scores
					JOIN attempts
						ON attempts.id = assessment_scores.attempt_id
					WHERE
						assessment_scores.user_id = $[userId]
						AND attempts.resource_link_id = $[resourceLinkId]
						AND assessment_scores.draft_id = $[draftId]
						AND assessment_scores.assessment_id = $[assessmentId]
						AND assessment_scores.is_preview = $[isPreview]
				) T1
				ORDER BY
					T1.coalesced_score DESC,
					T1.created_at DESC
				LIMIT 1
			`,
			{
				userId,
				draftId,
				resourceLinkId,
				assessmentId,
				isPreview
			}
		)
		.catch(error => {
			logger.error('Error in getLatestHighestAssessmentScoreRecord')
			logger.error(error)
			if (
				error instanceof db.errors.QueryResultError &&
				error.code === db.errors.queryResultErrorCode.noData
			) {
				throw Error(ERROR_FATAL_NO_ASSESSMENT_SCORE_FOUND)
			}
			throw error
		})
}

const getLatestSuccessfulLTIAssessmentScoreRecord = assessmentScoreId => {
	return db.oneOrNone(
		`
			SELECT *
			FROM lti_assessment_scores
			WHERE
				assessment_score_id = $[assessmentScoreId]
				AND status = 'success'
			ORDER BY created_at DESC
			LIMIT 1
			`,
		{
			assessmentScoreId
		}
	)
}

const getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId = (
	userId,
	draftId,
	resourceLinkId,
	optionalAssessmentId,
	isPreview = false
) => {
	return db
		.manyOrNone(
			`
			SELECT
				DISTINCT ON (T1.assessment_id)
				T1.assessment_id AS "assessmentId",
				T1.assessment_score_id AS "assessmentScoreId",
				T1.score_sent AS "scoreSent",
				T1.lti_sent_date AS "sentDate",
				T1.status,
				T1.gradebook_status AS "gradebookStatus",
				T1.status_details AS "statusDetails"
			FROM
			(
				SELECT
					S.*,
					L.*,
					L.created_at AS "lti_sent_date",
					L.id as "lti_id"
				FROM assessment_scores S
				JOIN attempts AS ATT
					ON ATT.id = S.attempt_id
				LEFT JOIN lti_assessment_scores L
					ON S.id = L.assessment_score_id
				WHERE S.draft_id = $[draftId]
					AND ATT.resource_link_id = $[resourceLinkId]
					AND S.user_id = $[userId]
					AND S.is_preview = $[isPreview]
					${optionalAssessmentId ? 'AND S.assessment_id = $[optionalAssessmentId]' : ''}
					AND L.id IS NOT NULL
				ORDER BY S.id DESC
			) T1
			ORDER BY T1.assessment_id, T1.lti_id DESC
		`,
			{
				userId,
				draftId,
				resourceLinkId,
				optionalAssessmentId,
				isPreview
			}
		)
		.then(result => {
			const ltiStatesByAssessmentId = {}

			if (result && result.length) {
				result.forEach(row => {
					ltiStatesByAssessmentId[row.assessmentId] = row
				})
			}
			return ltiStatesByAssessmentId
		})
		.catch(e => {
			logger.error('Error in getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId')
			logger.error(e)
			throw e
		})
}

// The 'error' property for this method can contain one of the following:
//	* ERROR_FATAL_NO_ASSESSMENT_SCORE_FOUND
//	* ERROR_FATAL_NO_LAUNCH_FOUND
//	* ERROR_FATAL_SCORE_IS_INVALID
//	* ERROR_FATAL_LAUNCH_EXPIRED
//	* (Or some unexpected error)
const getRequiredDataForReplaceResult = function(
	userId,
	draftId,
	assessmentId,
	logId,
	resourceLinkId,
	isPreview
) {
	// get assess score
	// get last success
	// get launch

	const result = {
		error: null,
		assessmentScoreRecord: null,
		lastSuccessfulSentScore: -1,
		ltiScoreToSend: -2,
		scoreType: null,
		launch: null
	}

	return getLatestHighestAssessmentScoreRecord(
		userId,
		draftId,
		assessmentId,
		resourceLinkId,
		isPreview
	)
		.then(assessmentScoreResult => {
			result.assessmentScoreRecord = assessmentScoreResult

			logger.info(
				`LTI found assessment score. Details: user:"${result.assessmentScoreRecord.userId}", draft:"${result.assessmentScoreRecord.draftId}", score:"${result.assessmentScoreRecord.score}", assessmentScoreId:"${assessmentScoreResult.id}", attemptId:"${result.assessmentScoreRecord.attemptId}", preview:"${result.assessmentScoreRecord.isPreview}"`,
				logId
			)

			return getLatestSuccessfulLTIAssessmentScoreRecord(assessmentScoreResult.id)
		})
		.then(latest => {
			const scoreRecord = result.assessmentScoreRecord

			result.lastSuccessfulSentScore = latest ? latest.score_sent : null
			result.ltiScoreToSend = scoreRecord.score === null ? null : scoreRecord.score / 100

			if (result.ltiScoreToSend === null) {
				result.scoreType = SCORE_TYPE_NULL
			} else if (!isScoreValid(result.ltiScoreToSend)) {
				result.scoreType = SCORE_TYPE_INVALID
			} else if (result.lastSuccessfulSentScore === result.ltiScoreToSend) {
				result.scoreType = SCORE_TYPE_SAME
			} else {
				result.scoreType = SCORE_TYPE_DIFFERENT
			}

			return retrieveLtiLaunch(scoreRecord.userId, scoreRecord.draftId, logId, resourceLinkId)
		})
		.then(ltiLaunch => {
			if (ltiLaunch.id !== null) {
				logger.info(`LTI launch with id:"${ltiLaunch.id}" retrieved!`, logId)
			}

			result.launch = ltiLaunch

			if (result.scoreType === SCORE_TYPE_INVALID) {
				throw Error(ERROR_FATAL_SCORE_IS_INVALID)
			}
			if (ltiLaunch.error !== null) {
				throw ltiLaunch.error
			}

			return result
		})
		.catch(e => {
			result.error = e

			return result
		})
}

// The error property for this function can contain the following:
//	* ERROR_FATAL_NO_LAUNCH_FOUND
//	* ERROR_FATAL_NO_SECRET_FOR_KEY
//	* Or some other unexpected error
const getOutcomeServiceForLaunch = function(launch) {
	const result = {
		error: null,
		outcomeService: null,
		serviceURL: null,
		resultSourcedId: null,
		type: OUTCOME_TYPE_UNKNOWN
	}

	result.resultSourcedId = launch && launch.reqVars ? launch.reqVars.lis_result_sourcedid : null

	try {
		if (!launch || !launch.reqVars) {
			result.type = OUTCOME_TYPE_UNKNOWN
			result.error = Error(ERROR_FATAL_NO_LAUNCH_FOUND)
			return result
		} else if (!launch.reqVars.lis_outcome_service_url) {
			result.type = OUTCOME_TYPE_NO_OUTCOME
			return result
		}

		result.type = OUTCOME_TYPE_HAS_OUTCOME
		result.serviceURL = launch.reqVars.lis_outcome_service_url

		const secret = findSecretForKey(launch.key)
		if (!secret) {
			result.error = Error(ERROR_FATAL_NO_SECRET_FOR_KEY)
			return result
		}

		result.outcomeService = new OutcomeService({
			service_url: launch.reqVars.lis_outcome_service_url,
			source_did: launch.reqVars.lis_result_sourcedid,
			consumer_key: launch.key,
			consumer_secret: secret
		})

		return result
	} catch (e) {
		result.error = e
		return result
	}
}

const retrieveLtiLaunch = function(userId, draftId, logId, resourceLinkId) {
	const result = {
		id: null,
		reqVars: null,
		key: null,
		createdAt: null,
		contentId: null,
		error: null
	}

	return db
		.oneOrNone(
			`
		SELECT id, data, lti_key, created_at, draft_content_id
		FROM launches
		WHERE user_id = $[userId]
		AND draft_id = $[draftId]
		AND data ->> 'resource_link_id' = $[resourceLinkId]
		AND type = 'lti'
		ORDER BY created_at DESC
		LIMIT 1
	`,
			{
				userId,
				draftId,
				resourceLinkId
			}
		)
		.then(dbResult => {
			if (!dbResult) {
				logger.error(`LTI error attempting to retrieve launch`, logId)
				result.error = Error(ERROR_FATAL_NO_LAUNCH_FOUND)
			} else {
				result.id = dbResult.id
				result.reqVars = dbResult.data
				result.key = dbResult.lti_key
				result.createdAt = dbResult.created_at
				result.contentId = dbResult.draft_content_id
			}

			if (isLaunchExpired(result.createdAt)) {
				throw Error(ERROR_FATAL_LAUNCH_EXPIRED)
			}

			return result
		})
		.catch(e => {
			result.error = e

			return result
		})
}

const findSecretForKey = key => {
	// locate a matching key/secret pair
	const keys = Object.keys(config.lti.keys)
	for (let i = keys.length - 1; i >= 0; i--) {
		if (keys[i] === key) {
			return config.lti.keys[keys[i]]
		}
	}

	logger.error(`LTI ERROR: No secret found for key:"${key}"`)

	return null
}

//
// LTI communication methods
//

const sendReplaceResultRequest = (outcomeService, score) => {
	logger.info(`LTI sendReplaceResult to "${outcomeService.service_url}" with "${score}"`)

	return new Promise((resolve, reject) => {
		/* istanbul ignore next */
		if (outcomeService.service_url === 'https://example.fake/outcomes/fake') {
			logger.info('BYPASSING SEND DUE TO USING TEST SERVICE URL')
			return resolve(true)
		}
		outcomeService.send_replace_result(score, (err, result) => {
			if (err) reject(err)
			else resolve(result)
		})
	}).catch(e => {
		logger.info(`LTI sendReplaceResult threw error: "${e}"`)
		return false
	})
}

//
// DB write methods
//

const insertReplaceResultEvent = (
	userId,
	draftDocument,
	launch,
	outcomeData,
	ltiResult,
	visitId
) => {
	return insertEvent({
		action: 'lti:replaceResult',
		actorTime: new Date().toISOString(),
		isPreview: false,
		payload: {
			launchId: launch ? launch.id : null,
			launchKey: launch ? launch.key : null,
			body: {
				lis_outcome_service_url: outcomeData.serviceURL,
				lis_result_sourcedid: outcomeData.resultSourcedId
			},
			result: ltiResult
		},
		visitId,
		userId,
		ip: '',
		eventVersion: '2.1.0',
		metadata: {},
		draftId: draftDocument.draftId,
		contentId: draftDocument.contentId
	}).catch(err => {
		logger.error('There was an error inserting the lti event:', err)
	})
}

const insertLTIAssessmentScore = (
	assessmentScoreId,
	launchId,
	scoreSent,
	scoreSentStatus,
	statusDetails,
	gradebookStatus,
	logId
) => {
	return db
		.one(
			`
			INSERT INTO lti_assessment_scores
			(assessment_score_id, launch_id, score_sent, status, status_details, gradebook_status, log_id)
			VALUES($[assessmentScoreId], $[launchId], $[scoreSent], $[scoreSentStatus], $[statusDetails], $[gradebookStatus], $[logId])
			RETURNING id
		`,
			{
				assessmentScoreId,
				launchId,
				scoreSent,
				scoreSentStatus,
				statusDetails,
				gradebookStatus,
				logId
			}
		)
		.then(insertScoreResult => {
			return insertScoreResult.id
		})
}

//
// Error handling methods
//

const logAndGetStatusForError = function(error, requiredData, logId) {
	const scoreRecord = requiredData.assessmentScoreRecord
	const userId = scoreRecord ? scoreRecord.userId : null
	const draftId = scoreRecord ? scoreRecord.draftId : null
	const ltiScoreToSend = requiredData.ltiScoreToSend
	const launchId = requiredData.launch ? requiredData.launch.id : null
	const launchKey = requiredData.launch ? requiredData.launch.key : null

	const result = {
		status: null,
		statusDetails: null
	}

	// Handle errors
	switch (error.message) {
		//
		// Expected possible errors:
		//
		case ERROR_PREVIEW_MODE:
			result.status = STATUS_NOT_ATTEMPTED_PREVIEW_MODE
			logger.info(`LTI not sending preview score`, logId)
			break

		case ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH:
			result.status = STATUS_NOT_ATTEMPTED_NO_OUTCOME_FOR_LAUNCH
			logger.info(`LTI No outcome service for user:"${userId}" on draft:"${draftId}"`, logId)
			break

		case ERROR_SCORE_IS_NULL:
			result.status = STATUS_NOT_ATTEMPTED_SCORE_IS_NULL
			logger.info(`LTI not sending null score for user:"${userId}" on draft:"${draftId}"`, logId)
			break
		//
		// Bad unexpected errors:
		// In these cases we didn't expect for any of these errors to happen
		//
		case ERROR_FATAL_REPLACE_RESULT_FAILED:
			result.status = STATUS_ERROR_REPLACE_RESULT_FAILED
			logger.error(`LTI replaceResult failed for user:"${userId}" on draft:"${draftId}"!`, logId)
			break

		case ERROR_FATAL_NO_SECRET_FOR_KEY:
			result.status = STATUS_ERROR_NO_SECRET_FOR_KEY
			logger.error(`LTI No secret found for key:"${launchKey}"!`, logId)
			break

		case ERROR_FATAL_SCORE_IS_INVALID:
			result.status = STATUS_ERROR_SCORE_IS_INVALID
			logger.error(
				`LTI not sending invalid score "${ltiScoreToSend}" for user:"${userId}" on draft:"${draftId}"!`,
				logId
			)
			break

		case ERROR_FATAL_NO_LAUNCH_FOUND:
			result.status = STATUS_ERROR_NO_LAUNCH_FOUND
			logger.error(`LTI No launch found for user:"${userId}" on draft:"${draftId}"!`, logId)
			break

		case ERROR_FATAL_LAUNCH_EXPIRED:
			result.status = STATUS_ERROR_LAUNCH_EXPIRED
			logger.error(`LTI launch expired for launch:"${launchId}"!`, logId)
			break

		case ERROR_FATAL_NO_ASSESSMENT_SCORE_FOUND:
			result.status = STATUS_ERROR_NO_ASSESSMENT_SCORE_FOUND
			logger.error(`LTI no assessment score found, unable to proceed!`, logId)
			break

		default:
			//Unexpected error
			result.status = STATUS_ERROR_UNEXPECTED
			result.statusDetails = { message: error.message }
			logger.error(`LTI bad error, was **unexpected** :( Stack trace:`, error, error.stack, logId)
			break
	}

	return result
}

//
// MAIN METHOD:
//
const sendHighestAssessmentScore = (
	userId,
	draftDocument,
	assessmentId,
	isPreview,
	resourceLinkId,
	visitId
) => {
	const logId = uuid()
	let requiredData = null
	let outcomeData = null
	const result = Object.seal({
		launchId: null,
		scoreSent: null,
		status: null,
		statusDetails: null,
		gradebookStatus: null,
		dbStatus: null,
		ltiAssessmentScoreId: null,
		outcomeServiceURL: null
	})

	logger.info(
		`LTI begin sendHighestAssessmentScore for userId:"${userId}", draftId:"${draftDocument.draftId}", assessmentId:"${assessmentId}"`,
		logId
	)

	return getRequiredDataForReplaceResult(
		userId,
		draftDocument.draftId,
		assessmentId,
		logId,
		resourceLinkId,
		isPreview
	)
		.then(requiredDataResult => {
			result.launchId = requiredDataResult.launch ? requiredDataResult.launch.id : null

			requiredData = requiredDataResult
			outcomeData = getOutcomeServiceForLaunch(requiredData.launch)

			result.outcomeServiceURL = outcomeData.serviceURL

			// @TODO: move this above getRequiredDataForReplaceResult call
			// @TODO: heck, why dont we just move all these throws down
			// to the where the code that finds these issues occurs
			// and pass them up using the normal throw/catch functionality
			if (isPreview) {
				throw Error(ERROR_PREVIEW_MODE)
			}

			if (requiredData.ltiScoreToSend === null) {
				throw Error(ERROR_SCORE_IS_NULL)
			}

			if (outcomeData.type === OUTCOME_TYPE_NO_OUTCOME) {
				throw Error(ERROR_NO_OUTCOME_SERVICE_FOR_LAUNCH)
			}

			if (requiredData.error !== null) {
				throw requiredData.error
			}

			if (outcomeData.error !== null) {
				throw outcomeData.error
			}

			result.scoreSent = requiredData.ltiScoreToSend

			logger.info(
				`LTI attempting replaceResult of score:"${result.scoreSent}" for assessmentScoreId:"${requiredData.assessmentScoreRecord.id}" for user:"${requiredData.assessmentScoreRecord.userId}", draft:"${requiredData.assessmentScoreRecord.draftId}", sourcedid:"${outcomeData.resultSourcedId}", url:"${outcomeData.serviceURL}" using key:"${requiredData.launch.key}"`,
				logId
			)

			return sendReplaceResultRequest(outcomeData.outcomeService, requiredData.ltiScoreToSend)
		})
		.then(ltiRequestResult => {
			logger.info(`LTI replaceResult response`, ltiRequestResult, logId)

			if (ltiRequestResult !== true) {
				throw Error(ERROR_FATAL_REPLACE_RESULT_FAILED)
			}

			result.status = STATUS_SUCCESS
		})
		.catch(error => {
			const errorResult = logAndGetStatusForError(error, requiredData, logId)
			result.status = errorResult.status
			result.statusDetails = errorResult.statusDetails
		})
		.then(() => {
			// ALWAYS RUNS DUE TO CATCH ABOVE
			result.gradebookStatus = getGradebookStatus(
				outcomeData.type,
				requiredData.scoreType,
				result.status === STATUS_SUCCESS,
				isPreview
			)

			logger.info(`LTI gradebook status is "${result.gradebookStatus}"`, logId)

			const assessmentScoreIdOrNull = requiredData.assessmentScoreRecord
				? requiredData.assessmentScoreRecord.id
				: null
			return insertLTIAssessmentScore(
				assessmentScoreIdOrNull,
				result.launchId,
				result.scoreSent,
				result.status,
				result.statusDetails,
				result.gradebookStatus,
				logId
			)
		})
		.then(scoreId => {
			logger.info(`LTI store "${result.status}" success - id:"${scoreId}"`, logId)

			result.ltiAssessmentScoreId = scoreId
			result.dbStatus = DB_STATUS_RECORDED
		})
		.catch(error => {
			logger.error(`LTI bad error attempting to update database! :(`, error.stack, logId)

			result.dbStatus = DB_STATUS_ERROR
		})
		.then(() => {
			// ALWAYS RUNS DUE TO CATCH ABOVE
			insertReplaceResultEvent(
				userId,
				draftDocument,
				requiredData.launch,
				outcomeData,
				result,
				visitId
			)
		})
		.catch(error => {
			logger.error(`LTI error with insertReplaceResultEvent`, error.message, logId)
		})
		.then(() => {
			// ALWAYS RUNS DUE TO CATCH ABOVE
			logger.info(`LTI complete`, logId)
			return result
		})
}

module.exports = {
	isScoreValid,
	isLaunchExpired,
	getGradebookStatus,
	getLatestHighestAssessmentScoreRecord,
	getLatestSuccessfulLTIAssessmentScoreRecord,
	getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId,
	getOutcomeServiceForLaunch,
	retrieveLtiLaunch,
	findSecretForKey,
	sendReplaceResultRequest,
	insertReplaceResultEvent,
	logAndGetStatusForError,
	sendHighestAssessmentScore
}
