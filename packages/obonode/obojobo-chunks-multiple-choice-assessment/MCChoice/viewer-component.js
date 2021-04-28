import './viewer-component.scss'

import { CSSTransition } from 'react-transition-group'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const { OboComponent, Flag } = Viewer.components
const { QuestionUtil } = Viewer.util

const TRANSITION_TIME_MS = 800

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

const choiceIsSelected = (questionState, model, questionModel, navStateContext) => {
	const response = QuestionUtil.getResponse(questionState, questionModel, navStateContext) || {
		ids: []
	}

	return response.ids.indexOf(model.get('id')) !== -1
}

const getQuestionScore = (model, questionModel, isReview, questionState, navStateContext) => {
	if (isReview) {
		return QuestionUtil.getScoreForModel(questionState, questionModel, navStateContext)
	}

	// Override any score property if this is for a survey type question
	if (questionModel.modelState.type === 'survey') {
		return 'no-score'
	}

	return model.modelState.score
}

const getChoiceText = (score, isTypePickAll) => {
	const isCorrect = score === 100

	if (score === 'no-score') return 'Your response:'
	if (isTypePickAll && isCorrect) return 'A correct response:'
	if (isTypePickAll && !isCorrect) return 'An incorrect response:'
	if (!isTypePickAll && isCorrect) return 'Your correct response:'
	/*if (!isTypePickAll && !isCorrect)*/ return 'Your incorrect response:'
}

const MCChoice = props => {
	const isSurvey = props.questionModel.modelState.type === 'survey'
	let score

	try {
		score = getQuestionScore(
			props.model,
			props.questionModel,
			props.mode === 'review',
			props.moduleData.questionState,
			props.moduleData.navState.context
		)
	} catch (error) {
		// if there's no questionState data for this
		// or getting the score throws an error
		// just display a div
		return <div />
	}

	const isSelected = choiceIsSelected(
		props.moduleData.questionState,
		props.model,
		props.questionModel,
		props.moduleData.navState.context
	)

	const inputType = getInputType(props.responseType)

	const ansType = Flag.getType(
		score === 100,
		props.model.modelState.score === 100,
		isSelected,
		isSurvey
	)

	const className =
		'obojobo-draft--chunks--mc-assessment--mc-choice' +
		isOrNot(isSelected, 'selected') +
		isOrNot(isSurvey || score === 100, 'correct-choice') +
		` is-type-${ansType}` +
		` is-mode-${props.mode}`

	return (
		<OboComponent
			model={props.model}
			moduleData={props.moduleData}
			className={className}
			tag="label"
		>
			<input
				type={inputType}
				value={props.model.get('id')}
				checked={isSelected}
				onChange={/* istanbul ignore next */ () => {}} // for react to not complain
				name={props.model.parent.get('id')}
				role={inputType}
				aria-checked={isSelected}
				disabled={props.mode === 'review'}
			/>
			{isSelected && props.questionSubmitted ? (
				<span className="for-screen-reader-only">
					{getChoiceText(score, props.responseType === 'pick-all')}
				</span>
			) : null}
			<div className="children">
				{props.model.children.map(child => {
					const type = child.get('type')
					const id = child.get('id')
					const Component = child.getComponentClass()

					switch (type) {
						case 'ObojoboDraft.Chunks.MCAssessment.MCAnswer':
							return (
								<div key={id}>
									{props.mode === 'review' ? <Flag type={ansType} /> : null}
									<Component key={id} model={child} moduleData={props.moduleData} />
								</div>
							)

						case 'ObojoboDraft.Chunks.MCAssessment.MCFeedback':
							return (
								<CSSTransition
									key={id}
									in={isSelected && props.questionSubmitted}
									classNames="feedback"
									timeout={TRANSITION_TIME_MS}
								>
									{isSelected && props.questionSubmitted ? (
										<div className="feedback">
											<Component model={child} moduleData={props.moduleData} />
										</div>
									) : (
										<span />
									)}
								</CSSTransition>
							)
					}

					return null
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
