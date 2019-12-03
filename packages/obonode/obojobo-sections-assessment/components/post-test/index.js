import Common from 'Common'
import { FOCUS_ON_ASSESSMENT_CONTENT } from '../../assessment-event-constants'
import FullReview from '../full-review'
import LTIStatus from './lti-status'
import React from 'react'
import Viewer from 'Viewer'

const { OboModel } = Common.models
const { focus } = Common.page
const { AssessmentUtil, NavUtil, APIUtil } = Viewer.util
const { Dispatcher } = Common.flux

class AssessmentPostTest extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			attempts: null,
			isFetching: true
		}

		this.h1Ref = React.createRef()
		this.ltiStatusRef = React.createRef()
		this.boundFocusOnContent = this.focusOnContent.bind(this)
		this.onClickResendScore = this.onClickResendScore.bind(this)
		this.renderFullReview = this.renderFullReview.bind(this)
	}

	componentDidMount() {
		Dispatcher.on(FOCUS_ON_ASSESSMENT_CONTENT, this.boundFocusOnContent)
		this.fetchAttemptReviews() // WARNING - ASYNC
	}

	componentWillUnmount() {
		Dispatcher.off(FOCUS_ON_ASSESSMENT_CONTENT, this.boundFocusOnContent)
	}

	focusOnContent() {
		focus(this.h1Ref)
	}

	// WARNING - ASYNC
	fetchAttemptReviews() {
		const attemptIds = []

		const attempts = AssessmentUtil.getAllAttempts(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		attempts.forEach(attempt => {
			attemptIds.push(attempt.attemptId)
		})

		return APIUtil.reviewAttempt(attemptIds).then(result => {
			attempts.forEach(attempt => {
				attempt.state.questionModels = result[attempt.attemptId]
			})

			this.setState({
				attempts,
				isFetching: false
			})
		})
	}

	onClickResendScore() {
		AssessmentUtil.resendLTIScore(this.props.model)
	}

	renderFullReview() {
		const showFullReview = AssessmentUtil.isFullReviewAvailableForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		return (
			<FullReview {...this.props} showFullReview={showFullReview} attempts={this.state.attempts} />
		)
	}

	renderScoreActionsPage(props) {
		if (!props.scoreAction.page) {
			return <p>{props.scoreAction.message}</p>
		}

		const pageModel = OboModel.create(props.scoreAction.page)
		pageModel.parent = props.model
		const PageComponent = pageModel.getComponentClass()
		return <PageComponent model={pageModel} moduleData={props.moduleData} />
	}

	renderRecordedScore(assessmentScore, props) {
		// eslint-disable-next-line no-undefined
		if (assessmentScore === null || assessmentScore === undefined) {
			return (
				<div className="recorded-score is-null">
					<h2>Recorded Score:</h2>
					<span className="value">Did Not Pass</span>
				</div>
			)
		}

		const highestAttempts = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(
			props.moduleData.assessmentState,
			props.model
		)

		return (
			<div className="recorded-score is-not-null">
				<h2>Recorded Score:</h2>
				<span className="value">
					{Math.round(assessmentScore)}
					<span className="for-screen-reader-only percent-label"> percent out of 100</span>
				</span>
				<span className="from-attempt">{`From attempt ${highestAttempts[0].assessmentScoreDetails.attemptNumber}`}</span>
			</div>
		)
	}

	render() {
		const props = this.props

		const assessmentScore = AssessmentUtil.getAssessmentScoreForModel(
			props.moduleData.assessmentState,
			props.model
		)

		const ltiState = AssessmentUtil.getLTIStateForModel(
			props.moduleData.assessmentState,
			props.model
		)

		const assessmentLabel = NavUtil.getNavLabelForModel(props.moduleData.navState, props.model)

		return (
			<div className="score unlock">
				<div className="overview">
					<h1 ref={this.h1Ref} tabIndex="-1">
						{assessmentLabel} Overview
					</h1>
					{this.renderRecordedScore(assessmentScore, props)}
					<LTIStatus
						ref={this.ltiStatusRef}
						ltiState={ltiState}
						isPreviewing={props.moduleData.isPreviewing}
						externalSystemLabel={props.moduleData.lti.outcomeServiceHostname}
						onClickResendScore={this.onClickResendScore}
						assessmentScore={assessmentScore}
					/>
					<div className="score-actions-page pad">{this.renderScoreActionsPage(props)}</div>
				</div>
				<div className="attempt-history">
					<h1>Attempt History:</h1>
					{this.state.isFetching ? <span>Loading...</span> : this.renderFullReview()}
				</div>
			</div>
		)
	}
}

export default AssessmentPostTest
