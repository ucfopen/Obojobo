import Viewer from 'Viewer'
import Common from 'Common'

import ReviewIcon from './review-icon.js'
import ScoreOverview from './viewer-component-score-overview'

import formatDate from 'date-fns/format'

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
		let dateString = formatDate(new Date(attempt.finishTime), 'M/D/YY [at] h:ma')
		let numCorrect = AssessmentUtil.getNumCorrect(attempt.questionScores)

		return (
			<div className="review">
				<div className="attempt-header">
					<div className="attempt-info-container">
						<ReviewIcon
							height="50px"
							width="50px"
							css={{
								transform: 'translate(-10px,-10px)'
							}}
						/>
						<div className="attempt-info-content-container">
							<h4>
								<strong>{`Attempt ${attempt.attemptNumber}`}</strong>
							</h4>
							<div className="attempt-info-content">
								<ul>
									<li>
										{dateString}
									</li>
									<li>
										{numCorrect} out of {attempt.questionScores.length} questions correct
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="score-section">
						<ScoreOverview />
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

	let attemptButtons = attempts.map((attempt, index) => {
		return (
			<Button onClick={() => NavUtil.setContext(`assessmentReview:${attempt.attemptId}`)}>
				{attempt.attemptNumber}
			</Button>
		)
	})

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
