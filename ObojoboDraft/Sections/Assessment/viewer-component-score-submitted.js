import Common from 'Common'
import Viewer from 'Viewer'

const { OboModel } = Common.models
const { AssessmentUtil } = Viewer.util

const scoreSubmittedView = assessment => {
	const questionScores = AssessmentUtil.getLastAttemptScoresForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const recentScore = AssessmentUtil.getLastAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	// @TODO make this in AssessmentUtil
	// const highestScore = AssessmentUtil.getHighestAttemptScoreForModel(
	// 	assessment.props.moduleData.assessmentState,
	// 	assessment.props.model
	// )
	const highestScore = 100

	const scoreAction = assessment.getScoreAction()
	const numCorrect = assessment.getNumCorrect(questionScores)

	let childEl

	if (scoreAction.page != null) {
		let pageModel = OboModel.create(scoreAction.page)
		pageModel.parent = assessment.props.model //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
		let PageComponent = pageModel.getComponentClass()
		childEl = <PageComponent model={pageModel} moduleData={assessment.props.moduleData} />
	} else {
		childEl = (
			<p>
				{scoreAction.message}
			</p>
		)
	}

	return (
		<div className="score unlock">
			<h1>{`Your score is ${Math.round(recentScore)}%`}</h1>
			{recentScore === highestScore
				? <h2>This is your highest score</h2>
				: <h2>{`Your highest score was ${Math.round(highestScore)}%`}</h2>}
			{childEl}
			<div className="review">
				<p className="number-correct">{`You got ${numCorrect} out of ${questionScores.length} questions correct:`}</p>
				{questionScores.map((questionScore, index) =>
					questionResultView(assessment.props, questionScore, index)
				)}
			</div>
		</div>
	)
}

const questionResultView = (props, questionScore, index) => {
	const questionModel = OboModel.models[questionScore.id]
	const QuestionComponent = questionModel.getComponentClass()

	return (
		<div key={index} className={questionScore.score === 100 ? 'is-correct' : 'is-not-correct'}>
			<p>{`Question ${index + 1} - ${questionScore.score === 100 ? 'Correct:' : 'Incorrect:'}`}</p>
			<QuestionComponent model={questionModel} moduleData={props.moduleData} showContentOnly />
		</div>
	)
}

export default scoreSubmittedView
