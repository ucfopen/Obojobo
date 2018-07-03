import './index.scss'

import React from 'react'

import Common from 'Common'
import Viewer from 'Viewer'

const { Button } = Common.components
const { LTINetworkStates, LTIResyncStates } = Viewer.stores.assessmentStore

import getLTIProps from './get-lti-status-props'
import getUIState from './get-lti-status-ui-state'
import UIStates from './lti-status-ui-states'

const renderNotLTI = () => (
	<div className="obojobo-draft--sections--assessment--lti-status is-not-lti">&nbsp;</div>
)

const renderNoScoreSent = externalSystemLabel => (
	<div className="obojobo-draft--sections--assessment--lti-status is-synced">
		{`No score has been sent to ${externalSystemLabel} (Only passing scores are sent)`}
	</div>
)

const renderSynced = (assessmentScore, externalSystemLabel) => (
	<div className="obojobo-draft--sections--assessment--lti-status is-synced">
		{`✔ Your recorded score of ${assessmentScore}% was sent to ${externalSystemLabel}.`}
	</div>
)

const renderResyncedSuccessfully = (assessmentScore, externalSystemLabel) => (
	<div className="obojobo-draft--sections--assessment--lti-status is-resynced">
		<h2>Success!</h2>
		<p
		>{`✔ Your recorded score of ${assessmentScore}% was successfully sent to ${externalSystemLabel}.`}</p>
	</div>
)

const renderError = (ltiResyncState, ltiNetworkState, systemLabel, onClickResendScore) => (
	<div className="obojobo-draft--sections--assessment--lti-status is-not-synced">
		<h2>{`There was a problem sending your score to ${systemLabel}.`}</h2>
		<p>
			{`Don’t worry - your score is safely recorded here. We just weren’t able to send it to ${systemLabel}. Click the button below to resend your score:`}
		</p>
		<div
			className={
				ltiResyncState === LTIResyncStates.NO_RESYNC_ATTEMPTED ? 'is-not-shown' : 'is-shown'
			}
		>
			<strong>Sorry - That didn&apos;t work.</strong>
			{` Most likely the connection to ${systemLabel} has expired and just needs to be refreshed. Please close this tab or window, reopen this module from ${systemLabel}, return to this page and then resend your score.`}
		</div>
		{ltiNetworkState === LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE ? (
			<Button disabled>Re-sending score...</Button>
		) : (
			<Button isDangerous onClick={onClickResendScore}>
				{ltiResyncState === LTIResyncStates.NO_RESYNC_ATTEMPTED
					? 'Resend score'
					: 'Try again anyway'}
			</Button>
		)}
	</div>
)

const LTIStatus = props => {
	const ltiProps = getLTIProps(props)

	switch (getUIState(ltiProps)) {
		case UIStates.UI_NOT_LTI:
			return renderNotLTI()

		case UIStates.UI_NO_SCORE_SENT:
			return renderNoScoreSent(ltiProps.externalSystemLabel)

		case UIStates.UI_SYNCED:
			return renderSynced(ltiProps.roundedAssessmentScore, ltiProps.externalSystemLabel)

		case UIStates.UI_RESYNCED:
			return renderResyncedSuccessfully(
				ltiProps.roundedAssessmentScore,
				ltiProps.externalSystemLabel
			)

		case UIStates.UI_ERROR:
		default: {
			return renderError(
				ltiProps.resyncState,
				ltiProps.networkState,
				ltiProps.externalSystemLabel,
				props.onClickResendScore
			)
		}
	}
}

export default LTIStatus
