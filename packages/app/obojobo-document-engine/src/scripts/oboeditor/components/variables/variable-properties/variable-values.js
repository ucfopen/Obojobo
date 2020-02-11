import './variable-values.scss'

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

	switch (variable.type) {
		case STATIC_VALUE:
			return (
				<form className="variable-values">
					<div className="variable-values--group">
						<label>Value: </label>
						<input name="value" value={variable.value || ''} onChange={onChange} />
					</div>
				</form>
			)

		case STATIC_LIST:
			return (
				<form className="variable-values">
					<div className="variable-values--group">
						<label>Values: </label>
						<input type="text" name="value" value={variable.value || ''} onChange={onChange} />
					</div>
				</form>
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
						/>
					</div>
					<div className="variable-values--group">
						<label>Max Value: </label>
						<input
							type="number"
							name="valueMax"
							value={variable.valueMax || ''}
							onChange={onChange}
						/>
					</div>
					<div className="variable-values--group">
						<label>Decimal places: </label>
						<input
							type="number"
							name="decimalPlacesMin"
							value={variable.decimalPlacesMin || ''}
							onChange={onChange}
						/>
						<span>to</span>
						<input
							type="number"
							name="decimalPlacesMax"
							value={variable.decimalPlacesMax || ''}
							onChange={onChange}
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
							name="sizeMin"
							value={variable.sizeMin || ''}
							onChange={onChange}
						/>
						<span>to</span>
						<input
							type="number"
							name="sizeMax"
							value={variable.sizeMax || ''}
							onChange={onChange}
						/>
					</div>
					<div className="variable-values--group">
						<label>No duplicate: </label>
						<input
							type="checkbox"
							name="unique"
							value={variable.unique || false}
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
						/>
					</div>
					<div className="variable-values--group">
						<label>Max Value: </label>
						<input
							type="number"
							name="valueMax"
							value={variable.valueMax || ''}
							onChange={onChange}
						/>
					</div>
					<div className="variable-values--group">
						<label>Decimal places: </label>
						<input
							type="number"
							name="decimalPlacesMin"
							value={variable.decimalPlacesMin || ''}
							onChange={onChange}
						/>
						<span>to</span>
						<input
							type="number"
							name="decimalPlacesMax"
							value={variable.decimalPlacesMax || ''}
							onChange={onChange}
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
							name="sizeMin"
							value={variable.sizeMin || ''}
							onChange={onChange}
						/>
						<span>to</span>
						<input
							type="number"
							name="sizeMax"
							value={variable.sizeMax || ''}
							onChange={onChange}
						/>
					</div>

					<div className="variable-values--group">
						<label>First value: </label>
						<input type="number" />
						<span>to</span>
						<input type="number" />
					</div>

					<div className="variable-values--group">
						<label>Series type: </label>
						<select name="seriesType" value={variable.seriesType || ''} onChange={onChange}>
							<option disabled value="">
								-- select an option --
							</option>
							<option value="arithmetic">Arithmetic</option>
							<option value="geometric">Geometric</option>
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
				</div>
			)

		case PICK_LIST:
			return (
				<div className="variable-values">
					<div className="variable-values--group">
						<label>Values: </label>
						<input name="value" value={variable.value || ''} onChange={onChange} />
					</div>
					<div className="variable-values--group">
						<label>Min Value: </label>
						<input
							type="number"
							name="valueMin"
							value={variable.valueMin || ''}
							onChange={onChange}
						/>
					</div>
					<div className="variable-values--group">
						<label>Max Value: </label>
						<input
							type="number"
							name="valueMax"
							value={variable.valueMax || ''}
							onChange={onChange}
						/>
					</div>
					<div className="variable-values--group">
						<label>Order: </label>
						<input
							type="checkbox"
							name="ordered"
							value={variable.ordered || false}
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
