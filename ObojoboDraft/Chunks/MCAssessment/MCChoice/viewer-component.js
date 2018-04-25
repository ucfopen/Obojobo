import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'
import isOrNot from '../../../../src/scripts/common/isornot'

let { OboComponent } = Common.components
let { OboModel } = Common.models
let { QuestionUtil } = Viewer.util

const QUESTION_TYPE = 'ObojoboDraft.Chunks.Question'
const CHOSEN_CORRECTLY = 'chosen-correctly'
const SHOULD_NOT_HAVE_CHOSEN = 'should-not-have-chosen'
const COULD_HAVE_CHOSEN = 'could-have-chosen'
const SHOULD_HAVE_CHOSEN = 'should-have-chosen'
const UNCHOSEN_CORRECTLY = 'unchosen-correctly'

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

const questionIsSelected = (questionState, model, navStateContext) => {
	let response = QuestionUtil.getResponse(
		questionState,
		model.getParentOfType(QUESTION_TYPE),
		navStateContext
	) || { ids: [] }

	return response.ids.indexOf(model.get('id')) !== -1
}

const getQuestionModel = model => model.getParentOfType(QUESTION_TYPE)

const answerIsCorrect = (model, mode, questionState, navStateContext) => {
	let score
	if (mode === 'review') {
		// no score data for this context? no idea what to do, throw an error
		if (!questionState.scores[navStateContext]) throw 'Unkown Question State'

		score = QuestionUtil.getScoreForModel(questionState, getQuestionModel(model), navStateContext)
	} else {
		score = model.modelState.score
	}
	return score === 100
}

const renderAnsFlag = type => {
	let flagEl

	switch (type) {
		case UNCHOSEN_CORRECTLY:
			return <div />
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
			flagEl = <p> Correct Answer </p>
			break
	}

	return <div className={`answer-flag is-type-${type}`}>{flagEl}</div>
}

const getAnsType = (model, isCorrect, isSelected) => {
	// The user selected a correct answer (not necessarily this one)
	// On multi-select questions, this is only true if a user selected all and only correct answers
	// Renamed for clarity w/ isACorrectChoice
	let userIsCorrect = isCorrect

	let isACorrectChoice = model.get('content').score === 100

	if (isSelected) {
		return isACorrectChoice ? CHOSEN_CORRECTLY : SHOULD_NOT_HAVE_CHOSEN
	}

	if (isACorrectChoice) {
		return userIsCorrect ? COULD_HAVE_CHOSEN : SHOULD_HAVE_CHOSEN
	}

	return UNCHOSEN_CORRECTLY
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

	let isSelected = questionIsSelected(
		props.moduleData.questionState,
		props.model,
		props.moduleData.navState.context
	)

	let ansType = getAnsType(props.model, isCorrect, isSelected)

	let flag
	if (props.mode === 'review') {
		flag = renderAnsFlag(ansType)
	}

	let className =
		'obojobo-draft--chunks--mc-assessment--mc-choice' +
		isOrNot(isSelected, 'selected') +
		isOrNot(isCorrect, 'correct') +
		` is-type-${ansType}` +
		` is-mode-${props.mode}`

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
					let id = child.get('id')

					if (isAnswerItem) {
						let Component = child.getComponentClass()
						return (
							<div key={id}>
								{flag}
								<Component key={id} model={child} moduleData={props.moduleData} />
							</div>
						)
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
