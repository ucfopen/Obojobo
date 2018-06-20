import './index.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { Button } = Common.components
let LTINetworkStates = Viewer.stores.assessmentStore.LTINetworkStates

const notLTI = () => (
	<div className="obojobo-draft--sections--assessment--lti-status is-not-lti">&nbsp;</div>
)

const noScoreSent = externalSystemLabel => (
	<div className="obojobo-draft--sections--assessment--lti-status is-synced">
		{`No score has been sent to ${externalSystemLabel} (Only passing scores are sent)`}
	</div>
)

const synced = (assessmentScore, externalSystemLabel) => (
	<div className="obojobo-draft--sections--assessment--lti-status is-synced">
		{`✔ Your recorded score of ${assessmentScore}% was sent to ${externalSystemLabel}`}
	</div>
)

const renderError = (ltiState = {}, systemLabel, onClickResendScore) => (
	<div className="obojobo-draft--sections--assessment--lti-status is-not-synced">
		<h2>{`There was a problem sending your score to ${systemLabel}.`}</h2>
		<p>
			{`Don’t worry - your score is safely recorded here. We just weren’t able to send it to ${systemLabel}. Click the button below to resend your score:`}
		</p>
		{ltiState.errorCount === 0 || ltiState.networkState !== LTINetworkStates.IDLE ? null : (
			<p>
				<strong>Sorry - That didn't work.</strong>
				{` Most likely the connection to ${systemLabel} has expired and just needs to be refreshed. Please close this tab or window, reopen this module from ${systemLabel}, return to this page and then resend your score.`}
			</p>
		)}
		{(() => {
			switch (ltiState.networkState) {
				case LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE:
					return <Button disabled>Resending Score...</Button>

				case LTINetworkStates.IDLE:
				default:
					return (
						<Button isDangerous onClick={onClickResendScore}>
							{ltiState.errorCount === 0 ? 'Resend score' : 'Try again anyway'}
						</Button>
					)
			}
		})()}
	</div>
)

export default props => {
	if (props.isPreviewing || !props.externalSystemLabel) return notLTI()

	if (props.externalSystemLabel && (!props.ltiState || !props.ltiState.state)) {
		return renderError(props.ltiState, props.externalSystemLabel, props.onClickResendScore)
	}

	switch (props.ltiState.state.gradebookStatus) {
		case 'ok_no_outcome_service':
			return notLTI()

		case 'ok_null_score_not_sent':
			return noScoreSent(props.externalSystemLabel)

		case 'ok_gradebook_matches_assessment_score':
			return synced(Math.round(props.assessmentScore), props.externalSystemLabel)

		default:
			return renderError(props.ltiState, props.externalSystemLabel, props.onClickResendScore)
	}
}
