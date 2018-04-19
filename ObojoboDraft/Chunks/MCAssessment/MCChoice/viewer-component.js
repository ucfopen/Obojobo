import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'
import isOrNot from '../../../../src/scripts/common/isornot'

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

const answerIsCorrect = (model, mode, questionState, navStateContext) => {
	let score
	if (mode === 'review') {
		// no score data for this context? no idea what to do, throw an error
		if (!questionState.scores[navStateContext]) throw 'Unkown Question State'

		score = QuestionUtil.getScoreForModel(questionState, model, navStateContext)
	} else {
		score = model.modelState.score
	}

	return score === 100
}

const MCChoice = props => {
	let isCorrect

	try {
		isCorrect = answerIsCorrect(
			props.model,
			props.mode,
			props.moduleData.questionState,
			props.moduleData.navState.context
		)
	} catch (error) {
		// if there's no questionState data for this
		// or getting the score throws an error
		// just display a div
		return <div />
	}

	let isSelected = questionIsSelected(props.moduleData.questionState, props.model)

	let className =
		'obojobo-draft--chunks--mc-assessment--mc-choice' +
		isOrNot(isSelected, 'selected') +
		isOrNot(isCorrect, 'correct') +
		' is-mode-' +
		props.mode

	return (
		<OboComponent
			model={props.model}
			moduleData={props.moduleData}
			className={className}
			data-choice-label={props.label}
		>
			<input
				type={getInputType(props.responseType)}
				value={props.model.get('id')}
				checked={isSelected}
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
