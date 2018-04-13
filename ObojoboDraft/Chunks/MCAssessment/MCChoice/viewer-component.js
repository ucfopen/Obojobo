import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { OboModel } = Common.models

let { QuestionUtil } = Viewer.util

const getInputType = responseType => {
	switch (responseType) {
		case 'pick-all':
			return 'checkbox'
		case 'pick-one':
		case 'pick-one-multiple-correct':
		default:
			return 'radio'
	}
}

const questionIsSelected = (questionState, model) => {
	let response = QuestionUtil.getResponse(
		questionState,
		model.getParentOfType('ObojoboDraft.Chunks.Question')
	) || { ids: [] }

	return response.ids.indexOf(model.get('id')) !== -1
}

const MCChoice = props => {
	let isSelected = questionIsSelected(props.moduleData.questionState, props.model)

	return (
		<OboComponent
			model={props.model}
			moduleData={props.moduleData}
			className={
				'obojobo-draft--chunks--mc-assessment--mc-choice' +
				(isSelected ? ' is-selected' : ' is-not-selected') +
				(props.model.modelState.score === 100 ? ' is-correct' : ' is-incorrect')
			}
			data-choice-label={props.label}
		>
			<input
				type={getInputType(props.responseType)}
				value={props.model.get('id')}
				checked={isSelected}
				onChange={function() {}}
				name={props.model.parent.get('id')}
			/>
			<div className="children">
				{props.model.children.map((child, index) => {
					let type = child.get('type')
					let isAnswerItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
					let isFeedbackItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

					if (isAnswerItem) {
						let Component = child.getComponentClass()
						return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
					}
				})}
			</div>
		</OboComponent>
	)
}

MCChoice.defaultProps = {
	responseType: null,
	revealAll: false,
	questionSubmitted: false
}

export default MCChoice
