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

		// TODO: This is for debugging purposes and will come from the document in the future.
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

	getNumCorrect(questionScores) {
		return questionScores.reduce(
			function (acc, questionScore) {
				let n = 0
				if (parseInt(questionScore.score, 10) === 100) {
					n = 1
				}
				return parseInt(acc, 10) + n
			},
			[0]
		)
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

// TODO: These functions can be abstracted to other components/files as necessary.
const untestedView = assessment => {
	let child = assessment.props.model.children.at(0)
	let Component = child.getComponentClass()

	return (
		<div className="untested">
			<Component model={child} moduleData={assessment.props.moduleData} />
		</div>
	)
}

const assessmentReviewView = (assessment) => {
	const recentScore = AssessmentUtil.getLastAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const highestScore = AssessmentUtil.getHighestAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const attempts = AssessmentUtil.getAllAttempts(assessment.props.moduleData.assessmentState, assessment.props.model)

	return (
		<div className="score unlock">
			<h1>{`Your score is ${Math.round(recentScore)}%`}</h1>
			{recentScore === highestScore
				? <h2>This is your highest score</h2>
				: <h2>{`Your highest score was ${Math.round(highestScore)}%`}</h2>}
			{// TODO: Carousel could wrap the assessment attempts.
				attempts.map(attempt => {
					const scores = attempt.result.scores
					console.log(scores)

					// TODO: Return attempt with incorrect/correct answers.
					return <div>this is an attempt</div>
				})}
		</div>
	)
}

const takingTestView = assessment => {
	const moduleData = assessment.props.moduleData
	const recentScore = AssessmentUtil.getLastAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const child = assessment.props.model.children.at(1)
	const Component = child.getComponentClass()
	return (
		<div className="test">
			<Component
				className="untested"
				model={child}
				moduleData={moduleData}
				showScore={recentScore !== null}
			/>
			<div className="submit-button">
				<Button
					onClick={assessment.onClickSubmit.bind(assessment)}
					value={
						assessment.isAttemptComplete()
							? 'Submit'
							: 'Submit (Not all questions have been answered)'
					}
				/>
			</div>
		</div>
	)
}

const scoreSubmittedView = assessment => {
	const questionScores = AssessmentUtil.getLastAttemptScoresForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const recentScore = AssessmentUtil.getLastAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const highestScore = AssessmentUtil.getHighestAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const scoreAction = assessment.getScoreAction()
	const numCorrect = assessment.getNumCorrect(questionScores)

	let childEl

	if (scoreAction.page != null) {
		let pageModel = OboModel.create(scoreAction.page)
		pageModel.parent = assessment.props.model //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
		let PageComponent = pageModel.getComponentClass()
		childEl = <PageComponent model={pageModel} moduleData={assessment.props.moduleData} />
	} else {
		childEl = (
			<p>
				{scoreAction.message}
			</p>
		)
	}

	return (
		<div className="score unlock">
			<h1>{`Your score is ${Math.round(recentScore)}%`}</h1>
			{recentScore === highestScore
				? <h2>This is your highest score</h2>
				: <h2>{`Your highest score was ${Math.round(highestScore)}%`}</h2>}
			{childEl}
			<div className="review">
				<p className="number-correct">{`You got ${numCorrect} out of ${questionScores.length} questions correct:`}</p>
				{questionScores.map((questionScore, index) =>
					questionResultView(assessment.props, questionScore, index)
				)}
			</div>
		</div>
	)
}

const questionResultView = (props, questionScore, index) => {
	const questionModel = OboModel.models[questionScore.id]
	const QuestionComponent = questionModel.getComponentClass()

	return (
		<div key={index} className={questionScore.score === 100 ? 'is-correct' : 'is-not-correct'}>
			<p>{`Question ${index + 1} - ${questionScore.score === 100 ? 'Correct:' : 'Incorrect:'}`}</p>
			<QuestionComponent model={questionModel} moduleData={props.moduleData} showContentOnly />
		</div>
	)
}
