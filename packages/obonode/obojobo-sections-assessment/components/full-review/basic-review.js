import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'

const { OboModel } = Common.models

const basicReview = (moduleData, questionScore, index) => {
	const questionModel = OboModel.models[questionScore.id]
	const QuestionComponent = questionModel.getComponentClass()

	let resultLabel
	if (questionModel.modelState.type === 'survey') {
		resultLabel = 'Survey Question'
	} else if (questionScore.score === 100) {
		resultLabel = 'Correct'
	} else {
		resultLabel = 'Incorrect'
	}

	const classNames = [
		`is-mode-${questionModel.modelState.mode}`,
		questionScore.score === 100 ? 'is-correct' : 'is-not-correct'
	].join(' ')

	return (
		<div key={index} className={classNames}>
			<p>{`Question ${index + 1}: ${resultLabel}`}</p>
			<QuestionComponent model={questionModel} moduleData={moduleData} showContentOnly />
		</div>
	)
}

export default basicReview
