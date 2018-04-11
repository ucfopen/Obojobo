import Viewer from 'Viewer'
import Common from 'Common'

import ReviewIcon from '../review-icon'
import formatDate from 'date-fns/format'

import basicReview from './basic-review'

const { AssessmentScoreReporter, AssessmentScoreReportView } = Viewer.assessment
const { AssessmentUtil } = Viewer.util
const { NavUtil } = Viewer.util
const { OboModel } = Common.models
const { Button, ButtonBar, MoreInfoButton } = Common.components

const assessmentReviewView = ({ assessment, showFullReview }) => {
	let attemptReviewComponents = {}

	let attempts = AssessmentUtil.getAllAttempts(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	let highestAttempts = AssessmentUtil.getHighestAttemptsForModelByAttemptScore(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const scoreReporter = new AssessmentScoreReporter({
		assessmentRubric: assessment.props.model.modelState.rubric.toObject(),
		totalNumberOfAttemptsAllowed: assessment.props.model.modelState.attempts,
		allAttempts: attempts
	})

	let attemptReviewComponent = (attempt, assessment, isAHighestScoringNonNullAttempt) => {
		let dateString = formatDate(new Date(attempt.finishTime), 'M/D/YY [at] h:mma')
		let numCorrect = AssessmentUtil.getNumCorrect(attempt.questionScores)

		let report = scoreReporter.getReportFor(attempt.attemptNumber)

		let attemptScoreSummary = Math.round(attempt.attemptScore) + '%'
		if (attempt.attemptScore !== attempt.assessmentScore) {
			attemptScoreSummary +=
				' → ' +
				(attempt.assessmentScore === null
					? 'Did Not Pass'
					: Math.round(attempt.assessmentScore) + '%')
		}

		return (
			<div className="attempt-results">
				<div className="attempt-header">
					<div className="attempt-info-container">
						<ReviewIcon />
						<div className="attempt-info-content-container">
							<h4>
								<strong>{`Attempt ${attempt.attemptNumber}`}</strong>
								{isAHighestScoringNonNullAttempt ? (
									<span className="highest-attempt">★ Highest Attempt</span>
								) : null}
							</h4>
							<div className="attempt-info-content">
								<ul>
									<li>{dateString}</li>
									<li>
										{numCorrect} out of {attempt.questionScores.length} questions correct
									</li>
									<li>
										Attempt Score: <strong>{attemptScoreSummary}</strong>
										<MoreInfoButton>
											<AssessmentScoreReportView report={report} />
										</MoreInfoButton>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className={`review ${showFullReview ? 'is-full-review' : 'is-basic-review'}`}>
					{attempt.questionScores.map((scoreObj, index) => {
						const questionModel = OboModel.models[scoreObj.id]
						const QuestionComponent = questionModel.getComponentClass()

						return showFullReview ? (
							<QuestionComponent
								model={questionModel}
								moduleData={assessment.props.moduleData}
								mode={'review'}
							/>
						) : (
							basicReview(assessment.props.moduleData, scoreObj, index)
						)
					})}
				</div>
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
			assessment,
			highestAttempts.indexOf(attempt) > -1 && attempt.assessmentScore !== null
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
