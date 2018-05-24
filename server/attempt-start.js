const Assessment = require('./assessment')
const DraftModel = oboRequire('models/draft')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const insertEvent = oboRequire('insert_event')
const logger = oboRequire('logger')
const logAndRespondToUnexpected = require('./util').logAndRespondToUnexpected
const _ = require('underscore')

const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const ACTION_ASSESSMENT_ATTEMPT_START = 'assessment:attemptStart'
const ACTION_ASSESSMENT_SEND_TO_ASSESSMENT = 'ObojoboDraft.Sections.Assessment:sendToAssessment'
const ERROR_ATTEMPT_LIMIT_REACHED = 'Attempt limit reached'
const ERROR_UNEXPECTED_DB_ERROR = 'Unexpected DB error'

const startAttempt = (req, res) => {
	let assessmentProperties = {
		user: null,
		isPreviewing: null,
		draftTree: null,
		id: null,
		node: null,
		nodeChildrenIds: null,
		attemptHistory: null,
		numAttemptsaken: null,
		questionUsesMap: null
	}
	let attemptState

	return req
		.requireCurrentUser()
		.then(user => {
			assessmentProperties.user = user
			assessmentProperties.isPreviewing = user.canViewEditor

			return DraftModel.fetchById(req.body.draftId)
		})
		.then(draftTree => {
			const assessmentNode = draftTree.getChildNodeById(req.body.assessmentId)

			assessmentProperties.draftTree = draftTree
			assessmentProperties.id = req.body.assessmentId
			assessmentProperties.oboNode = assessmentNode
			assessmentProperties.nodeChildrenIds = assessmentNode.children[1].childrenSet
			assessmentProperties.questionBank = assessmentNode.children[1]

			return Assessment.getCompletedAssessmentAttemptHistory(
				assessmentProperties.user.id,
				req.body.draftId,
				req.body.assessmentId
			)
		})
		.then(attemptHistory => {
			assessmentProperties.attemptHistory = attemptHistory

			return Assessment.getNumberAttemptsTaken(
				assessmentProperties.user.id,
				req.body.draftId,
				req.body.assessmentId
			)
		})
		.then(numAttemptsTaken => {
			assessmentProperties.numAttemptsTaken = numAttemptsTaken

			// If we're in preview mode, allow unlimited attempts, else throw an error
			// when trying to start an assessment with no attempts left.
			if (
				assessmentProperties.oboNode.node.content.attempts &&
				assessmentProperties.numAttemptsTaken >= assessmentProperties.oboNode.node.content.attempts
			)
				throw new Error(ERROR_ATTEMPT_LIMIT_REACHED)

			attemptState = getState(assessmentProperties)

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
					qb: attemptState.qb
				},
				assessmentProperties.isPreviewing
			)
		})
		.then(result => {
			res.success(result)

			return insertAttemptStartCaliperEvent(
				result.attemptId,
				assessmentProperties.numAttemptsaken,
				assessmentProperties.user.id,
				req.body.draftId,
				req.body.assessmentId,
				assessmentProperties.isPreviewing,
				req.hostname,
				req.connection.remoteAddress
			)
		})
		.catch(error => {
			switch (error.message) {
				case ERROR_ATTEMPT_LIMIT_REACHED:
					return res.reject(ERROR_ATTEMPT_LIMIT_REACHED)
				default:
					logAndRespondToUnexpected(ERROR_UNEXPECTED_DB_ERROR, res, req, error)
			}
		})
}

const getState = assessmentProperties => {
	assessmentProperties.questionUsesMap = loadChildren(assessmentProperties)

	let tree = assessmentProperties.questionBank.buildAssessment(assessmentProperties.questionUsesMap)

	return {
		qb: tree,
		questions: getNodeQuestions(tree, assessmentProperties.oboNode, []),
		data: {}
	}
}

// Load the children into the children map
const loadChildren = assessmentProperties => {
	const childrenMap = createAssessmentUsedQuestionMap(assessmentProperties)

	for (let attempt of assessmentProperties.attemptHistory) {
		if (attempt.state.qb) {
			initAssessmentUsedQuestions(attempt.state.qb, childrenMap)
		}
	}
	return childrenMap
}

// Maps an assessment's questions id's to the amount of times
// the questions have been used (0 until initAssessmentUsedQuestions is called).
const createAssessmentUsedQuestionMap = assessmentProperties => {
	const assessmentquestionUsesMap = new Map()
	assessmentProperties.nodeChildrenIds.forEach(id => {
		const type = assessmentProperties.draftTree.getChildNodeById(id).node.type
		if (type === QUESTION_BANK_NODE_TYPE || type === QUESTION_NODE_TYPE)
			assessmentquestionUsesMap.set(id, 0)
	})

	return assessmentquestionUsesMap
}

// When a question has been used, we will increment the value
// pointed to by the node's id in our usedMap.
const initAssessmentUsedQuestions = (node, usedQuestionMap) => {
	if (usedQuestionMap.has(node.id)) usedQuestionMap.set(node.id, usedQuestionMap.get(node.id) + 1)

	for (let child of node.children) initAssessmentUsedQuestions(child, usedQuestionMap)
}

// Return an array of question type nodes from a node tree.
const getNodeQuestions = (node, assessmentNode, questions = []) => {
	// add this item to the questions array
	if (node.type === QUESTION_NODE_TYPE) {
		questions.push(assessmentNode.draftTree.getChildNodeById(node.id))
	}

	// recurse through this node's children
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

const insertAttemptStartCaliperEvent = (
	attemptId,
	numAttemptsTaken,
	userId,
	draftId,
	assessmentId,
	isPreviewing,
	hostname,
	remoteAddress
) => {
	const { createAssessmentAttemptStartedEvent } = createCaliperEvent(null, hostname)
	return insertEvent({
		action: ACTION_ASSESSMENT_ATTEMPT_START,
		actorTime: new Date().toISOString(),
		payload: {
			attemptId: attemptId,
			attemptCount: numAttemptsTaken
		},
		userId: userId,
		ip: remoteAddress,
		metadata: {},
		draftId: draftId,
		eventVersion: '1.1.0',
		caliperPayload: createAssessmentAttemptStartedEvent({
			actor: { type: 'user', id: userId },
			draftId: draftId,
			assessmentId: assessmentId,
			attemptId: attemptId,
			isPreviewMode: isPreviewing,
			extensions: {
				count: numAttemptsTaken
			}
		})
	})
}

module.exports = {
	startAttempt,
	createAssessmentUsedQuestionMap,
	initAssessmentUsedQuestions,
	getNodeQuestions,
	getSendToClientPromises,
	insertAttemptStartCaliperEvent,
	loadChildren,
	getState
}
