import './pre-attempt-import-score-dialog.scss'

import React from 'react'
import Common from 'Common'
const Button = Common.components.Button
const { Dialog } = Common.components.modal

const PreAttemptImportScoreDialog = ({ highestScore, onChoice }) => {
	highestScore = Math.round(highestScore)

	const customControls = (
		<React.Fragment>
			<div className="choice-box">
				<h2>Import Score</h2>
				<div className="choice-desc">
					Skip this assessment.
					<br />
					Recieve a {highestScore}% for this assignment and forfeit all attempts.
				</div>
				<Button onClick={() => onChoice(true)}>Import Score: {highestScore}%</Button>
			</div>
			<div className="or-box">or</div>
			<div className="choice-box">
				<h2>Start Attempt</h2>
				<div className="choice-desc">
					Take this assessment.
					<br />
					Give up the ability to import your previous score.
				</div>
				<Button onClick={() => onChoice(false)}>Start Attempt</Button>
			</div>
		</React.Fragment>
	)

	return (
		<Dialog
			className="pre-attempt-import"
			centered
			title="Import Score or Start Attempt"
			width="300"
			customControls={customControls}
		>
			<p>You previously completed this module in another course or assignment.</p>
			<p>
				Your highest previous score is: <b>{highestScore}%</b>
			</p>
		</Dialog>
	)
}

export default PreAttemptImportScoreDialog
