import React from 'react'
import Common from 'Common'

const { SimpleDialog } = Common.components.modal

import './range-modal.scss'

class ImageProperties extends React.Component {
	constructor(props) {
		super(props)

		const splitRange = this.props.for.split(",")
		const score = this.props.for

		if(splitRange.length === 1){ // Single Score
			this.state = {
				type: 'single',
				for: score,
				start: score,
				startInclusive: true,
				end: score,
				endInclusive: true
			}
		} else { // Range
			this.state = {
				type: 'range',
				for: score,
				start: splitRange[0].substring(1),
				startInclusive: score.charAt(0) === '[',
				end: splitRange[1].substring(0,splitRange[1].length-1),
				endInclusive: score.charAt(score.length-1) === ']'
			}

			console.log(this.state)
		}


	}

	generateFor(state, opts) {
		const updatedState = Object.assign(state, opts)
		const { startInclusive, start, end, endInclusive } = updatedState

		if(start === end) return start

		return (
			(startInclusive ? '[': '(')
			+ start + ',' + end
			+ (endInclusive ? ']': ')')
		)
	}

	handleStartChange(event) {
		const start = event.target.value

		this.setState((state) => ({
			for: this.generateFor(state, { start }),
			start
		}))
	}

	handleStartInclusiveChange(event) {
		const startInclusive = event.target.checked

		this.setState((state) => ({
			for: this.generateFor(state, { startInclusive }),
			startInclusive
		}))
	}

	handleEndChange(event) {
		const end = event.target.value

		this.setState((state) => ({
			for: this.generateFor(state, { end }),
			end
		}))
	}

	handleEndInclusiveChange(event) {
		const endInclusive = event.target.checked

		this.setState((state) => ({
			for: this.generateFor(state, { endInclusive }),
			endInclusive
		}))
	}

	handleScoreChange(event) {
		const score = event.target.value

		return this.setState({ for: score })
	}

	onCheckType(event) {
		const type = event.target.value

		return this.setState({ type })
	}

	focusOnFirstElement() {
		return this.refs.input.focus()
	}

	render() {
		const type = this.state.type

		return (
			<SimpleDialog
				cancelOk
				title="Score Range"
				onConfirm={() => this.props.onConfirm(this.state.for)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}>
				<div className="score-range">
					<label htmlFor="typeInput">Range Type:</label>
					<fieldset id="typeInput">
						<div className="type-input">
							<input
								type="radio"
								name="type"
								value="single"
								id="single"
								ref={'input'}
								checked={type === "single"}
								onChange={this.onCheckType.bind(this)}/>
							<label htmlFor="single">Single Score</label>
							{type === "single" ?
								<div
									className="single-type-input"
									id="single-type-input">
									<label htmlFor="score">Score:</label>
									<input
										id="score"
										name="score"
										min="1"
										max="100"
										step="1"
										type="number"
										placeholder="1-100"
										value={this.state.for}
										onChange={this.handleScoreChange.bind(this)}/>
								</div> : null}
						</div>
						<div className="type-input">
							<input
								type="radio"
								name="type"
								value="range"
								id="range"
								checked={type === "range"}
								onChange={this.onCheckType.bind(this)}/>
							<label htmlFor="range">Range</label>
							{type === "range" ?
								<div
									className="range-type-input"
									id="range-type-input">
									<div>
										<label htmlFor="start">Start:</label>
										<input
											id="start"
											name="start"
											min="1"
											max="100"
											step="1"
											type="number"
											value={this.state.start}
											onChange={this.handleStartChange.bind(this)}/>
										<label htmlFor="start-inclusive">
											Inclusive?
										</label>
										<input
											type="checkbox"
											checked={this.state.startInclusive}
											onChange={this.handleStartInclusiveChange.bind(this)}/>
									</div>
									<div>
										<label htmlFor="urlInput">End:</label>
										<input
											id="custom-height"
											name="custom-height"
											min="1"
											max="100"
											step="1"
											type="number"
											value={this.state.end}
											onChange={this.handleEndChange.bind(this)}/>
										<label htmlFor="end-inclusive">
											Inclusive?
										</label>
										<input
											type="checkbox"
											checked={this.state.endInclusive}
											onChange={this.handleEndInclusiveChange.bind(this)}/>
									</div>
									<div className="range-display">
										{this.state.for}
									</div>
								</div> : null}
						</div>
					</fieldset>
				</div>
			</SimpleDialog>
		)
	}
}

export default ImageProperties
