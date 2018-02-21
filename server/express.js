const express = require('express')
const app = express()
const oboEvents = oboRequire('obo_events')
const DraftModel = oboRequire('models/draft')
const db = oboRequire('db')
const Assessment = require('./assessment')
const lti = oboRequire('lti')
const insertEvent = oboRequire('insert_event')
const logger = oboRequire('logger')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event') //@TODO
const _ = require('underscore')

const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const ACTION_ASSESSMENT_ATTEMPT_START = 'assessment:attemptStart'
const ACTION_ASSESSMENT_SEND_TO_ASSESSMENT = 'ObojoboDraft.Sections.Assessment:sendToAssessment'
const ERROR_ATTEMPT_LIMIT_REACHED = 'Attempt limit reached'
const ERROR_UNEXPECTED_DB_ERROR = 'Unexpected DB error'

const logAndRespondToUnexpected = (errorMessage, res, req, jsError) => {
	logger.error('logAndRespondToUnexpected', jsError, errorMessage)
	res.unexpected(jsError)
}

const getQuestionBankProperties = questionBankNode => ({
	choose: questionBankNode.content.choose || Infinity,
	select: questionBankNode.content.select || 'sequential'
})

// This map will be used to keep track of the questions we have used/have
// left to display.
const getAssessmentChildrenMap = assessmentProperties => {
	const assessmentChildrenMap = new Map()
	assessmentProperties.nodeChildrenIds.forEach(id => {
		const type = assessmentProperties.draftTree.getChildNodeById(id).node.type
		if (type === QUESTION_BANK_NODE_TYPE || QUESTION_NODE_TYPE)
			assessmentChildrenMap.set(id, 0)
	})

	return assessmentChildrenMap
}

// When a question has been used, we will increment the value
// pointed to by the node's id in our usedMap (a.k.a childrenMap).
// This will allow us to know which questions to show next.
const incrementUsedQuestionIds = (node, usedMap) => {
	if (usedMap.has(node.id))
		usedMap.set(node.id, usedMap.get(node.id) + 1)

	for (let child of node.children)
		incrementUsedQuestionIds(child, usedMap)
}

const chooseQuestionsSequentially = (numQuestionsPerAttempt, node, assessmentProperties) => {
	const { childrenMap } = assessmentProperties
	const draftNode = assessmentProperties.node.draftTree.getChildNodeById(node.id)
	const nodeChildren = [...draftNode.immediateChildrenSet]

	// Sort the questions by how many times they were used (after incrementing
	// with incrementUsedQuestionIds).
	const nodeChildrenDraftNodes = nodeChildren
		.sort((a, b) => childrenMap.get(a) - childrenMap.get(b))
		.map(id => assessmentProperties.node.draftTree.getChildNodeById(id).toObject())

	return nodeChildrenDraftNodes.slice(0, numQuestionsPerAttempt)
}

// This will narrow down the assessment tree to question banks
// with their respectively selected questions.
const createChosenQuestionTree = (node, assessmentProperties) => {
	if (node.type === QUESTION_BANK_NODE_TYPE) {
		logger.log('TEST', node.id, node.content, node.content.choose)
		const qbProperties = getQuestionBankProperties(node)

		node.children = chooseQuestionsSequentially(qbProperties.choose, node, assessmentProperties)
	}

	for (let child of node.children)
		createChosenQuestionTree(child, assessmentProperties)
}

// Return an array of question type nodes from a node tree.
const getNodeQuestions = (node, assessmentNode, questions) => {
	if (node.type === QUESTION_NODE_TYPE) {
		questions.push(assessmentNode.draftTree.getChildNodeById(node.id))
	}

	for (let child of node.children) {
		questions.concat(getNodeQuestions(child, assessmentNode, questions))
	}

	return questions
}

