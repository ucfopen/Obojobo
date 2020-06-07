import React from 'react'
import Common from 'Common'
const { Dialog } = Common.components.modal

const FinalWarningPreAttemptImportScoreDialog = ({
	isImporting,
	highestScore,
	shouldContinueFn
}) => {
	highestScore = Math.round(highestScore)
	const titleText = isImporting ? 'Import Score' : 'Start Attempt Without Importing'

	const buttonText = isImporting
		? `Import Score: ${highestScore}%`
		: 'Start Attempt Without Importing'

	return (
		<Dialog
			centered
			buttons={[
				{
					value: 'Cancel',
					onClick: () => {
						shouldContinueFn(false)
					}
				},
				{
					value: buttonText,
					onClick: () => {
						shouldContinueFn(true)
					}
				}
			]}
			title={titleText}
			width="300"
		>
			<p>
				{isImporting
					? `Importing will use up all assessment attempts for this module and set your final score to ${highestScore}%`
					: `Starting an attempt gives up your ability to import your ${highestScore}% score.`}
			</p>
		</Dialog>
	)
}

export default FinalWarningPreAttemptImportScoreDialog
