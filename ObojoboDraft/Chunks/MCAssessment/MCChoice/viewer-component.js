import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { OboModel } = Common.models

let { QuestionUtil } = Viewer.util

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

	getAnsType(isCorrect, isSelected, isRight){
		let text
		if(isSelected){
			text = <p>Your Answer</p>
		}else if(isCorrect){
			if(isRight){
				text = <p>Another Correct Answer</p>
			}else{
				text = <p>Correct Answer</p>
			}
		}

		return (<div className={
					'answer-flag' +
					(isSelected ? ' is-selected' : ' is-not-selected') +
					(isCorrect ? ' is-correct' : ' is-incorrect') +
					(isRight ? ' is-right' : ' is-not-right')}>
					{text}
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

		let isSelected = response.ids.indexOf(this.props.model.get('id')) !== -1

		let isCorrect
		let flag
		if (this.props.mode === 'review') {
			if (!this.props.moduleData.questionState.scores[this.props.moduleData.navState.context])
				return <div />
			isCorrect =
				this.props.model.get('content').score === 100
			flag = this.getAnsType(isCorrect,isSelected,isRight)
		} else isCorrect = this.props.model.modelState.score === 100

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={
					'obojobo-draft--chunks--mc-assessment--mc-choice' +
					(isSelected ? ' is-selected' : ' is-not-selected') +
					(isCorrect ? ' is-correct' : ' is-incorrect') +
					(isRight ? ' is-right' : ' is-not-right') +
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
								{flag}
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