// Return an array of promises that could be the result of yelling an
// assessment:sendToAssessment event.
const getSendToClientPromises = (attemptState, req, res) => {
	let promises = []
	for (let q of attemptState.questions) {
		promises = promises.concat(q.yell(ACTION_ASSESSMENT_SEND_TO_ASSESSMENT, req, res))
	}

	return promises
}

const updateAssessmentProperties = (currentProps, nextProps) => {
	return Object.assign(currentProps, nextProps)
}

app.post('/api/assessments/attempt/start', (req, res, next) => {
	let assessmentProperties = {}
	let attemptState

	req.requireCurrentUser()
		.then(user => {
			assessmentProperties = updateAssessmentProperties(assessmentProperties, {
				user,
				isPreviewing: user.canViewEditor
			})

			return DraftModel.fetchById(req.body.draftId)
		})
		.then(draftTree => {
			const assessmentNode = draftTree.getChildNodeById(req.body.assessmentId)

			assessmentProperties = updateAssessmentProperties(assessmentProperties, {
				draftTree,
				id: req.body.assessmentId,
				node: assessmentNode,
				nodeChildrenIds: assessmentNode.children[1].childrenSet,
				assessmentQBTree: assessmentNode.children[1].toObject()
			})

			return Assessment.getCompletedAssessmentAttemptHistory(
				assessmentProperties.user.id,
				req.body.draftId,
				req.body.assessmentId,
				true
			)
		})
		.then(attemptHistory => {
			assessmentProperties = updateAssessmentProperties(assessmentProperties, { attemptHistory })

			return Assessment.getNumberAttemptsTaken(
				assessmentProperties.user.id,
				req.body.draftId,
				req.body.assessmentId
			)
		})
		.then(numAttemptsTaken => {
			assessmentProperties = updateAssessmentProperties(assessmentProperties, { numAttemptsTaken })

			// If we're in preview mode, allow unlimited attempts, else throw an error
			// when trying to start an assessment with no attempts left.
			if (
				!assessmentProperties.isPreviewing
				&& assessmentProperties.node.content.attempts
				&& assessmentProperties.numAttemptsTaken >= assessmentProperties.node.content.attempts
			)
				throw new Error(ERROR_ATTEMPT_LIMIT_REACHED)

			assessmentProperties = updateAssessmentProperties(assessmentProperties, {
				childrenMap: getAssessmentChildrenMap(assessmentProperties)
			})

			for (let attempt of assessmentProperties.attemptHistory) {
				if (attempt.state.qb) {
					incrementUsedQuestionIds(attempt.state.qb, assessmentProperties.childrenMap)
				}
			}

			createChosenQuestionTree(assessmentProperties.assessmentQBTree, assessmentProperties)

			attemptState = {
				qb: assessmentProperties.assessmentQBTree,
				questions: getNodeQuestions(assessmentProperties.assessmentQBTree, assessmentProperties.node, []),
				data: {}
			}

			return Promise.all(getSendToClientPromises(attemptState, req, res))
		})
		.then(() => {
			const questionObjects = attemptState.questions.map(q => q.toObject())

			return Assessment.insertNewAttempt(
				assessmentProperties.user.id,
				req.body.draftId,
				req.body.assessmentId,
				{
					questions: questionObjects,
					data: attemptState.data,
					qb: assessmentProperties.assessmentQBTree
				},
				assessmentProperties.isPreviewing
			)
		})
		.then(result => {
			res.success(result)
			const { createAssessmentAttemptStartedEvent } = createCaliperEvent(null, req.hostname)
			insertEvent({
				action: ACTION_ASSESSMENT_ATTEMPT_START,
				actorTime: new Date().toISOString(),
				payload: { attemptId: result.attemptId, attemptCount: assessmentProperties.numAttemptsTaken },
				userId: assessmentProperties.user.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: req.body.draftId,
				eventVersion: '1.1.0',
				caliperPayload: createAssessmentAttemptStartedEvent({
					actor: { type: 'user', id: assessmentProperties.user.id },
					draftId: req.body.draftId,
					assessmentId: req.body.assessmentId,
					attemptId: result.attemptId,
					isPreviewMode: assessmentProperties.isPreviewing,
					extensions: {
						count: assessmentProperties.numAttemptsaken
					}
				})
			})
		})
		.catch(error => {
			switch (error.message) {
				case ERROR_ATTEMPT_LIMIT_REACHED:
					return res.reject(ERROR_ATTEMPT_LIMIT_REACHED)
				default:
					logAndRespondToUnexpected(ERROR_UNEXPECTED_DB_ERROR, res, req, error)
			}
		})
})

