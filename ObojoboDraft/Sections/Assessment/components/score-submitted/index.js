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

	let latestHighestAttempt = AssessmentUtil.getLatestHighestAttemptForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	const questionScores = AssessmentUtil.getLastAttemptScoresForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const recentScore = AssessmentUtil.getLastAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const isAssessmentComplete = () => {
		return !AssessmentUtil.hasAttemptsRemaining(
			assessment.props.moduleData.assessmentState,
			assessment.props.model
		)
	}
	const attemptsRemaining = AssessmentUtil.getAttemptsRemaining(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

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

	let childEl

	if (scoreAction.page != null) {
		let pageModel = OboModel.create(scoreAction.page)
		pageModel.parent = assessment.props.model //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
		let PageComponent = pageModel.getComponentClass()
		childEl = <PageComponent model={pageModel} moduleData={assessment.props.moduleData} />
	} else {
		childEl = <p>{scoreAction.message}</p>
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
			<div className="results-bar">
				<div className="top">
					<h1>{assessmentLabel} - How You Did</h1>

					<div className="assessment-flex-container">
						<div className="last-attempt">
							<h2>Last Attempt Score</h2>
							<div className="value">{Math.round(recentScore)}</div>
						</div>
						<div className="highest-score">
							<h2>Highest Score</h2>
							<ScoreReportView
								score={latestHighestAttempt.assessmentScore}
								items={report.getTextItems(
									true,
									latestHighestAttempt.assessmentScoreDetails,
									AssessmentUtil.getAttemptsRemaining(
										assessment.props.moduleData.assessmentState,
										assessment.props.model
									)
								)}
							/>
						</div>
						<div className="attempts-remaining">
							<h2>Attempts Remaining</h2>
							<div className="value">{attemptsRemaining}</div>
						</div>
					</div>
				</div>

				<LTIStatus
					ltiState={ltiState}
					externalSystemLabel={externalSystemLabel}
					onClickResendScore={onClickResendScore}
					assessmentScore={latestHighestAttempt.assessmentScore}
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
			</div>
			{childEl}
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
	)
}

export default scoreSubmittedView
