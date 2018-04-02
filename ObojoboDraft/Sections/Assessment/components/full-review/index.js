import Viewer from 'Viewer'
import Common from 'Common'

import ReviewIcon from '../review-icon'
import ScoreReportView from '../score-report'
import ScoreReport from '../../post-assessment/assessment-score-report'

import formatDate from 'date-fns/format'

const { AssessmentUtil } = Viewer.util
const { NavUtil } = Viewer.util
const { OboModel } = Common.models
const { Button, ButtonBar, MoreInfoButton } = Common.components

const assessmentReviewView = ({ assessment }) => {
	let attemptReviewComponents = {}

	let attempts = AssessmentUtil.getAllAttempts(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	const report = new ScoreReport(assessment.props.model.modelState.rubric.toObject())

	let attemptReviewComponent = (attempt, assessment) => {
		let dateString = formatDate(new Date(attempt.finishTime), 'M/D/YY [at] h:mma')
		let numCorrect = AssessmentUtil.getNumCorrect(attempt.questionScores)

		return (
			<div className="review">
				<div className="attempt-header">
					<div className="attempt-info-container">
						<ReviewIcon />
						<div className="attempt-info-content-container">
							<h4>
								<strong>{`Attempt ${attempt.attemptNumber}`}</strong>
							</h4>
							<div className="attempt-info-content">
								<ul>
									<li>{dateString}</li>
									<li>
										{numCorrect} out of {attempt.questionScores.length} questions correct
									</li>
									<li>
										Score:{' '}
										<strong>
											{attempt.assessmentScore === null ? '--' : attempt.assessmentScore + '%'}
										</strong>
										<MoreInfoButton>
											<ScoreReportView
												items={report.getTextItems(
													false,
													attempt.assessmentScoreDetails,
													AssessmentUtil.getAttemptsRemaining(
														assessment.props.moduleData.assessmentState,
														assessment.props.model
													)
												)}
											/>
										</MoreInfoButton>
									</li>
								</ul>
							</div>
						</div>
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

	let getSelectedIndex = () => {
		let context = assessment.props.moduleData.navState.context

		for (let i in attempts) {
			let attempt = attempts[i]

			if (context === `assessmentReview:${attempt.attemptId}`) {
				return parseInt(i, 10)
			}
		}

		return attempts.length - 1
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
			<div
				className={`attempt-button-container ${
					attemptButtons.length <= 1 ? 'is-showing-one-item' : null
				}`}
			>
				<ButtonBar altAction selectedIndex={getSelectedIndex()}>
					{attemptButtons}
				</ButtonBar>
			</div>
			{attemptReviewComponents[context]}
		</div>
	)
}

export default assessmentReviewView
