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
			case 'ok_gradebook_matches_assessment_score':
			case 'ok_null_score_not_sent':
				return null

			default:
				return this.renderError()
		}
	}

	renderError() {
		let ltiState = this.props.ltiState
		let location = this.props.launch.getOutcomeServiceHostname()

		return (
			<div className="obojobo-draft--sections--assessment--lti-status">
				<h2>{`There was a problem sending your score to ${location}.`}</h2>
				<p>
					{`Don’t worry - your score is safely recorded here. We just weren’t able to send it to ${location}. Click the button below to resend your score:`}
				</p>
				{this.props.ltiState.errorCount === 0 || ltiState.networkState !== LTINetworkStates.IDLE
					? null
					: <p>
							<strong>Sorry - That didn't work.</strong>
							{` Most likely the connection to ${location} has expired and just needs to be refreshed. Please close this tab or window, reopen this module from ${location}, return to this page and then resend your score.`}
						</p>}
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
