import React from 'react'

const QuestionOutcome = props => {
	const isModeSurvey = props.type === 'survey'
	const score = props.score
	const isForScreenReader = props.isForScreenReader
	const isCorrect = score >= 100
	const isIncorrect = score === 0 || score === 'no-score'

	if (isModeSurvey) {
		return (
			<div className="result-container" aria-hidden={!isForScreenReader}>
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

	if (isIncorrect && isForScreenReader) {
		return (
			<div className="result-container">
				<p className="result incorrect">{`${props.feedbackText} - You received a ${score}% on this question.`}</p>
			</div>
		)
	}

	if (isIncorrect && !isForScreenReader) {
		return (
			<div className="result-container" aria-hidden="true">
				<p className="result incorrect">{props.feedbackText}</p>
			</div>
		)
	}

	/*if (!isCorrect && !isForScreenReader) */
	// return (
	// 	<div className="result-container" aria-hidden="true">
	// 		<p className="result incorrect">{props.feedbackText}</p>
	// 	</div>
	// )
	return (
		<div className="result-container" aria-hidden="true">
			<p className="result partially-correct">{`${props.feedbackText} - You received a ${score}% on this question.`}</p>
		</div>
	)
}

export default QuestionOutcome

// import React from 'react'

// const QuestionOutcome = props => {
// 	const isModeSurvey = props.type === 'survey'
// 	const score = props.score
// 	const isForScreenReader = props.isForScreenReader

// 	let resultClass = ''
// 	let resultText = `${props.feedbackText} - You received a ${score}% on this question.`

// 	switch (true) {
// 		case score === 'no-score':
// 			resultText = props.feedbackText
// 			resultClass = 'correct'
// 			break
// 		case score === 0:
// 			if (isModeSurvey || !isForScreenReader) resultText = props.feedbackText
// 			resultClass = 'incorrect'
// 			break
// 		case score >= 100:
// 			if (isModeSurvey || !isForScreenReader) resultText = props.feedbackText
// 			resultClass = 'correct'
// 			break
// 		case score > 0 && score < 100:
// 		default:
// 			resultClass = 'partially-correct'
// 			break
// 	}
// 	// survey overrides other types
// 	if (isModeSurvey) resultClass = 'survey'

// 	return (
// 		<div className="result-container" aria-hidden={`${!isForScreenReader}`}>
// 			<p className={`result ${resultClass}`}>{resultText}</p>
// 		</div>
// 	)
// }

// export default QuestionOutcome
