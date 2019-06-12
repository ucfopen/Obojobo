import Common from 'Common'
import MCAssessmentResults from './mc-assessment-results'
import React from 'react'

const { Button } = Common.components

const MCAssessmentSubmitAndResultsFooter = props => {
	const isTypePickAll = props.isTypePickAll
	const score = props.score
	const isAnswerScored = score !== null // Question has been submitted in practice or scored by server in assessment
	const isAnswered = props.isAnswered

	let buttonSubmitLabel = ''
	let buttonResetLabel = ''
	let buttonResetAriaLabel = ''

	switch (props.type) {
		case 'survey':
			buttonSubmitLabel = 'Submit Response'
			buttonResetLabel = 'Change Response'
			buttonResetAriaLabel = 'Change Response'
			break

		default:
			buttonSubmitLabel = 'Check Your Answer'
			buttonResetLabel = 'Try Again'
			buttonResetAriaLabel = 'Try Question Again'
			break
	}

	return (
		<div className="submit-and-result-container">
			{props.mode === 'practice' ? (
				<div className="submit">
					{isAnswerScored ? (
						<Button
							altAction
							onClick={props.onClickReset}
							value={buttonResetLabel}
							ariaLabel={buttonResetAriaLabel}
						/>
					) : (
						<Button value={buttonSubmitLabel} disabled={!isAnswered} />
					)}
				</div>
			) : null}
			{isAnswerScored ? (
				<MCAssessmentResults
					mode={props.mode}
					type={props.type}
					score={score}
					isTypePickAll={isTypePickAll}
					correctLabel={props.correctLabel}
					incorrectLabel={props.incorrectLabel}
					pickAllIncorrectMessage={props.pickAllIncorrectMessage}
				/>
			) : null}
		</div>
	)
}

export default MCAssessmentSubmitAndResultsFooter
