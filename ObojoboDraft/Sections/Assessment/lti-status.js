import './lti-status.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { Button } = Common.components
let LTINetworkStates = Viewer.stores.assessmentStore.LTINetworkStates

export default class LTIStatus extends React.Component {
	constructor() {
		super()

		this.statusRender = {
			success: this.renderSuccess.bind(this),
			not_attempted_no_outcome_service_for_launch: this.renderNoOutcomeService.bind(this),
			not_attempted_score_is_null: this.renderScoreIsNull.bind(this),
			error_launch_expired: this.renderError.bind(this),
			error_replace_result_failed: this.renderError.bind(this),
			error_no_launch_found: this.renderError.bind(this),
			error_no_assessment_score_found: this.renderError.bind(this),
			error_no_secret_for_key: this.renderError.bind(this),
			error_score_is_invalid: this.renderError.bind(this),
			error_unexpected: this.renderError.bind(this),
			null: this.renderError.bind(this)
		}
	}

	onClickResendScore() {
		console.log('RESEND SCORE!!!!!!!!!!!!!!', APIUtil)

		AssessmentUtil.resendLTIScore(this.props.model)
	}

	render() {
		let childEl
		let ltiState = this.props.ltiState
		let ltiNetworkState = this.props.ltiNetworkState

		console.log('LTI NET STATE', ltiNetworkState)

		switch (ltiNetworkState) {
			case LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE:
			case LTINetworkStates.AWAITING_READ_RESULT_RESPONSE:
				childEl = this.renderLoading()
				break

			case LTINetworkStates.IDLE:
			default:
				if (!ltiState || ltiState.gradebookStatus === 'ok_no_outcome_service') {
					childEl = null
				} else if (ltiState.gradebookStatus === 'ok_gradebook_matches_assessment_score') {
					childEl = this.renderSynced()
				} else if (ltiState.gradebookStatus === 'ok_null_score_not_sent') {
					childEl = this.renderNotPassed()
				} else {
					childEl = this.renderStatus(ltiState)
				}

				break
		}

		if (childEl === null) return null

		return (
			<div className={`obojobo-draft--sections--assessment--lti-status`}>
				{childEl}
			</div>
		)
	}

	renderLoading() {
		return <div className="is-loading">LOADING...</div>
	}

	renderSynced() {
		return <div className="is-synced">Your score is synced</div>
	}

	renderNotPassed() {
		return <div className="is-not-passed">Not passed</div>
	}

	renderStatus(ltiState) {
		return (
			<div className={'is-status-' + (ltiState.status || 'null').replace(/_/g, '-')}>
				{this.statusRender[ltiState.status]()}
			</div>
		)
	}

	renderSuccess() {
		return <p>good</p>
	}

	renderNoOutcomeService() {
		return <p>module item?</p>
	}

	renderScoreIsNull() {
		return <p>have not passed</p>
	}

	renderError() {
		return (
			<div>
				<h2>There was a problem sending your score to the gradebook.</h2>
				<p>
					Close this assignment, reopen it and then click the button below to resend your score.
				</p>
				<Button onClick={this.props.onClickResendScore}>Resend Score</Button>
				<p>If the problem persists try again later - The gradebook may be down temporarily.</p>
				<p>
					If this still doesn't solve the issue contact technical support (error code "{btoa(this.props.ltiState.status)}")
				</p>
			</div>
		)
	}
}
