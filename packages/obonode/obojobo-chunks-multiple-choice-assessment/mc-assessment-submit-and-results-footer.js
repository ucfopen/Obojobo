import Common from 'Common'
import MCAssessmentResults from './mc-assessment-results'
import React from 'react'

const { Button } = Common.components

const MCAssessmentSubmitAndResultsFooter = props => {
	const isTypePickAll = props.isTypePickAll
	const score = props.score
	const isAnswerScored = score !== null // Question has been submitted in practice or scored by server in assessment
	const isAnAnswerChosen = props.isAnAnswerChosen
	const isPractice = props.isPractice

	return (
		<div className="submit-and-result-container">
			{isPractice ? (
				<div className="submit">
					{isAnswerScored ? (
						<Button
							altAction
							onClick={props.onClickReset}
							value="Try Again"
							ariaLabel="Try Question Again"
						/>
					) : (
						<Button value="Check Your Answer" disabled={!isAnAnswerChosen} />
					)}
				</div>
			) : null}
			{isAnswerScored ? (
				<MCAssessmentResults
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
