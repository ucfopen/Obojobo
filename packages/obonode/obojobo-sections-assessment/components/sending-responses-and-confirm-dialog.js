import React from 'react'
import ReactDOM from 'react-dom'

import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

import AttemptIncompleteDialog from './attempt-incomplete-dialog'

const { Throbber } = Common.components
const { ModalContainer } = Common.components
const { SimpleDialog, Dialog } = Common.components.modal
const { ModalUtil } = Common.util
const { CurrentAssessmentStates, AssessmentUtil } = Viewer.util
const { AssessmentNetworkStates } = Viewer.stores.assessmentStore

const getDialog = (currentAttemptStatus, assessmentStep, onCancel, endAttemptFn, onResponse) => {
	console.log('getDialog', currentAttemptStatus, assessmentStep)
	switch (assessmentStep) {
		case AssessmentNetworkStates.WILL_RESUME_ATTEMPT:
			return (
				<SimpleDialog
					ok
					title="Resume Attempt"
					onConfirm={onResponse.bind(null, 'ResumeAttempt')}
					preventEsc
				>
					<p>
						It looks like you were in the middle of an attempt. We&apos;ll resume where you left
						off.
					</p>
				</SimpleDialog>
			)

		case AssessmentNetworkStates.SENDING_RESPONSES_FAILED:
			return (
				<SimpleDialog onConfirm={onCancel} ok title="Error">
					<p>Sorry, something went wrong. Please try submitting again.</p>
				</SimpleDialog>
			)

		case AssessmentNetworkStates.AWAITING_END_ATTEMPT_RESPONSE:
			return (
				<Dialog
					buttons={[
						{
							value: 'Cancel',
							altAction: true,
							onClick: onCancel
						}
					]}
					title="Submitting your attempt"
				>
					<Throbber />
				</Dialog>
			)

		case AssessmentNetworkStates.TRYING_TO_SUBMIT: {
			switch (currentAttemptStatus) {
				case CurrentAssessmentStates.NO_ATTEMPT:
				case CurrentAssessmentStates.NO_QUESTIONS:
				case CurrentAssessmentStates.UNKNOWN:
				case CurrentAssessmentStates.HAS_RESPONSES_WITH_UNKNOWN_SEND_STATES:
					return (
						<SimpleDialog onConfirm={onCancel} ok title="Error">
							<p>Sorry, something went wrong. Please try submitting again.</p>
						</SimpleDialog>
					)

				case CurrentAssessmentStates.HAS_RESPONSES_WITH_ERROR_SEND_STATES:
				case CurrentAssessmentStates.HAS_RESPONSES_SENDING:
					return (
						<Dialog
							buttons={[
								{
									value: 'Cancel',
									altAction: true,
									onClick: onCancel
								}
							]}
							title="Saving your answers"
							onCancel={onCancel}
						>
							<Throbber />
						</Dialog>
					)

				case CurrentAssessmentStates.HAS_QUESTIONS_UNANSWERED:
				case CurrentAssessmentStates.HAS_QUESTIONS_EMPTY:
				case CurrentAssessmentStates.HAS_RESPONSES_UNSENT:
					return <AttemptIncompleteDialog onCancel={onCancel} onSubmit={endAttemptFn} />

				case CurrentAssessmentStates.READY_TO_SUBMIT:
					return (
						<SimpleDialog title="Just to confirm" onCancel={onCancel} onConfirm={endAttemptFn}>
							<p>Are you ready to submit?</p>
						</SimpleDialog>
					)
			}
		}
	}

	return null
}

// const SendingResponsesConfirmDialog = props => {
// 	return ReactDOM.createPortal(
// 		<div>{getDialog(props.currentAttemptStatus, props.endAttempt)}</div>,
// 		document.getElementById(ModalContainer.DOM_ID)
// 	)
// }

const SendingResponsesConfirmDialog = props => {
	return getDialog(
		props.currentAttemptStatus,
		props.assessmentStep,
		props.onCancel,
		props.endAttempt,
		props.onResponse
	)
}

export default SendingResponsesConfirmDialog
