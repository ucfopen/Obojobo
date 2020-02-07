import './variable-properties.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import VariableValue from './variable-values'
import { typeList, mapTypeToString } from '../constants'

const { Button } = Common.components

const VariableProperties = ({ variable }) => {
	return (
		<div className="variable-properties">
			<div className="group-item">
				<label>
					<strong>Name:</strong>
				</label>
				<input className="input-item" value={variable.name} />
				<Button>Delete</Button>
			</div>

			<div className="group-item">
				<label>
					<strong>Type:</strong>
				</label>
				<select className="select-item">
					{typeList.map(type => (
						<option value={type} key={type}>
							{mapTypeToString[type]}
						</option>
					))}
				</select>
			</div>

			{/* <VariableValue /> */}
		</div>
	)
}

export default VariableProperties
