import React from 'react'

import {
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	requirementDropdown,
	marginDropdown,
	simplifedToFullText
} from '../constants'

const NumericOption = ({
	freezeEditor,
	unfreezeEditor,
	numericChoice,
	onHandleInputChange,
	onClickDropdown
}) => {
	const { requirement, answer, start, end, margin, type } = numericChoice

	switch (simplifedToFullText[requirement]) {
		case WITHIN_A_RANGE:
			return (
				<div className="is-type-range">
					<label className="select requirement">
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
					<label className="input start">
						Start
						<input
							className="input-item"
							name="start"
							value={start || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={freezeEditor}
							onBlur={unfreezeEditor}
							contentEditable={false}
							autoComplete="off"
						/>
					</label>
					<label className="input end">
						End
						<input
							className="input-item"
							name="end"
							value={end || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={freezeEditor}
							onBlur={unfreezeEditor}
							contentEditable={false}
							autoComplete="off"
						/>
					</label>
				</div>
			)
		case MARGIN_OF_ERROR:
			return (
				<div className="is-type-margin">
					<label className="select requirement">
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
					<label className="select margin-type">
						Type
						<select
							className="select-item"
							name="margin-type"
							value={simplifedToFullText[type]}
							onChange={onClickDropdown}
							onClick={event => event.stopPropagation()}
						>
							{marginDropdown.map(type => (
								<option key={type}>{type}</option>
							))}
						</select>
					</label>
					<label className="input answer">
						Answer
						<input
							className="input-item"
							name="answer"
							value={answer || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={freezeEditor}
							onBlur={unfreezeEditor}
							contentEditable={false}
							autoComplete="off"
						/>
					</label>
					<label className="input margin-value">
						{type === 'percent' ? '% Error' : '± Error'}
						<input
							className="input-item"
							name="margin"
							value={margin || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={freezeEditor}
							onBlur={unfreezeEditor}
							contentEditable={false}
							autoComplete="off"
						/>
					</label>
				</div>
			)
		default:
		case EXACT_ANSWER:
			return (
				<div className="is-type-exact">
					<label className="select requirement">
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
					<label className="input answer">
						Answer
						<input
							className="input-item"
							name="answer"
							value={answer || ''}
							onChange={onHandleInputChange}
							onClick={event => event.stopPropagation()}
							onFocus={freezeEditor}
							onBlur={unfreezeEditor}
							contentEditable={false}
							autoComplete="off"
						/>
					</label>
				</div>
			)
	}
}

export default NumericOption
