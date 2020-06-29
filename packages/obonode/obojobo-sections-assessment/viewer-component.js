import './viewer-component.scss'

import AssessmentDialog from './components/assessment-dialog'
import Common from 'obojobo-document-engine/src/scripts/common'
import { FOCUS_ON_ASSESSMENT_CONTENT } from './assessment-event-constants'
import PostTest from './components/post-test'
import PreTest from './components/pre-test'
import React from 'react'
import ReactDOM from 'react-dom'
import Test from './components/test'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

import StateMachineComponent from 'obojobo-document-engine/src/scripts/common/util/state-machine-component'

const { OboComponent } = Viewer.components
const { Dispatcher } = Common.flux
const { ModalUtil } = Common.util
const { ModalContainer, Throbber } = Common.components
const { SimpleDialog, Dialog, ModalPortal } = Common.components.modal
// const { Dialog } = Common.components.modal

const { AssessmentUtil } = Viewer.util
const { AssessmentNetworkStates, AssessmentStateActions } = Viewer.stores.assessmentStore
const { NavUtil, FocusUtil, CurrentAssessmentStates } = Viewer.util

const {
	NOT_IN_ATTEMPT,
	PROMPTING_FOR_IMPORT,
	PROMPTING_FOR_RESUME,
	IN_ATTEMPT,
	START_ATTEMPT_FAILED,
	RESUME_ATTEMPT_FAILED,
	IMPORT_ATTEMPT_FAILED,
	SEND_RESPONSES_SUCCESSFUL,
	SEND_RESPONSES_FAILED,
	END_ATTEMPT_FAILED,
	STARTING_ATTEMPT,
	RESUMING_ATTEMPT,
	SENDING_RESPONSES,
	ENDING_ATTEMPT,
	END_ATTEMPT_SUCCESSFUL,
	IMPORTING_ATTEMPT
} = AssessmentNetworkStates

class Assessment extends React.Component {
	constructor(props) {
		super()
		this.state = {
			// isFetching: false,
			// isAwaitingForceSendAllResponses: false,
			currentStep: Assessment.getCurrentStep(props),
			sendingResponsesConfirmDialogId: null
		}
		// this.onEndAttempt = this.onEndAttempt.bind(this)
		// this.onAttemptEnded = this.onAttemptEnded.bind(this)
		this.endAttempt = this.endAttempt.bind(this)
		this.onClickSubmit = this.onClickSubmit.bind(this)

		this.childRef = React.createRef()
	}

	static focusOnContent() {
		Dispatcher.trigger(FOCUS_ON_ASSESSMENT_CONTENT)
	}

	static getDerivedStateFromProps(nextProps) {
		const curStep = Assessment.getCurrentStep(nextProps)
		return { curStep }
	}

	static getCurrentStep(props) {
		const state = AssessmentUtil.getAssessmentMachineStateForModel(
			props.moduleData.assessmentState,
			props.model
		)

		switch (state) {
			case IN_ATTEMPT:
			case SEND_RESPONSES_SUCCESSFUL:
			case SEND_RESPONSES_FAILED:
			case END_ATTEMPT_FAILED:
			case SENDING_RESPONSES:
			case ENDING_ATTEMPT: {
				return 'test'
			}

			case STARTING_ATTEMPT:
			case RESUMING_ATTEMPT: {
				return 'loading'
			}

			default:
				return AssessmentUtil.getNumberOfAttemptsCompletedForModel(
					props.moduleData.assessmentState,
					props.model
				) === 0
					? 'pre-test'
					: 'post-test'
		}
	}

	static getIsLoading(props) {
		const machineState = AssessmentUtil.getAssessmentMachineStateForModel(
			props.moduleData.assessmentState,
			props.model
		)
	}

	componentWillUnmount() {
		// make sure navutil know's we're not in assessment any more
		NavUtil.resetContext()
		// Dispatcher.off('assessment:endAttempt', this.onEndAttempt)
		// Dispatcher.off('assessment:attemptEnded', this.onAttemptEnded)
	}

