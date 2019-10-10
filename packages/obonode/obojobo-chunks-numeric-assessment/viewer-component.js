import './viewer-component.scss'

import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

class NumericAssessment extends React.Component {
	constructor() {
		super()

		this.state = {
			isScored: false,
			isCorrect: true,
			correctLabel: 'Correct',
			incorrectLabel: 'Incorrect',
			isWarning: false,
			warningLabel: 'Answer must be an integer',
			input: ''
		}
	}

	onInputChange(event) {
		const value = event.target.value
		this.setState({
			input: event.target.value,
			isScored: false,
			isWarning: isNaN(value)
		})
	}

	onSubmit() {
		this.setState({
			...this.state,
			isScored: true,
			isCorrect: 4 == this.state.input,
			isWarning: false
		})
	}

	onRetry() {
		this.setState({
			...this.state,
			isScored: false,
			input: ''
		})
	}

	render() {
		const className =
			`component` +
			` obojobo-draft--chunks--numeric-assessment` +
			isOrNot(this.state.isScored, 'scored') +
			isOrNot(this.state.isCorrect, 'correct')

		return (
			<label className={className}>
				<fieldset>
					<div className="input-section pad">
						<div className="input-container">
							<p>x = </p>
							<input
								id="numeric-assessment--input"
								placeholder="Your answer..."
								value={this.state.input}
								onChange={e => this.onInputChange(e)}
							/>
							<p> meters</p>

							{this.state.isWarning ? (
								<div className="warning">
									<p className="warning--content">{this.state.warningLabel}</p>
								</div>
							) : null}
						</div>

						{this.state.isScored && !this.state.isCorrect ? (
							<div className="feedback">
								<p className="feedback--content">Two plus two is four.</p>
							</div>
						) : null}
					</div>

					<div className="submit-and-result-container pad">
						<div className="submit">
							<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
								{!this.state.isScored ? (
									<button className="button" onClick={() => this.onSubmit()}>
										Check your answer
									</button>
								) : (
									<button className="button" onClick={() => this.onRetry()}>
										Retry
									</button>
								)}
							</div>
						</div>

						<div className="result-container">
							{this.state.isScored && this.state.isCorrect ? (
								<p className="result correct">{this.state.correctLabel}</p>
							) : null}
							{this.state.isScored && !this.state.isCorrect ? (
								<p className="result incorrect">{this.state.incorrectLabel}</p>
							) : null}
						</div>
					</div>
				</fieldset>
			</label>
		)
	}
}

export default NumericAssessment
