import React from 'react'

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

class AssessmentReviewView extends React.Component {
	componentDidMount() {
		const lastAttempt = AssessmentUtil.getLastAttemptForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		NavUtil.setContext(`assessmentReview:${lastAttempt.attemptId}`)
	}

	render() {
		const attemptReviewComponents = {}

		const attempts = this.props.attempts
		const highestAttempts = AssessmentUtil.getHighestAttemptsForModelByAttemptScore(
			this.props.moduleData.assessmentState,
			this.props.model
		)
		const scoreReporter = new AssessmentScoreReporter({
			assessmentRubric: this.props.model.modelState.rubric.toObject(),
			totalNumberOfAttemptsAllowed: this.props.model.modelState.attempts,
			allAttempts: attempts
		})

		const attemptReviewComponent = (attempt, assessment, isAHighestScoringNonNullAttempt) => {
			const date = new Date(attempt.finishTime)
			const dateString = formatDate(date, 'M/D/YY [at] h:mma')
			const machineDateString = formatDate(date)
			const ariaDateString = formatDate(date, 'MMMM Do YYYY [at] h:mma')
			const numCorrect = AssessmentUtil.getNumCorrect(attempt.questionScores)

			const report = scoreReporter.getReportFor(attempt.attemptNumber)

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
										<span className="highest-attempt">
											<span aria-hidden>★</span> Highest Attempt
										</span>
									) : null}
								</h4>
								<div className="attempt-info-content">
									<div>
										Submitted{' '}
										<time dateTime={machineDateString} aria-hidden="true">
											{dateString}
										</time>
										<span className="for-screen-reader-only">{ariaDateString}</span>
									</div>
									<div>
										{numCorrect} out of {attempt.questionScores.length} questions correct
									</div>
									<div>
										Attempt Score: <strong>{attemptScoreSummary}</strong>
										<MoreInfoButton ariaLabel="Click to explain attempt score in detail">
											<AssessmentScoreReportView report={report} />
										</MoreInfoButton>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						className={`review ${this.props.showFullReview ? 'is-full-review' : 'is-basic-review'}`}
					>
						{attempt.questionScores.map((scoreObj, index) => {
							const questionModel = OboModel.create(attempt.state.questionModels[scoreObj.id])

							const QuestionComponent = questionModel.getComponentClass()

							return this.props.showFullReview ? (
								<QuestionComponent
									model={questionModel}
									moduleData={this.props.moduleData}
									mode={'review'}
									key={scoreObj.id}
								/>
							) : (
								basicReview(this.props.moduleData, scoreObj, index)
							)
						})}
					</div>
				</div>
			)
		}

		const getSelectedIndex = () => {
			const context = this.props.moduleData.navState.context

			for (const i in attempts) {
				const attempt = attempts[i]

				if (context === `assessmentReview:${attempt.attemptId}`) {
					return parseInt(i, 10)
				}
			}

			return attempts.length - 1
		}

		const attemptButtons = attempts.map((attempt, index) => {
			return (
				<Button
					onClick={() => NavUtil.setContext(`assessmentReview:${attempt.attemptId}`)}
					key={index}
					ariaLabel={'Attempt ' + attempt.attemptNumber}
				>
					{attempt.attemptNumber}
				</Button>
			)
		})

		attempts.forEach(attempt => {
			attemptReviewComponents[`assessmentReview:${attempt.attemptId}`] = attemptReviewComponent(
				attempt,
				this.props.assessment,
				highestAttempts.indexOf(attempt) > -1 && attempt.assessmentScore !== null
			)
		})

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
				{attemptReviewComponents[this.props.moduleData.navState.context]}
			</div>
		)
	}
}

export default AssessmentReviewView
