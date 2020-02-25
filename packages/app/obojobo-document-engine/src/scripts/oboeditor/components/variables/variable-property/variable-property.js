import './variable-property.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import VariableValue from './variable-value'
import { typeList, mapTypeToString } from '../constants'

const { Button, MoreInfoButton } = Common.components

const VariableProperty = props => {
	const { variable, tabRef } = props
	if (!variable) return <div className="variable-property" />

	const showDeleteModal = () => {
		// eslint-disable-next-line no-alert, no-undef
		if (confirm('Are you sure you want to delete this variable?')) {
			props.deleteVariable()
		}
	}

	return (
		<div className="variable-property">
			<label className="group-item">
				<label>
					<strong>Name:</strong>
				</label>
				<input
					ref={tabRef}
					className="variable-property--input-item"
					name="name"
					value={variable.name || ''}
					onChange={props.onChange}
				/>

				<MoreInfoButton ariaLabel="Click to explain variable's name rules">
					<p>Alphanumeric plus underscore only</p>
				</MoreInfoButton>

				<Button
					className="variable-property--delete-button"
					onClick={showDeleteModal}
					aria-label="Delete"
				>
					Delete
				</Button>
			</label>

			<label className="group-item">
				<label>
					<strong>Type:</strong>
				</label>
				<select
					className="variable-property--select-item"
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
			</label>

			<VariableValue variable={variable} onChange={props.onChange} />

			<p>
				<strong>Duplicate:</strong>
			</p>
			<Button className="variable-property--duplicate-button" onClick={props.duplicateVariable}>
				Create another variable like this one
			</Button>
		</div>
	)
}

export default VariableProperty
