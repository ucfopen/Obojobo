import React from 'react'
import ReactDOM from 'react-dom'

import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

import AttemptIncompleteDialog from './attempt-incomplete-dialog'

const { AssessmentScoreReportView, AssessmentScoreReporter } = Viewer.assessment

const { Throbber } = Common.components
const { ModalContainer } = Common.components
const { SimpleDialog, Dialog } = Common.components.modal
const { ModalUtil } = Common.util
const { CurrentAssessmentStates, AssessmentUtil, NavUtil, FocusUtil } = Viewer.util
const { NavStore } = Viewer.stores
const { AssessmentNetworkStates } = Viewer.stores.assessmentStore

const {
	PROMPTING_FOR_RESUME,
	STARTING_ATTEMPT,
	RESUMING_ATTEMPT,
	IN_ATTEMPT,
	START_ATTEMPT_FAILED,
	RESUME_ATTEMPT_FAILED,
	SENDING_RESPONSES,
	SEND_RESPONSES_SUCCESSFUL,
	SEND_RESPONSES_FAILED,
	NOT_IN_ATTEMPT,
	ENDING_ATTEMPT,
	END_ATTEMPT_FAILED,
	END_ATTEMPT_SUCCESSFUL,
	PROMPTING_FOR_IMPORT,
	IMPORTING_ATTEMPT,
	IMPORT_ATTEMPT_FAILED,
	IMPORT_ATTEMPT_SUCCESSFUL
} = AssessmentNetworkStates

const getReportForAttempt = (assessmentModel, allAttempts, attemptNumber) => {
	const reporter = new AssessmentScoreReporter({
		assessmentRubric: assessmentModel.modelState.rubric.toObject(),
		totalNumberOfAttemptsAllowed: assessmentModel.modelState.attempts,
		allAttempts
	})

	return reporter.getReportFor(attemptNumber)
}

const onCloseResultsDialog = assessmentModel => {
	ModalUtil.hide()
	FocusUtil.focusOnNavTarget()
	AssessmentUtil.acknowledgeEndAttemptSuccessful(assessmentModel)
}

const continueAttempt = assessmentModel => {
	AssessmentUtil.continueAttempt(assessmentModel)
}

const acknowledgeStartAttemptFailed = assessmentModel => {
	AssessmentUtil.acknowledgeStartAttemptFailed(assessmentModel)
}

const acknowledgeResumeAttemptFailed = assessmentModel => {
	AssessmentUtil.acknowledgeResumeAttemptFailed(assessmentModel)
}

const acknowledgeEndAttemptFailed = assessmentModel => {
	AssessmentUtil.acknowledgeEndAttemptFailed(assessmentModel)
}

