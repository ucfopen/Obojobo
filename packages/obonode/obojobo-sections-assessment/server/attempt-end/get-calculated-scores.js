const AssessmentRubric = require('../../assessment-rubric')
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const getCalculatedScores = (
	req,
	res,
	assessmentModel,
	attemptState,
	attemptHistory,
	responseHistory
) => {
	const scoreInfo = {
		scores: [0],
		chosenAssessment: attemptState.chosen,
		scoresByQuestionId: {}
	}

	const promises = assessmentModel.yell(
		'ObojoboDraft.Sections.Assessment:attemptEnd',
		req,
		res,
		assessmentModel,
		responseHistory,
		{
			// this is only called by questions. question banks do not listen for ObojoboDraft.Sections.Assessment:attemptEnd
			addScore: (questionId, score) => {
				scoreInfo.scores.push(score)
				scoreInfo.scoresByQuestionId[questionId] = score
			}
		}
	)

	return Promise.all(promises).then(() =>
		calculateScores(assessmentModel, attemptHistory, scoreInfo)
	)
}

const calculateScores = (assessmentModel, attemptHistory, scoreInfo) => {
	const questionScores = []
	let numQuestions = 0

	for (const node of scoreInfo.chosenAssessment) {
		if (node.type === QUESTION_NODE_TYPE) {
			numQuestions++
			questionScores.push({ id: node.id, score: scoreInfo.scoresByQuestionId[node.id] })
		}
	}

	const attemptScore = scoreInfo.scores.reduce((a, b) => a + b) / numQuestions

	const allScores = attemptHistory
		.map(attempt => parseFloat(attempt.result.attemptScore))
		.concat(attemptScore)

	const numAttempts =
		typeof assessmentModel.node.content.attempts === 'undefined' ||
		assessmentModel.node.content.attempts === 'unlimited'
			? Infinity
			: parseInt(assessmentModel.node.content.attempts, 10)

	const rubric = new AssessmentRubric(assessmentModel.node.content.rubric)
	const assessmentScoreDetails = rubric.getAssessmentScoreInfoForAttempt(numAttempts, allScores)

	return {
		attempt: {
			attemptScore,
			questionScores
		},
		assessmentScoreDetails
	}
}

module.exports = getCalculatedScores
