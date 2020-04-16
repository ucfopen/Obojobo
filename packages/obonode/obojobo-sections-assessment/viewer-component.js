import './viewer-component.scss'

import AttemptIncompleteDialog from './components/attempt-incomplete-dialog'
import Common from 'obojobo-document-engine/src/scripts/common'
import { FOCUS_ON_ASSESSMENT_CONTENT } from './assessment-event-constants'
import PostTest from './components/post-test'
import PreTest from './components/pre-test'
import React from 'react'
import Test from './components/test'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { Dispatcher } = Common.flux
const { ModalUtil } = Common.util
const { Dialog } = Common.components.modal

const { AssessmentUtil } = Viewer.util
const { NavUtil, FocusUtil } = Viewer.util

class Assessment extends React.Component {
	constructor(props) {
		super()
		this.state = {
			isFetching: false,
			currentStep: Assessment.getCurrentStep(props)
		}
		this.onEndAttempt = this.onEndAttempt.bind(this)
		this.onAttemptEnded = this.onAttemptEnded.bind(this)
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
		// make sure navutil know's we're not in assessment any more
		NavUtil.resetContext()
		Dispatcher.off('assessment:endAttempt', this.onEndAttempt)
		Dispatcher.off('assessment:attemptEnded', this.onAttemptEnded)
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
	}

	onEndAttempt() {
		this.setState({ isFetching: true })
	}

	onAttemptEnded() {
		this.setState({ isFetching: false })
	}

	isAttemptComplete() {
		return AssessmentUtil.isCurrentAttemptComplete(
			this.props.moduleData.assessmentState,
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
	}

	isAssessmentComplete() {
		return !AssessmentUtil.hasAttemptsRemaining(
			this.props.moduleData.assessmentState,
			this.props.model
		)
	}

	onClickSubmit() {
		// disable multiple clicks
		if (this.state.isFetching) return

		if (!this.isAttemptComplete()) {
			ModalUtil.show(<AttemptIncompleteDialog onSubmit={this.endAttempt} />)
			return
		}

		const remainAttempts = AssessmentUtil.getAttemptsRemaining(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		if (remainAttempts === 1) {
			ModalUtil.show(
				<Dialog
					width="32rem"
					title="This is your last attempt"
					buttons={[
						{
							value: 'Cancel',
							altAction: true,
							default: true,
							onClick: ModalUtil.hide
						},
						{
							value: 'OK - Submit Last Attempt',
							onClick: this.endAttempt
						}
					]}
				>
					<p>{"You won't be able to submit another attempt after this one."}</p>
				</Dialog>
			)
		} else {
			ModalUtil.show(
				<Dialog
					width="32rem"
					title="Just to confirm..."
					buttons={[
						{
							value: 'Cancel',
							altAction: true,
							default: true,
							onClick: ModalUtil.hide
						},
						{
							value: 'OK - Submit',
							onClick: this.endAttempt
						}
					]}
				>
					<p>Are you ready to submit?</p>
				</Dialog>
			)
		}
	}

	endAttempt() {
		ModalUtil.hide()
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
							isAttemptComplete={this.isAttemptComplete()}
							isFetching={this.state.isFetching}
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
				{childEl}
			</OboComponent>
		)
	}
}

export default Assessment
