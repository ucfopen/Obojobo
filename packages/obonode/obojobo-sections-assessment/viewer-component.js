import './viewer-component.scss'

import SendingResponsesConfirmDialog from './components/sending-responses-and-confirm-dialog'
import Common from 'obojobo-document-engine/src/scripts/common'
import { FOCUS_ON_ASSESSMENT_CONTENT } from './assessment-event-constants'
import PostTest from './components/post-test'
import PreTest from './components/pre-test'
import React from 'react'
import ReactDOM from 'react-dom'
import Test from './components/test'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

import StateMachineComponent from 'obojobo-document-engine/src/scripts/common/util/state-machine-component'

const { OboComponent, Throbber } = Viewer.components
const { Dispatcher } = Common.flux
const { ModalUtil } = Common.util
const { ModalContainer } = Common.components
const { SimpleDialog, Dialog } = Common.components.modal

const { AssessmentUtil } = Viewer.util
const { AssessmentNetworkStates } = Viewer.stores.assessmentStore
const { NavUtil, FocusUtil, CurrentAssessmentStates } = Viewer.util

class ModalPortal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			todo: 0
		}
	}

	// componentDidMount() {
	// 	this.update()
	// }

	// componentDidUpdate() {
	// 	this.update()
	// }

	// update() {
	// 	if (!this.props.children) return

	// 	const firstChild = this.props.children

	// 	if(!this.props.children) {

	// 	}

	// 	if (firstChild !== this.state.component) {
	// 		// if (this.state.component === null) {
	// 		ModalUtil.show(null, false, true)
	// 		// }

	// 		this.setState({
	// 			component: firstChild
	// 		})
	// 	}
	// }

	render() {
		// alert('render')
		// if (!document.getElementById(ModalContainer.PORTAL_CONTAINER_DOM_ID)) {
		// 	alert('not ready')
		// 	setTimeout(() => {
		// 		this.setState({
		// 			todo: this.state.todo + 1
		// 		})
		// 	}, 1000)

		// 	return null
		// }

		return ReactDOM.createPortal(
			this.props.children,
			// document.getElementById(ModalContainer.PORTAL_CONTAINER_DOM_ID) //ModalContainer.DOM_ID
			document.body //ModalContainer.DOM_ID
		)
	}
}

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

		// Dispatcher.on('assessment:endAttempt', this.onEndAttempt)
		// Dispatcher.on('assessment:attemptEnded', this.onAttemptEnded)
	}

	static focusOnContent() {
		Dispatcher.trigger(FOCUS_ON_ASSESSMENT_CONTENT)
	}

	static getDerivedStateFromProps(nextProps) {
		const curStep = Assessment.getCurrentStep(nextProps)
		return { curStep }
	}

	static getCurrentStep(props) {
		const assessment = AssessmentUtil.getAssessmentForModel(
			props.moduleData.assessmentState,
			props.model
		)

		if (assessment === null) {
			return 'pre-test'
		}

		if (assessment.current !== null) {
			return 'test'
		}

		if (assessment.attempts.length > 0) {
			return 'post-test'
		}

		return 'pre-test'
	}

	componentWillUnmount() {
		NavUtil.resetContext()
		// Dispatcher.off('assessment:endAttempt', this.onEndAttempt)
		// Dispatcher.off('assessment:attemptEnded', this.onAttemptEnded)
	}

	componentDidUpdate(prevProps, prevState) {
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
		return (
			AssessmentUtil.getAssessmentStep(this.props.moduleData.assessmentState, this.props.model) ===
			AssessmentNetworkStates.AWAITING_END_ATTEMPT_RESPONSE
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

		ModalUtil.hide()
		machine.gotoStep(AssessmentNetworkStates.TRYING_TO_SUBMIT)
	}

	closeDialog() {
		//@TODO: This needs to happen after sending success
		AssessmentUtil.resetNetworkState(this.props.model)

		ModalUtil.hide()
	}

	onDialogResponse(response) {
		switch (response) {
			case 'ResumeAttempt':
				const machine = AssessmentUtil.getAssessmentMachineForModel(
					this.props.moduleData.assessmentState,
					this.props.model
				)

				ModalUtil.hide()
				machine.dispatch('tryResumeAttempt')

				break
		}
	}

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

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className="obojobo-draft--sections--assessment"
			>
				<h1>
					{AssessmentUtil.getAssessmentStep(
						this.props.moduleData.assessmentState,
						this.props.model
					)}
				</h1>
				<h1>
					{AssessmentUtil.getCurrentAttemptStatus(
						this.props.moduleData.assessmentState,
						this.props.moduleData.questionState,
						this.props.model,
						this.props.moduleData.navState.context
					)}
				</h1>
				<StateMachineComponent
					machine={this.props.moduleData.assessmentState.machines[this.props.model.get('id')]}
				></StateMachineComponent>
				{childEl}

				<ModalPortal>
					<SendingResponsesConfirmDialog
						onResponse={this.onDialogResponse.bind(this)}
						onCancel={this.closeDialog.bind(this)}
						endAttempt={this.endAttempt}
						assessmentStep={AssessmentUtil.getAssessmentStep(
							this.props.moduleData.assessmentState,
							this.props.model
						)}
						currentAttemptStatus={this.getCurrentAttemptStatus()}
					/>
				</ModalPortal>
			</OboComponent>
		)
	}
}

export default Assessment
