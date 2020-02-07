import './new-variable.scss'

import React from 'react'
import { typeList, mapTypeToString, mapTypeToDescription } from '../constants'

const NewVarible = () => {
	return (
		<div className="new-variable">
			<div className="new-variable--title">
				<strong>What type of variable do you want to create?</strong>
			</div>
			<div className="new-variable--type-list">
				{typeList.map(type => (
					<div className="new-variable--type-list--single-item" key={type}>
						<strong>{mapTypeToString[type]}</strong>
						<p>{mapTypeToDescription[type]}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default NewVarible
