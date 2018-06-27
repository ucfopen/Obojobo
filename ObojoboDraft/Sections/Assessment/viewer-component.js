import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { OboModel } = Common.models
let { Button } = Common.components
let { Dispatcher } = Common.flux
let { ModalUtil } = Common.util

let { AssessmentUtil } = Viewer.util
let { NavUtil } = Viewer.util

import AttemptIncompleteDialog from './components/attempt-incomplete-dialog'

import PreTest from './components/pre-test'
import Test from './components/test'
import PostTest from './components/post-test'

export default class Assessment extends React.Component {
	constructor() {
		super()
		this.state = {
			isFetching: false,
			step: null
		}

		// pre-bind scopes to this object once
		this.onEndAttempt = this.onEndAttempt.bind(this)
		this.onAttemptEnded = this.onAttemptEnded.bind(this)
		this.endAttempt = this.endAttempt.bind(this)
		this.onClickSubmit = this.onClickSubmit.bind(this)
	}

	getCurrentStep() {
		const assessment = AssessmentUtil.getAssessmentForModel(
			this.props.moduleData.assessmentState,
			this.props.model
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

	componentWillReceiveProps(nextProps) {
		let curStep = this.getCurrentStep()
		if (curStep !== this.state.step) {
			this.needsScroll = true
		}

		this.setState({
			step: curStep
		})
	}
	componentWillMount() {
		Dispatcher.on('assessment:endAttempt', this.onEndAttempt)
		Dispatcher.on('assessment:attemptEnded', this.onAttemptEnded)
	}

	componentWillUnmount() {
		NavUtil.setContext('practice')
		Dispatcher.off('assessment:endAttempt', this.onEndAttempt)
		Dispatcher.off('assessment:attemptEnded', this.onAttemptEnded)
	}

	componentDidUpdate() {
		if (this.needsScroll) {
			delete this.needsScroll
			return Dispatcher.trigger('viewer:scrollToTop')
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
		return AssessmentUtil.endAttempt(this.props.model, this.props.moduleData.navState.context)
	}

	exitAssessment() {
		let scoreAction = this.getScoreAction()

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
		let assessmentScore = AssessmentUtil.getAssessmentScoreForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)
		let scoreAction = this.props.model.modelState.scoreActions.getActionForScore(assessmentScore)

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
		let assessmentScore = AssessmentUtil.getAssessmentScoreForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)
		let ltiState = AssessmentUtil.getLTIStateForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		const childEl = (() => {
			switch (this.getCurrentStep()) {
				case 'pre-test':
					return PreTest({
						model: this.props.model.children.at(0),
						moduleData: this.props.moduleData
					})

				case 'test':
					return Test({
						model: this.props.model.children.at(1),
						moduleData: this.props.moduleData,
						onClickSubmit: this.onClickSubmit,
						isAttemptComplete: this.isAttemptComplete(),
						isFetching: this.state.isFetching
					})

				case 'post-test':
					return PostTest({
						model: this.props.model,
						moduleData: this.props.moduleData,
						scoreAction: this.getScoreAction()
					})
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
