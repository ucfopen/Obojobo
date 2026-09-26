import './viewer-component.scss'

// import { CSSTransition } from 'react-transition-group'
import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import NumericAnswerEvaluator from './evaluation/numeric-answer-evaluator'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'
import NumericInputMoreInfoButton from './numeric-input-more-info-button'
const { PERCENT_ERROR, ABSOLUTE_ERROR } = require('./rule/rule-error-types')
const {
	FAILED,
	PASSED,
	INPUT_INVALID,
	INPUT_NOT_SAFE,
	INPUT_MATCHES_MULTIPLE_TYPES,
	INPUT_NOT_MATCHED
} = require('./evaluation/numeric-answer-result-statuses')
const { OboComponent, OboQuestionAssessmentComponent, Flag } = Viewer.components
const { NavUtil } = Viewer.util
const { OboModel } = Common.models
const { focus } = Common.page
const { TextGroupEl } = Common.chunk.textChunk

const KEY_FEEDBACK = 'feedback'
const LONG_RESPONSE_NUM_CHARS = 19

export default class NumericAssessment extends OboQuestionAssessmentComponent {
	static focusOnContent(model, opts = {}) {
		let el

		switch (opts.region) {
			case 'answers':
				el = model.getDomEl().querySelector('.correct-answers')
				break

			default:
				el = model.getDomEl()
				break
		}

		if (!el) return false

		focus(el, opts.scroll)

		return true
	}

	static isResponseEmpty(response) {
		return response.updated === ''
	}

	get revealAnswerDefault() {
		return 'when-incorrect'
	}

