import './viewer-component.scss'

// import { CSSTransition } from 'react-transition-group'
import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import _ from 'underscore'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import NumericAnswerEvaluator from './evaluation/numeric-answer-evaluator'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'

const { OboComponent, OboQuestionAssessmentComponent, Flag } = Viewer.components
const { NavUtil } = Viewer.util
const { OboModel } = Common.models

const KEY_FEEDBACK = 'feedback'
const LONG_RESPONSE_NUM_CHARS = 19

export default class NumericAssessment extends OboQuestionAssessmentComponent {
	constructor(props) {
		super(props)

		// this.matchMedia = window.matchMedia('(max-width: 980px)')
		// this.onMatchMediaChanged = this.onMatchMediaChanged.bind(this)
		// this.matchMedia.addListener(this.onMatchMediaChanged)

		this.evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs: props.model.modelState.scoreRules
		})

		// debugger

		// this.onInputChange = this.onInputChange.bind(this)

		// this.state = {
		// 	feedback: null
		// }

		// this.state = {
		// 	isScreenLte980Px: false
		// }
	}

	// componentDidMount() {
	// 	this.setState({
	// 		isScreenLte980Px: this.matchMedia.matches
	// 	})
	// }

	// componentWillUnmount() {
	// 	this.matchMedia.removeListener(this.onMatchMediaChanged)
	// }

	// onMatchMediaChanged() {
	// 	this.setState({
	// 		isScreenLte980Px: this.matchMedia.matches
	// 	})
	// }

	static getInstructions(questionModel, questionAssessmentModel) {
		return <span>Input your answer</span>
	}

	// static getDerivedStateFromProps(props, state) {
	// 	if (props.response !== state.response) {
	// 		return {
	// 			response: props.response
	// 		}
	// 	}
	// }

	// onInputChange(event) {
	// 	this.setState({
	// 		response: event.target.value
	// 	})
	// }

	setFeedback(feedback) {
		QuestionUtil.setData(
			this.props.model.get('id'),
			NavUtil.getContext(this.props.moduleData.navState),
			KEY_FEEDBACK,
			feedback
		)
	}

	clearFeedback() {
		QuestionUtil.clearData(
			this.props.model.get('id'),
			NavUtil.getContext(this.props.moduleData.navState),
			KEY_FEEDBACK
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

	// getCorrectResponse() {
	// 	// Get the first correct response
	// 	const correctRules = this.evaluator.grader.rules.filter(r => r.score === 100)

	// 	if(correctRules.length === 0) {
	// 		return null
	// 	}

	// 	return {
	// 		state: {
	// 			value: correctRules[0].
	// 		},
	// 		targetId: null
	// 	}
	// }

	calculateScore() {
		const questionResponse = this.props.response.value

		console.log('CALCULATE SCORE', questionResponse)

		// debugger

		const results = this.evaluator.evaluate(questionResponse)
		this.results = results
		console.log('results', results)

		switch (results.status) {
			case 'inputInvalid':
				alert('input invalid')
				return null

			default: {
				let feedback = null
				if (
					results.details.matchingOutcome &&
					results.details.matchingOutcome.rule &&
					results.details.matchingOutcome.rule.feedback
				) {
					feedback = results.details.matchingOutcome.rule.feedback
				}

				this.setFeedback(feedback)

				return results.details.score
			}
		}
	}

	retry() {
		QuestionUtil.retryQuestion(
			this.props.questionModel.get('id'),
			this.props.moduleData.navState.context
		)
	}

	handleFormChange(event) {
		if (this.props.score !== null) {
			this.retry()
		}

		return {
			state: {
				value: event.target.value
			},
			targetId: null
		}
	}

	getRuleSummary(rule) {
		const min = rule.value.min.toString()
		const max = rule.value.max.toString()

		if (rule.value.isSingular) {
			return {
				type: 'single',
				value: min
			}
		}

		const isFullyInclusive = rule.value.isMinInclusive && rule.value.isMaxInclusive
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

		if (rule.value.isMinInclusive) {
			minPrefix = 'Greater than or equal to'
		} else {
			minPrefix = 'Greater than'
		}

		if (rule.value.isMaxInclusive) {
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

	renderRuleSummary(summary) {
		switch (summary.type) {
			case 'single':
				return <span className="value">{summary.value}</span>

			case 'range':
				return (
					<React.Fragment>
						{summary.minPrefix ? <span>{summary.minPrefix} </span> : null}
						<span className="value">{summary.min}</span>
						<span> {summary.conjunction} </span>
						{summary.maxPrefix ? <span>{summary.maxPrefix} </span> : null}
						<span className="value">{summary.max}</span>
					</React.Fragment>
				)
		}
	}

	render() {
		const score = this.props.score
		const scoreClass = this.props.scoreClass
		const isAnswered = this.props.isAnswered
		// const isAnswerRevealed = this.props.isAnswerRevealed
		const feedback = this.getFeedback()
		const feedbackModel = feedback ? OboModel.create(feedback) : null
		const FeedbackComponent = feedbackModel ? feedbackModel.getComponentClass() : null
		console.log('RULES', this.evaluator.grader.rules)
		const correctRules = this.evaluator.grader.rules.filter(rule => rule.score === 100)
		const responseValue =
			this.props.response && this.props.response.value ? this.props.response.value : ''
		console.log('fb', feedback, feedbackModel, FeedbackComponent)

		const className =
			'obojobo-draft--chunks--numeric-assessment' +
			` is-response-type-${this.props.model.modelState.responseType}` +
			` is-mode-${this.props.mode}` +
			` is-type-${this.props.type}` +
			isOrNot(responseValue.length >= LONG_RESPONSE_NUM_CHARS, 'long-response') +
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
				<div className="input-section pad">
					<div className="input-container">
						<input
							autoComplete="off"
							id="numeric-assessment--input"
							placeholder={this.props.mode !== 'review' ? 'Your answer...' : '(No answer given)'}
							value={responseValue}
							disabled={this.props.mode === 'review'}
							// onChange={this.onInputChange}
						/>
					</div>
					{feedback ? (
						<FeedbackComponent model={feedbackModel} moduleData={this.props.moduleData} />
					) : null}
					{this.props.mode === 'review' ? (
						<div className="review">
							<Flag
								// small={this.state.isScreenLte980Px}
								type={Flag.getType(
									score === 100,
									score === 100,
									true,
									this.props.questionModel.modelState.type === 'survey'
								)}
							/>
							{score !== 100 ? (
								<div className="correct-answers">
									{correctRules.length === 1 ? (
										<React.Fragment>
											<h2>Correct answer: </h2>
											<span>{this.renderRuleSummary(this.getRuleSummary(correctRules[0]))}</span>
										</React.Fragment>
									) : (
										<React.Fragment>
											<h2>Correct answers:</h2>
											<ul>
												{correctRules.map((rule, index) => {
													return (
														<li key={index}>{this.renderRuleSummary(this.getRuleSummary(rule))}</li>
													)
												})}
											</ul>
										</React.Fragment>
									)}
								</div>
							) : null}
						</div>
					) : null}
				</div>
			</OboComponent>
		)
	}
}
