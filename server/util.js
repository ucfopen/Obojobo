const logger = oboRequire('logger')

let findOboNode = (oboNode, targetId) => {
	; ((oboNode, id) => {
		if (findOboNode.oboNode) return

		if (oboNode.id === id) {
			findOboNode.oboNode = oboNode
		}
		for (index in oboNode.children) {
			findOboNode(oboNode.children[index], id)
		}
	})(oboNode, targetId)

	return findOboNode.oboNode
}

let filterOutAssessment = draft => {
	let filter = oboNode => {
		if (oboNode.type === 'ObojoboDraft.Sections.Assessment') {
			oboNode.children[1].children = null
		}

		for (index in oboNode.children) {
			filterOutAssessment(oboNode.children[index])
		}

		return oboNode
	}

	return filter(draft)
}

let buildAttempt = assessmentState => {
	// let questions = []
	// let attempt = //...
	// let curNode = attempt
	// return getQuestions(attempt, assessmentState)
}

let getQuestions = (oboNode, assessmentState) => {
	questions = []

	o = app.registered[oboNode.type]
	if (o && o.extensions && o.extensions.getQuestionsForAttempt) {
		questions.push(o.extensions.getQuestionsForAttempt(assessmentState))
	}

	for (let i = 0, len = oboNode.children.length; i < len; i++) {
		questions.concat(getQuestions(oboNode.children[i]), assessmentState)
	}

	return questions
}

let zeroOutScores = oboNode => {
	if (oboNode.type === 'ObojoboDraft.Chunks.MCAssessment.MCChoice') {
		oboNode.content.score = 0
	}

	for (index in oboNode.children) {
		zeroOutScores(oboNode.children[index])
	}
}

const logAndRespondToUnexpected = (errorMessage, res, req, jsError) => {
	logger.error('logAndRespondToUnexpected', errorMessage, jsError)
	res.unexpected(errorMessage)
}

module.exports = {
	filterOutAssessment: filterOutAssessment,
	buildAttempt: buildAttempt,
	findOboNode: findOboNode,
	zeroOutScores: zeroOutScores,
	logAndRespondToUnexpected
}
