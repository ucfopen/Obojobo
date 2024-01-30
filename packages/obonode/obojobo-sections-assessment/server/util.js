const logger = require('obojobo-express/server/logger')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const logAndRespondToUnexpected = (errorMessage, res, req, jsError) => {
	logger.error('logAndRespondToUnexpected', errorMessage, jsError)
	res.unexpected(errorMessage)
}

const getRandom = () => Math.random()

// An individual assessment's state only contains the id and type of each question chosen for the
// respective assessment. A question is either a question bank or a regular question. This
// function is used to take this metadata and return a list of full question data when
// a client requests to start an attempt, so the client can load the questions.
const getFullQuestionsFromDraftTree = (draftTree, questionMetadata) => {
	const questions = []

	for (const question of questionMetadata) {
		// the client does not need question bank nodes to render the assessment
		if (question.type === QUESTION_NODE_TYPE) {
			const questionNode = draftTree.getChildNodeById(question.id)

			// if we have any variable refs, we need to bake in long-form syntax replacements
			//  so the substitution works properly in the front end
			if (question.varRef && question.varRef.length) {
				question.varRef.forEach(v => {
					// this shouldn't happen, but just in case a null or undefined sneaks in there
					if (!v) return
					replaceVariableInNode(questionNode, v.var, `${v.ref}:${v.var}`)
				})
			}

			questions.push(questionNode.toObject())
		}
	}

	return questions
}

// this and the following method(s) should probably be in a separate utility for variables
// recurse through a node to find any text groups containing variable strings
const getVariablesUsedInNode = node => {
	const varRegex = /\{\{(.+?)\}\}/g
	const nodeVars = []

	if (node.content && node.content.textGroup) {
		node.content.textGroup.forEach(tg => {
			if (tg.text.value.indexOf('{{') === -1) return
			let match = null
			while ((match = varRegex.exec(tg.text.value)) !== null) {
				nodeVars.push(match[1])
			}
		})
	}

	if (node.children) {
		node.children.forEach(childNode => {
			const childVars = getVariablesUsedInNode(childNode)
			if (childVars) {
				nodeVars.push(...childVars)
			}
		})
	}

	return nodeVars.length > 0 ? nodeVars : null
}

const nodeVariablesInclude = (list, variable) => list.find(v => v.name === variable)

const getVariableOwner = (draftTree, targetNode, variable) => {
	// this node owns the target variable
	if (
		targetNode.content.variables &&
		nodeVariablesInclude(targetNode.content.variables, variable)
	) {
		return {
			var: variable,
			ref: targetNode.id
		}
	}

	// this node does not own the target variable - check its parent
	if (targetNode.parentId) {
		const parentNode = draftTree.getChildNodeById(targetNode.parentId).node
		return getVariableOwner(draftTree, parentNode, variable)
	}
}

// recurse through a node to find any text groups containing variable strings and replace them with a different string
const replaceVariableInNode = (draftNode, varString, newVarString) => {
	if (draftNode.node.content && draftNode.node.content.textGroup) {
		draftNode.node.content.textGroup.forEach(tg => {
			// example: replaces {{$varName}} with {{$nodeId:varName}}
			tg.text.value = tg.text.value.replace(`{{$${varString}}}`, `{{$${newVarString}}}`)
		})
	}

	if (draftNode.children) {
		draftNode.children.forEach(childNode => {
			replaceVariableInNode(childNode, varString, newVarString)
		})
	}
}

module.exports = {
	getFullQuestionsFromDraftTree,
	getRandom,
	logAndRespondToUnexpected,
	getVariablesUsedInNode,
	getVariableOwner,
	replaceVariableInNode
}
