const db = require('obojobo-express/server/db')
const camelcaseKeys = require('camelcase-keys')
const logger = require('obojobo-express/server/logger')
const lti = require('obojobo-express/server/lti')
const AssessmentScore = require('./assessment-score')

// if the attempt is imported, return the importedAttemptId, otherwise return this attempt's id
const attemptIdOrImportedId = attempt =>
	attempt.isImported ? attempt.importedAttemptId : attempt.id
const sortByAttemptNumber = (a, b) => a.attemptNumber - b.attemptNumber

class AssessmentModel {
	constructor(props) {
		// expand all the props onto this object with camel case keys
		props = camelcaseKeys(props)
		for (const prop in props) {
			this[prop] = props[prop]
		}

		// establish some default values
		this.result = this.result || { questionScores: [], attemptScore: null }
		if (this.assessmentScore) this.assessmentScore = parseFloat(this.assessmentScore)
		if (this.attemptNumber) this.attemptNumber = parseInt(this.attemptNumber, 10)
		this.isFinished = this.completedAt !== null
		this.questionResponses = []
	}

	static getCompletedAssessmentAttemptHistory(
		userId,
		draftId,
		assessmentId,
		isPreview,
		resourceLinkId
	) {
		return db.manyOrNone(
			`
				SELECT
					id AS "attemptId",
					created_at as "startTime",
					completed_at as "endTime",
					assessment_id as "assessmentId",
					state,
					result,
					draft_content_id as "contentId",
					is_imported as "isImported",
					imported_attempt_id as "importedAttemptId"
				FROM attempts
				WHERE
					user_id = $[userId]
					AND draft_id = $[draftId]
					AND assessment_id = $[assessmentId]
					AND completed_at IS NOT NULL
					AND is_preview = $[isPreview]
					AND resource_link_id = $[resourceLinkId]
					AND (state -> 'invalid' is null OR state -> 'invalid' = 'false')
				ORDER BY completed_at`,
			{ userId, draftId, assessmentId, isPreview, resourceLinkId }
		)
		// @TODO: return hydrated Assessment objects
	}

	// Finish an attempt and write a new assessment score record
	static completeAttempt(
		assessmentId,
		attemptId,
		userId,
		draftId,
		draftContentId,
		attemptScoreResult,
		assessmentScoreDetails,
		isPreview,
		resourceLinkId
	) {
		return db
			.tx(dbTransaction => {
				const q1 = dbTransaction.one(
					`
					UPDATE attempts
					SET
						completed_at = now(),
						result = $[result]
					WHERE id = $[attemptId]
					RETURNING
						id AS "attemptId",
						created_at as "startTime",
						completed_at as "endTime",
						assessment_id as "assessmentId",
						state,
						result as "scores"
				`,
					{ result: attemptScoreResult, attemptId: attemptId }
				)

				const aScore = new AssessmentScore({
					userId,
					draftId,
					draftContentId,
					assessmentId,
					attemptId,
					score: assessmentScoreDetails.assessmentModdedScore,
					scoreDetails: assessmentScoreDetails,
					isPreview,
					resourceLinkId
				})

				const q2 = aScore.create(dbTransaction)

				return dbTransaction.batch([q1, q2])
			})
			.then(result => ({
				attemptData: result[0],
				assessmentScoreId: result[1].id
			}))
	}

	static fetchAttempts(userId, draftId, isPreview, resourceLinkId, optionalAssessmentId = null) {
		return db
			.manyOrNone(
				`
				SELECT
					ROW_NUMBER () OVER (
						PARTITION by ATT.assessment_id
						ORDER BY ATT.completed_at, ATT.created_at
					) AS "attempt_number",
					ATT.*,
					SCO.id AS "assessment_score_id",
					SCO.score AS "assessment_score",
					SCO.score_details AS "score_details"
				FROM attempts ATT
				LEFT JOIN assessment_scores SCO
					ON ATT.id = SCO.attempt_id
				WHERE
					ATT.user_id = $[userId]
					AND ATT.draft_id = $[draftId]
					AND ATT.resource_link_id = $[resourceLinkId]
					${optionalAssessmentId !== null ? 'AND ATT.assessment_id = $[optionalAssessmentId]' : ''}
					AND ATT.is_preview = $[isPreview]
					AND (state -> 'invalid' is null OR state -> 'invalid' = 'false')
				ORDER BY ATT.completed_at`,
				{
					userId,
					draftId,
					optionalAssessmentId,
					isPreview,
					resourceLinkId
				}
			)
			.then(attempts => attempts.map(attempt => new AssessmentModel(attempt)))
	}

	static getAttemptIdsForUserForDraft(userId, draftId, resourceLinkId, isPreview) {
		// Note, this must use the same sorting as getAttempts()
		// for the attempt_number to be predictable
		return db.manyOrNone(
			`
			SELECT
			ROW_NUMBER () OVER (
				PARTITION by assessment_id
				ORDER BY completed_at, created_at
			) AS "attempt_number",
			id,
			state
			FROM attempts
			WHERE
				user_id = $[userId]
			AND draft_id = $[draftId]
			AND resource_link_id = $[resourceLinkId]
			AND is_preview = $[isPreview]
			AND (state -> 'invalid' is null OR state -> 'invalid' = 'false')
			ORDER BY completed_at
			`,
			{ userId, draftId, isPreview, resourceLinkId }
		)
	}

