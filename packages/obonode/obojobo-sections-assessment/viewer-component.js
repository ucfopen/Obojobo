import './viewer-component.scss'

import AssessmentDialog from './components/assessment-dialog'
import Common from 'obojobo-document-engine/src/scripts/common'
import { FOCUS_ON_ASSESSMENT_CONTENT } from './assessment-event-constants'
import PostTest from './components/post-test'
import PreTest from './components/pre-test'
import React from 'react'
import Test from './components/test'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

import AssessmentMachineStates from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store/assessment-machine-states'

const { OboComponent } = Viewer.components
const { Dispatcher } = Common.flux
const { Spinner } = Common.components
const { ModalPortal } = Common.components.modal

const { AssessmentUtil } = Viewer.util
const { NavUtil, FocusUtil, CurrentAssessmentStates } = Viewer.util

const {
	IN_ATTEMPT,
	SEND_RESPONSES_SUCCESSFUL,
	SEND_RESPONSES_FAILED,
	END_ATTEMPT_FAILED,
	STARTING_ATTEMPT,
	RESUMING_ATTEMPT,
	SENDING_RESPONSES,
	ENDING_ATTEMPT,
	IMPORTING_ATTEMPT
} = AssessmentMachineStates

class Assessment extends React.Component {
	constructor(props) {
		super()
		this.state = {
			curStep: Assessment.getStep(props)
		}
		this.endAttempt = this.endAttempt.bind(this)
		this.onClickSubmit = this.onClickSubmit.bind(this)

		this.childRef = React.createRef()
	}

	static focusOnContent() {
		Dispatcher.trigger(FOCUS_ON_ASSESSMENT_CONTENT)
	}

	static getDerivedStateFromProps(nextProps) {
		const curStep = Assessment.getStep(nextProps)
		return { curStep }
	}

	static getStep(props) {
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
			case RESUMING_ATTEMPT:
			case IMPORTING_ATTEMPT: {
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

	isAttemptSubmitting() {
		return (
			AssessmentUtil.getAssessmentMachineStateForModel(
				this.props.moduleData.assessmentState,
				this.props.model
			) === ENDING_ATTEMPT
		)
	}

	onClickSubmit() {
		AssessmentUtil.forceSendResponsesForCurrentAttempt(
			this.props.model,
			this.props.moduleData.navState.context
		)
	}

	endAttempt() {
		return AssessmentUtil.endAttempt({
			model: this.props.model,
			context: this.props.moduleData.navState.context,
			visitId: this.props.moduleData.navState.visitId
		})
	}

	getScoreAction() {
		return this.props.model.modelState.scoreActions.getActionForScore(
			AssessmentUtil.getAssessmentScoreForModel(
				this.props.moduleData.assessmentState,
				this.props.model
			)
		)
	}

	getAssessmentComponent() {
		switch (this.state.curStep) {
			case 'pre-test':
				return (
					<PreTest model={this.props.model.children.at(0)} moduleData={this.props.moduleData} />
				)

			case 'loading':
				return (
					<div className="loading-assessment">
						<Spinner />
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
	}

	componentWillUnmount() {
		NavUtil.resetContext()
	}

	componentDidMount() {
		// If we're in an active attempt - notify the navUtil we're in Assessment
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
	}

	render() {
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
				{this.getAssessmentComponent()}

				<ModalPortal>
					<AssessmentDialog
						endAttempt={this.endAttempt}
						assessmentMachineState={AssessmentUtil.getAssessmentMachineStateForModel(
							this.props.moduleData.assessmentState,
							this.props.model
						)}
						currentAttemptStatus={this.getCurrentAttemptStatus()}
						assessmentModel={this.props.model}
						assessment={assessment}
						importableScore={AssessmentUtil.getImportableScoreForModel(
							this.props.moduleData.assessmentState,
							this.props.model
						)}
						numAttemptsRemaining={AssessmentUtil.getAttemptsRemaining(
							this.props.moduleData.assessmentState,
							this.props.model
						)}
					/>
				</ModalPortal>
			</OboComponent>
		)
	}
}

export default Assessment