	componentDidMount() {
		Dispatcher.on('assessment:endAttempt', this.onEndAttempt)
		Dispatcher.on('assessment:attemptEnded', this.onAttemptEnded)

		// if we're in an active attempt - notify the navUtil we're in Assessment
		const attemptInfo = AssessmentUtil.getCurrentAttemptForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		if (attemptInfo) {
			NavUtil.setContext(`assessment:${attemptInfo.assessmentId}:${attemptInfo.attemptId}`)
		}
	}

	componentDidUpdate(_, prevState) {
		if (prevState.curStep !== this.state.curStep) {
			Dispatcher.trigger('viewer:scrollToTop')
			FocusUtil.focusOnNavTarget()
		}

		//SENDING_RESPONSES_SUCCESSFUL
		//SENDING_RESPONSES_FAILED
		// if (this.state.isAwaitingForceSendAllResponses) {
		// 	const assessmentNetworkState = AssessmentUtil.getAssessmentNetworkState(
		// 		this.props.moduleData.assessmentState,
		// 		this.props.model
		// 	)
		// 	// const currentAttemptStatus = this.getCurrentAttemptStatus()

		// 	if (
		// 		assessmentNetworkState === AssessmentNetworkStates.SENDING_RESPONSES_SUCCESSFUL ||
		// 		assessmentNetworkState === AssessmentNetworkStates.SENDING_RESPONSES_FAILED
		// 	) {
		// 		this.setState({
		// 			isAwaitingForceSendAllResponses: false
		// 		})

		// 		// ModalUtil.hide()
		// 		// ModalUtil.show(
		// 		// 	<SimpleDialog title="Just to confirm">
		// 		// 		<p>Are you ready to submit?</p>
		// 		// 	</SimpleDialog>
		// 		// )
		// 	}
		// }
	}

	// onEndAttempt() {
	// 	this.setState({ isFetching: true })
	// }

	// onAttemptEnded() {
	// 	this.setState({ isFetching: false })
	// }

	getCurrentAttemptStatus() {
		return AssessmentUtil.getCurrentAttemptStatus(
			this.props.moduleData.assessmentState,
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
	}

	isAttemptReadyToSubmit() {
		return this.getCurrentAttemptStatus() === CurrentAssessmentStates.READY_TO_SUBMIT
	}

	isAssessmentComplete() {
		return !AssessmentUtil.hasAttemptsRemaining(
			this.props.moduleData.assessmentState,
			this.props.model
		)
	}

	isAttemptSubmitting() {
		// return (
		// 	AssessmentUtil.getAssessmentStep(this.props.moduleData.assessmentState, this.props.model) ===
		// 	AssessmentNetworkStates.AWAITING_END_ATTEMPT_RESPONSE
		// )
		return (
			AssessmentUtil.getAssessmentMachineStateForModel(
				this.props.moduleData.assessmentState,
				this.props.model
			) === ENDING_ATTEMPT
		)
	}

	onClickSubmit() {
		// disable multiple clicks
		// if (this.state.isFetching) return
		// if (this.isAttemptSubmitting()) return

		// if (
		// 	this.getCurrentAttemptStatus() ===
		// 	CurrentAssessmentStates.HAS_RESPONSES_WITH_ERROR_SEND_STATES
		// ) {
		// 	AssessmentUtil.forceSendResponsesForCurrentAttempt(
		// 		this.props.model,
		// 		this.props.moduleData.navState.context
		// 	)
		// }

		// AssessmentUtil.forceSendResponsesForCurrentAttempt(
		// 	this.props.model,
		// 	this.props.moduleData.navState.context
		// )

		const machine = AssessmentUtil.getAssessmentMachineForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		// ModalUtil.hide()
		// ModalUtil.hide()
		// machine.gotoStep(AssessmentNetworkStates.TRYING_TO_SUBMIT)
		// }

		machine.send(AssessmentStateActions.SEND_RESPONSES)

		// machine.forceSendAllResponses()
		// machine.gotoStep(AssessmentNetworkStates.TRYING_TO_SUBMIT)
		//this'll hide regular modals but has no affect on ModalPortal
		// ModalUtil.hide()
	}

	// onDialogResponse(response) {
	// 	switch (response) {
	// 		case 'ResumeAttempt':
	// 			const machine = AssessmentUtil.getAssessmentMachineForModel(
	// 				this.props.moduleData.assessmentState,
	// 				this.props.model
	// 			)

	// 			ModalUtil.hide()

	// 			//@TODO XSTATE
	// 			// machine.dispatch('tryResumeAttempt')
	// 			machine.send(AssessmentStateActions.RESUME_ATTEMPT)

	// 			break
	// 	}
	// }

	endAttempt() {
		// this.closeDialog()

		return AssessmentUtil.endAttempt({
			model: this.props.model,
			context: this.props.moduleData.navState.context,
			visitId: this.props.moduleData.navState.visitId
		})
	}

	exitAssessment() {
		const scoreAction = this.getScoreAction()

		switch (scoreAction.action.value) {
			case '_next':
				return NavUtil.goNext()

			case '_prev':
				return NavUtil.goPrev()

			default:
				return NavUtil.goto(scoreAction.action.value)
		}
	}

	getScoreAction() {
		const assessmentScore = AssessmentUtil.getAssessmentScoreForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)
		const scoreAction = this.props.model.modelState.scoreActions.getActionForScore(assessmentScore)

		if (scoreAction) {
			return scoreAction
		}

		return {
			from: 0,
			to: 100,
			message: '',
			action: {
				type: 'unlock',
				value: '_next'
			}
		}
	}

