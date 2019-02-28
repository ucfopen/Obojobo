const DraftNode = oboRequire('models/draft_node')
const Visit = oboRequire('models/visit')
const db = oboRequire('db')
const lti = oboRequire('lti')
const logger = oboRequire('logger')

class Assessment extends DraftNode {
	static getCompletedAssessmentAttemptHistory(userId, draftId, assessmentId, isPreview) {
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
				ORDER BY completed_at`,
			{ userId, draftId, assessmentId, isPreview }
		)
	}

	static createUserAttempt(userId, draftId, attempt) {
		return {
			userId: userId,
			draftId: draftId,
			contentId: attempt.draft_content_id,
			attemptId: attempt.attempt_id,
			assessmentScoreId: attempt.assessment_score_id,
			attemptNumber: parseInt(attempt.attempt_number, 10),
			assessmentId: attempt.assessment_id,
			startTime: attempt.created_at,
			finishTime: attempt.completed_at,
			isFinished: attempt.completed_at !== null,
			state: attempt.state,
			questionScores: attempt.result ? attempt.result.questionScores : [],
			responses: {},
			attemptScore: attempt.result ? attempt.result.attemptScore : null,
			assessmentScore: parseFloat(attempt.assessment_score),
			assessmentScoreDetails: attempt.score_details
		}
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

	static getAttempts(userId, draftId, isPreview, optionalAssessmentId = null) {
		const assessments = {}

		return db
			.manyOrNone(
				`
				SELECT
					ROW_NUMBER () OVER (
						PARTITION by ATT.assessment_id
						ORDER BY ATT.completed_at, ATT.created_at
					) AS "attempt_number",
					ATT.id AS "attempt_id",
					ATT.assessment_id,
					ATT.created_at,
					ATT.updated_at,
					ATT.completed_at,
					ATT.state,
					ATT.result,
					ATT.draft_content_id,
					SCO.id AS "assessment_score_id",
					SCO.score AS "assessment_score",
					SCO.score_details AS "score_details"
				FROM attempts ATT
				LEFT JOIN assessment_scores SCO
				ON ATT.id = SCO.attempt_id
				WHERE
					ATT.user_id = $[userId]
					AND ATT.draft_id = $[draftId]
					${optionalAssessmentId !== null ? 'AND ATT.assessment_id = $[optionalAssessmentId]' : ''}
					AND ATT.is_preview = $[isPreview]
				ORDER BY ATT.completed_at`,
				{
					userId,
					draftId,
					optionalAssessmentId,
					isPreview
				}
			)
			.then(attempts => {
				// turn array of results from the query into a nested object
				// { assessment1: { id: 'assessment1', attempts: [{} , {}] }, ... }
				attempts.forEach(attempt => {
					const userAttempt = Assessment.createUserAttempt(userId, draftId, attempt)

					// create new assessment object if we don't have one yet
					if (!assessments[userAttempt.assessmentId]) {
						assessments[userAttempt.assessmentId] = {
							assessmentId: userAttempt.assessmentId,
							attempts: []
						}
					}

					// add attempt into our assessments object
					assessments[userAttempt.assessmentId].attempts.push(userAttempt)
				})

				/*
					Obojobo expects there to only be one incomplete attempt at max
					It also expects that attempt to be the most recent
					Filter out any incomplete attempts that don't meet those requirements
				*/
				for (const k in assessments) {
					const a = assessments[k]
					a.attempts = Assessment.filterIncompleteAttempts(a.attempts)
				}
			})
			.then(() => {
				// now, get the response history for this user & draft
				return Assessment.getResponseHistory(userId, draftId, isPreview, optionalAssessmentId)
			})
			.then(responseHistory => {
				// Goal: place the responses from history into the attempts created above
				// history is keyed by attemptId
				// find the matching attemptID in assessments.<id>.attempts[ {attemptId:<attemptId>}, ...]
				// and place our responses into the userAttempt objects in assessments
				for (const attemptId in responseHistory) {
					const responsesForAttempt = responseHistory[attemptId]

					// loop through responses in this attempt
					responsesForAttempt.forEach(response => {
						if (!assessments[response.assessment_id]) return

						const attemptForResponse = assessments[response.assessment_id].attempts.find(
							x => x.attemptId === response.attempt_id
						)

						if (!attemptForResponse) {
							logger.warn(
								`Couldn't find an attempt I was looking for ('${userId}', '${draftId}', '${attemptId}', '${
									response.id
								}', '${optionalAssessmentId}') - Shouldn't get here!`
							)

							return
						}

						// asessments.<assessmentId>.attempts
						attemptForResponse.responses[response.question_id] = response.response
					})
				}
			})
			.then(() =>
				lti.getLTIStatesByAssessmentIdForUserAndDraft(userId, draftId, optionalAssessmentId)
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

	static getAttemptIdsForUserForDraft(userId, draftId, isPreview) {
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
			AND is_preview = $[isPreview]
			ORDER BY completed_at
			`,
			{ userId, draftId, isPreview }
		)
	}

	static getAttemptNumber(userId, draftId, attemptId, isPreview) {
		return Assessment.getAttemptIdsForUserForDraft(userId, draftId, isPreview).then(attempts => {
			for (const attempt of attempts) {
				if (attempt.id === attemptId) return attempt.attempt_number
			}

			return null
		})
	}

	static getAttempt(attemptId) {
		return db.oneOrNone(
			`
			SELECT *
			FROM attempts
			WHERE id = $[attemptId]
			`,
			{ attemptId }
		)
	}

	// get all attempts containing an array of responses
	// { <attemptId>: [ {...question response...} ] }
	static getResponseHistory(userId, draftId, isPreview, optionalAssessmentId = null) {
		return db
			.manyOrNone(
				`
				SELECT *
				FROM attempts_question_responses
				WHERE attempt_id IN (
					SELECT id
					FROM attempts
					WHERE user_id = $[userId]
					AND draft_id = $[draftId]
					AND is_preview = $[isPreview]
					${optionalAssessmentId !== null ? "AND assessment_id = '" + optionalAssessmentId + "'" : ''}
				) ORDER BY updated_at`,
				{ userId, draftId, isPreview, optionalAssessmentId }
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

	static getResponsesForAttempt(attemptId) {
		return db.manyOrNone(
			`
				SELECT *
				FROM attempts_question_responses
				WHERE attempt_id = $[attemptId]
				ORDER BY updated_at`,
			{ attemptId }
		)
	}

	static insertNewAttempt(userId, draftId, contentId, assessmentId, state, isPreview) {
		return db.one(
			`
				INSERT INTO attempts (user_id, draft_id, draft_content_id, assessment_id, state, is_preview)
				VALUES($[userId], $[draftId], $[contentId], $[assessmentId], $[state], $[isPreview])
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
				contentId,
				assessmentId,
				state,
				isPreview
			}
		)
	}

	// Finish an attempt and write a new assessment score record
	static completeAttempt(
		assessmentId,
		attemptId,
		userId,
		draftId,
		contentId,
		attemptScoreResult,
		assessmentScoreDetails,
		isPreview
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

				const q2 = dbTransaction.one(
					`
					INSERT INTO assessment_scores (user_id, draft_id, draft_content_id, assessment_id, attempt_id, score, score_details, is_preview)
					VALUES($[userId], $[draftId], $[contentId], $[assessmentId], $[attemptId], $[score], $[scoreDetails], $[isPreview])
					RETURNING id
				`,
					{
						userId,
						draftId,
						contentId,
						assessmentId,
						attemptId,
						score: assessmentScoreDetails.assessmentModdedScore,
						scoreDetails: assessmentScoreDetails,
						isPreview
					}
				)

				return dbTransaction.batch([q1, q2])
			})
			.then(result => {
				return {
					attemptData: result[0],
					assessmentScoreId: result[1].id
				}
			})
	}

	// Update the state for an attempt
	static updateAttemptState(attemptId, state) {
		return db.none(
			`
			UPDATE attempts
			SET state = $[state]
			WHERE id = $[attemptId]
			`,
			{ state: state, attemptId: attemptId }
		)
	}

	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'internal:sendToClient': this.onSendToClient,
			'internal:startVisit': this.onStartVisit
		})
	}

	onSendToClient(req, res) {
		return this.yell('ObojoboDraft.Sections.Assessment:sendToClient', req, res)
	}

	onStartVisit(req, res, draftId, visitId, extensionsProps) {
		let currentUser
		return req
			.requireCurrentUser()
			.then(user => {
				currentUser = user
				return Visit.fetchById(visitId)
			})
			.then(visit => {
				return this.constructor.getAttempts(currentUser.id, draftId, visit.is_preview)
			})
			.then(attempts => {
				extensionsProps[':ObojoboDraft.Sections.Assessment:attemptHistory'] = attempts
			})
	}
}

module.exports = Assessment
