import React from 'react'
import ReactDOM from 'react-dom'

import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

import AttemptIncompleteDialog from './attempt-incomplete-dialog'
import PreAttemptImportScoreDialog from './dialogs/pre-attempt-import-score-dialog'

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
	IMPORT_ATTEMPT_SUCCESSFUL,
	FETCH_HISTORY_FAILED
} = AssessmentNetworkStates

const getReportForAttempt = (assessmentModel, allAttempts, attemptNumber) => {
	const reporter = new AssessmentScoreReporter({
		assessmentRubric: assessmentModel.modelState.rubric.toObject(),
		totalNumberOfAttemptsAllowed: assessmentModel.modelState.attempts,
		allScoreDetails: allAttempts.map(a => a.scoreDetails)
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

const acknowledgeImportAttemptFailed = assessmentModel => {
	AssessmentUtil.acknowledgeImportAttemptFailed(assessmentModel)
}

const acknowledgeFetchHistoryFailed = (assessmentModel, retry) => {
	AssessmentUtil.acknowledgeFetchHistoryFailed(assessmentModel, retry)
}

const onImportChoice = (shouldImport, assessmentModel) => {
	if (shouldImport) {
		AssessmentUtil.importAttempt(assessmentModel)
	} else {
		AssessmentUtil.abandonImport(assessmentModel)
	}
}

const getDialog = (
	currentAttemptStatus,
	assessmentMachineState,
	// onCancel,
	endAttemptFn,
	assessmentModel,
	assessment,
	importableScore,
	numAttemptsRemaining
) => {
	switch (assessmentMachineState) {
		case PROMPTING_FOR_RESUME:
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

		case PROMPTING_FOR_IMPORT:
			return (
				<PreAttemptImportScoreDialog
					highestScore={importableScore}
					onChoice={shouldImport => {
						onImportChoice(shouldImport, assessmentModel)
					}}
				/>
			)

		case SEND_RESPONSES_FAILED:
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

				case 'import score has already been used':
					return (
						<SimpleDialog
							onConfirm={() => acknowledgeStartAttemptFailed(assessmentModel)}
							ok
							title="Import already used"
						>
							<p>You&apos;ve imported your score, which means you cannot attempt the assessment.</p>
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

		case IMPORT_ATTEMPT_FAILED: {
			return (
				<Dialog
					centered
					buttons={[
						{
							value: `Close`,
							onClick: () => acknowledgeImportAttemptFailed(assessmentModel),
							default: true
						}
					]}
					title="Error"
					width="35rem"
				>
					<p>{`Something went wrong importing your attempt: ${assessment.current.error}. Please try again.`}</p>
				</Dialog>
			)
		}

		case FETCH_HISTORY_FAILED: {
			return (
				// <SimpleDialog
				// 	onConfirm={() => acknowledgeFetchHistoryFailed(assessmentModel)}
				// 	ok
				// 	title="Error"
				// >
				// 	<p>
				// 		Sorry, something went wrong fetching your assessment history. Close this window and
				// 		revisit this module.
				// 	</p>
				// </SimpleDialog>

				<Dialog
					centered
					buttons={[
						{
							value: 'Close',
							altAction: true,
							onClick: () => acknowledgeFetchHistoryFailed(assessmentModel, false)
						},
						{
							value: `Try again`,
							onClick: () => acknowledgeFetchHistoryFailed(assessmentModel, true),
							default: true
						}
					]}
					title="Error"
					width="35rem"
				>
					<p>
						Something went wrong fetching your assessment history. If the problem persists, close
						this window and revisit this module
					</p>
				</Dialog>
			)
		}

		case SEND_RESPONSES_SUCCESSFUL: {
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
					switch (numAttemptsRemaining) {
						case 1:
							return (
								<Dialog
									width="32rem"
									title="This is your last attempt"
									buttons={[
										{
											value: 'Cancel',
											altAction: true,
											default: true,
											onClick: () => continueAttempt(assessmentModel)
										},
										{
											value: 'OK - Submit Last Attempt',
											onClick: endAttemptFn
										}
									]}
								>
									<p>{"You won't be able to submit another attempt after this one."}</p>
								</Dialog>
							)
						default:
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
	console.log('ASSESSMENT DIALOG', props.currentAttemptStatus, props.assessmentMachineState)

	return getDialog(
		props.currentAttemptStatus,
		props.assessmentMachineState,
		// props.onCancel,
		props.endAttempt,
		// props.onResponse,
		props.assessmentModel,
		props.assessment,
		props.importableScore,
		props.numAttemptsRemaining
	)
}

export default AssessmentDialog
