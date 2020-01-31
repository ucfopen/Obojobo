import './viewer-component.scss'

// import { CSSTransition } from 'react-transition-group'
import Common from 'obojobo-document-engine/src/scripts/common'
import MCAssessmentAnswerChoices from './mc-assessment-answer-choices'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import _ from 'underscore'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const { OboModel } = Common.models
const { OboComponent, OboQuestionAssessmentComponent } = Viewer.components
const { QuestionUtil } = Viewer.util

const PICK_ALL_INCORRECT_MESSAGE =
	'You have either missed some correct answers or selected some incorrect answers.'
const ANIMATION_TRANSITION_TIME_MS = 800

const FEEDBACK_LABELS_TO_SHOW = 'feedbackLabelsToShow'

const FOCUS_TARGET_EXPLANATION = 'explanation'
const FOCUS_TARGET_RESULTS = 'results'
const FOCUS_TARGET_QUESTION = 'question'

export default class MCAssessment extends OboQuestionAssessmentComponent {
	static getDetails(questionModel, questionAssessmentModel, score) {
		if (questionAssessmentModel.modelState.responseType === 'pick-all' && score !== 100) {
			return PICK_ALL_INCORRECT_MESSAGE
		}

		return null
	}

	constructor(props) {
		super(props)
		this.answerChoicesRef = React.createRef()

		// this.onClickShowExplanation = this.onClickShowExplanation.bind(this)
		// this.onClickHideExplanation = this.onClickHideExplanation.bind(this)
		// this.onClickReset = this.onClickReset.bind(this)
		// this.onFormChange = this.onFormChange.bind(this)
		// this.onFormSubmit = this.onFormSubmit.bind(this)
		// this.isShowingExplanation = this.isShowingExplanation.bind(this)

		this.sortIds()
	}

	getCorrectLabels(correctLabels, isReview, isSurvey, isAnswered) {
		if (correctLabels) {
			return correctLabels
		}

		return null
	}

	static getInstructions(questionModel, questionAssessmentModel) {
		const responseType = questionAssessmentModel.modelState.responseType
		const questionType = questionModel.modelState.type

		let instructions = ''

		if (questionType === 'survey') {
			switch (responseType) {
				case 'pick-one':
				case 'pick-one-multiple-correct':
					instructions = <span>Choose one</span>
					break
				case 'pick-all':
					instructions = <span>Choose one or more</span>
					break
			}
		} else {
			switch (responseType) {
				case 'pick-one':
					instructions = <span>Pick the correct answer</span>
					break
				case 'pick-one-multiple-correct':
					instructions = <span>Pick one of the correct answers</span>
					break
				case 'pick-all':
					instructions = (
						<span>
							Pick <b>all</b> of the correct answers
						</span>
					)
					break
			}
		}

		return (
			<React.Fragment>
				<span className="for-screen-reader-only">{`Multiple choice form with ${questionAssessmentModel.children.models.length} choices. `}</span>
				{instructions}
			</React.Fragment>
		)
	}

	getResponseData() {
		const questionResponse = this.props.response || { ids: [] }

		const correct = new Set()
		const responses = new Set()
		let childId

		for (const child of Array.from(this.props.model.children.models)) {
			childId = child.get('id')

			if (child.modelState.score === 100) {
				correct.add(childId)
			}

			if (questionResponse.ids.indexOf(childId) !== -1) {
				responses.add(childId)
			}
		}

		return {
			correct,
			responses
		}
	}

	calculateScore() {
		const responseData = this.getResponseData()
		const { correct } = responseData
		const { responses } = responseData

		switch (this.props.model.modelState.responseType) {
			case 'pick-all': {
				if (correct.size !== responses.size) {
					return 0
				}

				let score = 100
				correct.forEach(function(id) {
					if (!responses.has(id)) {
						score = 0
					}
				})

				return score
			}

			default: {
				// pick-one | pick-one-multiple-correct
				const correctArr = [...correct]

				for (const id of correctArr) {
					if (responses.has(id)) {
						return 100
					}
				}

				return 0
			}
		}
	}

	retry() {
		QuestionUtil.retryQuestion(
			this.props.questionModel.get('id'),
			this.props.moduleData.navState.context
		)
	}

	handleFormChange(event, prevResponse) {
		if (this.props.score !== null) {
			this.retry()
			prevResponse = { ids: [] }
		}

		const mcChoiceId = event.target.value
		let response

		switch (this.props.model.modelState.responseType) {
			case 'pick-all': {
				response = prevResponse || { ids: [] }
				const responseIndex = response.ids.indexOf(mcChoiceId)

				if (responseIndex === -1) {
					response.ids.push(mcChoiceId)
				} else {
					response.ids.splice(responseIndex, 1)
				}

				break
			}

			default:
				response = {
					ids: [mcChoiceId]
				}
				break
		}

		return {
			state: response,
			targetId: mcChoiceId
		}
	}

