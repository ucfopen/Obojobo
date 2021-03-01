import './viewer-component.scss'

import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import { getLabel } from './feedback-labels'
import QuestionContent from './Content/viewer-component'
import QuestionComponent from './question-component'

const { OboComponent, OboQuestionComponent } = Viewer.components
const { FocusUtil, QuestionUtil, NavUtil } = Viewer.util
const { Throbber } = Common.components
const { focus } = Common.page
const { QuestionResponseSendStates } = Viewer.stores.questionStore

// 0.4s Card "flip" time plus an extra 50ms to handle delay
const DURATION_FLIP_TIME_MS = 450

const FOCUS_TARGET_EXPLANATION = 'explanation'
const FOCUS_TARGET_RESULTS = 'results'
const FOCUS_TARGET_QUESTION = 'question'
const FOCUS_TARGET_ANSWERS = 'answers'

export default class Question extends OboQuestionComponent {
	constructor() {
		super()

		this.state = {
			isFlipping: false
		}

		this.assessmentComponentRef = React.createRef()
		this.resultsRef = React.createRef()
		this.explanationRef = React.createRef()

		this.onClickBlocker = this.onClickBlocker.bind(this)
		this.onClickReset = this.onClickReset.bind(this)
		this.onClickReveal = this.onClickReveal.bind(this)
		this.onFormSubmit = this.onFormSubmit.bind(this)
		this.onFormChange = this.onFormChange.bind(this)
		this.onClickShowExplanation = this.onClickShowExplanation.bind(this)
		this.onClickHideExplanation = this.onClickHideExplanation.bind(this)
		this.isShowingExplanation = this.isShowingExplanation.bind(this)
		this.getInstructions = this.getInstructions.bind(this)
	}

	static getQuestionAssessmentModel(questionModel) {
		return questionModel.children.at(questionModel.children.models.length - 1)
	}

	static focusOnContent(model, opts = { preventScroll: false }) {
		const el = model.getDomEl()

		if (!el) return false

		const isHidden = el.classList.contains('is-hidden')
		let focusableEl = null

		// If question is hidden then we focus on the button to "flip" the question over.
		// Otherwise, focus on the first thing inside the question:
		if (isHidden) {
			focusableEl = el.querySelector('.blocker-front button')
		} else {
			const firstModel = model.children.at(0)
			if (firstModel) focusableEl = firstModel.getDomEl()
		}

		if (!focusableEl) return false

		focus(focusableEl, opts.preventScroll)
		return true
	}

	onFormChange(event) {
		if (this.props.isReview) return

		const prevResponse = QuestionUtil.getResponse(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)

		const response = this.assessmentComponentRef.current.handleFormChange(event, prevResponse)

		QuestionUtil.setResponse(
			this.props.model.get('id'),
			response.state,
			response.targetId,
			this.props.moduleData.navState.context,
			this.props.moduleData.navState.context.split(':')[1],
			this.props.moduleData.navState.context.split(':')[2],
			response.sendResponseImmediately
		)

		this.nextFocus = FOCUS_TARGET_RESULTS
	}

	onFormSubmit(event) {
		event.preventDefault()

		if (this.getMode() !== 'practice') {
			return
		}

		this.submitResponse()

		event.target.reset()
	}

	submitResponse() {
		const model = this.props.model
		const id = model.get('id')
		const modelState = model.modelState
		const context = this.props.moduleData.navState.context
		const isSurvey = modelState.type === 'survey'

		this.scoreResponse()

		if (isSurvey) {
			QuestionUtil.submitResponse(id, context)
		} else {
			QuestionUtil.checkAnswer(id, context)
		}
	}

	scoreResponse() {
		if (this.props.isReview) return

		const model = this.props.model
		const id = model.get('id')
		const modelState = model.modelState
		const context = this.props.moduleData.navState.context
		const isSurvey = modelState.type === 'survey'

		const calculatedScoreResponse = isSurvey
			? { score: 'no-score', details: null }
			: this.assessmentComponentRef.current.calculateScore()
		const detailedText =
			this.assessmentComponentRef.current.getDetails(calculatedScoreResponse.score) || null

		const feedbackText = getLabel(
			modelState.correctLabels,
			modelState.incorrectLabel,
			calculatedScoreResponse.score,
			this.props.mode === 'review',
			isSurvey,
			true
		)

		QuestionUtil.setScore(
			id,
			calculatedScoreResponse.score,
			calculatedScoreResponse.details,
			feedbackText,
			detailedText,
			context
		)
	}

	onClickReset(event) {
		event.preventDefault()

		this.nextFocus = FOCUS_TARGET_QUESTION

		this.retry()
	}

