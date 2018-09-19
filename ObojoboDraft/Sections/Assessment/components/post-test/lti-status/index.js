import './index.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import Common from 'Common'
import Viewer from 'Viewer'

const { Button } = Common.components
const { focus } = Common.page
const { LTINetworkStates, LTIResyncStates } = Viewer.stores.assessmentStore

const UIStates = {
	UI_NOT_LTI: 'notLTI',
	UI_ERROR: 'error',
	UI_ERROR_RESYNC_FAILED: 'errorResyncFailed',
	UI_NO_SCORE_SENT: 'noScoreSent',
	UI_SYNCED: 'synced',
	UI_RESYNCED: 'resynced'
}

const renderNotLTI = () => <div className="is-not-lti">&nbsp;</div>

const renderNoScoreSent = externalSystemLabel => (
	<div className="is-synced">
		{`No score has been sent to ${externalSystemLabel} (Only passing scores are sent)`}
	</div>
)

const renderSynced = (assessmentScore, externalSystemLabel) => (
	<div className="is-synced">
		{`✔ Your recorded score of ${assessmentScore}% was sent to ${externalSystemLabel}.`}
	</div>
)

const renderResyncedSuccessfully = (assessmentScore, externalSystemLabel) => (
	<div className="is-resynced">
		<h2>Success!</h2>
		<p
		>{`✔ Your recorded score of ${assessmentScore}% was successfully sent to ${externalSystemLabel}.`}</p>
	</div>
)

const renderError = (ltiResyncState, ltiNetworkState, systemLabel, onClickResendScore) => (
	<div className="is-not-synced">
		<h2>{`There was a problem sending your score to ${systemLabel}.`}</h2>
		<p>
			{`Don’t worry - your score is safely recorded here. We just weren’t able to send it to ${systemLabel}. Click the button below to resend your score:`}
		</p>
		<div
			ref="resyncFailed"
			tabIndex="-1"
			className={
				'is-not-synced-additional ' +
				(ltiResyncState === LTIResyncStates.NO_RESYNC_ATTEMPTED ? 'is-not-shown' : 'is-shown')
			}
			aria-hidden={ltiResyncState === LTIResyncStates.NO_RESYNC_ATTEMPTED}
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

const getLTIStatusProps = props => {
	const lti = props.ltiState
	const isLTIDataComplete = !!(lti && lti.state)
	const gradebookStatus = lti && lti.state ? lti.state.gradebookStatus : null
	const networkState = lti ? lti.networkState : null
	const resyncState = lti ? lti.resyncState : null
	const isPreviewing = props.isPreviewing
	const externalSystemLabel = props.externalSystemLabel
	const roundedAssessmentScore = Math.round(props.assessmentScore)

	return {
		isLTIDataComplete,
		gradebookStatus,
		networkState,
		resyncState,
		isPreviewing,
		externalSystemLabel,
		roundedAssessmentScore
	}
}

const getUIState = ltiProps => {
	if (
		ltiProps.isPreviewing ||
		!ltiProps.externalSystemLabel ||
		ltiProps.gradebookStatus === 'ok_no_outcome_service'
	) {
		return UIStates.UI_NOT_LTI
	}
	if (ltiProps.externalSystemLabel && !ltiProps.isLTIDataComplete) {
		if (ltiProps.resyncState === LTIResyncStates.RESYNC_FAILED) {
			return UIStates.UI_ERROR_RESYNC_FAILED
		} else {
			return UIStates.UI_ERROR
		}
	}
	if (ltiProps.gradebookStatus === 'ok_null_score_not_sent') return UIStates.UI_NO_SCORE_SENT
	if (ltiProps.gradebookStatus === 'ok_gradebook_matches_assessment_score') {
		if (ltiProps.resyncState === LTIResyncStates.RESYNC_SUCCEEDED) {
			return UIStates.UI_RESYNCED
		}
		return UIStates.UI_SYNCED
	}
	if (ltiProps.resyncState === LTIResyncStates.RESYNC_FAILED) {
		return UIStates.UI_ERROR_RESYNC_FAILED
	}

	return UIStates.UI_ERROR
}

class LTIStatus extends React.Component {
	componentWillReceiveProps(nextProps) {
		const currentLtiProps = getLTIStatusProps(this.props)
		const currentUIState = getUIState(currentLtiProps)
		const nextLtiProps = getLTIStatusProps(nextProps)
		const nextUIState = getUIState(nextLtiProps)

		if (
			currentUIState !== nextUIState ||
			(currentLtiProps.networkState === LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE &&
				nextLtiProps.networkState === LTINetworkStates.IDLE)
		) {
			if (nextUIState === UIStates.UI_ERROR_RESYNC_FAILED) {
				this.nextFocusEl = this.refs.resyncFailed
			} else {
				this.nextFocusEl = ReactDOM.findDOMNode(this)
			}
		}
	}

	componentDidUpdate() {
		if (this.nextFocusEl) {
			focus(this.nextFocusEl)
			delete this.nextFocusEl
		}
	}

	render() {
		const ltiProps = getLTIStatusProps(this.props)
		let child

		switch (getUIState(ltiProps)) {
			case UIStates.UI_NOT_LTI:
				return renderNotLTI()

			case UIStates.UI_NO_SCORE_SENT:
				child = renderNoScoreSent(ltiProps.externalSystemLabel)
				break

			case UIStates.UI_SYNCED:
				child = renderSynced(ltiProps.roundedAssessmentScore, ltiProps.externalSystemLabel)
				break

			case UIStates.UI_RESYNCED:
				child = renderResyncedSuccessfully(
					ltiProps.roundedAssessmentScore,
					ltiProps.externalSystemLabel
				)
				break

			// Handle UI_ERROR, UI_ERROR_RESYNC_FAILED and any other case:
			default: {
				child = renderError(
					ltiProps.resyncState,
					ltiProps.networkState,
					ltiProps.externalSystemLabel,
					this.props.onClickResendScore
				)
				break
			}
		}

		return (
			<div
				role="dialog"
				aria-labelledby="obojobo-draft--sections--assessment--lti-status--dialog"
				tabIndex="-1"
				className="obojobo-draft--sections--assessment--lti-status"
			>
				<div id="obojobo-draft--sections--assessment--lti-status--dialog">{child}</div>
			</div>
		)
	}
}

export default LTIStatus
export { getLTIStatusProps, getUIState, UIStates }
