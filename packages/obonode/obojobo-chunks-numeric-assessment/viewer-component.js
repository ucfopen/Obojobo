import './viewer-component.scss'

import React from 'react'

class NumericAssessment extends React.Component {
	render() {
		return (
			<div className="obojobo-draft--chunks--nuremic-assessment">
				<fieldset>
					<div className="input-section">
						<p>x = </p>
						<input id="numeric-assessment--input" placeholder="Your answer..."></input>
						<p> meters</p>
					</div>

					<div className="submit-and-result-container">
						<div className="submit">
							<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
								<button className="button">Check your answer</button>
							</div>
						</div>
					</div>
				</fieldset>
			</div>
		)
		// return (
		// 	<div className="obojobo-draft--chunks--nuremic-assessment button">
		// 		<div className="section">
		// 			<div id="numeric-assessment--content">
		// 				<p>What is 2 + 2 =</p>
		// 			</div>
		// 			{/* <span>Enter your answer:</span> */}
		// 		</div>
		// 		<div className="section">
		// 			<p id="enter-answer-text">Input your answer:</p>
		// 			<input id="numeric-assessment--input" placeholder="Your answer..." />
		// 		</div>
		// 		<div className="section">
		// <div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
		// 	<button className="button">Check your answer</button>
		// </div>
		// 		</div>
		// 	</div>
		// )
	}
}

export default NumericAssessment
