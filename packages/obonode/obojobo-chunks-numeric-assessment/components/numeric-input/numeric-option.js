import React from 'react'

import {
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	PRECISE_RESPONSE,
	requirementDropdown,
	marginDropdown,
	precisionDropdown
} from '../../constant'

const NumericOption = ({ numericRule, onHandleInputChange, onClickDropdown }) => {
	const {
		requirement,
		answerInput,
		startInput,
		endInput,
		marginInput,
		precisionInput,
		marginType,
		precisionType
	} = numericRule

	switch (requirement) {
		case EXACT_ANSWER:
			return (
				<tr>
					<td>
						<select
							className="select-item"
							name="requirement"
							value={requirement}
							onChange={event => onClickDropdown(event)}
						>
							{requirementDropdown.map(requirement => (
								<option>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<input
							className="input-item"
							name="answerInput"
							value={answerInput || ''}
							onChange={() => onHandleInputChange(event)}
							contentEditable={false}
						/>
					</td>
				</tr>
			)
		case PRECISE_RESPONSE:
			return (
				<tr>
					<td>
						<select
							className="select-item"
							name="requirement"
							value={requirement}
							onChange={event => onClickDropdown(event)}
						>
							{requirementDropdown.map(requirement => (
								<option>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<select
							className="select-item"
							name="precisionType"
							value={precisionType}
							onChange={() => onClickDropdown(event)}
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
							value={answerInput || ''}
							onChange={event => onHandleInputChange(event)}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="precisionInput"
							value={precisionInput || ''}
							onChange={() => onHandleInputChange(event)}
						/>
					</td>
				</tr>
			)
		case WITHIN_A_RANGE:
			return (
				<tr>
					<td>
						<select
							className="select-item"
							name="requirement"
							value={requirement}
							onChange={event => onClickDropdown(event)}
						>
							{requirementDropdown.map(requirement => (
								<option>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<input
							className="input-item"
							name="startInput"
							value={startInput || ''}
							onChange={() => onHandleInputChange(event)}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="endInput"
							value={endInput || ''}
							onChange={() => onHandleInputChange(event)}
						/>
					</td>
				</tr>
			)
		case MARGIN_OF_ERROR:
			return (
				<tr>
					<td>
						<select
							className="select-item"
							name="requirement"
							value={requirement}
							onChange={event => onClickDropdown(event)}
						>
							{requirementDropdown.map(requirement => (
								<option>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<select
							className="select-item"
							name="marginType"
							value={marginType}
							onChange={event => onClickDropdown(event)}
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
							value={answerInput || ''}
							onChange={() => onHandleInputChange(event)}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="marginInput"
							value={marginInput || ''}
							onChange={() => onHandleInputChange(event)}
						/>
					</td>
				</tr>
			)
		default:
			return null
	}
}

export default NumericOption
