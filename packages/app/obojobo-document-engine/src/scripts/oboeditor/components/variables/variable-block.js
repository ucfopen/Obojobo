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
								<span>Static value </span>
								<b>{variable.value || ''}</b>
							</small>
						)
					case RANDOM_NUMBER:
						return (
							<small>
								<span>Random number </span>
								{variable.valueMin && variable.valueMax ? (
									<b>
										({variable.valueMin}-{variable.valueMax})
									</b>
								) : null}
							</small>
						)
					case STATIC_LIST:
						return (
							<small>
								<b>[{(variable.value || '').split(',').join(', ')}]</b>
							</small>
						)
					case RANDOM_LIST:
						return (
							<small>
								<span>Random list </span>
								{variable.sizeMin && variable.sizeMax && variable.valueMin && variable.valueMax ? (
									<b>
										{variable.sizeMin === variable.sizeMax
											? variable.sizeMin
											: `${variable.sizeMin}-${variable.sizeMax}`}

										{` items of ${variable.valueMin}-${variable.valueMax}`}
									</b>
								) : null}
							</small>
						)
					case RANDOM_SEQUENCE:
						return (
							<small>
								<span>Random seq </span>
								{variable.sizeMin && variable.sizeMax && variable.valueMin && variable.valueMax ? (
									<b>
										{variable.sizeMin === variable.sizeMax
											? variable.sizeMin
											: `${variable.sizeMin}-${variable.sizeMax}`}
										{` items starting from ${variable.valueMin}`}
									</b>
								) : null}
							</small>
						)
					case PICK_ONE:
						return (
							<small>
								<span>Pick from </span>
								<b>[{(variable.value || '').split(',').join(', ')}]</b>
							</small>
						)
					case PICK_LIST:
						if (!variable.value) return <small>Pick list </small>

						return (
							<small>
								{variable.chooseMin && variable.chooseMax && variable.value ? (
									<b>
										{variable.chooseMin === variable.chooseMax
											? variable.chooseMin
											: `${variable.chooseMin}-${variable.chooseMax}`}

										{` items from [${(variable.value || '').split(',').join(', ')}]`}
									</b>
								) : null}
							</small>
						)
				}
			})()}
		</div>
	)
}

export default VariableBlock
