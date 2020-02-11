import './variable-list-modal.scss'

import React, { useState } from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import VariableProperties from './variable-properties/variable-properties'
import VariableList from './variable-list/variable-list'
import NewVariable from './new-variable/new-variable'

const { SimpleDialog } = Common.components.modal

const VariableListModal = props => {
	const [currSelect, setCurrSelect] = useState(0)
	const [creatingVariable, setCreatingVariable] = useState(false)
	const [variables, setVariables] = useState(props.content.variables || [])

	const onClickVarible = index => {
		setCreatingVariable(false)
		setCurrSelect(index)
	}

	const onChange = event => {
		const { name, value } = event.target

		const updatedVariables = [...variables]
		updatedVariables[currSelect][name] = value
		setVariables(updatedVariables)
	}

	const onAddVariable = type => {
		const nameSet = new Set()
		for (const variable of variables) {
			nameSet.add(variable.name)
		}

		let index = 0
		while (nameSet.has('no_name' + (index === 0 ? '' : index))) {
			index++
		}

		setVariables([...variables, { type, name: 'no_name' + (index === 0 ? '' : index) }])
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

		let index = 2
		while (nameSet.has(duplicateVariable.name + index)) {
			index++
		}
		duplicateVariable.name = duplicateVariable.name + index

		setVariables([...variables, duplicateVariable])
		setCurrSelect(variables.length)
		setCreatingVariable(false)
	}

	return (
		<SimpleDialog ok title="Variables" onConfirm={() => props.onClose({ variables })}>
			<div className="variable-list-modal">
				<VariableList
					variables={variables}
					currSelect={currSelect}
					onClickVarible={onClickVarible}
					setCreatingVariable={() => setCreatingVariable(true)}
					onAddVariable={onAddVariable}
				/>

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
