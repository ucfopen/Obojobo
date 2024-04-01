const AssessmentModel = require('./models/assessment')
const insertEvent = require('obojobo-express/server/insert_event')
const {
	logAndRespondToUnexpected,
	getFullQuestionsFromDraftTree,
	getVariablesUsedInNode,
	getVariableOwner
} = require('./util')

const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const ACTION_ASSESSMENT_ATTEMPT_START = 'assessment:attemptStart'
const ACTION_ASSESSMENT_SEND_TO_ASSESSMENT = 'ObojoboDraft.Sections.Assessment:sendToAssessment'
const ERROR_ATTEMPT_LIMIT_REACHED = 'Attempt limit reached'
const ERROR_UNEXPECTED_DB_ERROR = 'Unexpected DB error'
const ERROR_IMPORT_USED = 'Import score has already been used'
const ERROR_ASSESSMENT_ID_NOT_FOUND = 'ID not found'

const startAttempt = (req, res) => {
	let attemptState
	let assessmentProperties
	let assessmentNode

	const variableValues = []
	return Promise.resolve()
		.then(() => req.currentDocument.yell('internal:generateVariables', req, res, variableValues))
		.then(() => {
			attemptState
			assessmentProperties = {
				user: req.currentUser,
				isPreview: req.currentVisit.is_preview,
				draftTree: req.currentDocument,
				id: req.body.assessmentId,
				oboNode: null,
				nodeChildrenIds: null,
				questionBank: null,
				attemptHistory: null,
				numAttemptsTaken: null,
				questionUsesMap: null,
				variables: variableValues,
				resourceLinkId: req.currentVisit.resource_link_id
			}

			// @TODO: make sure assessmentID is found
			assessmentNode = req.currentDocument.getChildNodeById(req.body.assessmentId)

			if (!assessmentNode) {
				throw new Error(ERROR_ASSESSMENT_ID_NOT_FOUND)
			}

			assessmentProperties.oboNode = assessmentNode
			assessmentProperties.nodeChildrenIds = assessmentNode.children[1].childrenSet
			assessmentProperties.questionBank = assessmentNode.children[1]

			return AssessmentModel.getCompletedAssessmentAttemptHistory(
				req.currentUser.id,
				req.currentDocument.draftId,
				req.body.assessmentId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id
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

			// look to see if import has been used before
			const isImportUsed = attemptHistory.find(attempt => attempt.isImported === true)
			if (isImportUsed) {
				throw new Error(ERROR_IMPORT_USED)
			}

			attemptState = getState(req.currentDocument, assessmentProperties)
			const toClientPromises = getSendToClientPromises(
				assessmentProperties.oboNode,
				attemptState,
				req,
				res
			)
			return Promise.all(toClientPromises)
		})
		.then(() => {
			return AssessmentModel.createNewAttempt(
				req.currentUser.id,
				req.currentDocument.draftId,
				req.currentDocument.contentId,
				req.body.assessmentId,
				{
					chosen: attemptState.chosen,
					variables: attemptState.variables
				},
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id
			)
		})
		.then(result => {
			result.questions = getFullQuestionsFromDraftTree(
				assessmentProperties.oboNode.draftTree,
				result.state.chosen
			)
			res.success(result)
			return insertAttemptStartEvent(
				result.attemptId,
				assessmentProperties.numAttemptsTaken,
				req.currentUser.id,
				req.currentDocument,
				req.body.assessmentId,
				req.currentVisit.is_preview,
				req.hostname,
				req.connection.remoteAddress,
				req.body.visitId
			)
		})
		.catch(error => {
			switch (error.message) {
				case ERROR_ATTEMPT_LIMIT_REACHED:
				case ERROR_IMPORT_USED:
				case ERROR_ASSESSMENT_ID_NOT_FOUND:
					return res.reject(error.message)

				default:
					logAndRespondToUnexpected(ERROR_UNEXPECTED_DB_ERROR, res, req, error)
			}
		})
}

const getState = (draftTree, assessmentProperties) => {
	assessmentProperties.questionUsesMap = loadChildren(assessmentProperties)

	let chosenAssessment = assessmentProperties.questionBank.buildAssessment(
		assessmentProperties.questionUsesMap
	)

	// most assessment state data can be pulled from the draft tree when necessary,
	//  but the chosen questions (and their variables, and the owners of those variables)
	//  needs to be tracked independently
	chosenAssessment = chosenAssessment.map(node => {
		const chosen = {
			type: node.type,
			id: node.id
		}

		// for questions, identify any variables that need substitution and
		//  store references to the correct variables along with the type and id
		if (node.type === QUESTION_NODE_TYPE) {
			// since questions do not have their full ancestor history available during
			//  assessment attempts/reviews, we need to determine their variables' owners
			//  ahead of time to make sure they're substituted correctly
			// start by finding all variables used in each question
			const questionVars = getVariablesUsedInNode(node)

			if (questionVars) {
				// now find the nearest ancestor that owns each variable
				// assuming the variables are in the shorthand format
				// variables already in the long format or owned by the question itself
				//  will not require references in the future, they should just work
				const ownerReferences = questionVars
					.map(varName => {
						return getVariableOwner(draftTree, node, varName.slice(1))
					})
					.filter(e => e) // to filter out any null or undefined

				if (ownerReferences.length) chosen.varRef = ownerReferences
			}
		}

		return chosen
	})

	return {
		chosen: chosenAssessment,
		variables: assessmentProperties.variables ?? null
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
		const yellReturn = nodeInstance.yell(ACTION_ASSESSMENT_SEND_TO_ASSESSMENT, req, res)
		promises = promises.concat(yellReturn)
	}
	return promises
}

const insertAttemptStartEvent = (
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
		eventVersion: '1.1.0'
	})
}

module.exports = {
	startAttempt,
	createAssessmentUsedQuestionMap,
	initAssessmentUsedQuestions,
	getSendToClientPromises,
	insertAttemptStartEvent,
	loadChildren,
	getState
}
