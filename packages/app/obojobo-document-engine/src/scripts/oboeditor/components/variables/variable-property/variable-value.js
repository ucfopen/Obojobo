import './variable-value.scss'

import React from 'react'
import {
	STATIC_VALUE,
	STATIC_LIST,
	RANDOM_NUMBER,
	RANDOM_LIST,
	RANDOM_SEQUENCE,
	PICK_ONE,
	PICK_LIST,
	SERIES_TYPE_OPTIONS
} from '../constants'

const VariableValues = props => {
	const { variable, onChange } = props

	const onBlurMin = e => {
		const minName = e.target.name
		const minValue = e.target.value

		if (minValue && (minName === 'decimalPlacesMin' || minName === 'sizeMin')) {
			e.target.value = '' + parseInt(e.target.value, 10)
		}

		props.onChange(e)

		let maxName = ''
		switch (minName) {
			case 'valueMin':
				maxName = 'valueMax'
				break
			case 'decimalPlacesMin':
				maxName = 'decimalPlacesMax'
				break
			case 'sizeMin':
				maxName = 'sizeMax'
				break
			case 'chooseMin':
				maxName = 'chooseMax'
		}

		const maxValue = variable[maxName]

		if (!maxValue) {
			return props.onChange({ target: { name: maxName, value: minValue } })
		}

		const minValueInt = parseInt(minValue, 10)
		const maxValueInt = parseInt(maxValue, 10)

		if (minValueInt > maxValueInt) {
			return props.onChange({ target: { name: maxName, value: minValue } })
		}
	}

	const onBlurMax = e => {
		const maxName = e.target.name
		const maxValue = e.target.value

		if (maxValue && (maxName === 'decimalPlacesMax' || maxName === 'sizeMax')) {
			e.target.value = '' + parseInt(e.target.value, 10)
		}
		props.onChange(e)

		let minName = ''
		switch (maxName) {
			case 'valueMax':
				minName = 'valueMin'
				break
			case 'decimalPlacesMax':
				minName = 'decimalPlacesMin'
				break
			case 'sizeMax':
				minName = 'sizeMin'
				break
			case 'chooseMax':
				minName = 'chooseMin'
		}

		const minValue = variable[minName]

		const minValueInt = parseInt(minValue, 10)
		const maxValueInt = parseInt(maxValue, 10)

		if (minValueInt > maxValueInt) {
			return props.onChange({ target: { name: minName, value: maxValue } })
		}
	}

	const getInputClassForType = (type, isSelect = false) => {
		let className = `variable-property--${isSelect ? 'select' : 'input'}-item`
		if (variable.errors && variable.errors[type]) className += ' has-error'
		return className
	}

	const constrainSeriesTypeOption = value => {
		return SERIES_TYPE_OPTIONS.includes(value) ? value : ''
	}

	switch (variable.type) {
		case STATIC_VALUE:
			return (
				<div className="variable-values">
					<label className="variable-values--group">
						<label>Value: </label>
						<input
							className={getInputClassForType('value')}
							type="text"
							name="value"
							value={variable.value || ''}
							onChange={onChange}
						/>
					</label>
				</div>
			)

		case STATIC_LIST:
			return (
				<div className="variable-values">
					<label className="variable-values--group">
						<label>Values: </label>
						<input
							className={getInputClassForType('value')}
							type="text"
							name="value"
							value={variable.value || ''}
							onChange={onChange}
						/>
					</label>
					<p className="variable-values--example-text">
						{"Enter values, separating each value with a comma (eg. '1, 2, 3')"}
					</p>
				</div>
			)

		case RANDOM_NUMBER:
			return (
				<div className="variable-values">
					<label className="variable-values--group">
						<label>Min Value: </label>
						<input
							className={getInputClassForType('valueMin')}
							type="number"
							name="valueMin"
							value={variable.valueMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
					</label>
					<label className="variable-values--group">
						<label>Max Value: </label>
						<input
							className={getInputClassForType('valueMax')}
							type="number"
							name="valueMax"
							value={variable.valueMax || ''}
							onChange={onChange}
							onBlur={onBlurMax}
						/>
					</label>
					<label className="variable-values--group">
						<label>Decimal places: </label>
						<input
							className={getInputClassForType('decimalPlacesMin')}
							type="number"
							min="0"
							name="decimalPlacesMin"
							value={variable.decimalPlacesMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
							aria-label="Enter the minimum number of decimal places"
						/>
						<span>to</span>
						<input
							className={getInputClassForType('decimalPlacesMax')}
							type="number"
							min="0"
							name="decimalPlacesMax"
							value={variable.decimalPlacesMax || ''}
							onChange={onChange}
							onBlur={onBlurMax}
							aria-label="Enter the maximum number of decimal places"
						/>
					</label>
				</div>
			)

		case RANDOM_LIST:
			return (
				<div className="variable-values">
					<label className="variable-values--group">
						<label>List Size: </label>
						<input
							className={getInputClassForType('sizeMin')}
							type="number"
							min="1"
							name="sizeMin"
							value={variable.sizeMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
							aria-label="Enter the minimum size for the list"
						/>
						<span>to</span>
						<input
							className={getInputClassForType('sizeMax')}
							type="number"
							min="1"
							name="sizeMax"
							value={variable.sizeMax || ''}
							onChange={onChange}
							onBlur={onBlurMax}
							aria-label="Enter the maximum size for the list"
						/>
					</label>
					<label className="variable-values--group">
						<label>No duplicate: </label>
						<input
							className="variable-property--checkbox-item"
							type="checkbox"
							name="unique"
							checked={variable.unique === true || variable.unique === 'true'}
							onChange={onChange}
						/>
					</label>
					<label className="variable-values--group">
						<label>Min Value: </label>
						<input
							className={getInputClassForType('valueMin')}
							type="number"
							name="valueMin"
							value={variable.valueMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
					</label>
					<label className="variable-values--group">
						<label>Max Value: </label>
						<input
							className={getInputClassForType('valueMax')}
							type="number"
							name="valueMax"
							value={variable.valueMax || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
					</label>
					<label className="variable-values--group">
						<label>Decimal places: </label>
						<input
							className={getInputClassForType('decimalPlacesMin')}
							type="number"
							min="0"
							name="decimalPlacesMin"
							value={variable.decimalPlacesMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
							aria-label="Enter the minumum number of decimal places for the variable"
						/>
						<span>to</span>
						<input
							className={getInputClassForType('decimalPlacesMax')}
							type="number"
							min="0"
							name="decimalPlacesMax"
							value={variable.decimalPlacesMax || ''}
							onChange={onChange}
							onBlur={onBlurMax}
							aria-label="Enter the maximum number of decimal places for the variable"
						/>
					</label>
				</div>
			)

		case RANDOM_SEQUENCE:
			return (
				<div className="variable-values">
					<label className="variable-values--group">
						<label>List Size: </label>
						<input
							className={getInputClassForType('sizeMin')}
							type="number"
							min="1"
							name="sizeMin"
							value={variable.sizeMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
							aria-label="Enter the minimum list size for the variable"
						/>
						<span>to</span>
						<input
							className={getInputClassForType('sizeMax')}
							type="number"
							min="1"
							name="sizeMax"
							value={variable.sizeMax || ''}
							onChange={onChange}
							onBlur={onBlurMax}
							aria-label="Enter the minimum list size for the variable"
						/>
					</label>

					<label className="variable-values--group">
						<label>First value: </label>
						<input
							className={getInputClassForType('start')}
							type="number"
							name="start"
							value={variable.start || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
					</label>

					<label className="variable-values--group">
						<label>Series type: </label>
						<select
							className={getInputClassForType('seriesType', true)}
							name="seriesType"
							value={constrainSeriesTypeOption(variable.seriesType) || ''}
							onChange={onChange}
						>
							<option disabled value="">
								-- select an option --
							</option>
							<option value="arithmetic">Arithmetic (Add)</option>
							<option value="geometric">Geometric (Multiply)</option>
						</select>
					</label>
					{variable.errors &&
					variable.errors.seriesType &&
					!SERIES_TYPE_OPTIONS.includes(variable.seriesType) ? (
						<span className="invalid-value-warning">
							Invalid option &quot;{variable.seriesType}&quot;
						</span>
					) : null}

					<label className="variable-values--group">
						<label>Step by: </label>
						<input
							className={getInputClassForType('step')}
							type="number"
							name="step"
							value={variable.step || ''}
							onChange={onChange}
						/>
					</label>
				</div>
			)

		case PICK_ONE:
			return (
				<div className="variable-values">
					<label className="variable-values--group">
						<label>Values: </label>
						<input
							className={getInputClassForType('value')}
							name="value"
							value={variable.value || ''}
							onChange={onChange}
						/>
					</label>
					<p className="variable-values--example-text">
						{"Enter values, separating each value with a comma (eg. '1, 2, 3')"}
					</p>
				</div>
			)

		case PICK_LIST:
			return (
				<div className="variable-values">
					<label className="variable-values--group">
						<label>Values: </label>
						<input
							className={getInputClassForType('value')}
							name="value"
							value={variable.value || ''}
							onChange={onChange}
						/>
					</label>
					<p className="variable-values--example-text">
						{"Enter values, separating each value with a comma (eg. '1, 2, 3')"}
					</p>
					<div className="variable-values--group">
						<label>Choose: </label>
						<input
							className={getInputClassForType('chooseMin')}
							type="number"
							min="1"
							name="chooseMin"
							value={variable.chooseMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
							aria-label="Enter the minimum number of values to choose from the list."
						/>
						<span>to</span>
						<input
							className={getInputClassForType('chooseMax')}
							type="number"
							min="1"
							name="chooseMax"
							value={variable.chooseMax || ''}
							onChange={onChange}
							onBlur={onBlurMax}
							aria-label="Enter the maximum number of values to choose from the list."
						/>
					</div>

					<label className="variable-values--group">
						<label>Order: </label>
						<input
							className="variable-property--checkbox-item"
							type="checkbox"
							name="ordered"
							checked={variable.ordered === true || variable.ordered === 'true'}
							value={variable.ordered}
							onChange={onChange}
						/>
					</label>
				</div>
			)

		default:
			return null
	}
}

export default VariableValues
