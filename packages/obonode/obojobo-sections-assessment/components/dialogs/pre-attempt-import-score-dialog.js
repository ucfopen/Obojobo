import React from 'react'
import Common from 'Common'
const { Dialog } = Common.components.modal

const PreAttemptImportScoreDialog = ({ highestScore, onChoice }) => {
	highestScore = Math.round(highestScore)
	return <Dialog
			centered
			buttons={[
				{
					value: 'Do Not Import',
					onClick: () => {onChoice(false)}
				},
				{
					value: `Import Score: ${highestScore}%`,
					onClick: () => {onChoice(true)}
				}
			]}
			title='Import Previous Score?'
			width='300'
		>
		<p>
			You have previously completed this module and your instructor is
			allowing you to import your high score of <strong>{highestScore}%</strong>
		</p>
		<p>
			Would you like to use that score now or ignore it and begin the Assessment?
		</p>
	</Dialog>
}

export default PreAttemptImportScoreDialog