	// getScore() {
	// 	return QuestionUtil.getScoreForModel(
	// 		this.props.moduleData.questionState,
	// 		this.props.questionModel,
	// 		this.props.moduleData.navState.context
	// 	)
	// }

	componentDidUpdate() {
		this.sortIds()
	}

	//@TODO - Begin dev/9 stuff that I don't know if I need!!!!
	// getScore() {
	// 	return QuestionUtil.getScoreForModel(
	// 		this.props.moduleData.questionState,
	// 		this.getQuestionModel(),
	// 		this.props.moduleData.navState.context
	// 	)
	// }

	// getScoreClass() {
	// 	return QuestionUtil.getScoreClass(this.getScore())
	// }

	// getIsAnswered() {
	// 	return QuestionUtil.isAnswered(
	// 		this.props.moduleData.questionState,
	// 		this.getQuestionModel(),
	// 		this.props.moduleData.navState.context
	// 	)
	// }

	// componentDidUpdate() {
	// 	this.sortIds()

	// 	switch (this.nextFocus) {
	// 		case FOCUS_TARGET_EXPLANATION:
	// 			delete this.nextFocus
	// 			this.refExplanation.focusOnExplanation()
	// 			break

	// 		case FOCUS_TARGET_RESULTS:
	// 			if (this.getScore() !== null) {
	// 				delete this.nextFocus
	// 				this.answerChoicesRef.current.focusOnResults()
	// 			}
	// 			break

	// 		case FOCUS_TARGET_QUESTION:
	// 			delete this.nextFocus
	// 			FocusUtil.focusComponent(this.getQuestionModel().get('id'))
	// 			break
	// 	}
	// }

	// getFeedbackLabels(isReview, isSurvey, isAnswered) {
	// 	const { correctLabels, incorrectLabels } = this.props.model.modelState

	// 	return {
	// 		correct: this.getRandomItem(
	// 			this.getCorrectLabels(correctLabels, isReview, isSurvey, isAnswered)
	// 		),
	// 		incorrect: this.getRandomItem(this.getIncorrectLabels(incorrectLabels, isReview))
	// 	}
	// }

	// getRandomItem(arrayOfOptions) {
	// 	return arrayOfOptions[Math.floor(Math.random() * arrayOfOptions.length)]
	// }
	//@TODO - END dev/9 stuff that I'm not sure I need!

	sortIds() {
		if (!this.getSortedIds()) {
			let ids = this.props.model.children.models.map(model => model.get('id'))
			if (this.props.model.modelState.shuffle) ids = _.shuffle(ids)
			QuestionUtil.setData(
				this.props.model.get('id'),
				this.props.moduleData.navState.context,
				'sortedIds',
				ids
			)
		}
	}

	getSortedIds() {
		return QuestionUtil.getData(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context,
			'sortedIds'
		)
	}

	getSortedChoiceModels() {
		const sortedIds = this.getSortedIds()
		if (!sortedIds) return []

		return sortedIds
			.map(mcChoiceId => OboModel.models[mcChoiceId])
			.filter(model => model.get('type') === 'ObojoboDraft.Chunks.MCAssessment.MCChoice')
	}

	render() {
		const responseType = this.props.model.modelState.responseType
		const score = this.props.score
		const scoreClass = this.props.scoreClass
		const sortedChoiceModels = this.getSortedChoiceModels()
		const isAnswered = this.props.isAnswered

		const className =
			'obojobo-draft--chunks--mc-assessment' +
			` is-response-type-${this.props.model.modelState.responseType}` +
			` is-mode-${this.props.mode}` +
			` is-type-${this.props.type}` +
			isOrNot(isAnswered, 'answered') +
			` ${scoreClass}` +
			// isOrNot(isShowingExplanationValue, 'showing-explanation') +
			isOrNot(score !== null, 'scored')

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={className}
			>
				<MCAssessmentAnswerChoices
					ref={this.answerChoicesRef}
					models={sortedChoiceModels}
					questionModel={this.props.questionModel}
					responseType={responseType}
					score={score}
					mode={this.props.mode}
					isAnswerRevealed={this.props.isAnswerRevealed}
					type={this.props.type}
					moduleData={this.props.moduleData}
					feedbackText={this.props.feedbackText}
				/>
			</OboComponent>
		)
	}
}