const getDialog = (
	currentAttemptStatus,
	assessmentMachineState,
	// onCancel,
	endAttemptFn,
	assessmentModel,
	assessment
) => {
	console.log('getDialog', assessmentMachineState)
	switch (assessmentMachineState) {
		case PROMPTING_FOR_RESUME:
			console.log('sracd', PROMPTING_FOR_RESUME)
			return (
				<SimpleDialog
					ok
					title="Resume Attempt"
					onConfirm={() => {
						AssessmentUtil.resumeAttempt(assessmentModel)
					}}
					preventEsc
				>
					<p>
						It looks like you were in the middle of an attempt. We&apos;ll resume where you left
						off.
					</p>
				</SimpleDialog>
			)

		case SEND_RESPONSES_FAILED:
			console.log('sracd', SEND_RESPONSES_FAILED)
			return (
				<SimpleDialog onConfirm={() => continueAttempt(assessmentModel)} ok title="Error">
					<p>Sorry, something went wrong sending your responses. Please try submitting again.</p>
				</SimpleDialog>
			)

		// case STARTING_ATTEMPT:
		// case RESUMING_ATTEMPT:
		// 	console.log('sracd', STARTING_ATTEMPT)
		// 	return (
		// 		<Dialog
		// 			// buttons={[
		// 			// 	{
		// 			// 		value: 'Cancel',
		// 			// 		altAction: true,
		// 			// 		onClick: onCancel
		// 			// 	}
		// 			// ]}
		// 			title="Loading Assessment"
		// 		>
		// 			<Throbber />
		// 		</Dialog>
		// 	)

		case ENDING_ATTEMPT:
			console.log('sracd', ENDING_ATTEMPT)
			return (
				<Dialog
					// buttons={[
					// 	{
					// 		value: 'Cancel',
					// 		altAction: true,
					// 		onClick: onCancel
					// 	}
					// ]}
					title="Submitting your attempt"
				>
					<Throbber />
				</Dialog>
			)

		case SENDING_RESPONSES: {
			return (
				<Dialog
					// buttons={[
					// 	{
					// 		value: 'Cancel',
					// 		altAction: true,
					// 		onClick: onCancel
					// 	}
					// ]}
					title="Submitting your responses"
					// onCancel={onCancel}
				>
					<Throbber />
				</Dialog>
			)
		}

		case START_ATTEMPT_FAILED: {
			switch (assessment.current.error.toLowerCase()) {
				case 'attempt limit reached':
					return (
						<SimpleDialog
							onConfirm={() => acknowledgeStartAttemptFailed(assessmentModel)}
							ok
							title="No attempts left"
						>
							<p>You have attempted this assessment the maximum number of times available.</p>
						</SimpleDialog>
					)

				default:
					return (
						<SimpleDialog
							onConfirm={() => acknowledgeStartAttemptFailed(assessmentModel)}
							ok
							title="Error"
							width="35rem"
						>
							<p>
								{`Something went wrong while starting your attempt: ${assessment.current.error}. Try starting your attempt again.`}
							</p>
						</SimpleDialog>
					)
			}
		}

		case RESUME_ATTEMPT_FAILED: {
			return (
				<Dialog
					centered
					buttons={[
						{
							value: `Retry Resuming Your Attempt`,
							onClick: () => acknowledgeResumeAttemptFailed(assessmentModel),
							default: true
						}
					]}
					title="Error"
					width="35rem"
				>
					<p>{`Something went wrong resuming your attempt: ${assessment.current.error}. Click the button below to try again.`}</p>
				</Dialog>
			)
		}

		case END_ATTEMPT_SUCCESSFUL: {
			const assessmentLabel = NavUtil.getNavLabelForModel(NavStore.getState(), assessmentModel)
			const allAttempts = assessment.attempts
			const attemptNumber = allAttempts[allAttempts.length - 1].attemptNumber

			return (
				<Dialog
					modalClassName="obojobo-draft--sections--assessment--results-modal"
					centered
					buttons={[
						{
							value: `Show ${assessmentLabel} Overview`,
							onClick: () => onCloseResultsDialog(assessmentModel),
							default: true
						}
					]}
					title={`Attempt ${attemptNumber} Results`}
					width="35rem"
				>
					<AssessmentScoreReportView
						report={getReportForAttempt(assessmentModel, allAttempts, attemptNumber)}
					/>
				</Dialog>
			)
		}

		case END_ATTEMPT_FAILED: {
			return (
				<Dialog
					centered
					buttons={[
						{
							value: `Close`,
							onClick: () => acknowledgeEndAttemptFailed(assessmentModel),
							default: true
						}
					]}
					title="Error"
					width="35rem"
				>
					<p>{`Something went wrong ending your attempt: ${assessment.current.error}. Please try again.`}</p>
				</Dialog>
			)
		}

		case SEND_RESPONSES_SUCCESSFUL: {
			console.log('sracd', SENDING_RESPONSES, currentAttemptStatus)
			switch (currentAttemptStatus) {
				case CurrentAssessmentStates.NO_ATTEMPT:
				case CurrentAssessmentStates.NO_QUESTIONS:
				case CurrentAssessmentStates.UNKNOWN:
				case CurrentAssessmentStates.HAS_RESPONSES_WITH_UNKNOWN_SEND_STATES:
					return (
						<SimpleDialog onConfirm={() => continueAttempt(assessmentModel)} ok title="Error">
							<p>Sorry, something went wrong. Please try submitting again.</p>
						</SimpleDialog>
					)

				// case CurrentAssessmentStates.HAS_RESPONSES_WITH_ERROR_SEND_STATES:
				// case CurrentAssessmentStates.HAS_RESPONSES_SENDING:
				// 	return (
				// 		<Dialog
				// 			buttons={[
				// 				{
				// 					value: 'Cancel',
				// 					altAction: true,
				// 					onClick: onCancel
				// 				}
				// 			]}
				// 			title="Saving your answers"
				// 			onCancel={onCancel}
				// 		>
				// 			<Throbber />
				// 		</Dialog>
				// 	)

				case CurrentAssessmentStates.HAS_QUESTIONS_UNANSWERED:
				case CurrentAssessmentStates.HAS_QUESTIONS_EMPTY:
				case CurrentAssessmentStates.HAS_RESPONSES_UNSENT:
					// return (
					// 	<Dialog
					// 		buttons={[
					// 			{
					// 				value: 'Cancel',
					// 				altAction: true,
					// 				onClick: onCancel
					// 			}
					// 		]}
					// 		title="Saving your answers"
					// 		onCancel={onCancel}
					// 	>
					// 		<Throbber />
					// 	</Dialog>
					// )
					return (
						<AttemptIncompleteDialog
							onCancel={() => continueAttempt(assessmentModel)}
							onSubmit={endAttemptFn}
						/>
					)

				case CurrentAssessmentStates.READY_TO_SUBMIT:
					return (
						<SimpleDialog
							title="Just to confirm"
							onCancel={() => continueAttempt(assessmentModel)}
							onConfirm={endAttemptFn}
						>
							<p>Are you ready to submit?</p>
						</SimpleDialog>
					)
			}
		}
	}

	return null
}

// const AssessmentDialog = props => {
// 	return ReactDOM.createPortal(
// 		<div>{getDialog(props.currentAttemptStatus, props.endAttempt)}</div>,
// 		document.getElementById(ModalContainer.DOM_ID)
// 	)
// }

const AssessmentDialog = props => {
	return getDialog(
		props.currentAttemptStatus,
		props.assessmentMachineState,
		// props.onCancel,
		props.endAttempt,
		// props.onResponse,
		props.assessmentModel,
		props.assessment
	)
}

export default AssessmentDialog
