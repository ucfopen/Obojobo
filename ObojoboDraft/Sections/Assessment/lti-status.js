import './lti-status.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { Button } = Common.components
let LTINetworkStates = Viewer.stores.assessmentStore.LTINetworkStates

export default class LTIStatus extends React.Component {
	onClickResendScore() {
		AssessmentUtil.resendLTIScore(this.props.model)
	}

	render() {
		let ltiState = this.props.ltiState

		if (!ltiState.state) return null

		switch (ltiState.state.gradebookStatus) {
			case 'ok_no_outcome_service':
			case 'ok_null_score_not_sent':
				return null

			case 'ok_gradebook_matches_assessment_score':
				return this.renderSynced()

			default:
				return this.renderError()
		}
	}

	renderSynced() {
		let systemLabel = this.props.externalSystemLabel

		return (
			<div className="obojobo-draft--sections--assessment--lti-status is-synced">
				{`✔ Your retained score of ${Math.round(
					this.props.assessmentScore
				)}% was sent to ${systemLabel}`}
			</div>
		)
	}

	renderError() {
		let ltiState = this.props.ltiState
		let systemLabel = this.props.externalSystemLabel

		return (
			<div className="obojobo-draft--sections--assessment--lti-status">
				<h2>{`There was a problem sending your score to ${systemLabel}.`}</h2>
				<p>
					{`Don’t worry - your score is safely recorded here. We just weren’t able to send it to ${systemLabel}. Click the button below to resend your score:`}
				</p>
				{this.props.ltiState.errorCount === 0 ||
				ltiState.networkState !== LTINetworkStates.IDLE ? null : (
					<p>
						<strong>Sorry - That didn't work.</strong>
						{` Most likely the connection to ${systemLabel} has expired and just needs to be refreshed. Please close this tab or window, reopen this module from ${systemLabel}, return to this page and then resend your score.`}
					</p>
				)}
				{(() => {
					switch (ltiState.networkState) {
						case LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE:
							return <Button disabled>Resending Score...</Button>
							break

						case LTINetworkStates.IDLE:
						default:
							return (
								<Button dangerous onClick={this.props.onClickResendScore}>
									{this.props.ltiState.errorCount === 0 ? 'Resend score' : 'Try again anyway'}
								</Button>
							)
							break
					}
				})()}
			</div>
		)
	}
}
