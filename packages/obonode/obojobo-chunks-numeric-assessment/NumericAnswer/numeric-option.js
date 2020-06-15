import React from 'react'

import {
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	requirementDropdown,
	marginDropdown,
	simplifedToFullText
} from '../constants'

const NumericOption = ({ editor, numericChoice, onHandleInputChange, onClickDropdown }) => {
	const { requirement, answer, start, end, margin, type } = numericChoice

	switch (simplifedToFullText[requirement]) {
		case WITHIN_A_RANGE:
			return (
				<div>
					<label className="select">
						Requirement
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
					</label>
					<label className="input">
						Start
						<input
							className="input-item"
							name="start"
							value={start || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={() => editor.toggleEditable(false)}
							onBlur={() => editor.toggleEditable(true)}
							contentEditable={false}
						/>
					</label>
					<label className="input">
						End
						<input
							className="input-item"
							name="end"
							value={end || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={() => editor.toggleEditable(false)}
							onBlur={() => editor.toggleEditable(true)}
							contentEditable={false}
						/>
					</label>
				</div>
			)
		case MARGIN_OF_ERROR:
			return (
				<div>
					<label className="select">
						Requirement
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
					</label>
					<label className="select">
						Type
						<select
							className="select-item"
							name="type"
							value={simplifedToFullText[type]}
							onChange={onClickDropdown}
							onClick={event => event.stopPropagation()}
						>
							{marginDropdown.map(type => (
								<option key={type}>{type}</option>
							))}
						</select>
					</label>
					<label className="input">
						Answer
						<input
							className="input-item"
							name="answer"
							value={answer || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={() => editor.toggleEditable(false)}
							onBlur={() => editor.toggleEditable(true)}
							contentEditable={false}
						/>
					</label>
					<label className="input">
						Margin
						<input
							className="input-item"
							name="margin"
							value={margin || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={() => editor.toggleEditable(false)}
							onBlur={() => editor.toggleEditable(true)}
							contentEditable={false}
						/>
					</label>
				</div>
			)
		default:
		case EXACT_ANSWER:
			return (
				<div>
					<label className="select">
						Requirement
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
					</label>
					<label className="input">
						Answer
						<input
							className="input-item"
							name="answer"
							value={answer || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={() => editor.toggleEditable(false)}
							onBlur={() => editor.toggleEditable(true)}
							contentEditable={false}
						/>
					</label>
				</div>
			)
	}
}

export default NumericOption
