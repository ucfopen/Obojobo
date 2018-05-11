import './index.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { Button } = Common.components
let LTINetworkStates = Viewer.stores.assessmentStore.LTINetworkStates
// Number forces an error to show for testing purposes
// let number = 0
// Until I learn/figure out the proper way, this is keeping track of the error state.
let tempErrorHappened = false

const notLTI = () => (
	<div className="obojobo-draft--sections--assessment--lti-status is-not-lti">&nbsp;</div>
)

const noScoreSent = externalSystemLabel => (
	<div className="obojobo-draft--sections--assessment--lti-status is-synced">
		{`No score has been sent to ${externalSystemLabel} (Only passing scores are sent)`}
	</div>
)

// Added a switch statement to check if the error state is true.
// onClickClose sets the error state to false, RemoveRecover forces an update of the component.
// Ideally would like to combine their functionality.
const synced = (assessmentScore, externalSystemLabel, onClickRemoveRecoverMessage) => (
	<div className="obojobo-draft--sections--assessment--lti-status is-synced">
		{(() => {
			switch (tempErrorHappened) {
				case true:
					return (
						<div className="recovery-message">
							<h2>{`Success!`}</h2>
							{`Your score was sucessfully sent to to ${externalSystemLabel}.`}
							<Button
								isDangerous
								onClick={() => {
									onClickClose()
									onClickRemoveRecoverMessage()
								}}
							>
								{`Close this message.`}
							</Button>
						</div>
					)
				default:
					return (
						<p
						>{`✔ Your recorded score of ${assessmentScore}% was sent to ${externalSystemLabel}.`}</p>
					)
			}
		})()}
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

// Need to combine with other button functionality.
const onClickClose = () => {
	//console.log("This is working?")
	tempErrorHappened = false
	//console.log("If so, this should be false: " + tempErrorHappened)
}

export default props => {
	if (props.isPreviewing || !props.externalSystemLabel) return notLTI()

	if (props.externalSystemLabel && (!props.ltiState || !props.ltiState.state)) {
		tempErrorHappened = true
		return renderError(props.ltiState, props.externalSystemLabel, props.onClickResendScore)
	}

	switch (props.ltiState.state.gradebookStatus) {
		case 'ok_no_outcome_service':
			return notLTI()

		case 'ok_null_score_not_sent':
			return noScoreSent(props.externalSystemLabel)

		// Function now needs the onClickRemoveRecoverMessage from props.
		case 'ok_gradebook_matches_assessment_score':
			return synced(
				Math.round(props.assessmentScore),
				props.externalSystemLabel,
				props.onClickRemoveRecoverMessage
			)

		default:
			tempErrorHappened = true
			return renderError(props.ltiState, props.externalSystemLabel, props.onClickResendScore)
	}
}

// Test code, forced an error to show before the synced message could show. Also has some print statements.
/*
export default props => {
	if (props.isPreviewing || !props.externalSystemLabel) return notLTI()

	if (props.externalSystemLabel && (!props.ltiState || !props.ltiState.state)) {
		tempErrorHappened = true
		return renderError(props.ltiState, props.externalSystemLabel, props.onClickResendScore)
	}

	switch (props.ltiState.state.gradebookStatus) {
		case 'ok_no_outcome_service':
			return notLTI()

		case 'ok_null_score_not_sent':
			return noScoreSent(props.externalSystemLabel)

		case 'ok_gradebook_matches_assessment_score':
			return synced(Math.round(props.assessmentScore), props.externalSystemLabel, props.onClickRemoveRecoverMessage)

		default:
			if (number < 5) {
				number++
				console.log("Default!")
				console.log("Number now is" + number)
				console.log("Defualt stuff is " + JSON.stringify(props.ltiState))
				console.log(props.ltiState.statusDetails)
				props.ltiState.statusDetails = "Can I insert things here?"
				console.log(props.ltiState.statusDetails)
				tempErrorHappened = true
				console.log("Case 1")
				return renderError(props.ltiState, props.externalSystemLabel, props.onClickResendScore)
			}
			if (tempErrorHappened) {
				console.log("Case 2")
				return synced(Math.round(props.assessmentScore), props.externalSystemLabel, props.onClickRemoveRecoverMessage)
			}
			console.log("Case 3")
			return synced(Math.round(props.assessmentScore), props.externalSystemLabel, props.onClickRemoveRecoverMessage)
	}
}

*/
