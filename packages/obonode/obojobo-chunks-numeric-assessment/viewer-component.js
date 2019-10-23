import './viewer-component.scss'

import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'
import NumericAnswerEvaluator from './evaluation/numeric-answer-evaluator'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

const { OboComponent } = Viewer.components

class NumericAssessment extends React.Component {
	constructor() {
		super()

		this.state = {
			isScored: false,
			isCorrect: true,
			correctLabel: 'Correct',
			incorrectLabel: 'Incorrect',
			isWarning: false,
			warningLabel: 'Answer must be an integer',
			input: '',
			feedback: null
		}
	}

	onInputChange(event) {
		const value = event.target.value
		this.setState({
			input: event.target.value,
			isScored: false,
			isWarning: isNaN(value)
		})
	}

	// onSubmit() {
	// 	this.setState({
	// 		...this.state,
	// 		isScored: true,
	// 		isCorrect: 4 == this.state.input,
	// 		isWarning: false
	// 	})
	// }

	onRetry() {
		this.setState({
			...this.state,
			isScored: false,
			input: ''
		})
	}

	//@TODO - This is duplicated in MCAssessment
	getQuestionModel() {
		return this.props.model.getParentOfType('ObojoboDraft.Chunks.Question')
	}

	onFormChange(event) {
		console.log('fc', event.target.value)
		const questionModel = this.getQuestionModel()
		const response = event.target.value

		QuestionUtil.setResponse(
			questionModel.get('id'),
			response,
			null,
			this.props.moduleData.navState.context,
			this.props.moduleData.navState.context.split(':')[1],
			this.props.moduleData.navState.context.split(':')[2]
		)
	}

	calculateScore() {
		const questionResponse = QuestionUtil.getResponse(
			this.props.moduleData.questionState,
			this.getQuestionModel(),
			this.props.moduleData.navState.context
		)

		console.log(questionResponse)

		// debugger

		const evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs: this.props.model.modelState.scoreRules
		})

		const results = evaluator.evaluate(questionResponse)

		console.log('results', results)

		this.setState({
			feedback: results.details.matchingOutcome.rule.feedback
		})

		return results.details.score
	}

	onSubmit(event) {
		event.preventDefault()

		// debugger

		const questionModel = this.getQuestionModel()

		QuestionUtil.setScore(
			questionModel.get('id'),
			this.calculateScore(),
			this.props.moduleData.navState.context
		)

		// Clear out labels so they are reselected
		// QuestionUtil.clearData(
		// 	questionModel.get('id'),
		// 	this.props.moduleData.navState.context,
		// 	FEEDBACK_LABELS_TO_SHOW
		// )

		if (questionModel.modelState.type === 'survey') {
			QuestionUtil.submitResponse(questionModel.get('id'), this.props.moduleData.navState.context)
		} else {
			QuestionUtil.checkAnswer(questionModel.get('id'), this.props.moduleData.navState.context)
		}
	}

	render() {
		const isReview = false
		const className = 'test'

		var fb = this.state.feedback

		console.log('fb be all', fb)

		var fbc = null
		if (fb) {
			fb.type = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
			fb = OboModel.create(fb)
			const Component = fb.getComponentClass()
			// debugger
			fbc = <Component model={fb} moduleData={this.props.moduleData} />
		}

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				onChange={!isReview ? this.onFormChange.bind(this) : null}
				onSubmit={this.onFormSubmit}
				tag="form"
				className={className}
			>
				<textarea on></textarea>
				<button onClick={this.onSubmit.bind(this)}>Submit</button>
				{fbc}
			</OboComponent>
		)
	}

	renderOLD() {
		const className =
			`component` +
			` obojobo-draft--chunks--numeric-assessment` +
			isOrNot(this.state.isScored, 'scored') +
			isOrNot(this.state.isCorrect, 'correct')

		return (
			<label className={className}>
				<fieldset>
					<div className="input-section pad">
						<div className="input-container">
							<p>x = </p>
							<input
								id="numeric-assessment--input"
								placeholder="Your answer..."
								value={this.state.input}
								onChange={e => this.onInputChange(e)}
							/>
							<p> meters</p>

							{this.state.isWarning ? (
								<div className="warning">
									<p className="warning--content">{this.state.warningLabel}</p>
								</div>
							) : null}
						</div>

						{this.state.isScored && !this.state.isCorrect ? (
							<div className="feedback">
								<p className="feedback--content">Two plus two is four.</p>
							</div>
						) : null}
					</div>

					<div className="submit-and-result-container pad">
						<div className="submit">
							<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
								{!this.state.isScored ? (
									<button className="button" onClick={() => this.onSubmit()}>
										Check your answer
									</button>
								) : (
									<button className="button" onClick={() => this.onRetry()}>
										Retry
									</button>
								)}
							</div>
						</div>

						<div className="result-container">
							{this.state.isScored && this.state.isCorrect ? (
								<p className="result correct">{this.state.correctLabel}</p>
							) : null}
							{this.state.isScored && !this.state.isCorrect ? (
								<p className="result incorrect">{this.state.incorrectLabel}</p>
							) : null}
						</div>
					</div>
				</fieldset>
			</label>
		)
	}
}

export default NumericAssessment
