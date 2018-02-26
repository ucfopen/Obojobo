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
		AssessmentUtil.resendLTIScore(this.props.model)
	}

	render() {
		let childEl
		let ltiState = this.props.ltiState

		switch (ltiState.networkState) {
			case LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE:
				//case LTINetworkStates.AWAITING_READ_RESULT_RESPONSE:
				childEl = this.renderLoading()
				break

			case LTINetworkStates.IDLE:
			default:
				if (!ltiState.state || ltiState.state.gradebookStatus === 'ok_no_outcome_service') {
					childEl = null
				} else if (ltiState.state.gradebookStatus === 'ok_gradebook_matches_assessment_score') {
					childEl = this.renderSynced()
				} else if (ltiState.state.gradebookStatus === 'ok_null_score_not_sent') {
					childEl = this.renderNotPassed()
				} else {
					childEl = this.renderStatus(ltiState.state.status)
				}

				break
		}

		if (childEl === null) return null

		return (
			<div className={`obojobo-draft--sections--assessment--lti-status`}>
				<p>
					{this.props.ltiState.errorCount}
				</p>
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

	renderStatus(status) {
		return (
			<div className={'is-status-' + (status || 'null').replace(/_/g, '-')}>
				{this.statusRender[status]()}
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
					Don’t worry - your score is safely recorded here but we weren’t able to send it to your
					gradebook. Click the button below to resend your score:
				</p>
				<Button onClick={this.props.onClickResendScore}>Resend Score</Button>
				{this.props.ltiState.errorCount === 0
					? null
					: <div>
							<p>
								<strong>Sorry!</strong> Please close this assignment, reopen it, return to this page
								and try again
							</p>
							<a>THING</a>
						</div>}
			</div>
		)
	}
}
