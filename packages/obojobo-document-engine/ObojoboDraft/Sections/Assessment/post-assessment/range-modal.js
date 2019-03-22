import React from 'react'
import Common from 'Common'

const { SimpleDialog } = Common.components.modal
const getParsedRange = Common.util.RangeParsing.getParsedRange

import './range-modal.scss'

class RangeModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = getParsedRange(this.props.for)
		this.state.type = this.state.min === this.state.max ? 'single' : 'range'
		this.state.for = this.props.for
	}

	generateFor(state, opts) {
		const updatedState = Object.assign(state, opts)
		const { isMinInclusive, min, max, isMaxInclusive } = updatedState

		if (min === max) return min

		return (isMinInclusive ? '[' : '(') + min + ',' + max + (isMaxInclusive ? ']' : ')')
	}

	handleMinChange(event) {
		const min = event.target.value

		this.setState(state => ({
			for: this.generateFor(state, { min }),
			min
		}))
	}

	handleMinInclusiveChange(event) {
		const isMinInclusive = event.target.checked

		this.setState(state => ({
			for: this.generateFor(state, { isMinInclusive }),
			isMinInclusive
		}))
	}

	handleMaxChange(event) {
		const max = event.target.value

		this.setState(state => ({
			for: this.generateFor(state, { max }),
			max
		}))
	}

	handleMaxInclusiveChange(event) {
		const isMaxInclusive = event.target.checked

		this.setState(state => ({
			for: this.generateFor(state, { isMaxInclusive }),
			isMaxInclusive
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
				onConfirm={() => this.props.onConfirm(this.state)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
			>
				<div className="score-range">
					<label htmlFor="editor--sections--assessment--post-assessment--range-modal--type">
						Range Type:
					</label>
					<fieldset id="editor--sections--assessment--post-assessment--range-modal--type">
						<div className="type-input">
							<input
								type="radio"
								name="type"
								value="single"
								id="editor--sections--assessment--post-assessment--range-modal--type-single"
								ref={'input'}
								checked={type === 'single'}
								onChange={this.onCheckType.bind(this)}
							/>
							<label htmlFor="editor--sections--assessment--post-assessment--range-modal--type-single">
								Single Score
							</label>
							{type === 'single' ? (
								<div className="single-type-input">
									<label htmlFor="editor--sections--assessment--post-assessment--range-modal--single-input">
										Score:
									</label>
									<input
										id="editor--sections--assessment--post-assessment--range-modal--single-input"
										name="score"
										min="1"
										max="100"
										step="1"
										type="number"
										placeholder="1-100"
										value={this.state.for}
										onChange={this.handleScoreChange.bind(this)}
									/>
								</div>
							) : null}
						</div>
						<div className="type-input">
							<input
								type="radio"
								name="type"
								value="range"
								id="editor--sections--assessment--post-assessment--range-modal--type-range"
								checked={type === 'range'}
								onChange={this.onCheckType.bind(this)}
							/>
							<label htmlFor="editor--sections--assessment--post-assessment--range-modal--type-range">
								Range
							</label>
							{type === 'range' ? (
								<div className="range-type-input">
									<div>
										<label htmlFor="editor--sections--assessment--post-assessment--range-modal--min">
											Min:
										</label>
										<input
											id="editor--sections--assessment--post-assessment--range-modal--min"
											name="min"
											min="1"
											max="100"
											step="1"
											type="number"
											value={this.state.min}
											onChange={this.handleMinChange.bind(this)}
										/>
										<label htmlFor="editor--sections--assessment--post-assessment--range-modal--min-inclusive">
											Inclusive?
										</label>
										<input
											type="checkbox"
											id="editor--sections--assessment--post-assessment--range-modal--min-inclusive"
											checked={this.state.isMinInclusive}
											onChange={this.handleMinInclusiveChange.bind(this)}
										/>
									</div>
									<div>
										<label htmlFor="editor--sections--assessment--post-assessment--range-modal--max">
											Max:
										</label>
										<input
											id="editor--sections--assessment--post-assessment--range-modal--max"
											name="max"
											min="1"
											max="100"
											step="1"
											type="number"
											value={this.state.max}
											onChange={this.handleMaxChange.bind(this)}
										/>
										<label htmlFor="editor--sections--assessment--post-assessment--range-modal--max-inclusive">
											Inclusive?
										</label>
										<input
											type="checkbox"
											id="editor--sections--assessment--post-assessment--range-modal--max-inclusive"
											checked={this.state.isMaxInclusive}
											onChange={this.handleMaxInclusiveChange.bind(this)}
										/>
									</div>
									<div className="range-display">{this.state.for}</div>
								</div>
							) : null}
						</div>
					</fieldset>
				</div>
			</SimpleDialog>
		)
	}
}

export default RangeModal
