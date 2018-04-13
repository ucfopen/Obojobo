import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { OboModel } = Common.models

let { QuestionUtil } = Viewer.util

const CHOSEN_CORRECTLY = ' chosen-correctly'
const SHOULD_NOT_HAVE_CHOSEN = ' should-not-have-chosen'
const COULD_HAVE_CHOSEN = ' could-have-chosen'
const SHOULD_HAVE_CHOSEN = ' should-have-chosen'
const UNCHOSEN_CORRECTLY = ' unchosen-correctly'

export default class MCChoice extends React.Component {
	static get defaultProps() {
		return {
			responseType: null,
			revealAll: false,
			questionSubmitted: false
		}
	}

	getQuestionModel() {
		return this.props.model.getParentOfType('ObojoboDraft.Chunks.Question')
	}

	getInputType() {
		switch (this.props.responseType) {
			case 'pick-all':
				return 'checkbox'
			default:
				//'pick-one', 'pick-one-multiple-correct'
				return 'radio'
		}
	}

	getAnsType(response, score){
		// The question is a correct choice
		let isACorrectChoice = this.props.model.get('content').score === 100

		// The user selected a correct answer (not necessarily this one)
		// On multi-select questions, this is only true if a user selected all and only correct answers
		let userIsCorrect = score == 100

		// The user selected this answer
		let isUserSelected = response.ids.indexOf(this.props.model.get('id')) !== -1


		if(isUserSelected){
			if(isACorrectChoice){
				return CHOSEN_CORRECTLY
			}else{
				return SHOULD_NOT_HAVE_CHOSEN
			}
		}else if(isACorrectChoice){
			if(userIsCorrect){
				return COULD_HAVE_CHOSEN
			}else{
				return SHOULD_HAVE_CHOSEN
			}
		}else{
			return UNCHOSEN_CORRECTLY
		}
	}

	renderAnsFlag(type){
		let flagEl

		switch(type){
			case UNCHOSEN_CORRECTLY:
				return <div/>
			case CHOSEN_CORRECTLY:
				flagEl = <p>Your Answer (Correct)</p>
				break
			case SHOULD_NOT_HAVE_CHOSEN:
				flagEl = <p>Your Answer (Incorrect)</p>
				break
			case COULD_HAVE_CHOSEN:
				flagEl = <p>Another Correct Answer</p>
				break
			case SHOULD_HAVE_CHOSEN:
				flagEl = <p>Correct Answer</p>
				break
		}

		return (<div className={
					'answer-flag' + type}>
					{flagEl}
				</div>)
	}

	render() {
		let questionModel = this.getQuestionModel()
		let questionId = questionModel.id
		let response = QuestionUtil.getResponse(
			this.props.moduleData.questionState,
			questionModel,
			this.props.moduleData.navState.context
		) || { ids: [] }

		let score = QuestionUtil.getScoreForModel(
			this.props.moduleData.questionState,
			questionModel,
			this.props.moduleData.navState.context
		)

		let isRight = score == 100
		let ansType = this.getAnsType(response, score)

		let isSelected = response.ids.indexOf(this.props.model.get('id')) !== -1

		let isCorrect
		let flag
		if (this.props.mode === 'review') {
			if (!this.props.moduleData.questionState.scores[this.props.moduleData.navState.context])
				return <div />
			isCorrect =
				this.props.model.get('content').score === 100
		} else isCorrect = this.props.model.modelState.score === 100

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={
					'obojobo-draft--chunks--mc-assessment--mc-choice' +
					ansType +
					' is-mode-' +
					this.props.mode
				}
				data-choice-label={this.props.label}
			>
				<input
					ref="input"
					type={this.getInputType()}
					value={this.props.model.get('id')}
					checked={isSelected}
					onChange={function() {}}
					name={this.props.model.parent.get('id')}
				/>
				<div className="children">
					{this.props.model.children.map((child, index) => {
						let type = child.get('type')
						let isAnswerItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
						let isFeedbackItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

						if (isAnswerItem) {
							let Component = child.getComponentClass()
							return (<div>
								{this.renderAnsFlag(ansType)}
								<Component key={child.get('id')} model={child} moduleData={this.props.moduleData} />
								</div>
							)
						}
					})}
				</div>
			</OboComponent>
		)
	}
}

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
