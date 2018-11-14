import './viewer-component.scss'

import React from 'react'

import Common from 'Common'
import Viewer from 'Viewer'

const { OboComponent } = Viewer.components
const { Dispatcher } = Common.flux
const { ModalUtil } = Common.util

const { AssessmentUtil } = Viewer.util
const { NavUtil, FocusUtil } = Viewer.util

import AttemptIncompleteDialog from './components/attempt-incomplete-dialog'
import { FOCUS_ON_ASSESSMENT_CONTENT } from './assessment-event-constants'

import PreTest from './components/pre-test'
import Test from './components/test'
import PostTest from './components/post-test'

class Assessment extends React.Component {
	static focusOnContent() {
		Dispatcher.trigger(FOCUS_ON_ASSESSMENT_CONTENT)
	}

	static getCurrentStep(model, assessmentState) {
		const assessment = AssessmentUtil.getAssessmentForModel(assessmentState, model)

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

	constructor() {
		super()
		this.state = {
			isFetching: false,
			step: null
		}

		this.onEndAttempt = this.onEndAttempt.bind(this)
		this.onAttemptEnded = this.onAttemptEnded.bind(this)
		this.endAttempt = this.endAttempt.bind(this)
		this.onClickSubmit = this.onClickSubmit.bind(this)

		Dispatcher.on('assessment:endAttempt', this.onEndAttempt)
		Dispatcher.on('assessment:attemptEnded', this.onAttemptEnded)
	}

	getCurrentStep() {
		return this.constructor.getCurrentStep(this.props.model, this.props.moduleData.assessmentState)
	}

	componentWillReceiveProps() {
		// If we were on a step (meaning we haven't left the assessment section)
		// and the step has changed we need to scroll to the top and focus
		// on the content
		const curStep = this.getCurrentStep()

		if (this.state.step !== null && curStep !== this.state.step) {
			this.needsScrollToTopAndFocus = true
		}

		this.setState({
			step: curStep
		})
	}

	componentWillUnmount() {
		NavUtil.setContext('practice')
		Dispatcher.off('assessment:endAttempt', this.onEndAttempt)
		Dispatcher.off('assessment:attemptEnded', this.onAttemptEnded)
	}

	componentDidUpdate() {
		if (this.needsScrollToTopAndFocus) {
			delete this.needsScrollToTopAndFocus
			Dispatcher.trigger('viewer:scrollToTop')

			FocusUtil.focusOnNavTargetContent()
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
		return this.endAttempt()
	}

	endAttempt() {
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
			switch (this.getCurrentStep()) {
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
							ref="child"
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
