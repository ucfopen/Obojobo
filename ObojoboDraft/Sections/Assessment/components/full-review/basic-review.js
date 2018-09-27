import React from 'react'

import Common from 'Common'

const { OboModel } = Common.models

const basicReview = (moduleData, questionScore, index) => {
	const questionModel = OboModel.models[questionScore.id]
	const QuestionComponent = questionModel.getComponentClass()

	return (
		<div key={index} className={questionScore.score === 100 ? 'is-correct' : 'is-not-correct'}>
			<p>{`Question ${index + 1}: ${questionScore.score === 100 ? 'Correct' : 'Incorrect'}`}</p>
			<QuestionComponent model={questionModel} moduleData={moduleData} showContentOnly />
		</div>
	)
}

export default basicReview
