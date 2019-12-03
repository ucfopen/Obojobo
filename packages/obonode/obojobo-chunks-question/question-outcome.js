import React from 'react'

const QuestionOutcome = props => {
	const isModeSurvey = props.type === 'survey'
	const score = props.score
	const isForScreenReader = props.isForScreenReader
	const isCorrect = score === 100

	if (isModeSurvey) {
		return (
			<div className="result-container">
				<p className="result survey">{props.feedbackText}</p>
			</div>
		)
	}

	if (isCorrect && isForScreenReader) {
		return (
			<div className="result-container">
				<p className="result correct">{`${props.feedbackText} - You received a ${score}% on this question.`}</p>
			</div>
		)
	}

	if (isCorrect && !isForScreenReader) {
		return (
			<div className="result-container" aria-hidden="true">
				<p className="result correct">{props.feedbackText}</p>
			</div>
		)
	}

	if (!isCorrect && isForScreenReader) {
		return (
			<div className="result-container">
				<p className="result incorrect">{`${props.feedbackText} - You received a ${score}% on this question.`}</p>
			</div>
		)
	}

	/*if (!isCorrect && !isForScreenReader) */
	return (
		<div className="result-container" aria-hidden="true">
			<p className="result incorrect">{props.feedbackText}</p>
		</div>
	)
}

export default QuestionOutcome