	onClickReveal(event) {
		event.preventDefault()

		if (
			QuestionUtil.hasUnscoredResponse(
				this.props.moduleData.questionState,
				this.props.model,
				this.props.moduleData.navState.context
			)
		) {
			this.scoreResponse()
		}

		this.reveal()

		this.nextFocus = FOCUS_TARGET_ANSWERS
	}

	retry() {
		QuestionUtil.retryQuestion(this.props.model.get('id'), this.props.moduleData.navState.context)
	}

	reveal() {
		QuestionUtil.revealAnswer(this.props.model.get('id'), this.props.moduleData.navState.context)
	}

	onClickBlocker() {
		const context = NavUtil.getContext(this.props.moduleData.navState)

		QuestionUtil.viewQuestion(this.props.model.get('id'), context)

		FocusUtil.focusComponent(this.props.model.get('id'), { fade: context === 'practice' })

		this.applyFlipCSS()
	}

	// Temporarily set the state to 'isFlipping', causing the card to play the flip animation.
	// The flipping state is removed after the flip is completed to be able to remove CSS
	// transforms, which can cause rendering issues.
	applyFlipCSS() {
		this.setState({ isFlipping: true })
		setTimeout(() => this.setState({ isFlipping: false }), DURATION_FLIP_TIME_MS)
	}

	getMode() {
		if (
			QuestionUtil.isAnswerRevealed(
				this.props.moduleData.questionState,
				this.props.model,
				this.props.moduleData.navState.context
			)
		) {
			return 'review'
		}

		const baseContext = this.props.moduleData.navState.context.split(':')[0]

		switch (baseContext) {
			case 'practice':
				return 'practice'

			case 'assessment':
				return 'assessment'

			case 'assessmentReview':
				return 'review'
		}

		return null
	}

