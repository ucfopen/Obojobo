import React from 'react'
import Common from 'Common'
const { Dialog } = Common.components.modal

const PreAttemptImportScoreDialog = ({ highestScore, onChoice }) => {
	highestScore = Math.round(highestScore)
	return (
		<Dialog
			centered
			buttons={[
				{
					value: 'Do Not Import',
					onClick: () => {
						onChoice(false)
					}
				},
				{
					value: `Import Score: ${highestScore}%`,
					onClick: () => {
						onChoice(true)
					}
				}
			]}
			title="Import Score or Start Attempt"
			width="300"
		>
			<p>
				You previously completed this module in another course. Your highest score can be imported
				for this assignment.
			</p>
			<p>
				Import <b>{highestScore}%</b> for your final score <i>or</i> attempt the assessment?
			</p>
		</Dialog>
	)
}

export default PreAttemptImportScoreDialog
