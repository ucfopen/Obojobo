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
				return attemptReviewComponent(attempt, assessment, index + 1)
			})}
		</div>
	)
}

const attemptReviewComponent = (attempt, assessment, attemptNumber) => {
	return (
		<div className="review">
			<h1>{`Attempt ${attemptNumber}`}</h1>
			<h2>{`Score: ${attempt.score}`}</h2>
			{attempt.questionScores.map(scoreObj => {
				const questionModel = OboModel.models[scoreObj.id]
				const QuestionComponent = questionModel.getComponentClass()
				return (
					<QuestionComponent
						model={questionModel}
						moduleData={assessment.props.moduleData}
						mode={'review'}
						context={`assessmentReview:${attempt.attemptId}`}
					/>
				)
			})}
		</div>
	)
}

export default assessmentReviewView
