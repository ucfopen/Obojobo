import React from 'react'

const basicReview = (questionModel, moduleData, questionScore, index) => {
	const QuestionComponent = questionModel.getComponentClass()

	let resultLabel
	let className
	if (questionModel.modelState.type === 'survey') {
		resultLabel = 'Survey Question'
		className = 'is-no-score'
	} else if (questionScore.score === 100) {
		resultLabel = 'Correct'
		className = 'is-correct'
	} else {
		resultLabel = 'Incorrect'
		className = 'is-not-correct'
	}

	const classNames = [`is-mode-review`, className].join(' ')

	return (
		<div key={index} className={classNames}>
			<p>{`Question ${index + 1}: ${resultLabel}`}</p>
			<QuestionComponent model={questionModel} moduleData={moduleData} showContentOnly />
		</div>
	)
}

export default basicReview
