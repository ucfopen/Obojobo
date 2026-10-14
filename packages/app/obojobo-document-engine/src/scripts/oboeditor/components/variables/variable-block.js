import './variable-block.scss'

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
		<button
			key={variable.name}
			className={
				'single-variable' + (isSelected && !creatingVariable ? ' variable-is-selected' : '')
			}
			onClick={onClick}
			tabIndex="0"
			ref={firstRef}
			aria-label={'Jump to variable ' + variable.name}
		>
			<h4>${variable.name}</h4>
			<small>
				{(() => {
					switch (variable.type) {
						case STATIC_VALUE:
							return (
								<>
									<span>Static value </span>
									<b aria-label={variable.value}>{variable.value || ''}</b>
								</>
							)
						case RANDOM_NUMBER:
							return (
								<>
									<span>Random number </span>
									{variable.valueMin && variable.valueMax ? (
										<b>
											({variable.valueMin}-{variable.valueMax})
										</b>
									) : null}
								</>
							)
						case STATIC_LIST:
							return (
								<>
									<b>[{(variable.value || '').split(',').join(', ')}]</b>
								</>
							)
						case RANDOM_LIST:
							return (
								<>
									<span>Random list </span>
									{variable.sizeMin &&
									variable.sizeMax &&
									variable.valueMin &&
									variable.valueMax ? (
										<b>
											{variable.sizeMin === variable.sizeMax
												? variable.sizeMin
												: `${variable.sizeMin}-${variable.sizeMax}`}

											{` item${
												variable.sizeMin === variable.sizeMax &&
												parseInt(variable.sizeMin, 10) === 1
													? ''
													: 's'
											} of ${variable.valueMin}-${variable.valueMax}`}
										</b>
									) : null}
								</>
							)
						case RANDOM_SEQUENCE:
							return (
								<>
									<span>Random seq </span>
									{variable.sizeMin && variable.sizeMax && variable.start ? (
										<b>
											{variable.sizeMin === variable.sizeMax
												? variable.sizeMin
												: `${variable.sizeMin}-${variable.sizeMax}`}
											{` item${
												variable.sizeMin === variable.sizeMax &&
												parseInt(variable.sizeMin, 10) === 1
													? ''
													: 's'
											} starting from ${variable.start}`}
										</b>
									) : null}
								</>
							)
						case PICK_ONE:
							return (
								<>
									<span>Pick from </span>
									<b>[{(variable.value || '').split(',').join(', ')}]</b>
								</>
							)
						case PICK_LIST:
							return (
								<>
									{variable.chooseMin && variable.chooseMax ? (
										<b>
											{variable.chooseMin === variable.chooseMax
												? variable.chooseMin
												: `${variable.chooseMin}-${variable.chooseMax}`}

											{` item${
												variable.chooseMin === variable.chooseMax &&
												parseInt(variable.chooseMin, 10) === 1
													? ''
													: 's'
											} from [${(variable.value || '').split(',').join(', ')}]`}
										</b>
									) : (
										<b>Pick List</b>
									)}
								</>
							)
					}
				})()}
			</small>
			{variable.errors ? (
				<small className="error-count">
					<span>{Object.keys(variable.errors).length} issues</span>
				</small>
			) : null}
		</button>
	)
}

export default VariableBlock
