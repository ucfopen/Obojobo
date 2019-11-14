const db = require('obojobo-express/db')
const camelcaseKeys = require('camelcase-keys')
const logger = require('obojobo-express/logger')
const lti = require('obojobo-express/lti')
const AssessmentScore = require('./assessment-score')

class AssessmentModel {
	constructor(props) {
		// expand all the props onto this object with camel case keys
		props = camelcaseKeys(props)
		for (const prop in props) {
			this[prop] = props[prop]
		}

		// establish some default values
		this.result = this.result || { questionScores: [], attemptScore: null}
		if(this.assessmentScore) this.assessmentScore = parseFloat(this.assessmentScore)
		if(this.attemptNumber) this.attemptNumber = parseInt(this.attemptNumber, 10)
		this.isFinished = this.isFinished != null
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
					draft_content_id as "contentId"
				FROM attempts
				WHERE
					user_id = $[userId]
					AND draft_id = $[draftId]
					AND assessment_id = $[assessmentId]
					AND completed_at IS NOT NULL
					AND is_preview = $[isPreview]
					AND resource_link_id = $[resourceLinkId]
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
			.then(result => {
				return {
					attemptData: result[0],
					assessmentScoreId: result[1].id
				}
			})
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
				ORDER BY ATT.completed_at`,
				{
					userId,
					draftId,
					optionalAssessmentId,
					isPreview,
					resourceLinkId
				}
			)
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
			id
			FROM attempts
			WHERE
				user_id = $[userId]
			AND draft_id = $[draftId]
			AND resource_link_id = $[resourceLinkId]
			AND is_preview = $[isPreview]
			ORDER BY completed_at
			`,
			{ userId, draftId, isPreview, resourceLinkId }
		)
	}

	static fetchAttemptByID(attemptId) {
		return db.oneOrNone(
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
				logger.error('Assessment fetchAttemptByID Error', error.message)
				return Promise.reject(error)
			})
	}

	static getImportableAttempt(userId, draftContentId, isPreview){
		return db
			.oneOrNone(`
				SELECT
					*
				FROM attempts
				WHERE
					user_id = $[userId]
					AND draft_content_id = $[draftContentId]
					AND is_preview = $[isPreview]
					AND is_imported = false
				ORDER BY
					completed_at DESC
				LIMIT 1
				`,
				{
					userId,
					isPreview,
					draftContentId
				})
			.then(result => {
				if(result){
					return new AssessmentModel(result)
				}
			})
	}

	// get attempts for user and resour
	static fetchAttemptHistory(userId, draftId, isPreview, resourceLinkId, optionalAssessmentId = null) {
		const assessments = {}
		const mapImportedToAttempt = {} // key is imported_attempt_id, value is attempt_id
		const attemptIds = []
		return AssessmentModel.fetchAttempts(userId, draftId, isPreview, resourceLinkId, optionalAssessmentId)
			.then(attempts => {
				// turn array of results from the query into a nested object
				// { assessment1: { id: 'assessment1', attempts: [{} , {}] }, ... }
				attempts.forEach(attempt => {
					attempt = new AssessmentModel(attempt)
					// collect an array of attemptIds from each attempt
					// if it's imported, use the imported attempt id
					attemptIds.push(attempt.isImported ? attempt.importedAttemptId : attempt.id)
					// if imported, keep track of it so we know where to put the
					// question responses
					if(attempt.isImported){
						mapImportedToAttempt[attempt.importedAttemptId] = attempt.id
					}

					// create new assessment object if we don't have one yet
					if (!assessments[attempt.assessmentId]) {
						assessments[attempt.assessmentId] = {
							assessmentId: attempt.assessmentId,
							attempts: []
						}
					}

					// add attempt into our assessments object
					assessments[attempt.assessmentId].attempts.push(attempt)
				})

				/*
					Obojobo expects there to only be one incomplete attempt at max
					It also expects that attempt to be the most recent
					Filter out any incomplete attempts that don't meet those requirements
				*/
				for (const k in assessments) {
					const a = assessments[k]
					a.attempts = AssessmentModel.filterIncompleteAttempts(a.attempts)
				}
			})
			.then(() => AssessmentModel.fetchResponsesForAttempts(attemptIds))
			.then(responseHistory => {
				// Goal: place the responses from history into the attempts created above
				// history is keyed by attemptId
				// find the matching attemptID in assessments.<id>.attempts[ {attemptId:<attemptId>}, ...]
				// and place our responses into the userAttempt objects in assessments
				for (const attemptId in responseHistory) {
					const responsesForAttempt = responseHistory[attemptId]
					const responsesAreImported = Boolean(mapImportedToAttempt[attemptId])

					// loop through responses in this attempt
					responsesForAttempt.forEach(response => {
						if (!assessments[response.assessment_id]) return

						// find the first userAttempt that matches
						const attemptForResponse = assessments[response.assessment_id].attempts.find(attempt => {
							const attemptIdToMatch = responsesAreImported ? attempt.importedAttemptId : attempt.id
							return attemptIdToMatch === response.attempt_id
						})

						if (!attemptForResponse) {
							logger.warn(
								`Couldn't find an attempt I was looking for ('${userId}', '${draftId}', '${attemptId}', '${
									response.id
								}', '${optionalAssessmentId}') - Shouldn't get here!`
							)

							return
						}

						attemptForResponse.questionResponses.push({ questionId: response.question_id, response: response.response})
					})
				}
			})
			.then(() =>
				lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId(
					userId,
					draftId,
					resourceLinkId,
					optionalAssessmentId
				)
			)
			.then(ltiStates => {
				const assessmentsArr = Object.keys(assessments).map(k => assessments[k])
				assessmentsArr.forEach(assessmentItem => {
					const ltiState = ltiStates[assessmentItem.assessmentId]

					if (!ltiState) {
						assessmentItem.ltiState = null
					} else {
						assessmentItem.ltiState = {
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
					return assessmentsArr
				}

				// asked for a specific assessment return it
				if (assessmentsArr.length > 0) {
					return assessmentsArr[0]
				}

				// asked for a specific assessment but none found
				return {
					assessmentId: optionalAssessmentId,
					attempts: [],
					ltiState: null
				}
			})
	}

	/*
	Filter out any incomplete attempts that have a startTime after
	the last complete attempts' finishTime
	This function assumes that attempts are all for the same assessment_id
	*/
	static filterIncompleteAttempts(attempts) {
		const complete = attempts.filter(r => r.isFinished).sort((a, b) => a.finishTime - b.finishTime)

		const incomplete = attempts.filter(r => !r.isFinished).sort((a, b) => a.startTime - b.startTime)

		// no completed, return the latest incomplete
		if (!complete.length && incomplete.length) {
			const newestIncomplete = incomplete[incomplete.length - 1]
			return [newestIncomplete]
		}

		if (incomplete.length) {
			// If the last incomplete was created AFTER the last completed at date then include it too
			const newestIncomplete = incomplete[incomplete.length - 1]
			const newestComplete = complete[complete.length - 1]
			if (newestIncomplete.startTime > newestComplete.finishTime) {
				complete.push(newestIncomplete)
			}
		}

		return complete
	}

	static fetchResponsesForAttempt(attemptId) {
		return db.manyOrNone(
			`
				SELECT *
				FROM attempts_question_responses
				WHERE attempt_id = $[attemptId]
				ORDER BY updated_at`,
			{ attemptId }
		)
	}

	// get all attempts containing an array of responses
	// { <attemptId>: [ {...question response...} ] }
	static fetchResponsesForAttempts(attemptIds) {
		if(attemptIds.length < 1) return []
		return db
			.manyOrNone(
				`
				SELECT *
				FROM attempts_question_responses
				WHERE attempt_id IN ($[attemptIds:csv])
				ORDER BY updated_at`,
				{ attemptIds }
			)
			.then(result => {
				const history = {}

				result.forEach(row => {
					if (!history[row.attempt_id]) history[row.attempt_id] = []
					history[row.attempt_id].push(row)
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
		return AssessmentModel.getAttemptIdsForUserForDraft(userId, draftId, resourceLinkId, isPreview).then(
			attempts => {
				for (const attempt of attempts) {
					if (attempt.id === attemptId) return attempt.attempt_number
				}

				return null
			}
		)
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

	static deletePreviewAttemptsAndScores(userId, draftId, resourceLinkId){
		return db
			.tx(transaction => {
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
				return Promise.all(queries)
					.then(([p1, p2]) => transaction.batch(p1.concat(p2)) )
			})
	}

	clone(){
		const clone = Object.assign({}, this)
		return new AssessmentModel(clone)
	}

	create(dbOrTransaction = db){
		if(this.id) throw 'E'
		return dbOrTransaction.one(`
			INSERT INTO attempts
				(completed_at, user_id, draft_id, assessment_id, state, result, is_preview, draft_content_id, resource_link_id, is_imported, imported_attempt_id)
				VALUES($[completedAt], $[userId], $[draftId], $[assessmentId], $[state], $[result], $[isPreview], $[draftContentId], $[resourceLinkId], $[isImported], $[importedAttemptId])
				RETURNING id, created_at, updated_at, completed_at
			`, this)
			.then(result => {
				this.id = result.id
				this.createdAt = result.created_at
				this.updatedAt = result.updated_at
				this.completedAt = result.completedAt
				return this
			})
	}

	importAsNewAttempt(resourceLinkId){
		const newAttempt = this.clone()
		delete newAttempt.id
		newAttempt.isImported = true
		newAttempt.importedAttemptId = this.id
		newAttempt.completedAt = new Date()
		newAttempt.resourceLinkId = resourceLinkId
		// dispatch an event?
		// store a caliper event?
		return newAttempt.create()
	}


}

module.exports = AssessmentModel
