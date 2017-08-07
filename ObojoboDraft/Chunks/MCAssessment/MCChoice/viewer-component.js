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

	createFeedbackItem(message) {
		let feedback = OboModel.create('ObojoboDraft.Chunks.MCAssessment.MCFeedback')
		let text = OboModel.create('ObojoboDraft.Chunks.Text')
		// console.log('text', text)
		text.modelState.textGroup.first.text.insertText(0, message)
		// console.log('feedback', feedback)
		feedback.children.add(text)

		return feedback
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

	render() {
		let response = QuestionUtil.getResponse(
			this.props.moduleData.questionState,
			this.getQuestionModel()
		) || { ids: [] }
		let isSelected = response.ids.indexOf(this.props.model.get('id')) !== -1

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={
					'obojobo-draft--chunks--mc-assessment--mc-choice' +
					(isSelected ? ' is-selected' : ' is-not-selected') +
					(this.props.model.modelState.score === 100 ? ' is-correct' : ' is-incorrect')
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
							return (
								<Component key={child.get('id')} model={child} moduleData={this.props.moduleData} />
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