app.post('/api/assessments/attempt/:attemptId/end', (req, res, next) => {
	// check perms

	// references to hold on to from various responses (so we don't have to nest thens)
	let updateResult
	let draftTree
	let attemptState
	let draftId
	let assessmentId
	let attemptScore
	let highestAttemptScore
	let attemptHistory
	let numAttempts
	let state
	let currentUser
	let isPreviewing

	req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			isPreviewing = user.canViewEditor
			// check input
			// insert
			// get draft and assessment ids for this attempt
			return db.one(
				`
				SELECT drafts.id AS draft_id, attempts.assessment_id, attempts.state as attempt_state
				FROM drafts
				JOIN attempts
				ON drafts.id = attempts.draft_id
				WHERE attempts.id = $1
			`,
				[req.params.attemptId]
			)
		})
		.then(result => {
			assessmentId = result.assessment_id
			attemptState = result.attempt_state
			draftId = result.draft_id

			return DraftModel.fetchById(draftId)
		})
		.then(draft => {
			draftTree = draft
			return db.any(
				`
			SELECT *
			FROM attempts_question_responses
			WHERE attempt_id = $1
			`,
				[req.params.attemptId]
			)
		})
		.then(responseHistory => {
			var assessment = draftTree.getChildNodeById(assessmentId)
			state = {
				scores: [0],
				questions: attemptState.questions,
				scoresByQuestionId: {}
			}

			let promises = assessment.yell(
				'ObojoboDraft.Sections.Assessment:attemptEnd',
				req,
				res,
				assessment,
				responseHistory,
				{
					getQuestions: () => {
						return state.questions
					},
					addScore: (questionId, score) => {
						state.scores.push(score)
						state.scoresByQuestionId[questionId] = score
					}
				}
			)

			return Promise.all(promises)
		})
		.then(() => {
			attemptScore =
				state.scores.reduce((a, b) => {
					return a + b
				}) / state.questions.length

			let scores = state.questions.map(question => {
				return {
					id: question.id,
					score: state.scoresByQuestionId[question.id] || 0
				}
			})

			let result = {
				attemptScore: attemptScore,
				scores: scores
			}
			return Assessment.updateAttempt(result, req.params.attemptId)
		})
		.then(updateAttemptResult => {
			updateResult = updateAttemptResult

			return Assessment.getCompletedAssessmentAttemptHistory(
				currentUser.id,
				draftId,
				assessmentId,
				false
			)
		})
		.then(attemptHistoryResult => {
			attemptHistory = attemptHistoryResult

			return Assessment.getNumberAttemptsTaken(currentUser.id, draftId, assessmentId)
		})
		.then(numAttemptsResult => {
			numAttempts = numAttemptsResult
			let { createAssessmentAttemptSubmittedEvent } = createCaliperEvent(null, req.hostname)
			insertEvent({
				action: 'assessment:attemptEnd',
				actorTime: new Date().toISOString(),
				payload: {
					attemptId: req.params.attemptId,
					attemptCount: isPreviewing ? -1 : numAttempts
				},
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: draftId,
				eventVersion: '1.1.0',
				caliperPayload: createAssessmentAttemptSubmittedEvent({
					actor: { type: 'user', id: currentUser.id },
					draftId,
					assessmentId,
					attemptId: req.params.attemptId,
					isPreviewMode: isPreviewing
				})
			})

			if (isPreviewing) return Promise.resolve(false)

			let allScores = attemptHistory.map(attempt => {
				return parseFloat(attempt.result.attemptScore)
			})
			highestAttemptScore = Math.max(0, ...allScores) / 100

			return lti.replaceResult(currentUser.id, draftId, highestAttemptScore)
		})
		.then(isScoreSent => {
			updateResult.ltiOutcomes = {
				sent: isScoreSent
			}
			res.success(updateResult)
			let { createAssessmentAttemptScoredEvent } = createCaliperEvent(null, req.hostname)
			insertEvent({
				action: 'assessment:attemptScored',
				actorTime: new Date().toISOString(),
				payload: {
					attemptId: req.params.attemptId,
					attemptCount: isPreviewing ? -1 : numAttempts,
					attemptScore: attemptScore,
					highestAttemptScore: isPreviewing ? -1 : highestAttemptScore,
					didSendLtiOutcome: isScoreSent
				},
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: draftId,
				eventVersion: '1.1.0',
				caliperPayload: createAssessmentAttemptScoredEvent({
					actor: { type: 'serverApp' },
					draftId,
					assessmentId,
					attemptId: req.params.attemptId,
					attemptScore,
					isPreviewMode: isPreviewing,
					extensions: {
						attemptCount: isPreviewing ? -1 : numAttempts,
						attemptScore: attemptScore,
						highestAttemptScore: isPreviewing ? -1 : highestAttemptScore,
						didSendLtiOutcome: isScoreSent
					}
				})
			})
		})
		.catch(error => {
			logger.error('error', error, error.toString())
			logAndRespondToUnexpected(
				'Unexpected error',
				res,
				req,
				Error('Unexpected Error Completing your attempt.')
			)
		})
})

