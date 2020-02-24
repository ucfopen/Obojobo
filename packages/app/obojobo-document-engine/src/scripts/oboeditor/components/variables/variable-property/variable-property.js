import './variable-property.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import VariableValue from './variable-value'
import { typeList, mapTypeToString } from '../constants'

const { Button, MoreInfoButton } = Common.components

const VariableProperty = props => {
	const { variable, tabRef } = props
	if (!variable) return <div className="variable-properties" />

	const showDeleteModal = () => {
		// eslint-disable-next-line no-alert, no-undef
		if (confirm('Are you sure you want to delete this variable?')) {
			props.onDeleteVariable()
		}
	}

	return (
		<div className="variable-properties">
			<div className="group-item">
				<label>
					<strong>Name:</strong>
				</label>
				<input
					ref={tabRef}
					className="input-item"
					name="name"
					value={variable.name || ''}
					onChange={props.onChange}
				/>
				<div className="help-tip">
					<p>Alphanumeric plus underscore only</p>
				</div>
				<Button className="variable-properties--delete-button" onClick={showDeleteModal}>
					Delete
				</Button>
			</div>

			<div className="group-item">
				<label>
					<strong>Type:</strong>
				</label>
				<select
					className="select-item"
					name="type"
					value={variable.type || ''}
					onChange={props.onChange}
				>
					{typeList.map(type => (
						<option value={type} key={type}>
							{mapTypeToString[type]}
						</option>
					))}
				</select>
			</div>

			<VariableValue variable={variable} onChange={props.onChange} />

			<p>
				<strong>Duplicate:</strong>
			</p>
			<Button className="variable-properties--duplicate-button" onClick={props.onDuplicateVariable}>
				Create another variable like this one
			</Button>
		</div>
	)
}

export default VariableProperty
