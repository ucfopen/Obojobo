const Assessment = require('./assessment')
const AssessmentModel = require('./models/assessment')
const VisitModel = require('obojobo-express/models/visit')
const createCaliperEvent = require('obojobo-express/routes/api/events/create_caliper_event')
const insertEvent = require('obojobo-express/insert_event')
const { logAndRespondToUnexpected, getFullQuestionsFromDraftTree } = require('./util')

const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const ACTION_ASSESSMENT_ATTEMPT_START = 'assessment:attemptStart'
const ACTION_ASSESSMENT_SEND_TO_ASSESSMENT = 'ObojoboDraft.Sections.Assessment:sendToAssessment'
const ERROR_ATTEMPT_LIMIT_REACHED = 'Attempt limit reached'
const ERROR_UNEXPECTED_DB_ERROR = 'Unexpected DB error'

const startAttempt = (req, res) => {
	const assessmentProperties = {
		user: null,
		isPreview: null,
		draftTree: null,
		id: null,
		node: null,
		nodeChildrenIds: null,
		questionBank: null,
		attemptHistory: null,
		numAttemptsTaken: null,
		questionUsesMap: null,
		resourceLinkId: null
	}
	let attemptState
	let currentDocument = null

	return req
		.requireCurrentUser() // @TODO: this is redundant - handled in express router
		.then(user => {
			assessmentProperties.user = user
			return VisitModel.fetchById(req.body.visitId)
		})
		.then(visit => {
			assessmentProperties.isPreview = visit.is_preview
			assessmentProperties.resourceLinkId = visit.resource_link_id

			return req.requireCurrentDocument() // @TODO: this is redundant - handled in express router
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			const assessmentNode = currentDocument.getChildNodeById(req.body.assessmentId)

			assessmentProperties.draftTree = currentDocument
			assessmentProperties.id = req.body.assessmentId
			assessmentProperties.oboNode = assessmentNode
			assessmentProperties.nodeChildrenIds = assessmentNode.children[1].childrenSet
			assessmentProperties.questionBank = assessmentNode.children[1]

			return AssessmentModel.getCompletedAssessmentAttemptHistory(
				assessmentProperties.user.id,
				currentDocument.draftId,
				req.body.assessmentId,
				assessmentProperties.isPreview,
				assessmentProperties.resourceLinkId
			)
		})
		.then(attemptHistory => {
			assessmentProperties.attemptHistory = attemptHistory
			assessmentProperties.numAttemptsTaken = attemptHistory.length

			// If we're in preview mode, allow unlimited attempts, else throw an error
			// when trying to start an assessment with no attempts left.
			if (
				assessmentProperties.oboNode.node.content.attempts &&
				assessmentProperties.numAttemptsTaken >= assessmentProperties.oboNode.node.content.attempts
			) {
				throw new Error(ERROR_ATTEMPT_LIMIT_REACHED)
			}

			attemptState = getState(assessmentProperties)

			return Promise.all(
				getSendToClientPromises(assessmentProperties.oboNode, attemptState, req, res)
			)
		})
		.then(() => {
			return AssessmentModel.createNewAttempt(
				assessmentProperties.user.id,
				currentDocument.draftId,
				currentDocument.contentId,
				req.body.assessmentId,
				{
					chosen: attemptState.chosen
				},
				assessmentProperties.isPreview,
				assessmentProperties.resourceLinkId
			)
		})
		.then(result => {
			result.questions = getFullQuestionsFromDraftTree(
				assessmentProperties.oboNode.draftTree,
				result.state.chosen
			)

			res.success(result)

			return insertAttemptStartCaliperEvent(
				result.attemptId,
				assessmentProperties.numAttemptsTaken,
				assessmentProperties.user.id,
				currentDocument,
				req.body.assessmentId,
				assessmentProperties.isPreview,
				req.hostname,
				req.connection.remoteAddress,
				req.body.visitId
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

	let chosenAssessment = assessmentProperties.questionBank.buildAssessment(
		assessmentProperties.questionUsesMap
	)

	// The state of an assessment can be stored using only the id and type
	// of nodes in the assessment. The remaining data can be retrieved
	// from the draftTree
	chosenAssessment = chosenAssessment.map(node => {
		return {
			type: node.type,
			id: node.id
		}
	})

	return {
		chosen: chosenAssessment
	}
}

// Load the children into the children map
const loadChildren = assessmentProperties => {
	const childrenMap = createAssessmentUsedQuestionMap(assessmentProperties)

	for (const attempt of assessmentProperties.attemptHistory) {
		if (attempt.state.chosen) {
			initAssessmentUsedQuestions(attempt.state.chosen, childrenMap)
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
		if (type === QUESTION_BANK_NODE_TYPE || type === QUESTION_NODE_TYPE) {
			assessmentquestionUsesMap.set(id, 0)
		}
	})

	return assessmentquestionUsesMap
}

// When a question has been used, we will increment the value
// pointed to by the node's id in our usedMap.
const initAssessmentUsedQuestions = (chosenAssessment, usedQuestionMap) => {
	for (const node of chosenAssessment) {
		if (usedQuestionMap.has(node.id)) {
			usedQuestionMap.set(node.id, usedQuestionMap.get(node.id) + 1)
		}
	}
}

// Return an array of promises that could be the result of yelling an
// assessment:sendToAssessment event.
const getSendToClientPromises = (assessmentNode, attemptState, req, res) => {
	let promises = []
	for (const node of attemptState.chosen) {
		// A nodeInstance must be fetched from the draftTree since the state of an assessment only holds question/questionBank node ids and types.
		// Questions and question banks can be yelled at once an instance is retrieved.s
		const nodeInstance = assessmentNode.draftTree.getChildNodeById(node.id)
		promises = promises.concat(nodeInstance.yell(ACTION_ASSESSMENT_SEND_TO_ASSESSMENT, req, res))
	}

	return promises
}

const insertAttemptStartCaliperEvent = (
	attemptId,
	numAttemptsTaken,
	userId,
	draftDocument,
	assessmentId,
	isPreview,
	hostname,
	remoteAddress,
	visitId
) => {
	const { createAssessmentAttemptStartedEvent } = createCaliperEvent(null, hostname)
	return insertEvent({
		action: ACTION_ASSESSMENT_ATTEMPT_START,
		actorTime: new Date().toISOString(),
		isPreview,
		payload: {
			attemptId: attemptId,
			attemptCount: numAttemptsTaken
		},
		visitId,
		userId,
		ip: remoteAddress,
		metadata: {},
		draftId: draftDocument.draftId,
		contentId: draftDocument.contentId,
		eventVersion: '1.1.0',
		caliperPayload: createAssessmentAttemptStartedEvent({
			actor: { type: 'user', id: userId },
			draftId: draftDocument.draftId,
			contentId: draftDocument.contentId,
			assessmentId: assessmentId,
			attemptId: attemptId,
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
	getSendToClientPromises,
	insertAttemptStartCaliperEvent,
	loadChildren,
	getState
}
