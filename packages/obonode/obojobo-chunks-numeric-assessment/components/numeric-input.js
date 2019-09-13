import './numeric-input.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

const requirementDropdown = [
	'Exact answer',
	'Margin of error',
	'Within a range',
	'Precise response'
]
const marginDropdown = ['Percent', 'Absolute']
const precisionDropdown = ['Significant digits', 'Decimal places']

class NumericInput extends React.Component {
	renderHeader(requirement) {
		switch (requirement) {
			case 'Exact answer':
				return (
					<>
						<th>Requirement</th>
						<th>Answer</th>
					</>
				)
			case 'Margin of error':
				return (
					<>
						<th>Requirement</th>
						<th>Answer</th>
						<th>Margin</th>
						<th>Type</th>
					</>
				)
			case 'Within a range':
				return (
					<>
						<th>Requirement</th>
						<th>Start</th>
						<th>End</th>
					</>
				)
			case 'Precise response':
				return (
					<>
						<th>Requirement</th>
						<th>Answer</th>
						<th>Precision</th>
						<th>Type</th>
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

		return (
			<>
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
				{(() => {
					switch (requirement) {
						case 'Exact answer':
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
						case 'Precise response':
							return (
								<>
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
									<td>
										<select
											className="select-item"
											name="precisionType"
											value={precisionType}
											onChange={event => this.props.onClickDropdown(event)}
										>
											{precisionDropdown.map(requirement => (
												<option>{requirement}</option>
											))}
										</select>
									</td>
								</>
							)
						case 'Within a range':
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
						case 'Margin of error':
							return (
								<>
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
									<td>
										<select
											className="select-item"
											name="marginType"
											value={marginType}
											onChange={event => this.props.onClickDropdown(event)}
										>
											{marginDropdown.map(requirement => (
												<option>{requirement}</option>
											))}
										</select>
									</td>
								</>
							)
					}
				})()}
			</>
		)
	}

	render() {
		return (
			<div className="numeric-input-container">
				<Button className="delete-button" onClick={() => this.props.onDeteteResponse()}>
					×
				</Button>
				<table>
					<tr>{this.renderHeader(this.props.response.requirement)}</tr>
					<tr>{this.renderOption(this.props)}</tr>
				</table>
			</div>
		)
	}
}

export default NumericInput
