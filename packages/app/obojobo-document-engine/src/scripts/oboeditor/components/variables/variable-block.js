import React from 'react'
import {
	STATIC_VALUE,
	RANDOM_NUMBER,
	STATIC_LIST,
	RANDOM_LIST,
	RANDOM_SEQUENCE,
	PICK_ONE,
	PICK_LIST
} from './constants'

const VariableBlock = props => {
	const { variable, isSelected, creatingVariable, firstRef, onClick } = props

	return (
		<div
			key={variable.name}
			className={
				'single-variable' + (isSelected && !creatingVariable ? ' variable-is-selected' : '')
			}
			onClick={onClick}
			tabIndex="0"
			ref={firstRef}
		>
			<h4>${variable.name}</h4>
			{(() => {
				switch (variable.type) {
					case STATIC_VALUE:
						return (
							<small>
								<b>{variable.value || ''}</b>
							</small>
						)
					case RANDOM_NUMBER:
						return (
							<small>
								Random number{' '}
								<b>
									({variable.valueMin || ''}-{variable.valueMax || ''})
								</b>
							</small>
						)
					case STATIC_LIST:
						if (!variable.value) return null
						return (
							<small>
								<b>{'[' + variable.value.split(',').join(', ') + ']'}</b>
							</small>
						)
					case RANDOM_LIST:
						return (
							<small>
								Random list
								<b>
									{` (${variable.sizeMin || ''}-${variable.sizeMax ||
										''} items of ${variable.valueMin || ''}-${variable.valueMax || ''})`}
								</b>
							</small>
						)
					case RANDOM_SEQUENCE:
						return (
							<small>
								Random seq
								<b>
									{` (${variable.sizeMin || ''}-${variable.sizeMax ||
										''} items starting from ${variable.valueMin || ''})`}
								</b>
							</small>
						)
					case PICK_ONE:
						if (!variable.value) return null
						return (
							<small>
								{'Pick from '}
								<b>{'[' + variable.value.split(',').join(', ') + ']'}</b>
							</small>
						)
					case PICK_LIST:
						if (!variable.value) return null

						return (
							<small>
								{variable.valueMin || ''}-{variable.valueMax || ''} item
								{variable.value.split(',').length >= 2 ? 's' : ''} from{' '}
								<b>{'[' + variable.value.split(',').join(', ') + ']'}</b>
							</small>
						)
				}
			})()}
		</div>
	)
}

export default VariableBlock
