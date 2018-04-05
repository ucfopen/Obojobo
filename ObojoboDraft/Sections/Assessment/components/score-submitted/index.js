import Common from 'Common'
import Viewer from 'Viewer'

const { OboModel } = Common.models
const { AssessmentUtil } = Viewer.util
const Launch = Common.Launch
const NavUtil = Viewer.util.NavUtil

import LTIStatus from './lti-status'
import FullReview from '../full-review'
import ScoreReportView from '../score-report'
import ScoreReport from '../../post-assessment/assessment-score-report'
import basicReview from '../basic-review'

const scoreSubmittedView = assessment => {
	const report = new ScoreReport(assessment.props.model.modelState.rubric.toObject())

	let highestAttempt = AssessmentUtil.getHighestAttemptForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	const questionScores = AssessmentUtil.getLastAttemptScoresForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	const isAssessmentComplete = () => {
		return !AssessmentUtil.hasAttemptsRemaining(
			assessment.props.moduleData.assessmentState,
			assessment.props.model
		)
	}

	const scoreAction = assessment.getScoreAction()
	const numCorrect = AssessmentUtil.getNumCorrect(questionScores)

	let assessmentScore = AssessmentUtil.getAssessmentScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	let onClickResendScore = () => {
		AssessmentUtil.resendLTIScore(assessment.props.model)
	}

	let ltiState = AssessmentUtil.getLTIStateForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	let assessmentLabel = NavUtil.getNavLabelForModel(
		assessment.props.moduleData.navState,
		assessment.props.model
	)

	let scoreActionsPage

	if (scoreAction.page != null) {
		let pageModel = OboModel.create(scoreAction.page)
		pageModel.parent = assessment.props.model //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
		let PageComponent = pageModel.getComponentClass()
		scoreActionsPage = <PageComponent model={pageModel} moduleData={assessment.props.moduleData} />
	} else {
		scoreActionsPage = <p>{scoreAction.message}</p>
	}

	let externalSystemLabel = assessment.props.moduleData.lti.outcomeServiceHostname

	let showFullReview = (reviewType => {
		switch (reviewType) {
			case 'always':
				return true
			case 'never':
				return false
			case 'afterAttempts':
				return isAssessmentComplete()
		}
	})(assessment.props.model.modelState.review)

	return (
		<div className="score unlock">
			<div className="overview">
				<h1>{assessmentLabel} Overview</h1>
				{highestAttempt.assessmentScore === null ? (
					<div className="recorded-score is-null">
						<h2>Recorded Score:</h2>
						<span className="value">No Score Recorded</span>
					</div>
				) : (
					<div className="recorded-score is-not-null">
						<h2>Recorded Score:</h2>
						<span className="value">{highestAttempt.assessmentScore}</span>
						<span className="from-attempt">{`From attempt ${
							highestAttempt.assessmentScoreDetails.attemptNumber
						}`}</span>
					</div>
				)}

				<LTIStatus
					ltiState={ltiState}
					externalSystemLabel={externalSystemLabel}
					onClickResendScore={onClickResendScore}
					assessmentScore={highestAttempt.assessmentScore}
				/>
				{() => {
					switch (ltiState.state.gradebookStatus) {
						case 'ok_no_outcome_service':
						case 'ok_null_score_not_sent':
							return null

						case 'ok_gradebook_matches_assessment_score':
							return (
								<span className="lti-sync-message is-synced">
									({`sent to ${externalSystemLabel} `}
									<span>✔</span>)
								</span>
							)

						default:
							return (
								<span className="lti-sync-message is-not-synced">
									({`not sent to ${externalSystemLabel} `}
									<span>✖</span>)
								</span>
							)
					}
				}}
				<div className="score-actions-page">{scoreActionsPage}</div>
			</div>
			<div className="attempt-history">
				<h1>Attempt History:</h1>
				{showFullReview ? (
					<FullReview assessment={assessment} />
				) : (
					<div className="review">
						<p className="number-correct">{`You got ${numCorrect} out of ${
							questionScores.length
						} questions correct:`}</p>
						{questionScores.map((questionScore, index) =>
							basicReview(assessment.props.moduleData, questionScore, index)
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default scoreSubmittedView
