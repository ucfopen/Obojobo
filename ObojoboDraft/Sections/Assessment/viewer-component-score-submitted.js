import Common from 'Common'
import Viewer from 'Viewer'

const { OboModel } = Common.models
const { AssessmentUtil } = Viewer.util
const Launch = Common.Launch
const NavUtil = Viewer.util.NavUtil

import LTIStatus from './lti-status'

import fullReview from './viewer-component-review'

const scoreSubmittedView = assessment => {
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
				<h1>{assessmentLabel} - How You Did</h1>
				<table>
					<thead>
						<tr>
							<th>Last Attempt Score</th>
							<th>Retained Score</th>
							<th>Attempts Remaining</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{Math.round(recentScore)}%</td>
							<td>{assessmentScore === null ? '--' : Math.round(assessmentScore)}%</td>
							<td>{attemptsRemaining}</td>
						</tr>
					</tbody>
				</table>
				<LTIStatus
					ltiState={ltiState}
					externalSystemLabel={externalSystemLabel}
					onClickResendScore={onClickResendScore}
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
				fullReview(assessment)
			) : (
				<div className="review">
					<p className="number-correct">{`You got ${numCorrect} out of ${
						questionScores.length
					} questions correct:`}</p>
					{questionScores.map((questionScore, index) =>
						questionResultView(assessment.props, questionScore, index)
					)}
				</div>
			)}
		</div>
	)
}

const questionResultView = (props, questionScore, index) => {
	const questionModel = OboModel.models[questionScore.id]
	const QuestionComponent = questionModel.getComponentClass()

	return (
		<div key={index} className={questionScore.score === 100 ? 'is-correct' : 'is-not-correct'}>
			<p>{`Question ${index + 1} - ${questionScore.score === 100 ? 'Correct:' : 'Incorrect:'}`}</p>
			<QuestionComponent model={questionModel} moduleData={props.moduleData} showContentOnly />
		</div>
	)
}

export default scoreSubmittedView
