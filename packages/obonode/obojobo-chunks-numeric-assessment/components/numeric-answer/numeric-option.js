import React from 'react'

import {
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	PRECISE_RESPONSE,
	requirementDropdown,
	marginDropdown,
	precisionDropdown,
	simplifedToFullText
} from '../../constants'

const NumericOption = ({ numericRule, onHandleInputChange, onClickDropdown }) => {
	const { requirement, answer, start, end, margin, precision, type } = numericRule

	switch (simplifedToFullText[requirement]) {
		case EXACT_ANSWER:
			return (
				<tr>
					<td>
						<select
							className="select-item"
							name="requirement"
							value={simplifedToFullText[requirement]}
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
							name="answer"
							value={answer || ''}
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
							value={simplifedToFullText[requirement]}
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
							name="type"
							value={simplifedToFullText[type]}
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
							name="answer"
							value={answer || ''}
							onChange={event => onHandleInputChange(event)}
							onClick={event => event.stopPropagation()}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="precision"
							value={precision || ''}
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
							value={simplifedToFullText[requirement]}
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
							name="start"
							value={start || ''}
							onChange={() => onHandleInputChange(event)}
							onClick={event => event.stopPropagation()}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="end"
							value={end || ''}
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
							value={simplifedToFullText[requirement]}
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
							name="type"
							value={simplifedToFullText[type]}
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
							name="answer"
							value={answer || ''}
							onChange={() => onHandleInputChange(event)}
							onClick={event => event.stopPropagation()}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="margin"
							value={margin || ''}
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
