import Viewer from 'Viewer'
import Common from 'Common'

const { AssessmentUtil } = Viewer.util
const { OboModel } = Common.models

const assessmentReviewView = assessment => {
	// const recentScore = AssessmentUtil.getLastAttemptScoreForModel(
	// 	assessment.props.moduleData.assessmentState,
	// 	assessment.props.model
	// )
	// const highestScore = AssessmentUtil.getHighestAttemptScoreForModel(
	// 	assessment.props.moduleData.assessmentState,
	// 	assessment.props.model
	// )
	const attempts = AssessmentUtil.getAllAttempts(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	return (
		<div className="score unlock">
			{attempts.map((attempt, index) => {
				let scoreTotal = attempts[index].scores.questionScores.reduce(
					(prev, curr) => prev + curr.score,
					0
				)
				let reviewScore = scoreTotal / attempts[index].scores.questionScores.length
				return attemptReviewComponent(attempt, reviewScore, assessment, index + 1)
			})}
		</div>
	)
}

const attemptReviewComponent = (attempt, reviewScore, assessment, attemptNumber) => {
	return (
		<div className="review">
			<h1>{`Attempt ${attemptNumber}`}</h1>
			<h2>{`Score: ${reviewScore}`}</h2>
			{attempt.scores.questionScores.map(scoreObj => {
				const questionModel = OboModel.models[scoreObj.id]
				const QuestionComponent = questionModel.getComponentClass()
				return (
					<QuestionComponent
						model={questionModel}
						moduleData={assessment.props.moduleData}
						isReview
						scoreContext={`assessmentReview:${attempt.attemptId}`}
					/>
				)
			})}
		</div>
	)
}

export default assessmentReviewView
