import Viewer from 'Viewer'
import Common from 'Common'

const { AssessmentUtil } = Viewer.util
const { NavUtil } = Viewer.util
const { OboModel } = Common.models

const assessmentReviewView = assessment => {
	let attemptReviewComponents = {}

	let attempts = AssessmentUtil.getAllAttempts(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	let attemptReviewComponent = (attempt, assessment) => {
		return (
			<div className="review">
				<h1>{`Attempt ${attempt.attemptNumber}`}</h1>
				<h2>{`Score: ${attempt.attemptScore}`}</h2>
				{attempt.questionScores.map(scoreObj => {
					const questionModel = OboModel.models[scoreObj.id]
					const QuestionComponent = questionModel.getComponentClass()
					return (
						<QuestionComponent
							model={questionModel}
							moduleData={assessment.props.moduleData}
							mode={'review'}
						/>
					)
				})}
			</div>
		)
	}

	attempts.forEach(attempt => {
		attemptReviewComponents[`assessmentReview:${attempt.attemptId}`] = attemptReviewComponent(
			attempt,
			assessment
		)
	})

	let context = assessment.props.moduleData.navState.context
	if (context.split(':')[0] !== 'assessmentReview')
		// show most recent attempt
		NavUtil.setContext(`assessmentReview:${attempts[attempts.length - 1].attemptId}`)

	let attemptButtons = attempts.map((attempt, index) => {
		return (
			<button onClick={() => NavUtil.setContext(`assessmentReview:${attempt.attemptId}`)}>
				Attempt #{attempt.attemptNumber}
			</button>
		)
	})

	return (
		<div className="score unlock">
			{attemptButtons}
			{attemptReviewComponents[context]}
			{attemptButtons}
		</div>
	)
}

export default assessmentReviewView
