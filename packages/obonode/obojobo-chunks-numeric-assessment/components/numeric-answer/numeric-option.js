import React from 'react'

import {
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	PRECISE_RESPONSE,
	requirementDropdown,
	marginDropdown,
	precisionDropdown
} from '../../constants'

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
							onClick={event => event.stopPropagation()}
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
							onClick={event => event.stopPropagation()}
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
							onClick={event => event.stopPropagation()}
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
							onClick={event => event.stopPropagation()}
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
							onClick={event => event.stopPropagation()}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="precisionInput"
							value={precisionInput || ''}
							onChange={() => onHandleInputChange(event)}
							onClick={event => event.stopPropagation()}
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
							onClick={event => event.stopPropagation()}
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
							onClick={event => event.stopPropagation()}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="endInput"
							value={endInput || ''}
							onChange={() => onHandleInputChange(event)}
							onClick={event => event.stopPropagation()}
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
							onClick={event => event.stopPropagation()}
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
							onClick={event => event.stopPropagation()}
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
							onClick={event => event.stopPropagation()}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="marginInput"
							value={marginInput || ''}
							onChange={() => onHandleInputChange(event)}
							onClick={event => event.stopPropagation()}
						/>
					</td>
				</tr>
			)
		default:
			return null
	}
}

export default NumericOption
