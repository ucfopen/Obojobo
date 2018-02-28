import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { OboModel } = Common.models
let { Button } = Common.components
let { Dispatcher } = Common.flux
let { ModalUtil } = Common.util
let Launch = Common.Launch

let { ScoreStore } = Viewer.stores
let { AssessmentUtil } = Viewer.util
let { NavUtil } = Viewer.util

import AttemptIncompleteDialog from './attempt-incomplete-dialog'
import LTIStatus from './lti-status'

export default class Assessment extends React.Component {
	constructor() {
		super()

		this.state = { step: null }
	}

	getCurrentStep() {
		let assessment = AssessmentUtil.getAssessmentForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		if (assessment === null) {
			return 'untested'
		}
		if (assessment.current !== null) {
			return 'takingTest'
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

	onClickResendScore() {
		AssessmentUtil.resendLTIScore(this.props.model)
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
		let recentScore = AssessmentUtil.getLastAttemptScoreForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)
		let assessmentScore = AssessmentUtil.getAssessmentScoreForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)
		let ltiState = AssessmentUtil.getLTIStateForModel(
			this.props.moduleData.assessmentState,
			this.props.model
		)

		let externalSystemLabel = Launch.getOutcomeServiceHostname()

		var childEl = (() => {
			switch (this.getCurrentStep()) {
				case 'untested':
					let child = this.props.model.children.at(0)
					let Component = child.getComponentClass()

					return (
						<div className="untested">
							<Component model={child} moduleData={this.props.moduleData} />
						</div>
					)

				case 'takingTest':
					child = this.props.model.children.at(1)
					Component = child.getComponentClass()

					return (
						<div className="test">
							<Component
								className="untested"
								model={child}
								moduleData={this.props.moduleData}
								showScore={recentScore !== null}
							/>
							<div className="submit-button">
								<Button
									onClick={this.onClickSubmit.bind(this)}
									value={
										this.isAttemptComplete()
											? 'Submit'
											: 'Submit (Not all questions have been answered)'
									}
								/>
							</div>
						</div>
					)

				case 'scoreSubmitted':
					let scoreAction = this.getScoreAction()

					let questionScores = AssessmentUtil.getLastAttemptScoresForModel(
						this.props.moduleData.assessmentState,
						this.props.model
					)

					let numCorrect = questionScores.reduce(
						function(acc, questionScore) {
							let n = 0
							if (parseInt(questionScore.score, 10) === 100) {
								n = 1
							}
							return parseInt(acc, 10) + n
						},
						[0]
					)

					if (scoreAction.page != null) {
						let pageModel = OboModel.create(scoreAction.page)
						pageModel.parent = this.props.model //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
						let PageComponent = pageModel.getComponentClass()
						childEl = <PageComponent model={pageModel} moduleData={this.props.moduleData} />
					} else {
						childEl = (
							<p>
								{scoreAction.message}
							</p>
						)
					}

					return (
						<div className="score unlock">
							<LTIStatus
								ltiState={ltiState}
								launch={Launch}
								onClickResendScore={this.onClickResendScore.bind(this)}
							/>
							<h1>{`Your attempt score is ${Math.round(recentScore)}%`}</h1>
							<h2>
								Your overall score for this assessment is{' '}
								<strong>{assessmentScore === null ? '--' : Math.round(assessmentScore)}% </strong>
								{(() => {
									switch (ltiState.state.gradebookStatus) {
										case 'ok_no_outcome_service':
										case 'ok_null_score_not_sent':
											return null

										case 'ok_gradebook_matches_assessment_score':
											return (
												<span className="lti-sync-message is-synced">
													({`sent to ${externalSystemLabel} `}
													<span>✔</span>)
												</span>
											)

										default:
											return (
												<span className="lti-sync-message is-not-synced">
													({`not sent to ${externalSystemLabel} `}
													<span>✖</span>)
												</span>
											)
									}
								})()}
							</h2>

							{childEl}
							<div className="review">
								<p className="number-correct">{`You got ${numCorrect} out of ${questionScores.length} questions correct:`}</p>
								{questionScores.map((questionScore, index) => {
									let questionModel = OboModel.models[questionScore.id]
									let QuestionComponent = questionModel.getComponentClass()

									return (
										<div
											key={index}
											className={questionScore.score === 100 ? 'is-correct' : 'is-not-correct'}
										>
											<p>{`Question ${index + 1} - ${questionScore.score === 100
												? 'Correct:'
												: 'Incorrect:'}`}</p>
											<QuestionComponent
												model={questionModel}
												moduleData={this.props.moduleData}
												showContentOnly
											/>
										</div>
									)
								})}
							</div>
						</div>
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
