import React from 'react'

const MCAssessmentResults = props => {
	const isModeSurvey = props.type === 'survey'
	const score = props.score
	const isTypePickAll = props.isTypePickAll
	const isForScreenReader = props.isForScreenReader
	const isCorrect = score === 100

	if (isModeSurvey) {
		return (
			<div className="result-container">
				<p className="result survey">{props.correctLabel}</p>
			</div>
		)
	} else if (isCorrect && isForScreenReader) {
		return (
			<div className="result-container">
				<p className="result correct">{`${props.correctLabel} - You received a ${score}% on this question.`}</p>
			</div>
		)
	} else if (isCorrect && !isForScreenReader) {
		return (
			<div className="result-container" aria-hidden="true">
				<p className="result correct">{props.correctLabel}</p>
			</div>
		)
	} else if (!isCorrect && isForScreenReader) {
		return (
			<div className="result-container">
				<p className="result incorrect">{`${props.incorrectLabel} - You received a ${score}% on this question.`}</p>
				{isTypePickAll ? (
					<span key="_instructions" className="pick-all-instructions">
						{props.pickAllIncorrectMessage}
					</span>
				) : null}
			</div>
		)
	} else {
		/*if (!isCorrect && !isForScreenReader) */
		return (
			<div className="result-container" aria-hidden="true">
				<p className="result incorrect">{props.incorrectLabel}</p>
				{isTypePickAll ? (
					<span key="_instructions" className="pick-all-instructions">
						{props.pickAllIncorrectMessage}
					</span>
				) : null}
			</div>
		)
	}
}

export default MCAssessmentResults
