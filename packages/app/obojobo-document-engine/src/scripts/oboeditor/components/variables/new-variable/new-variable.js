import './new-variable.scss'

import React from 'react'
import { typeList, mapTypeToString, mapTypeToDescription } from '../constants'

const NewVarible = props => {
	return (
		<div className="new-variable">
			<div className="new-variable--title">
				<strong>What type of variable do you want to create?</strong>
			</div>
			<form className="new-variable--type-list">
				{typeList.map((type, index) => (
					<div
						className="new-variable--type-list--single-item"
						key={type}
						onClick={() => props.onAddVariable(type)}
					>
						<input type="radio" id={type} name="gender" value={type} checked={index === 0} />
						<strong htmlFor={type}>{mapTypeToString[type]}</strong>
						<label htmlFor={type}>{mapTypeToDescription[type]}</label>
					</div>

					// <div
					// 	className="new-variable--type-list--single-item"
					// 	key={type}
					// 	onClick={() => props.onAddVariable(type)}
					// 	type="radio"
					// >
					// 	<strong>{mapTypeToString[type]}</strong>
					// 	<p>{mapTypeToDescription[type]}</p>
					// </div>
				))}
			</form>
		</div>
	)
}

export default NewVarible
