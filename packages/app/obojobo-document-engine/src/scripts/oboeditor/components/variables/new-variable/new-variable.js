import './new-variable.scss'

import React, { useState, useRef, useEffect } from 'react'
import { typeList, mapTypeToString, mapTypeToDescription } from '../constants'

const NewVarible = props => {
	const firstRef = useRef()
	const [currSelectType, setCurrSelectType] = useState('static-value')

	useEffect(() => {
		firstRef.current.focus()
	}, [])

	const onChange = event => {
		setCurrSelectType(event.target.value)
	}

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			props.addVariable(currSelectType)
		}
	}

	const onClick = (e, type) => {
		// In Chrome browser, use arrow keys in radio list will trigger onClick()
		// The following if statement will prevent it from happening
		if (e.type === 'click' && e.clientX !== 0 && e.clientY !== 0) {
			props.addVariable(type)
		}
	}

	return (
		<div className="new-variable">
			<div className="new-variable--title">
				<strong>What type of variable do you want to create?</strong>
			</div>
			<div
				className="new-variable--type-list"
				value={currSelectType}
				onKeyDown={handleKeyDown}
				role="radiogroup"
			>
				{typeList.map(type => (
					<button
						className={
							'new-variable--type-list--single-item' +
							(type === currSelectType ? ' is-selected' : '')
						}
						key={type}
						tabIndex="0"
						value={type}
						onClick={e => onClick(e, type)}
						onMouseEnter={() => setCurrSelectType(type)}
					>
						<label>
							<input
								type="radio"
								id={type}
								value={type}
								checked={type === currSelectType}
								tabIndex="-1"
								onChange={onChange}
								ref={type === currSelectType ? firstRef : null}
							/>
							<strong htmlFor={type}>{mapTypeToString[type]}</strong>
							<label htmlFor={type}>{mapTypeToDescription[type]}</label>
						</label>
					</button>
				))}
			</div>
		</div>
	)
}

export default NewVarible