	static fetchAttemptById(attemptId) {
		return db
			.oneOrNone(
				`
				SELECT *
				FROM attempts
				WHERE id = $[attemptId]
				LIMIT 1
				`,
				{ attemptId }
			)
			.then(result => {
				return new AssessmentModel(result)
			})
			.catch(error => {
				logger.error('Assessment fetchAttemptById Error', error.message)
				return Promise.reject(error)
			})
	}

	// get attempts for user and resourceLinkId
	static async fetchAttemptHistory(
		userId,
		draftId,
		isPreview,
		resourceLinkId,
		optionalAssessmentId = null
	) {
		const assessments = new Map()
		const attempts = await AssessmentModel.fetchAttempts(
			userId,
			draftId,
			isPreview,
			resourceLinkId,
			optionalAssessmentId
		)
		const attemptIds = attempts.map(attemptIdOrImportedId)
		const responseHistory = await AssessmentModel.fetchResponsesForAttempts(attemptIds)
		const attemptMap = new Map()

		// build a returnable assessment structure
		attempts.forEach(attempt => {
			// map the attempt to the attemptId that the question responses will be looking for
			// note imported responses will have the id of the original attempt!
			attemptMap.set(attemptIdOrImportedId(attempt), attempt)

			// init assessment obj if none exist for this attempt's assessment
			if (!assessments.has(attempt.assessmentId)) {
				assessments.set(attempt.assessmentId, {
					assessmentId: attempt.assessmentId,
					attempts: []
				})
			}

			// add attempt into our assessments object
			assessments.get(attempt.assessmentId).attempts.push(attempt)
		})

		// remove all the incomplete attempts except the last one
		// this just filters out any erroniously created incomplete attempts
		assessments.forEach(a => {
			a.attempts = AssessmentModel.removeAllButLastIncompleteAttempts(a.attempts)
		})

		// Place the responses from responseHistory into the attempts created above
		responseHistory.forEach((responses, attemptId) => {
			const matchingAttempt = attemptMap.get(attemptId)

			if (!matchingAttempt) {
				throw Error(
					`Missing attempt responses userid:'${userId}', draftId:'${draftId}', attemptId:'${attemptId}'.`
				)
			}

			matchingAttempt.questionResponses = responses.map(r => ({
				questionId: r.question_id,
				response: r.response
			}))
		})

		const ltiStates = await lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId(
			userId,
			draftId,
			resourceLinkId,
			optionalAssessmentId
		)

		assessments.forEach((assessment, assessmentId) => {
			const ltiState = ltiStates[assessmentId]

			if (!ltiState) {
				assessment.ltiState = null
			} else {
				assessment.ltiState = {
					scoreSent: ltiState.scoreSent,
					sentDate: ltiState.sentDate,
					status: ltiState.status,
					gradebookStatus: ltiState.gradebookStatus,
					statusDetails: ltiState.statusDetails
				}
			}
		})

		// didn't ask for a specific assessment, return everything
		if (optionalAssessmentId === null) {
			return Array.from(assessments.values())
		}

		// asked for a specific assessment
		// size should always be 1, just get the first item
		if (assessments.size > 0) {
			return assessments.values().next().value
		}

		// asked for a specific assessment but none found
		// return a standard structure to be nice
		return {
			assessmentId: optionalAssessmentId,
			attempts: [],
			ltiState: null
		}
	}

	/*
	1. Sort by attempt number
	2. remove any incomplete attempts with a start time before the last complete time
	3. place the last incomplete attempt at the end

	Filter out any incomplete attempts that have a startTime after
	the last complete attempts' completedAt
	This function assumes that attempts are all for the same assessment_id
	*/
	static removeAllButLastIncompleteAttempts(attempts) {
		// clone the array
		let _attempts = [...attempts]
		// sort by attempt number
		_attempts = _attempts.sort(sortByAttemptNumber)
		const complete = _attempts.filter(r => r.isFinished)
		let incomplete = _attempts.filter(r => !r.isFinished)
		// if both arrays have content
		if (incomplete.length) {
			// exit early if there's no complete items
			// return an array with the last incomplete item
			if (!complete.length) {
				return incomplete.slice(-1)
			}
			// grab the last completed finishTime
			const lastCompletedTime = complete.slice(-1)[0].completedAt

			// filter all incompletes that started before lastCompletedTime
			incomplete = incomplete.filter(r => r.createdAt > lastCompletedTime)
			// make array with only the last item (or an empty array)
			incomplete = incomplete.slice(-1)
			// append the last item to the end (incomplete can be an empty array)
			return complete.concat(incomplete)
		}

		return complete
	}

