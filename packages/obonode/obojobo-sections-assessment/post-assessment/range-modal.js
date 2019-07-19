import './range-modal.scss'

import Common from 'obojobo-document-engine/src/scripts/common'

import React from 'react'

const { SimpleDialog } = Common.components.modal
const getParsedRange = Common.util.RangeParsing.getParsedRange

class RangeModal extends React.Component {
	constructor(props) {
		super(props)

		let range = getParsedRange(this.props.for)

		// If for some reason we couldn't read the range (bad input) we default to something we understand
		if (!range) {
			range = {
				min: '0',
				max: '100',
				isMinInclusive: true,
				isMaxInclusive: true
			}
		}

		this.state = {
			range,
			type: range.min === range.max ? 'single' : 'range',
			error: null
		}

		this.inputRef = React.createRef()
	}

	getValueFromInput(el) {
		switch (el.type) {
			case 'checkbox':
			case 'radio':
				return el.checked

			case 'number':
				return el.value
		}

		return null
	}

	updateSingleScoreFromEvent(event) {
		this.updateSingleScore(this.getValueFromInput(event.target))
	}

	updateRangeFromEvent(propName, event) {
		const range = {}
		range[propName] = this.getValueFromInput(event.target)

		this.updateRange(range)
	}

	updateSingleScore(singleScore) {
		this.updateRange({
			min: singleScore,
			max: singleScore,
			isMinInclusive: true,
			isMaxInclusive: true
		})
	}

	updateRange(newRangeProps) {
		const newRange = Object.assign({}, this.state.range, newRangeProps)

		this.setState({ range: newRange, error: null })
	}

	generateRangeString(range) {
		const { isMinInclusive, min, max, isMaxInclusive } = range

		if (min === max) return min
		return (isMinInclusive ? '[' : '(') + min + ',' + max + (isMaxInclusive ? ']' : ')')
	}

	onChangeType(newType) {
		switch (newType) {
			case 'single':
				this.updateSingleScore(this.state.range.max)
				break

			case 'range':
				// Switching from 'single' to 'range' we reset the values to a default:
				this.updateRange({
					min: '0',
					max: '100',
					isMinInclusive: true,
					isMaxInclusive: true
				})
				break
		}

		this.setState({ type: newType })
	}

	onToggleNoScore(event) {
		this.updateSingleScore(event.target.checked ? 'no-score' : '')
	}

	getError(range) {
		if (range.min === range.max && range.min === 'no-score') return null

		const min = parseFloat(range.min)
		const max = parseFloat(range.max)

		if (
			min < 0 ||
			max < 0 ||
			min > 100 ||
			max > 100 ||
			!Number.isFinite(min) ||
			!Number.isFinite(max)
		) {
			return 'Scores must be between 0 and 100'
		}

		if (min > max) {
			return "Min can't be larger than max"
		}

		return null
	}

	onConfirm() {
		const error = this.getError(this.state.range)
		this.setState({ error })

		if (error === null) {
			this.props.onConfirm(this.generateRangeString(this.state.range))
		}
	}

	focusOnFirstElement() {
		Common.page.focus(this.inputRef)
	}

	render() {
		const type = this.state.type

		return (
			<SimpleDialog
				cancelOk
				title="Score Range"
				onConfirm={this.onConfirm.bind(this)}
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
								ref={this.inputRef}
								checked={type === 'single'}
								onChange={this.onChangeType.bind(this, 'single')}
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
										min="0"
										max="100"
										step="1"
										type="number"
										value={this.state.range.max}
										onChange={this.updateSingleScoreFromEvent.bind(this)}
									/>
									<span>or</span>
									<input
										type="checkbox"
										id="editor--sections--assessment--post-assessment--range-modal--no-score"
										checked={this.generateRangeString(this.state.range) === 'no-score'}
										onChange={this.onToggleNoScore.bind(this)}
									/>
									<label
										className="null-label"
										htmlFor="editor--sections--assessment--post-assessment--range-modal--no-score"
									>
										no-score
									</label>
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
								onChange={this.onChangeType.bind(this, 'range')}
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
											min="0"
											max="100"
											step="1"
											type="number"
											value={this.state.range.min}
											onChange={this.updateRangeFromEvent.bind(this, 'min')}
										/>
										<input
											type="checkbox"
											id="editor--sections--assessment--post-assessment--range-modal--min-inclusive"
											checked={this.state.range.isMinInclusive}
											onChange={this.updateRangeFromEvent.bind(this, 'isMinInclusive')}
										/>
										<label htmlFor="editor--sections--assessment--post-assessment--range-modal--min-inclusive">
											Inclusive
										</label>
									</div>
									<div>
										<label htmlFor="editor--sections--assessment--post-assessment--range-modal--max">
											Max:
										</label>
										<input
											id="editor--sections--assessment--post-assessment--range-modal--max"
											name="max"
											min="0"
											max="100"
											step="1"
											type="number"
											value={this.state.range.max}
											onChange={this.updateRangeFromEvent.bind(this, 'max')}
										/>
										<input
											type="checkbox"
											id="editor--sections--assessment--post-assessment--range-modal--max-inclusive"
											checked={this.state.range.isMaxInclusive}
											onChange={this.updateRangeFromEvent.bind(this, 'isMaxInclusive')}
										/>
										<label htmlFor="editor--sections--assessment--post-assessment--range-modal--max-inclusive">
											Inclusive
										</label>
									</div>
									<div className="range-display">
										Range: <code>{this.generateRangeString(this.state.range)}</code>
									</div>
								</div>
							) : null}
						</div>
					</fieldset>
					<span className="error">{this.state.error}</span>
				</div>
			</SimpleDialog>
		)
	}
}

export default RangeModal
