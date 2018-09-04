const Assessment = require('./assessment')
const VisitModel = oboRequire('models/visit')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const insertEvent = oboRequire('insert_event')
const { getRandom, logAndRespondToUnexpected } = require('./util')
const _ = require('underscore')

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
		assessmentQBTree: null,
		attemptHistory: null,
		numAttemptsTaken: null,
		questionUsesMap: null
	}
	let attemptState
	let currentUser = null
	let currentDocument = null

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			assessmentProperties.user = user
			return VisitModel.fetchById(req.body.visitId)
		})
		.then(visit => {
			assessmentProperties.isPreview = visit.is_preview

			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			const assessmentNode = currentDocument.getChildNodeById(req.body.assessmentId)

			assessmentProperties.draftTree = currentDocument
			assessmentProperties.id = req.body.assessmentId
			assessmentProperties.oboNode = assessmentNode
			assessmentProperties.nodeChildrenIds = assessmentNode.children[1].childrenSet
			assessmentProperties.assessmentQBTree = assessmentNode.children[1].toObject()

			return Assessment.getCompletedAssessmentAttemptHistory(
				assessmentProperties.user.id,
				currentDocument.draftId,
				req.body.assessmentId,
				assessmentProperties.isPreview
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

			return Promise.all(getSendToClientPromises(attemptState, req, res))
		})
		.then(() => {
			const questionObjects = attemptState.questions.map(q => q.toObject())
			return Assessment.insertNewAttempt(
				assessmentProperties.user.id,
				currentDocument.draftId,
				currentDocument.contentId,
				req.body.assessmentId,
				{
					questions: questionObjects,
					data: attemptState.data,
					qb: assessmentProperties.assessmentQBTree
				},
				assessmentProperties.isPreview
			)
		})
		.then(result => {
			res.success(result)
			return insertAttemptStartCaliperEvent(
				result.attemptId,
				assessmentProperties.numAttemptsTaken,
				assessmentProperties.user.id,
				currentDocument,
				req.body.assessmentId,
				assessmentProperties.isPreview,
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

	createChosenQuestionTree(assessmentProperties.assessmentQBTree, assessmentProperties)

	return {
		qb: assessmentProperties.assessmentQBTree,
		questions: getNodeQuestions(
			assessmentProperties.assessmentQBTree,
			assessmentProperties.oboNode,
			[]
		),
		data: {}
	}
}

// Load the children into the children map
const loadChildren = assessmentProperties => {
	const childrenMap = createAssessmentUsedQuestionMap(assessmentProperties)

	for (const attempt of assessmentProperties.attemptHistory) {
		if (attempt.state.qb) {
			initAssessmentUsedQuestions(attempt.state.qb, childrenMap)
		}
	}
	return childrenMap
}

// Choose is the number of questions to show per attempt, select indicates how to display them.
const getQuestionBankProperties = questionBankNode => ({
	choose: questionBankNode.content.choose || Infinity,
	select: questionBankNode.content.select || 'sequential'
})

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
const initAssessmentUsedQuestions = (node, usedQuestionMap) => {
	if (usedQuestionMap.has(node.id)) usedQuestionMap.set(node.id, usedQuestionMap.get(node.id) + 1)

	for (const child of node.children) initAssessmentUsedQuestions(child, usedQuestionMap)
}

// Choose questions in order, Prioritizing less used questions first
// questions are first grouped by number of uses
// but within those groups, questions are kept in order
// only return up to the desired amount of questions per attempt.
const chooseUnseenQuestionsSequentially = (
	assessmentProperties,
	rootId, // the root id of the question bank
	numQuestionsPerAttempt
) => {
	const { oboNode, questionUsesMap } = assessmentProperties

	// convert this questionBank's (via rootId) set of direct children *IDs* to an array
	return (
		[...oboNode.draftTree.getChildNodeById(rootId).immediateChildrenSet]
			// sort those ids based on the number of time's the've been used
			.sort((id1, id2) => questionUsesMap.get(id1) - questionUsesMap.get(id2))
			// reduce the array to the number of questions in attempt
			.slice(0, numQuestionsPerAttempt)
			// return plain objects using DraftNode.toObject
			.map(id => oboNode.draftTree.getChildNodeById(id).toObject())
	)
}

// Randomly choose from all questions
// Ignores the number of times a question is used
// only return up to the desired amount of questions per attempt.
const chooseAllQuestionsRandomly = (assessmentProperties, rootId, numQuestionsPerAttempt) => {
	const { oboNode } = assessmentProperties
	// convert this questionBank's (via rootId) set of direct children *IDs* to an array
	const oboNodeQuestionIds = [...oboNode.draftTree.getChildNodeById(rootId).immediateChildrenSet]
	// shuffle the array
	return (
		_.shuffle(oboNodeQuestionIds)
			// reduce the array to the number of questions in attempt
			.slice(0, numQuestionsPerAttempt)
			// return the node objects using DraftNode.toObject
			.map(id => oboNode.draftTree.getChildNodeById(id).toObject())
	)
}

// Randomly chooses unseen questions to display.
// prioritizes questions that have been seen less
// will still return questions that have been seen
const chooseUnseenQuestionsRandomly = (assessmentProperties, rootId, numQuestionsPerAttempt) => {
	const { oboNode, questionUsesMap } = assessmentProperties
	// convert this questionBank's (via rootId) set of direct children *IDs* to an array
	return (
		[...oboNode.draftTree.getChildNodeById(rootId).immediateChildrenSet]
			// sort, prioritizing unseen questions
			.sort((id1, id2) => {
				// these questions have been seen the same number of times
				// randomize their order relative to each other [a, b] or [b, a]
				if (questionUsesMap.get(id1) === questionUsesMap.get(id2)) {
					return getRandom() - 0.5
				}
				// these questions have not been seen the same number of times
				// place the lesser seen one first
				return questionUsesMap.get(id1) - questionUsesMap.get(id2)
			})
			// reduce the array to the number of questions in attempt
			.slice(0, numQuestionsPerAttempt)
			// return plain objects using DraftNode.toObject
			.map(id => oboNode.draftTree.getChildNodeById(id).toObject())
	)
}

/*
This reduce a tree of nodes to those nodes selected for an attempt
node is probably initially a QuestionBank Node (or higher up tree)
expects all `.children` of question banks to be questions or question banks
alters `.children` of questionbank nodes

SEE the `createChosenQuestionTree` tests in attempt-start.test.js for
details on exactly what to expect from this
*/
const createChosenQuestionTree = (node, assessmentProperties) => {
	if (node.type === QUESTION_BANK_NODE_TYPE) {
		const qbProperties = getQuestionBankProperties(node)

		switch (qbProperties.select) {
			case 'random-unseen':
				node.children = chooseUnseenQuestionsRandomly(
					assessmentProperties,
					node.id,
					qbProperties.choose
				)
				break
			case 'random-all':
				node.children = chooseAllQuestionsRandomly(
					assessmentProperties,
					node.id,
					qbProperties.choose
				)
				break
			case 'sequential':
			default:
				node.children = chooseUnseenQuestionsSequentially(
					assessmentProperties,
					node.id,
					qbProperties.choose
				)
				break
		}
	}

	// Continue recursively through children
	for (const child of node.children) createChosenQuestionTree(child, assessmentProperties)
}

// Return an array of question type nodes from a node tree.
const getNodeQuestions = (node, assessmentNode, questions = []) => {
	// add this item to the questions array
	if (node.type === QUESTION_NODE_TYPE) {
		questions.push(assessmentNode.draftTree.getChildNodeById(node.id))
	}

	// recurse through this node's children
	for (const child of node.children) {
		questions.concat(getNodeQuestions(child, assessmentNode, questions))
	}

	return questions
}

// Return an array of promises that could be the result of yelling an
// assessment:sendToAssessment event.
const getSendToClientPromises = (attemptState, req, res) => {
	let promises = []
	for (const q of attemptState.questions) {
		promises = promises.concat(q.yell(ACTION_ASSESSMENT_SEND_TO_ASSESSMENT, req, res))
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
	remoteAddress
) => {
	const { createAssessmentAttemptStartedEvent } = createCaliperEvent(null, hostname)
	return insertEvent({
		action: ACTION_ASSESSMENT_ATTEMPT_START,
		actorTime: new Date().toISOString(),
		isPreview: isPreview,
		payload: {
			attemptId: attemptId,
			attemptCount: numAttemptsTaken
		},
		userId: userId,
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
	getQuestionBankProperties,
	createAssessmentUsedQuestionMap,
	initAssessmentUsedQuestions,
	chooseUnseenQuestionsSequentially,
	chooseAllQuestionsRandomly,
	chooseUnseenQuestionsRandomly,
	createChosenQuestionTree,
	getNodeQuestions,
	getSendToClientPromises,
	insertAttemptStartCaliperEvent,
	loadChildren,
	getState
}
