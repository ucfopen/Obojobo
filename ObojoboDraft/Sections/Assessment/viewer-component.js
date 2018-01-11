import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { OboModel } = Common.models
let { Button } = Common.components
let { Dispatcher } = Common.flux
let { ModalUtil } = Common.util

let { ScoreStore } = Viewer.stores
let { AssessmentUtil } = Viewer.util
let { NavUtil } = Viewer.util

import AttemptIncompleteDialog from './attempt-incomplete-dialog'
import untestedView from './viewer-component-untested'
import assessmentReviewView from './viewer-component-review'
import scoreSubmittedView from './viewer-component-score-submitted'
import takingTestView from './viewer-component-taking-test'

export default class Assessment extends React.Component {
	constructor() {
		super()

		this.state = { step: null }
	}

	getCurrentStep() {
		const assessment = AssessmentUtil.getAssessmentForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		if (assessment === null) {
			return 'untested'
		}
		if (assessment.current !== null) {
			return 'takingTest'
		}

		// TODO: Assessment review
		this.props.model.modelState.assessmentReview = true
		if (
			!AssessmentUtil.hasAttemptsRemaining(
				this.props.moduleData.assessmentState,
				this.props.model
			) && this.props.model.modelState.assessmentReview
		) {
			return 'review'
		}

		if (assessment.attempts.length > 0) {
			return 'scoreSubmitted'
		}
		return 'untested'
	}

	componentWillReceiveProps(nextProps) {
		let curStep = this.getCurrentStep()
		if (curStep !== this.state.step) {
			this.needsScroll = true
		}

		return this.setState({ step: curStep })
	}

	componentDidUpdate() {
		if (this.needsScroll) {
			delete this.needsScroll
			return Dispatcher.trigger('viewer:scrollToTop')
		}
	}

	isAttemptComplete() {
		return true
		//@TODO: isCurrentAttemptComplete not functional, returning true which was the status quo for the pilot
		// return AssessmentUtil.isCurrentAttemptComplete(this.props.moduleData.assessmentState, this.props.moduleData.questionState, this.props.model);
	}

	isAssessmentComplete() {
		return !AssessmentUtil.hasAttemptsRemaining(this.props.moduleData.assessmentState, this.props.model)
	}

	onClickSubmit() {
		if (!this.isAttemptComplete()) {
			ModalUtil.show(<AttemptIncompleteDialog onSubmit={this.endAttempt} />)
			return
		}

		return this.endAttempt()
	}

	endAttempt() {
		return AssessmentUtil.endAttempt(this.props.model)
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
		let highestScore = AssessmentUtil.getHighestAttemptScoreForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)
		let scoreAction = this.props.model.modelState.scoreActions.getActionForScore(highestScore)
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
		// DEBUG
		// alert(@state.step+ ','+ @getCurrentStep())

		const childEl = (() => {
			switch (this.getCurrentStep()) {
				case 'untested':
					return untestedView(this)

				case 'takingTest':
					return takingTestView(this)

				case 'scoreSubmitted':
					return scoreSubmittedView(this)

				case 'review':
					return assessmentReviewView(this)
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