	getScore() {
		return QuestionUtil.getScoreForModel(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
	}

	isShowingExplanationButton() {
		const isAnswerScored = this.getScore() !== null
		const hasSolution = this.props.model.modelState.solution !== null
		const isSurvey = this.props.type === 'survey'

		return isAnswerScored && hasSolution && !isSurvey
	}

	isShowingExplanation() {
		return QuestionUtil.isShowingExplanation(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
	}

	onClickShowExplanation(event) {
		event.preventDefault()

		this.nextFocus = FOCUS_TARGET_EXPLANATION

		QuestionUtil.showExplanation(this.props.model.get('id'), this.props.moduleData.navState.context)
	}

	hideExplanation() {
		QuestionUtil.hideExplanation(
			this.props.model.get('id'),
			this.props.moduleData.navState.context,
			'user'
		)
	}

	onClickHideExplanation(event) {
		event.preventDefault()

		this.hideExplanation()
	}

	getFeedbackText() {
		const feedbackText = QuestionUtil.getFeedbackTextForModel(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
		if (feedbackText) return feedbackText

		return getLabel(
			this.props.model.modelState.correctLabels,
			this.props.model.modelState.incorrectLabels,
			this.getScore(),
			this.getMode() === 'review',
			this.props.moduleData.type === 'survey',
			this.getResponse() !== null
		)
	}

	getInstructions() {
		if (!this.assessmentComponentRef || !this.assessmentComponentRef.current) return null
		return this.assessmentComponentRef.current.getInstructions()
	}

	getShouldShowRevealAnswerButton() {
		const mode = this.getMode()
		const type = this.props.model.modelState.type
		const questionAssessmentModel = this.constructor.getQuestionAssessmentModel(this.props.model)
		const score = this.getScore()

		let revealAnswerMode = this.props.model.modelState.revealAnswer

		// If we don't have a reference yet to the assessment component then abort
		if (!this.assessmentComponentRef || !this.assessmentComponentRef.current) return false

		// Should never show the Reveal Answer button on survey questions or outside of practice
		if (mode !== 'practice' || type !== 'default') {
			return false
		}

		// If the mode is 'default' then we ask the assessment component what to do:
		if (revealAnswerMode === 'default') {
			revealAnswerMode = this.assessmentComponentRef.current.getRevealAnswerDefault(
				this.props.model,
				questionAssessmentModel
			)
		}

		switch (revealAnswerMode) {
			case 'always':
				// Show when the question is unanswered or incorrect:
				return score !== 100

			case 'when-incorrect':
				// Show when the question has been answered incorrectly:
				return score !== null && score < 100

			case 'never':
			default:
				return false
		}
	}

	renderResponseSendState(responseSendState) {
		switch (responseSendState) {
			case QuestionResponseSendStates.NOT_SENT:
				return <span className="is-response-state-not-sent">&nbsp;</span>

			case QuestionResponseSendStates.SENDING:
				return (
					<span className="is-response-state-sending">
						<Throbber />
					</span>
				)

			case QuestionResponseSendStates.RECORDED:
				return <span className="is-response-state-recorded">Answer Saved</span>

			case QuestionResponseSendStates.ERROR:
				return <span className="is-response-state-error">✖ Error sending response, try again</span>

			case null:
			default:
				return <span className="is-response-state-other">&nbsp;</span>
		}
	}

	getScoreClass(score) {
		switch (score) {
			case null:
				return 'is-not-scored'

			case 'no-score':
				return 'is-no-score'

			case 100:
				return 'is-correct'

			default:
				return 'is-not-correct'
		}
	}

	getViewState() {
		switch (this.getMode()) {
			case 'review':
				return 'active'

			default:
				return QuestionUtil.getViewState(
					this.props.moduleData.questionState,
					this.props.model,
					this.props.moduleData.navState.context
				)
		}
	}

	getResponse() {
		return QuestionUtil.getResponse(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
	}

	isAnswerRevealed() {
		return QuestionUtil.isAnswerRevealed(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
	}

	getDetailedText() {
		return QuestionUtil.getDetailedTextForModel(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
	}

	getResponseSendState() {
		return QuestionUtil.getResponseSendState(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
	}

	componentDidUpdate() {
		switch (this.nextFocus) {
			case FOCUS_TARGET_EXPLANATION:
				delete this.nextFocus
				this.explanationRef.focusOnExplanation()
				break

			case FOCUS_TARGET_RESULTS:
				if (this.getScore() !== null) {
					delete this.nextFocus
					focus(this.resultsRef.current, false)
				}
				break

			case FOCUS_TARGET_QUESTION:
				delete this.nextFocus
				FocusUtil.focusComponent(this.props.model.get('id'), { preventScroll: true })
				break

			case FOCUS_TARGET_ANSWERS:
				delete this.nextFocus
				FocusUtil.focusComponent(
					this.constructor.getQuestionAssessmentModel(this.props.model).get('id'),
					{ preventScroll: true, region: 'answers' }
				)
				break
		}
	}

	render() {
		if (this.props.showContentOnly) {
			return this.renderContentOnly()
		}
		const questionModel = this.props.model
		const questionAssessmentModel = this.constructor.getQuestionAssessmentModel(questionModel)
		const moduleData = this.props.moduleData
		const type = questionModel.modelState.type
		const score = this.getScore()
		const mode = this.getMode()
		const startQuestionAriaLabel =
			mode === 'practice'
				? 'Try Question'
				: 'Start Question ' +
				  (this.props.questionIndex + 1) +
				  ' of ' +
				  this.props.numQuestionsInBank

		return (
			<QuestionComponent
				updateExplanationRef={component => {
					this.explanationRef = component
				}}
				questionModel={questionModel}
				questionAssessmentModel={questionAssessmentModel}
				moduleData={moduleData}
				resultsRef={this.resultsRef}
				assessmentComponentRef={this.assessmentComponentRef}
				type={type}
				mode={mode}
				viewState={this.getViewState()}
				response={this.getResponse()}
				score={score}
				startQuestionAriaLabel={startQuestionAriaLabel}
				isFlipping={this.state.isFlipping}
				shouldShowRevealAnswerButton={this.getShouldShowRevealAnswerButton()}
				isAnswerRevealed={this.isAnswerRevealed()}
				isShowingExplanation={this.isShowingExplanation()}
				isShowingExplanationButton={this.isShowingExplanationButton()}
				instructions={this.getInstructions()}
				scoreClass={this.getScoreClass(score)}
				feedbackText={this.getFeedbackText()}
				detailedText={this.getDetailedText()}
				responseSendState={this.getResponseSendState()}
				onFormChange={this.onFormChange}
				onFormSubmit={this.onFormSubmit}
				onClickReset={this.onClickReset}
				onClickReveal={this.onClickReveal}
				onClickShowExplanation={this.onClickShowExplanation}
				onClickHideExplanation={this.onClickHideExplanation}
				onClickBlocker={this.onClickBlocker}
			/>
		)
	}

	renderContentOnly() {
		const score = this.getScore()
		const scoreClass = this.getScoreClass(score)
		const response = QuestionUtil.getResponse(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
		const mode = this.getMode()
		const type = this.props.model.modelState.type

		const className =
			'obojobo-draft--chunks--question' +
			` ${scoreClass}` +
			' is-active' +
			` is-mode-${mode}` +
			` is-type-${type}` +
			isOrNot(response, 'answered')

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={className}
				tabIndex="-1"
				role="region"
				aria-label="Question"
			>
				<div className="flipper">
					<div className="content-back">
						<QuestionContent model={this.props.model} moduleData={this.props.moduleData} />
						<div className="pad responses-hidden">(Responses Hidden)</div>
					</div>
				</div>
			</OboComponent>
		)
	}
}
