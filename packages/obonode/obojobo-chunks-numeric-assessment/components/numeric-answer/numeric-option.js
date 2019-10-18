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

const NumericOption = ({ numericChoice, onHandleInputChange, onClickDropdown }) => {
	const { requirement, answer, start, end, margin, precision, type } = numericChoice

	switch (simplifedToFullText[requirement]) {
		case PRECISE_RESPONSE:
			return (
				<tr>
					<td>
						<select
							className="select-item"
							name="requirement"
							value={simplifedToFullText[requirement]}
							onChange={onClickDropdown}
							onClick={event => event.stopPropagation()}
						>
							{requirementDropdown.map(requirement => (
								<option key={requirement}>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<select
							className="select-item"
							name="type"
							value={simplifedToFullText[type]}
							onChange={onClickDropdown}
							onClick={event => event.stopPropagation()}
						>
							{precisionDropdown.map(requirement => (
								<option key={requirement}>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<input
							className="input-item"
							name="answer"
							value={answer || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="precision"
							value={precision || ''}
							onChange={onHandleInputChange}
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
							onChange={onClickDropdown}
							onClick={event => event.stopPropagation()}
						>
							{requirementDropdown.map(requirement => (
								<option key={requirement}>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<input
							className="input-item"
							name="start"
							value={start || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="end"
							value={end || ''}
							onChange={onHandleInputChange}
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
							onChange={onClickDropdown}
							onClick={event => event.stopPropagation()}
						>
							{requirementDropdown.map(requirement => (
								<option key={requirement}>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<select
							className="select-item"
							name="type"
							value={simplifedToFullText[type]}
							onChange={onClickDropdown}
							onClick={event => event.stopPropagation()}
						>
							{marginDropdown.map(requirement => (
								<option key={requirement}>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<input
							className="input-item"
							name="answer"
							value={answer || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="margin"
							value={margin || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
						/>
					</td>
				</tr>
			)
		default:
		case EXACT_ANSWER:
			return (
				<tr>
					<td>
						<select
							className="select-item"
							name="requirement"
							value={simplifedToFullText[requirement]}
							onChange={onClickDropdown}
							onClick={event => event.stopPropagation()}
						>
							{requirementDropdown.map(requirement => (
								<option key={requirement}>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<input
							className="input-item"
							name="answer"
							value={answer || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							contentEditable={false}
						/>
					</td>
				</tr>
			)
	}
}

export default NumericOption
