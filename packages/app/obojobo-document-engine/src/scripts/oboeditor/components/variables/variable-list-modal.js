import './variable-list-modal.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import VariableProperties from './variable-properties/variable-properties'
import NewVariable from './new-variable/new-variable'
import {
	STATIC_VALUE,
	RANDOM_NUMBER,
	STATIC_LIST,
	RANDOM_LIST,
	RANDOM_SEQUENCE,
	PICK_ONE,
	PICK_LIST
} from './constants'

const { Button } = Common.components
const { SimpleDialog } = Common.components.modal

const VariableListModal = props => {
	const firstRef = React.createRef()

	const [currSelect, setCurrSelect] = React.useState(0)
	const [creatingVariable, setCreatingVariable] = React.useState(false)
	const [variables, setVariables] = React.useState([...(props.content.variables || [])])

	const onClickVarible = index => {
		setCreatingVariable(false)
		setCurrSelect(index)
	}

	const onChange = event => {
		const { name, value } = event.target

		const updatedVariables = [...variables]
		updatedVariables[currSelect][name] = value

		// Delete all properties if type is change
		if (name === 'type') {
			for (const attr in updatedVariables[currSelect]) {
				if (attr !== 'name' && attr !== 'type') {
					delete updatedVariables[currSelect][attr]
				}
			}
		}

		setVariables(updatedVariables)
	}

	const onAddVariable = type => {
		const nameSet = new Set()
		for (const variable of variables) {
			nameSet.add(variable.name)
		}

		let index = 1
		while (nameSet.has('var' + (index === 1 ? '' : index))) {
			index++
		}

		const updatedVariables = [...variables, { type, name: 'var' + (index === 1 ? '' : index) }]
		setVariables(updatedVariables)
		setCurrSelect(variables.length)
		setCreatingVariable(false)
	}

	const onDeleteVariable = () => {
		const updatedVariables = [...variables]
		updatedVariables.splice(currSelect, 1)
		setVariables(updatedVariables)
		setCurrSelect(0)
	}

	const onDuplicateVariable = () => {
		const nameSet = new Set()
		for (const variable of variables) {
			nameSet.add(variable.name)
		}

		const duplicateVariable = { ...variables[currSelect] }

		const suffixNumList = duplicateVariable.name.match(/\d+$/)
		let newName = duplicateVariable.name

		let siffixNum = 2
		if (suffixNumList) {
			siffixNum = suffixNumList[0]
			newName = newName.substring(0, newName.length - (siffixNum + '').length)
		}

		while (nameSet.has(newName + siffixNum)) {
			siffixNum++
		}
		duplicateVariable.name = newName + siffixNum

		setVariables([...variables, duplicateVariable])
		setCurrSelect(variables.length)
		setCreatingVariable(false)
	}

	const focusOnFirstElement = () => {
		return firstRef.current.focus()
	}

	return (
		<SimpleDialog
			ok
			title="Variables"
			onConfirm={() => props.onClose({ variables })}
			focusOnFirstElement={focusOnFirstElement}
		>
			<div className="variable-list-modal">
				<div className="variable-list">
					{variables.map((variable, index) => (
						<div
							key={variable.name}
							className={
								'single-variable' +
								(index === currSelect && !creatingVariable ? ' variable-is-selected' : '')
							}
							onClick={() => onClickVarible(index)}
							tabIndex="0"
							ref={index === 0 ? firstRef : null}
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
													{` (${variable.sizeMin || ''}-${variable.valueMax ||
														''} items of ${variable.decimalPlacesMin ||
														''}-${variable.decimalPlacesMax || ''})`}
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
												{variable.value.split(',') >= 1 ? 's' : ''} from{' '}
												<b>{'[' + variable.value.split(',').join(', ') + ']'}</b>
											</small>
										)
								}
							})()}
						</div>
					))}

					{creatingVariable ? (
						<div className="variable-holder">
							<p>New Variable...</p>
						</div>
					) : (
						<Button className="create-variable-button" onClick={() => setCreatingVariable(true)}>
							+ Create Variable
						</Button>
					)}
				</div>

				{creatingVariable ? (
					<NewVariable onAddVariable={onAddVariable} />
				) : (
					<VariableProperties
						variable={variables[currSelect]}
						onChange={onChange}
						onDuplicateVariable={onDuplicateVariable}
						onDeleteVariable={onDeleteVariable}
					/>
				)}
			</div>
		</SimpleDialog>
	)
}

export default VariableListModal
