import './variable-values.scss'

import React from 'react'

const VariableValues = () => {
	return (
		<div className="variable-values">
			<div className="variable-values--group">
				<label>Min Value: </label>
				<input />
			</div>
			<div className="variable-values--group">
				<label>Max Value: </label>
				<input />
			</div>
			<div className="variable-values--group">
				<label>Decimal places: </label>
				<input />
				<span>to</span>
				<input />
			</div>
		</div>
	)
}

export default VariableValues
