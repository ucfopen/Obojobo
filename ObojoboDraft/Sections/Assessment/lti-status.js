import './lti-status.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { Button } = Common.components
let LTINetworkStates = Viewer.stores.assessmentStore.LTINetworkStates

export default props => {
	if (!props.ltiState.state) return null

	switch (props.ltiState.state.gradebookStatus) {
		case 'ok_no_outcome_service':
		case 'ok_gradebook_matches_assessment_score':
		case 'ok_null_score_not_sent':
			return null
	}

	let systemLabel = props.externalSystemLabel
	return (
		<div className="obojobo-draft--sections--assessment--lti-status">
			<h2>{`There was a problem sending your score to ${systemLabel}.`}</h2>
			<p>
				{`Don’t worry - your score is safely recorded here. We just weren’t able to send it to ${systemLabel}. Click the button below to resend your score:`}
			</p>
			{props.ltiState.errorCount === 0 ||
			props.ltiState.networkState !== LTINetworkStates.IDLE ? null : (
				<p>
					<strong>Sorry - That didn't work.</strong>
					{` Most likely the connection to ${systemLabel} has expired and just needs to be refreshed. Please close this tab or window, reopen this module from ${systemLabel}, return to this page and then resend your score.`}
				</p>
			)}
			{(() => {
				switch (props.ltiState.networkState) {
					case LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE:
						return <Button disabled>Resending Score...</Button>
						break

					case LTINetworkStates.IDLE:
					default:
						return (
							<Button dangerous onClick={props.onClickResendScore}>
								{props.ltiState.errorCount === 0 ? 'Resend score' : 'Try again anyway'}
							</Button>
						)
						break
				}
			})()}
		</div>
	)
}
