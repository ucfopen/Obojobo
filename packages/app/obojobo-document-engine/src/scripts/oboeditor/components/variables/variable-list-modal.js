import './variable-list-modal.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import VariableProperties from './variable-property/variable-property'
import NewVariable from './new-variable/new-variable'
import VariableBlock from './variable-block'
import { RANDOM_NUMBER, RANDOM_LIST } from './constants'

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

		const newVariable = { type, name: 'var' + (index === 1 ? '' : index) }
		if (type === RANDOM_NUMBER || type === RANDOM_LIST) {
			newVariable['decimalPlacesMin'] = 0
			newVariable['decimalPlacesMax'] = 0
		}
		const updatedVariables = [...variables, newVariable]
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
						<VariableBlock
							key={variable.name}
							variable={variable}
							currSelect={currSelect}
							isSelected={index === currSelect}
							creatingVariable={creatingVariable}
							firstRef={index === 0 ? firstRef : null}
							onClickVarible={onClickVarible}
							index={index}
							onClick={() => onClickVarible(index)}
						/>
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
