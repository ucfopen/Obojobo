import React from 'react'

import Common from 'Common'
import Viewer from 'Viewer'

const { OboModel } = Common.models
const { AssessmentUtil } = Viewer.util
const NavUtil = Viewer.util.NavUtil

import LTIStatus from './lti-status'
import FullReview from '../full-review'

const AssessmentPostTest = props => {
	const isFullReviewAvailable = reviewType => {
		switch (reviewType) {
			case 'always':
				return true
			case 'never':
				return false
			case 'no-attempts-remaining':
				return isAssessmentComplete()
		}
	}

	const isAssessmentComplete = () => {
		return !AssessmentUtil.hasAttemptsRemaining(props.moduleData.assessmentState, props.model)
	}

	const assessmentScore = AssessmentUtil.getAssessmentScoreForModel(
		props.moduleData.assessmentState,
		props.model
	)

	let firstHighestAttempt = null
	if (assessmentScore !== null) {
		const highestAttempts = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(
			props.moduleData.assessmentState,
			props.model
		)

		firstHighestAttempt = highestAttempts[0]
	}

	const onClickResendScore = () => {
		AssessmentUtil.resendLTIScore(props.model)
	}

	const ltiState = AssessmentUtil.getLTIStateForModel(props.moduleData.assessmentState, props.model)

	const assessmentLabel = NavUtil.getNavLabelForModel(props.moduleData.navState, props.model)

	let scoreActionsPage

	if (props.scoreAction.page) {
		const pageModel = OboModel.create(props.scoreAction.page)
		pageModel.parent = props.model
		const PageComponent = pageModel.getComponentClass()
		scoreActionsPage = <PageComponent model={pageModel} moduleData={props.moduleData} />
	} else {
		scoreActionsPage = <p>{props.scoreAction.message}</p>
	}

	const externalSystemLabel = props.moduleData.lti.outcomeServiceHostname

	const showFullReview = isFullReviewAvailable(props.model.modelState.review)

	return (
		<div className="score unlock">
			<div className="overview">
				<h1>{assessmentLabel} Overview</h1>
				{assessmentScore === null ? (
					<div className="recorded-score is-null">
						<h2>Recorded Score:</h2>
						<span className="value">Did Not Pass</span>
					</div>
				) : (
					<div className="recorded-score is-not-null">
						<h2>Recorded Score:</h2>
						<span className="value">{Math.round(assessmentScore)}</span>
						<span className="from-attempt">{`From attempt ${
							firstHighestAttempt.assessmentScoreDetails.attemptNumber
						}`}</span>
					</div>
				)}

				<LTIStatus
					ltiState={ltiState}
					isPreviewing={props.moduleData.isPreviewing}
					externalSystemLabel={externalSystemLabel}
					onClickResendScore={onClickResendScore}
					assessmentScore={assessmentScore}
				/>
				<div className="score-actions-page">{scoreActionsPage}</div>
			</div>
			<div className="attempt-history">
				<h1>Attempt History:</h1>
				<FullReview {...props} showFullReview={showFullReview} />
			</div>
		</div>
	)
}

export default AssessmentPostTest
