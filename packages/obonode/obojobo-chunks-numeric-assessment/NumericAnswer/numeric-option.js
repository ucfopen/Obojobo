import React from 'react'

import {
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	requirementDropdown,
	marginDropdown,
	simplifedToFullText
} from '../constants'
import NumericEntry from '../entry/numeric-entry'
import {
	OK,
	INPUT_INVALID,
	INPUT_NOT_SAFE,
	INPUT_MATCHES_MULTIPLE_TYPES,
	INPUT_NOT_MATCHED
} from '../entry/numeric-entry-statuses'

const getValidityString = valueString => {
	if (valueString === '') {
		return 'Missing a value'
	}

	switch (new NumericEntry(valueString).status) {
		case OK:
			return ''

		case INPUT_NOT_SAFE:
			return 'This answer is too large of a value'

		case INPUT_MATCHES_MULTIPLE_TYPES:
			return 'This answer matches multiple types'

		case INPUT_NOT_MATCHED:
			return "This answer doesn't match one of the allowed numeric types"

		case INPUT_INVALID:
		default:
			return 'Not a valid numeric value'
	}
}

const NumericOption = ({ numericChoice, onHandleInputChange, onHandleSelectChange }) => {
	const { requirement, answer, start, end, margin, type } = numericChoice

	const onChangeNumericValue = event => {
		// Clear out the error string and then update state
		event.target.setCustomValidity('')
		onHandleInputChange(event)
	}

	const onBlurAnswer = event => {
		event.target.setCustomValidity(getValidityString(event.target.value))
		event.target.reportValidity()
	}

	const onBlurErrorValue = event => {
		const errorAmount = parseFloat(event.target.value)

		if (!Number.isFinite(errorAmount)) {
			event.target.setCustomValidity('Enter a numeric error amount')
		} else if (errorAmount <= 0) {
			event.target.setCustomValidity('Error amount must be greater than 0')
		} else {
			event.target.setCustomValidity('')
		}

		event.target.reportValidity()
	}

	switch (simplifedToFullText[requirement]) {
		case WITHIN_A_RANGE:
			return (
				<div className="is-type-range">
					<label className="select requirement">
						Answer Type
						<select
							className="select-item"
							name="requirement"
							value={simplifedToFullText[requirement]}
							onChange={onHandleSelectChange}
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
							onChange={onChangeNumericValue}
							onBlur={onBlurAnswer}
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
							onChange={onChangeNumericValue}
							onBlur={onBlurAnswer}
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
						Answer Type
						<select
							className="select-item"
							name="requirement"
							value={simplifedToFullText[requirement]}
							onChange={onHandleSelectChange}
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
							onChange={onChangeNumericValue}
							onBlur={onBlurAnswer}
							contentEditable={false}
							autoComplete="off"
						/>
					</label>
					<label className="select margin-type">
						Error Type
						<select
							className="select-item"
							name="margin-type"
							value={simplifedToFullText[type]}
							onChange={onHandleSelectChange}
						>
							{marginDropdown.map(type => (
								<option key={type}>{type}</option>
							))}
						</select>
					</label>
					<label className="input margin-value">
						{type === 'percent' ? '% Error' : '± Error'}
						<input
							className="input-item"
							name="margin"
							value={margin || ''}
							onChange={onChangeNumericValue}
							onBlur={onBlurErrorValue}
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
						Answer Type
						<select
							className="select-item"
							name="requirement"
							value={simplifedToFullText[requirement]}
							onChange={onHandleSelectChange}
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
							onChange={onChangeNumericValue}
							onBlur={onBlurAnswer}
							contentEditable={false}
							autoComplete="off"
						/>
					</label>
				</div>
			)
	}
}

export default NumericOption