	render() {
		// if(this._sendingResponsesConfirmDialog) {
		// 	this._sendingResponsesConfirmDialog.setPro
		// }

		// const SRCD = this._sendingResponsesConfirmDialog

		const childEl = (() => {
			switch (this.state.curStep) {
				case 'pre-test':
					return (
						<PreTest model={this.props.model.children.at(0)} moduleData={this.props.moduleData} />
					)

				case 'loading':
					return (
						<div className="loading-assessment">
							<Throbber />
						</div>
					)

				case 'test':
					return (
						<Test
							model={this.props.model.children.at(1)}
							moduleData={this.props.moduleData}
							onClickSubmit={this.onClickSubmit}
							isAttemptReadyToSubmit={this.isAttemptReadyToSubmit()}
							isAttemptSubmitting={this.isAttemptSubmitting()}
						/>
					)

				case 'post-test':
					return (
						<PostTest
							ref={this.childRef}
							model={this.props.model}
							moduleData={this.props.moduleData}
							scoreAction={this.getScoreAction()}
						/>
					)
			}
		})()

		const assessment = AssessmentUtil.getAssessmentForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className="obojobo-draft--sections--assessment"
			>
				{/* <h1>{this.state.curStep}</h1>
				<h1>
					{AssessmentUtil.getCurrentAttemptStatus(
						this.props.moduleData.assessmentState,
						this.props.moduleData.questionState,
						this.props.model,
						this.props.moduleData.navState.context
					)}
				</h1>
				<h1>
					{AssessmentUtil.getAssessmentMachineStateForModel(
						this.props.moduleData.assessmentState,
						this.props.model
					)}
				</h1> */}
				{/* <StateMachineComponent
					machine={this.props.moduleData.assessmentState.machines[this.props.model.get('id')]}
				></StateMachineComponent> */}
				{childEl}

				<ModalPortal>
					<AssessmentDialog
						// onResponse={this.onDialogResponse.bind(this)}
						// onCancel={this.closeDialog.bind(this)}
						endAttempt={this.endAttempt}
						assessmentMachineState={AssessmentUtil.getAssessmentMachineStateForModel(
							this.props.moduleData.assessmentState,
							this.props.model
						)}
						currentAttemptStatus={this.getCurrentAttemptStatus()}
						assessmentModel={this.props.model}
						assessment={assessment}
					/>
				</ModalPortal>
			</OboComponent>
		)
	}
}

export default Assessment
