import Viewer from 'Viewer'
import Common from 'Common'
// import ReviewIcon from 'svg-url-loader?noquotes!./review-icon.svg'
import ReviewIcon from './review-icon.js'

const { AssessmentUtil } = Viewer.util
const { NavUtil } = Viewer.util
const { OboModel } = Common.models
const { Button } = Common.components

const assessmentReviewView = assessment => {
	let attemptReviewComponents = {}

	let attempts = AssessmentUtil.getAllAttempts(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	let attemptReviewComponent = (attempt, assessment) => {
		return (
			<div className="review">
				<div className="attempt-header">
					<ReviewIcon
						height="50px"
						width="50px"
						css={{
							position: 'absolute',
							transform: 'translate(-5px,10px)'
						}}
					/>
					<div className="attempt-info-container">
						<h4>
							<strong>{`Attempt ${attempt.attemptNumber}`}</strong>
						</h4>
						<div className="attempt-info-content">
							<ul>
								<li>Completed 4/15/18 at 5:15pm</li>
								<li>1 out of 4 questions correct</li>
							</ul>
						</div>
					</div>
					<div className="score-section">
						<ul className="credit-breakdown">
							<li>Attempt Score: 20%</li>
							<li>+ Extra Credit: 5%</li>
							<li>+ Extra Credit: 5%</li>
						</ul>
						<h1>
							{`${attempt.attemptScore}`}
							<div id="attempt-percent">%</div>
						</h1>
					</div>
				</div>
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
			<Button onClick={() => NavUtil.setContext(`assessmentReview:${attempt.attemptId}`)}>
				{attempt.attemptNumber}
			</Button>
		)
	})

	return (
		<div className="attempt-review-container">
			<div className="attempt-button-container">
				{attemptButtons}
			</div>
			{attemptReviewComponents[context]}
		</div>
	)
}

export default assessmentReviewView