	// get all attempts containing an array of responses
	// { <attemptId>: [ {...question response...} ] }
	static fetchResponsesForAttempts(attemptIds) {
		if (attemptIds.length < 1) return []
		return db
			.manyOrNone(
				`
				SELECT id, attempt_id, assessment_id, question_id, score, response
				FROM attempts_question_responses
				WHERE attempt_id IN ($[attemptIds:csv])
				ORDER BY updated_at`,
				{ attemptIds }
			)
			.then(result => {
				const history = new Map()

				result.forEach(row => {
					if (!history.has(row.attempt_id)) history.set(row.attempt_id, [])
					history.get(row.attempt_id).push(row)
				})

				return history
			})
	}

	static createNewAttempt(
		userId,
		draftId,
		draftContentId,
		assessmentId,
		state,
		isPreview,
		resourceLinkId
	) {
		return db.one(
			`
				INSERT INTO attempts (user_id, draft_id, draft_content_id, assessment_id, state, is_preview, resource_link_id)
				VALUES($[userId], $[draftId], $[draftContentId], $[assessmentId], $[state], $[isPreview], $[resourceLinkId])
				RETURNING
				id AS "attemptId",
				created_at as "startTime",
				completed_at as "endTime",
				assessment_id as "assessmentId",
				state,
				result
			`,
			{
				userId,
				draftId,
				draftContentId,
				assessmentId,
				state,
				isPreview,
				resourceLinkId
			}
		)
	}

	static getAttemptNumber(userId, draftId, attemptId, resourceLinkId, isPreview) {
		return AssessmentModel.getAttemptIdsForUserForDraft(
			userId,
			draftId,
			resourceLinkId,
			isPreview
		).then(attempts => {
			for (const attempt of attempts) {
				if (attempt.id === attemptId) return attempt.attempt_number
			}

			return null
		})
	}

	static deletePreviewAttempts({ transaction, userId, draftId, resourceLinkId }) {
		return transaction
			.manyOrNone(
				`
				SELECT id
				FROM attempts
				WHERE user_id = $[userId]
				AND draft_id = $[draftId]
				AND resource_link_id = $[resourceLinkId]
				AND is_preview = true
			`,
				{ userId, draftId, resourceLinkId }
			)
			.then(attemptIdsResult => {
				const ids = attemptIdsResult.map(i => i.id)
				if (ids.length < 1) return []

				return [
					transaction.none(
						`
						DELETE FROM attempts_question_responses
						WHERE attempt_id IN ($[ids:csv])
					`,
						{ ids }
					),
					transaction.none(
						`
						DELETE FROM attempts
						WHERE id IN ($[ids:csv])
					`,
						{ ids }
					)
				]
			})
	}

	static deletePreviewAttemptsAndScores(userId, draftId, resourceLinkId) {
		return db.tx(transaction => {
			const queryArgs = {
				transaction,
				userId,
				draftId,
				resourceLinkId
			}

			const queries = [
				AssessmentScore.deletePreviewScores(queryArgs),
				AssessmentModel.deletePreviewAttempts(queryArgs)
			]

			// both queries return an array of queries
			// when they return combine and batch execute in transaction
			return Promise.all(queries).then(([p1, p2]) => transaction.batch(p1.concat(p2)))
		})
	}

	static invalidateAttempt(attemptId) {
		// Set attempt state.invalid key to "true" 
		// NOTE: db.oneOrNone resolves null if state.invalid is already true
		// this is useful to determine if the state changed after it resolves
		return db
			.oneOrNone(
				`
				UPDATE attempts
				SET state = jsonb_set(state, '{invalid}', 'true')
				WHERE id = $[attemptId]
					AND (NOT(state ? 'invalid')
					OR state ->> 'invalid' != 'true')
				RETURNING *
				`,
				{ attemptId }
			)
			.then(result => {
				// attempt not found OR was already invalid
				if (!result) {
					return null
				}

				return new AssessmentModel(result)
			})
			.catch(error => {
				logger.error('Assessment invalidateAttempt Error', error.message)
				return Promise.reject(error)
			})
	}

	clone() {
		// eslint-disable-next-line no-unused-vars
		const { id, ...clone } = this // clone properties, except id
		return new AssessmentModel(clone)
	}

	create(dbOrTransaction = db) {
		if (this.id) throw Error('Cannot call create on a model that has an id.')
		return dbOrTransaction
			.one(
				`
			INSERT INTO attempts
				(completed_at, user_id, draft_id, assessment_id, state, result, is_preview, draft_content_id, resource_link_id, is_imported, imported_attempt_id)
				VALUES($[completedAt], $[userId], $[draftId], $[assessmentId], $[state], $[result], $[isPreview], $[draftContentId], $[resourceLinkId], $[isImported], $[importedAttemptId])
				RETURNING id, created_at, updated_at, completed_at
			`,
				this
			)
			.then(result => {
				this.id = result.id
				this.createdAt = result.created_at
				this.updatedAt = result.updated_at
				this.completedAt = result.completed_at
				return this
			})
	}

	importAsNewAttempt(resourceLinkId, dbTransaction) {
		const newAttempt = this.clone()
		newAttempt.isImported = true
		newAttempt.importedAttemptId = this.id
		newAttempt.completedAt = new Date()
		newAttempt.resourceLinkId = resourceLinkId
		return newAttempt.create(dbTransaction)
	}
}

module.exports = AssessmentModel
