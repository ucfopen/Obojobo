import './numeric-input.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

const EXACT_ANSWER = 'Exact answer'
const MARGIN_OF_ERROR = 'Margin of error'
const WITHIN_A_RANGE = 'Within a range'
const PRECISE_RESPONSE = 'Precise response'
const PERCENT = 'Percent'
const ABSOLUTE = 'Absolute'
const SIGNIFICANT_DIGITS = 'Significant digits'
const DECIMAL_PLACES = 'Decimal places'

const requirementDropdown = [EXACT_ANSWER, MARGIN_OF_ERROR, WITHIN_A_RANGE, PRECISE_RESPONSE]
const marginDropdown = [PERCENT, ABSOLUTE]
const precisionDropdown = [SIGNIFICANT_DIGITS, DECIMAL_PLACES]

class NumericInput extends React.Component {
	renderHeader(requirement) {
		switch (requirement) {
			case EXACT_ANSWER:
				return (
					<>
						<th>Answer</th>
					</>
				)
			case MARGIN_OF_ERROR:
				return (
					<>
						<th>Type</th>
						<th>Answer</th>
						<th>Margin</th>
					</>
				)
			case WITHIN_A_RANGE:
				return (
					<>
						<th>Start</th>
						<th>End</th>
					</>
				)
			case PRECISE_RESPONSE:
				return (
					<>
						<th>Type</th>
						<th>Answer</th>
						<th>Precision</th>
					</>
				)
		}
	}

	renderOption(props) {
		const { response } = props
		const {
			requirement,
			answerInput,
			startInput,
			endInput,
			marginInput,
			precisionInput,
			marginType,
			precisionType
		} = response

		switch (requirement) {
			case EXACT_ANSWER:
				return (
					<td>
						<input
							className="input-item"
							name="answerInput"
							value={answerInput}
							onChange={event => props.onInputChange(event)}
						/>
					</td>
				)
			case PRECISE_RESPONSE:
				return (
					<>
						<td>
							<select
								className="select-item"
								name="precisionType"
								value={precisionType}
								onChange={event => props.onClickDropdown(event)}
							>
								{precisionDropdown.map(requirement => (
									<option>{requirement}</option>
								))}
							</select>
						</td>
						<td>
							<input
								className="input-item"
								name="answerInput"
								value={answerInput}
								onChange={event => props.onInputChange(event)}
							/>
						</td>
						<td>
							<input
								className="input-item"
								name="precisionInput"
								value={precisionInput}
								onChange={() => props.onInputChange(event)}
							/>
						</td>
					</>
				)
			case WITHIN_A_RANGE:
				return (
					<>
						<td>
							<input
								className="input-item"
								name="startInput"
								value={startInput}
								onChange={() => props.onInputChange(event)}
							/>
						</td>
						<td>
							<input
								className="input-item"
								name="endInput"
								value={endInput}
								onChange={() => props.onInputChange(event)}
							/>
						</td>
					</>
				)
			case MARGIN_OF_ERROR:
				return (
					<>
						<td>
							<select
								className="select-item"
								name="marginType"
								value={marginType}
								onChange={event => props.onClickDropdown(event)}
							>
								{marginDropdown.map(requirement => (
									<option>{requirement}</option>
								))}
							</select>
						</td>
						<td>
							<input
								className="input-item"
								name="answerInput"
								value={answerInput}
								onChange={() => props.onInputChange(event)}
							/>
						</td>
						<td>
							<input
								className="input-item"
								name="marginInput"
								value={marginInput}
								onChange={() => props.onInputChange(event)}
							/>
						</td>
					</>
				)
		}
	}

	render() {
		return (
			<div className="numeric-input-container">
				<table>
					<tr>
						<th>Requirement</th>
						{this.renderHeader(this.props.response.requirement)}
					</tr>
					<tr>
						<td>
							<select
								className="select-item"
								name="requirement"
								onChange={event => this.props.onClickDropdown(event)}
							>
								{requirementDropdown.map(requirement => (
									<option>{requirement}</option>
								))}
							</select>
						</td>
						{this.renderOption(this.props)}
					</tr>
				</table>
				<Button className="delete-button" onClick={() => this.props.onDeteteResponse()}>
					×
				</Button>
			</div>
		)
	}
}

export default NumericInput