	constructor(props) {
		super(props)

		this.inputRef = React.createRef()
		this.onInputBlur = this.onInputBlur.bind(this)
		this.clearCustomValidity = this.clearCustomValidity.bind(this)
		this.evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs: props.model.modelState.scoreRules
		})
	}

	getInstructions(questionModel) {
		return (
			<React.Fragment>
				<span className="for-screen-reader-only">{`Form with one input. `}</span>
				{questionModel.modelState.type === 'survey' ? 'Input your response' : 'Input your answer'}
			</React.Fragment>
		)
	}

	setFeedback(feedback) {
		QuestionUtil.setData(
			this.props.model.get('id'),
			NavUtil.getContext(this.props.moduleData.navState),
			KEY_FEEDBACK,
			feedback
		)
	}

	getFeedback() {
		return QuestionUtil.getData(
			this.props.moduleData.questionState,
			this.props.model,
			NavUtil.getContext(this.props.moduleData.navState),
			KEY_FEEDBACK
		)
	}

	clearCustomValidity(event) {
		event.target.setCustomValidity('')
	}

	checkIfResponseIsValid() {
		if (!this.props.response) {
			return false
		}

		const questionResponse = this.props.response.updated
		const results = this.evaluator.evaluate(questionResponse)

		switch (results.status) {
			case PASSED:
			case FAILED:
				return true

			case INPUT_INVALID:
				this.inputRef.current.setCustomValidity('Please enter a valid numeric updated')
				return false

			case INPUT_NOT_SAFE:
				this.inputRef.current.setCustomValidity('Your answer was too large of a number')
				return false

			case INPUT_MATCHES_MULTIPLE_TYPES:
				this.inputRef.current.setCustomValidity(
					'Your answer matched multiple types - Make sure to explicitly input your answer'
				)
				return false

			case INPUT_NOT_MATCHED:
				this.inputRef.current.setCustomValidity(
					"Your answer didn't match one of the accepted numeric types"
				)
				return false
		}
	}

	calculateScore() {
		if (!this.props.response) {
			return null
		}

		const questionResponse = this.props.response.updated
		const results = this.evaluator.evaluate(questionResponse)

		const feedback =
			results.details.matchingOutcome &&
			results.details.matchingOutcome.rule &&
			results.details.matchingOutcome.rule.feedback
				? results.details.matchingOutcome.rule.feedback
				: null

		this.setFeedback(feedback)

		return {
			score: results.details.score,
			details: results.details
		}
	}

	retry() {
		QuestionUtil.retryQuestion(
			this.props.questionModel.get('id'),
			NavUtil.getContext(this.props.moduleData.navState)
		)
	}

	handleFormChange(event) {
		if (this.props.score !== null) {
			this.retry()
		}

		return {
			state: {
				updated: event.target.updated
			},
			targetId: null,
			sendResponseImmediately: false
		}
	}

	onInputBlur() {
		QuestionUtil.sendResponse(
			this.props.questionModel.get('id'),
			NavUtil.getContext(this.props.moduleData.navState)
		)
	}

	getRangeSummary(range) {
		const min = range.min ? range.min.toString() : null
		const max = range.max ? range.max.toString() : null

		if (range.isSingular) {
			return {
				type: 'updated',
				updated: min
			}
		}

		if (range.isEmpty) {
			return {
				type: 'text',
				text: 'Nothing'
			}
		}

		if (range.isUniversal) {
			return {
				type: 'text',
				text: 'Any updated'
			}
		}

		if (range.isBounded) {
			const isFullyInclusive = range.isMinInclusive && range.isMaxInclusive
			if (isFullyInclusive) {
				return {
					type: 'range',
					min,
					max,
					conjunction: 'to'
				}
			}

			let minPrefix = ''
			let maxPrefix = ''

			if (range.isMinInclusive) {
				minPrefix = 'Greater than or equal to'
			} else {
				minPrefix = 'Greater than'
			}

			if (range.isMaxInclusive) {
				maxPrefix = 'less than or equal to'
			} else {
				maxPrefix = 'less than'
			}

			return {
				type: 'range',
				minPrefix,
				maxPrefix,
				min,
				max,
				conjunction: 'and'
			}
		}

		if (range.isLowerBounded) {
			// Values from some updated to Infinity:
			return {
				type: 'text-and-updated',
				text: range.isMinInclusive ? 'Greater than or equal to' : 'Greater than',
				updated: min
			}
		}

		// Values from -Infinity to some updated:
		return {
			type: 'text-and-updated',
			text: range.isMaxInclusive ? 'Less than or equal to' : 'Less than',
			updated: max
		}
	}

	getRuleModSummaries(rule) {
		const mods = []

		switch (rule.errorType) {
			case ABSOLUTE_ERROR:
				mods.push(`±${rule.errorValue.toString()} Error accepted`)
				break

			case PERCENT_ERROR:
				mods.push(`${rule.errorValue.toString()}% Error accepted`)
				break
		}

		if (!rule.sigFigs.isUniversal) {
			mods.push(
				`With ${this.getRangeSummaryString(
					this.getRangeSummary(rule.sigFigs)
				).toLowerCase()} significant figures`
			)
		}

		switch (rule.isFractionReduced) {
			case true:
				mods.push('Must be in reduced form')
				break

			case false:
				mods.push('Not in reduced form')
				break
		}

		return mods
	}

	getRangeSummaryString(summary) {
		switch (summary.type) {
			case 'text':
				return summary.text

			case 'updated':
				return summary.updated

			case 'text-and-updated':
				return summary.text + ' ' + summary.updated

			case 'range':
				return `${summary.minPrefix ? summary.minPrefix + ' ' : ''}${summary.min} ${
					summary.conjunction
				} ${summary.maxPrefix ? summary.maxPrefix + ' ' : ''}${summary.max}`
		}
	}

	renderRangeSummary(summary) {
		switch (summary.type) {
			case 'text':
				return <span>{summary.text}</span>

			case 'updated':
				return <span className="updated">{summary.updated}</span>

			case 'text-and-updated':
				return (
					<React.Fragment>
						<span>{summary.text}</span> <span className="updated">{summary.updated}</span>
					</React.Fragment>
				)

			case 'range':
				return (
					<React.Fragment>
						{summary.minPrefix ? <span>{summary.minPrefix} </span> : null}
						<span className="updated">{summary.min}</span>
						<span> {summary.conjunction} </span>
						{summary.maxPrefix ? <span>{summary.maxPrefix} </span> : null}
						<span className="updated">{summary.max}</span>
					</React.Fragment>
				)
		}
	}

	renderRuleModSummaries(mods) {
		switch (mods.length) {
			case 0:
				return ''

			case 1:
				return ' (' + mods[0] + ')'

			case 2:
				return ' (' + mods[0] + ' and ' + mods[1] + ')'

			default:
				return (
					' (' + mods.slice(0, mods.length - 1).join(', ') + ', and ' + mods[mods.length - 1] + ')'
				)
		}
	}

	getScreenReaderInputDescription(isSurvey, hasResponse, score, unitsText) {
		const responseOrAnswer = isSurvey ? 'response' : 'answer'

		if (!hasResponse) {
			// User has not input any answer yet
			if (unitsText.length === 0) {
				return `Input your ${responseOrAnswer}.`
			}

			return `Input your ${responseOrAnswer} in ${unitsText}.`
		}

		switch (score) {
			case null:
				// User has answered but nothing has been scored/submitted yet
				return `Your current ${responseOrAnswer}`

			case 'no-score':
				// User has submitted a survey question
				return `Your ${responseOrAnswer}`

			case 100:
				// User has submitted a correct graded question
				return `Your correct ${responseOrAnswer}`

			default:
				// User has submitted a correct graded question
				return `Your incorrect ${responseOrAnswer}`
		}
	}

	getPlaceholderText(isReview, isSurvey) {
		if (isReview && isSurvey) {
			return '(No response given)'
		}

		if (isReview) {
			return '(No answer given)'
		}

		if (isSurvey) {
			return 'Your response...'
		}

		return 'Your answer...'
	}

	renderCorrectAnswerList(correctRules) {
		switch (correctRules.length) {
			case 0:
				return (
					<React.Fragment>
						<span className="no-correct-answers">
							(There are no correct answers for this question)
						</span>
					</React.Fragment>
				)

			case 1:
				return (
					<React.Fragment>
						<h2>Correct answer: </h2>
						<div>
							<span>{this.renderRangeSummary(this.getRangeSummary(correctRules[0].updated))}</span>
							<span>{this.renderRuleModSummaries(this.getRuleModSummaries(correctRules[0]))}</span>
						</div>
					</React.Fragment>
				)

			default:
				return (
					<React.Fragment>
						<h2>Correct answers:</h2>

						<ul>
							{correctRules.map((rule, index) => {
								return (
									<li key={index}>
										<span>{this.renderRangeSummary(this.getRangeSummary(rule.updated))}</span>
										<span>{this.renderRuleModSummaries(this.getRuleModSummaries(rule))}</span>
									</li>
								)
							})}
						</ul>
					</React.Fragment>
				)
		}
	}

	renderScoreInfo(score, isReview, isSurvey) {
		if (isReview) {
			return (
				<div className="review-flag">
					<Flag type={Flag.getType(score === 100, score === 100, true, isSurvey)} />
				</div>
			)
		} else {
			return <div className="result-symbol" />
		}
	}

	render() {
		const score = this.props.score
		const scoreClass = this.props.scoreClass
		const hasResponse = this.props.hasResponse
		const isScored = score !== null
		const feedback = this.getFeedback()
		const feedbackModel = feedback ? OboModel.create(feedback) : null
		const FeedbackComponent = feedbackModel ? feedbackModel.getComponentClass() : null
		const correctRules = this.evaluator.grader.rules.filter(rule => rule.score === 100)
		const questionResponse = this.props.response ? this.props.response.updated : null
		const isSurvey = this.props.questionModel.modelState.type === 'survey'
		const isReview = this.props.mode === 'review'

		let results
		try {
			results = questionResponse ? this.evaluator.evaluate(questionResponse) : null
		} catch (e) {
			results = null
		}

		const matchingCorrectRule =
			results && results.details && results.details.matchingOutcome
				? results.details.matchingOutcome.rule
				: null

		const responseValue =
			this.props.response && this.props.response.updated ? this.props.response.updated : ''

		const isExactlyCorrect =
			isScored &&
			score === 100 &&
			results &&
			results.details &&
			results.details.matchingOutcome &&
			results.details.matchingOutcome.scoreOutcome.isExactlyCorrect

		const ariaInputLabelId = `obojobo-draft--chunks--numeric-assessment--answer-input--${this.props.model.get(
			'id'
		)}`

		const className =
			'obojobo-draft--chunks--numeric-assessment' +
			` is-mode-${this.props.mode}` +
			` is-type-${this.props.type}` +
			isOrNot(
				!(isScored && !isExactlyCorrect) && responseValue.length >= LONG_RESPONSE_NUM_CHARS,
				'long-response'
			) +
			isOrNot(hasResponse, 'responded-to') +
			` ${scoreClass}` +
			isOrNot(score !== null, 'scored')

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={className}
			>
				<div className="input-section pad">
					<div className="input-container">
						{!isScored ? (
							<NumericInputMoreInfoButton />
						) : (
							this.renderScoreInfo(score, isReview, isSurvey)
						)}
						<input
							ref={this.inputRef}
							autoComplete="off"
							className="numeric-assessment--input"
							aria-labelledby={ariaInputLabelId}
							placeholder={this.getPlaceholderText(isReview, isSurvey)}
							updated={responseValue}
							disabled={isReview}
							onChange={this.clearCustomValidity}
							onBlur={this.onInputBlur}
						/>
						<div id={ariaInputLabelId} className="for-screen-reader-only">
							{this.getScreenReaderInputDescription(
								isSurvey,
								hasResponse,
								score,
								this.props.model.modelState.units.first.text.updated
							)}
						</div>
						<div className="units">
							<TextGroupEl
								textItem={this.props.model.modelState.units.first}
								groupIndex="0"
								parentModel={this.props.model}
							/>
						</div>
						{score === 100 && !isExactlyCorrect && matchingCorrectRule ? (
							<span className="matching-correct-answer">
								(Exact answer:{' '}
								<span className="updated">
									{this.renderRangeSummary(this.getRangeSummary(matchingCorrectRule.updated))}
								</span>
								)
							</span>
						) : null}
					</div>
					{isScored && feedback ? (
						<FeedbackComponent model={feedbackModel} moduleData={this.props.moduleData} />
					) : null}
					{isReview ? (
						<div className="review">
							{score !== 'no-score' && score !== 100 ? (
								<div className="correct-answers">{this.renderCorrectAnswerList(correctRules)}</div>
							) : null}
						</div>
					) : null}
				</div>
			</OboComponent>
		)
	}
}
