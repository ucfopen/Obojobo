import './viewer-component.scss'

let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { Button } = Common.components
let { OboModel } = Common.models
let { Dispatcher } = Common.flux
let { DOMUtil } = Common.page
;({ OboModel } = Common.models)
// FocusUtil = Common.util.FocusUtil

let { QuestionUtil } = Viewer.util
let { ScoreUtil } = Viewer.util

// @TODO - This wont update if new children are passed in via props

export default class MCAssessment extends React.Component {
	getResponseData() {
		let correct = new Set()
		let responses = new Set()

		for (let child of Array.from(this.props.model.children.models)) {
			if (child.modelState.score === 100) {
				correct.add(child.get('id'))
			}

			if (
				__guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, child), x => x.set)
			) {
				// return child.modelState.score
				responses.add(child.get('id'))
			}
		}

		return {
			correct,
			responses
		}
	}

	calculateScore() {
		let responseData = this.getResponseData()
		let { correct } = responseData
		let { responses } = responseData

		switch (this.props.model.modelState.responseType) {
			case 'pick-all':
				if (correct.size !== responses.size) {
					return 0
				}
				let score = 100
				correct.forEach(function(id) {
					if (!responses.has(id)) {
						return (score = 0)
					}
				})
				return score

			default:
				// pick-one | pick-one-multiple-correct
				for (let id of Array.from(Array.from(correct))) {
					if (responses.has(id)) {
						return 100
					}
				}

				return 0
		}
	}

	onClickSubmit(event) {
		event.preventDefault()
		return this.updateScore()
	}

	updateScore() {
		return ScoreUtil.setScore(this.props.model.parent.get('id'), this.calculateScore())
	}

	onClickUndoRevealAll(event) {
		event.preventDefault()
		return QuestionUtil.setData(this.props.model.get('id'), 'revealAll', false)
	}

	onClickRevealAll(event) {
		event.preventDefault()
		return QuestionUtil.setData(this.props.model.get('id'), 'revealAll', true)
	}

	onClickReset(event) {
		event.preventDefault()
		return this.reset()
	}

	reset() {
		this.clearRevealAll()
		this.clearResponses()
		return this.clearScore()
	}

	clearRevealAll() {
		return QuestionUtil.clearData(this.props.model.get('id'), 'revealAll')
	}
	// QuestionUtil.clearData @props.model.get('id'), 'shuffledIds'

	clearResponses() {
		return Array.from(this.props.model.children.models).map(child =>
			QuestionUtil.resetResponse(child.get('id'))
		)
	}

	clearScore() {
		return ScoreUtil.clearScore(this.props.model.parent.get('id'))
	}

	onClick(event) {
		let mcChoiceEl = DOMUtil.findParentWithAttr(
			event.target,
			'data-type',
			'ObojoboDraft.Chunks.MCAssessment.MCChoice'
		)
		if (!mcChoiceEl) {
			return
		}

		let mcChoiceId = mcChoiceEl.getAttribute('data-id')
		if (!mcChoiceId) {
			return
		}

		let revealAll = this.isRevealingAll()

		if (this.getScore() !== null) {
			this.reset()
		}

		switch (this.props.model.modelState.responseType) {
			case 'pick-all':
				return QuestionUtil.recordResponse(mcChoiceId, {
					set: !__guard__(
						QuestionUtil.getResponse(
							this.props.moduleData.questionState,
							OboModel.models[mcChoiceId]
						),
						x => x.set
					)
				})

			default:
				// pick-one | pick-one-multiple-correct
				for (let child of Array.from(this.props.model.children.models)) {
					if (child.get('id') !== mcChoiceId) {
						QuestionUtil.recordResponse(child.get('id'), {
							set: false
						})
					}
				}

				return QuestionUtil.recordResponse(mcChoiceId, {
					set: true
				})
		}
	}

	getScore() {
		return ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model.parent)
	}

	// showSolution: (event) ->
	// 	event.preventDefault()
	// 	@setState { showingSolution:true }

	isRevealingAll() {
		return QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'revealAll')
	}

	componentWillReceiveProps() {
		this.shuffle()
	}

	componentWillMount() {
		this.shuffle()
	}

	shuffle() {
		let shuffledIds = QuestionUtil.getData(
			this.props.moduleData.questionState,
			this.props.model,
			'shuffledIds'
		)
		if (!shuffledIds) {
			shuffledIds = _.shuffle(this.props.model.children.models).map(model => model.get('id'))
			QuestionUtil.setData(this.props.model.get('id'), 'shuffledIds', shuffledIds)
		}
	}

	render() {
		let { responseType } = this.props.model.modelState
		let revealAll = this.isRevealingAll()
		let score = this.getScore()
		let questionSubmitted = score !== null
		let questionAnswered = this.getResponseData().responses.size >= 1
		let shuffledIds = QuestionUtil.getData(
			this.props.moduleData.questionState,
			this.props.model,
			'shuffledIds'
		)
		// shuffledIds = _.shuffle(@props.model.children.models).map (model) -> model.get('id')

		if (!shuffledIds) return false

		let feedbacks = Array.from(this.getResponseData().responses)
			.filter(mcChoiceId => {
				return OboModel.models[mcChoiceId].children.length > 1
			})
			.sort((id1, id2) => {
				return shuffledIds.indexOf(id1) - shuffledIds.indexOf(id2)
			})
			.map(mcChoiceId => {
				return OboModel.models[mcChoiceId].children.at(1)
			})

		let { solution } = this.props.model.parent.modelState
		if (solution != null) {
			var SolutionComponent = solution.getComponentClass()
		}

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				onClick={this.onClick.bind(this)}
				tag="form"
				className={
					'obojobo-draft--chunks--mc-assessment' +
					` is-response-type-${this.props.model.modelState.responseType}` +
					(revealAll ? ' is-revealing-all' : ' is-not-revealing-all') +
					(score === null ? ' is-unscored' : ' is-scored')
				}
			>
				<span className="instructions">
					{(function() {
						switch (responseType) {
							case 'pick-one':
								return <span>Pick the correct answer</span>
							case 'pick-one-multiple-correct':
								return <span>Pick one of the correct answers</span>
							case 'pick-all':
								return (
									<span>
										Pick <b>all</b> of the correct answers
									</span>
								)
						}
					})()}
				</span>
				{shuffledIds.map((id, index) => {
					let child = OboModel.models[id]
					if (child.get('type') !== 'ObojoboDraft.Chunks.MCAssessment.MCChoice') {
						return null
					}

					let Component = child.getComponentClass()
					return (
						<Component
							key={child.get('id')}
							model={child}
							moduleData={this.props.moduleData}
							responseType={responseType}
							revealAll={revealAll}
							questionSubmitted={questionSubmitted}
							label={String.fromCharCode(index + 65)}
						/>
					)
				})}
				{
					<div className="submit">
						{questionSubmitted
							? <Button altAction onClick={this.onClickReset.bind(this)} value="Try Again" />
							: <Button
									onClick={this.onClickSubmit.bind(this)}
									value="Check Your Answer"
									disabled={!questionAnswered}
								/>}

						{questionSubmitted
							? score === 100
								? <div className="result-container">
										<p className="result correct">Correct!</p>
									</div>
								: <div className="result-container">
										<p className="result incorrect">Incorrect</p>
										{responseType === 'pick-all'
											? <span className="pick-all-instructions">
													You have either missed some correct answers or selected some incorrect
													answers
												</span>
											: null}
									</div>
							: null}
					</div>
				}
				<ReactCSSTransitionGroup
					component="div"
					transitionName="submit"
					transitionEnterTimeout={800}
					transitionLeaveTimeout={800}
				>
					{questionSubmitted && (feedbacks.length > 0 || solution)
						? <div className="solution" key="solution">
								<div className="score">
									{feedbacks.length === 0
										? null
										: <div
												className={`feedback${responseType === 'pick-all'
													? ' is-pick-all-feedback'
													: ' is-not-pick-all-feedback'}`}
											>
												{feedbacks.map(model => {
													let Component = model.getComponentClass()
													return (
														<Component
															key={model.get('id')}
															model={model}
															moduleData={this.props.moduleData}
															responseType={responseType}
															revealAll={revealAll}
															questionSubmitted={questionSubmitted}
															label={String.fromCharCode(
																shuffledIds.indexOf(model.parent.get('id')) + 65
															)}
														/>
													)
												})}
											</div>}
								</div>
								{revealAll
									? <Button
											altAction
											onClick={this.onClickUndoRevealAll.bind(this)}
											value="Hide Explanation"
										/>
									: solution
										? <Button
												altAction
												onClick={this.onClickRevealAll.bind(this)}
												value="Read an explanation of the answer"
											/>
										: null}
								<ReactCSSTransitionGroup
									component="div"
									transitionName="solution"
									transitionEnterTimeout={800}
									transitionLeaveTimeout={800}
								>
									{revealAll
										? <div className="solution-container" key="solution-component">
												<SolutionComponent model={solution} moduleData={this.props.moduleData} />
											</div>
										: null}
								</ReactCSSTransitionGroup>
							</div>
						: null}
				</ReactCSSTransitionGroup>
			</OboComponent>
		)
	}
}

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