// gets the current user's attempts for all assessments for a specific draft
app.get('/api/drafts/:draftId/attempts', (req, res, next) => {
	// check perms
	req
		.requireCurrentUser()
		.then(currentUser => {
			// check input
			// select
			return db.manyOrNone(
				`
				SELECT
					id AS "attemptId",
					created_at as "startDate",
					completed_at as "endDate",
					assessment_id,
					state,
					score
				FROM attempts
				WHERE user_id = $[userId]
					AND draft_id = $[draftId]
				ORDER BY completed_at DESC`,
				{ userId: currentUser.id, draftId: req.params.draftId }
			)
		})
		.then(result => {
			res.success({ attempts: result })
		})
		.catch(error => {
			logger.error('error', error, error.toString())
			logAndRespondToUnexpected(
				'Unexpected error',
				res,
				req,
				Error('Unexpected Error Loading attempts.')
			)
		})
})

oboEvents.on('client:assessment:setResponse', (event, req) => {
	let eventRecordResponse = 'client:assessment:setResponse'

	// check perms
	// check input
	if (!event.payload.attemptId)
		return logger.error(eventRecordResponse, 'Missing Attempt ID', req, event)
	if (!event.payload.questionId)
		return logger.error(eventRecordResponse, 'Missing Question ID', req, event)
	if (!event.payload.response)
		return logger.error(eventRecordResponse, 'Missing Response', req, event)

	return db
		.none(
		`
			INSERT INTO attempts_question_responses
			(attempt_id, question_id, response, assessment_id)
			VALUES($[attemptId], $[questionId], $[response], $[assessmentId])
			ON CONFLICT (attempt_id, question_id) DO
				UPDATE
				SET
					response = $[response],
					updated_at = now()
				WHERE attempts_question_responses.attempt_id = $[attemptId]
					AND attempts_question_responses.question_id = $[questionId]`,
		{
			assessmentId: event.payload.assessmentId,
			attemptId: event.payload.attemptId,
			questionId: event.payload.questionId,
			response: event.payload.response
		}
		)
		.catch(error => {
			logger.error(eventRecordResponse, 'DB UNEXPECTED', req, error, error.toString())
		})
})

module.exports = app
