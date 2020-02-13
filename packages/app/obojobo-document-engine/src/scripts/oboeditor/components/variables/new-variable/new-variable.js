import './new-variable.scss'

import React, { useState, useRef, useEffect } from 'react'
import { typeList, mapTypeToString, mapTypeToDescription } from '../constants'

const NewVarible = props => {
	const firstRef = useRef()
	const [currSelectType, setCurrSelectType] = useState('static-value')

	useEffect(() => {
		firstRef.current.focus()
	})

	const onKeyPress = event => {
		props.onAddVariable(event.target.value)
	}

	const onChange = event => {
		setCurrSelectType(event.target.value)
	}

	return (
		<div className="new-variable">
			<div className="new-variable--title">
				<strong>What type of variable do you want to create?</strong>
			</div>
			<form
				className="new-variable--type-list"
				value={currSelectType}
				onKeyPress={onKeyPress}
				onChange={onChange}
				ref={firstRef}
			>
				{typeList.map(type => (
					<div
						className={
							'new-variable--type-list--single-item' +
							(type === currSelectType ? ' is-selected' : '')
						}
						key={type}
						onMouseEnter={() => setCurrSelectType(type)}
						onClick={() => props.onAddVariable(type)}
					>
						<label>
							<input type="radio" id={type} value={type} checked={type === currSelectType} />
							<strong htmlFor={type}>{mapTypeToString[type]}</strong>
							<label htmlFor={type}>{mapTypeToDescription[type]}</label>
						</label>
					</div>
				))}
			</form>
		</div>
	)
}

export default NewVarible
