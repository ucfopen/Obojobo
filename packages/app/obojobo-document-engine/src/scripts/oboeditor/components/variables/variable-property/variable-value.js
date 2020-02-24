import './variable-value.scss'

import React from 'react'
import {
	STATIC_VALUE,
	STATIC_LIST,
	RANDOM_NUMBER,
	RANDOM_LIST,
	RANDOM_SEQUENCE,
	PICK_ONE,
	PICK_LIST
} from '../constants'

const VariableValues = props => {
	const { variable, onChange } = props

	const onBlurMin = e => {
		if (e.target.name === 'decimalPlacesMin' || e.target.name === 'sizeMin') {
			e.target.value = '' + parseInt(e.target.value, 10)
		}
		props.onChange(e)

		const minName = e.target.name
		const minValue = e.target.value

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

	const onBurMax = e => {
		if (e.target.name === 'decimalPlacesMax' || e.target.name === 'sizeMax') {
			e.target.value = '' + parseInt(e.target.value, 10)
		}
		props.onChange(e)

		const maxName = e.target.name
		const maxValue = e.target.value

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

	switch (variable.type) {
		case STATIC_VALUE:
			return (
				<div className="variable-values">
					<div className="variable-values--group">
						<label>Value: </label>
						<input type="text" name="value" value={variable.value || ''} onChange={onChange} />
					</div>
				</div>
			)

		case STATIC_LIST:
			return (
				<div className="variable-values">
					<div className="variable-values--group">
						<label>Values: </label>
						<input type="text" name="value" value={variable.value || ''} onChange={onChange} />
					</div>
					<p className="variable-values--example-text">
						{"Enter values, separating each value with a comma (eg. '1, 2, 3')"}
					</p>
				</div>
			)

		case RANDOM_NUMBER:
			return (
				<div className="variable-values">
					<div className="variable-values--group">
						<label>Min Value: </label>
						<input
							type="number"
							name="valueMin"
							value={variable.valueMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
					</div>
					<div className="variable-values--group">
						<label>Max Value: </label>
						<input
							type="number"
							name="valueMax"
							value={variable.valueMax || ''}
							onChange={onChange}
							onBlur={onBurMax}
						/>
					</div>
					<div className="variable-values--group">
						<label>Decimal places: </label>
						<input
							type="number"
							min="0"
							name="decimalPlacesMin"
							value={variable.decimalPlacesMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
						<span>to</span>
						<input
							type="number"
							min="0"
							name="decimalPlacesMax"
							value={variable.decimalPlacesMax || ''}
							onChange={onChange}
							onBlur={onBurMax}
						/>
					</div>
				</div>
			)

		case RANDOM_LIST:
			return (
				<div className="variable-values">
					<div className="variable-values--group">
						<label>List Size: </label>
						<input
							type="number"
							min="1"
							name="sizeMin"
							value={variable.sizeMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
						<span>to</span>
						<input
							type="number"
							min="1"
							name="sizeMax"
							value={variable.sizeMax || ''}
							onChange={onChange}
							onBlur={onBurMax}
						/>
					</div>
					<div className="variable-values--group">
						<label>No duplicate: </label>
						<input
							type="checkbox"
							name="unique"
							checked={variable.unique === true || variable.unique === 'true'}
							onChange={onChange}
						/>
					</div>
					<div className="variable-values--group">
						<label>Min Value: </label>
						<input
							type="number"
							name="valueMin"
							value={variable.valueMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
					</div>
					<div className="variable-values--group">
						<label>Max Value: </label>
						<input
							type="number"
							name="valueMax"
							value={variable.valueMax || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
					</div>
					<div className="variable-values--group">
						<label>Decimal places: </label>
						<input
							type="number"
							min="0"
							name="decimalPlacesMin"
							value={variable.decimalPlacesMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
						<span>to</span>
						<input
							type="number"
							min="0"
							name="decimalPlacesMax"
							value={variable.decimalPlacesMax || ''}
							onChange={onChange}
							onBlur={onBurMax}
						/>
					</div>
				</div>
			)

		case RANDOM_SEQUENCE:
			return (
				<div className="variable-values">
					<div className="variable-values--group">
						<label>List Size: </label>
						<input
							type="number"
							min="1"
							name="sizeMin"
							value={variable.sizeMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
						<span>to</span>
						<input
							type="number"
							min="1"
							name="sizeMax"
							value={variable.sizeMax || ''}
							onChange={onChange}
							onBlur={onBurMax}
						/>
					</div>

					<div className="variable-values--group">
						<label>First value: </label>
						<input
							type="number"
							name="start"
							value={variable.start || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
					</div>

					<div className="variable-values--group">
						<label>Series type: </label>
						<select name="seriesType" value={variable.seriesType || ''} onChange={onChange}>
							<option disabled value="">
								-- select an option --
							</option>
							<option value="arithmetic">Arithmetic (Add)</option>
							<option value="geometric">Geometric (Multiply)</option>
						</select>
					</div>

					<div className="variable-values--group">
						<label>Step by: </label>
						<input type="number" name="step" value={variable.step || ''} onChange={onChange} />
					</div>
				</div>
			)

		case PICK_ONE:
			return (
				<div className="variable-values">
					<div className="variable-values--group">
						<label>Values: </label>
						<input name="value" value={variable.value || ''} onChange={onChange} />
					</div>
					<p className="variable-values--example-text">
						{"Enter values, separating each value with a comma (eg. '1, 2, 3')"}
					</p>
				</div>
			)

		case PICK_LIST:
			return (
				<div className="variable-values">
					<div className="variable-values--group">
						<label>Values: </label>
						<input name="value" value={variable.value || ''} onChange={onChange} />
					</div>
					<p className="variable-values--example-text">
						{"Enter values, separating each value with a comma (eg. '1, 2, 3')"}
					</p>
					<div className="variable-values--group">
						<label>Choose: </label>
						<input
							type="number"
							min="1"
							name="chooseMin"
							value={variable.chooseMin || ''}
							onChange={onChange}
							onBlur={onBlurMin}
						/>
						<span>to</span>
						<input
							type="number"
							min="1"
							name="chooseMax"
							value={variable.chooseMax || ''}
							onChange={onChange}
							onBlur={onBurMax}
						/>
					</div>

					<div className="variable-values--group">
						<label>Order: </label>
						<input
							type="checkbox"
							name="ordered"
							checked={variable.ordered === true || variable.ordered === 'true'}
							value={variable.ordered}
							onChange={onChange}
						/>
					</div>
				</div>
			)

		default:
			return null
	}
}

export default VariableValues
