const Assessment = require('./assessment')
const attemptStart = require('./attempt-start')
const VisitModel = oboRequire('models/visit')
const DraftModel = oboRequire('models/draft')
const { getFullQuestionsFromDraftTree } = require('./util')

const getQuestionModelsFromAttempt = async (attemptId, req, res) => {
	const attempt = await Assessment.getAttempt(attemptId)

	// const visit = await VisitModel.fetchById(req.body.visitId)
	// const isPreview = visit.is_preview

	const draftDocument = await DraftModel.fetchDraftByVersion(
		attempt.draft_id,
		attempt.draft_content_id
	)

	const assessmentNode = draftDocument.getChildNodeById(attempt.assessment_id)

	if (assessmentNode.node.content.review !== 'always') {
		await Promise.all(attemptStart.getSendToClientPromises(assessmentNode, attempt.state, req, res))
	}

	const attemptQuestionModels = getFullQuestionsFromDraftTree(draftDocument, attempt.state.chosen)

	const attemptQuestionModelsMap = {}

	for (const questionModel of attemptQuestionModels) {
		attemptQuestionModelsMap[questionModel.id] = questionModel
	}

	return attemptQuestionModelsMap
}

const reviewAttempt = async (req, res) => {
	const attemptIds = req.body.attemptIds

	try {
		await req.requireCurrentUser()

		const questionModels = {}

		for (const attemptId of attemptIds) {
			questionModels[attemptId] = await getQuestionModelsFromAttempt(attemptId, req, res)
		}

		res.send(questionModels)
	} catch (ex) {
		console.log(ex)
	}
}

module.exports = {
	reviewAttempt
}
