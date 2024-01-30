import './variable-list-modal.scss'

import React, { useState, useRef } from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import VariableProperty from './variable-property/variable-property'
import NewVariable from './new-variable/new-variable'
import VariableBlock from './variable-block'
import {
	changeVariableToType,
	validateVariableValue,
	validateMultipleVariables,
	rangesToIndividualValues,
	individualValuesToRanges
} from './variable-util'

const { Button } = Common.components
const { SimpleDialog } = Common.components.modal

const VariableListModal = props => {
	const firstRef = useRef() // First element to fucus on when open the modal
	const tabRef = useRef() // First element to focus on when open a variable

	const [currSelect, setCurrSelect] = useState(0)
	const [creatingVariable, setCreatingVariable] = useState(false)
	const [variables, setVariables] = useState(
		validateMultipleVariables(rangesToIndividualValues(props.content.variables))
	)

	const onClickVariable = index => {
		setCreatingVariable(false)
		setCurrSelect(index)
		tabRef.current.focus() // Tab focus on the first element
	}

	// manage variable property changes and validation, also add/remove variable errors
	const onChange = event => {
		const name = event.target.name
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value

		const updatedVariables = [...variables]
		updatedVariables[currSelect][name] = value

		const variableErrors = updatedVariables[currSelect].errors ?? {}

		// if the variable type is changed, keep any relevant attributes and remove any others
		// this should also reset errors based on the new type
		if (name === 'type') {
			updatedVariables[currSelect] = changeVariableToType(updatedVariables[currSelect], value)
		} else {
			// indicate any errors with the changed property - or remove any that existed if it's valid
			const error = validateVariableValue(name, value)
			if (error) {
				variableErrors[name] = true
			} else {
				delete variableErrors[name]
			}

			if (Object.keys(variableErrors).length) {
				updatedVariables[currSelect].errors = variableErrors
			} else {
				delete updatedVariables[currSelect].errors
			}
		}

		setVariables(updatedVariables)
	}

	const addVariable = type => {
		const nameSet = new Set()
		for (const variable of variables) {
			nameSet.add(variable.name)
		}

		let index = 1
		while (nameSet.has('var' + (index === 1 ? '' : index))) {
			index++
		}

		const newVariable = { type, name: 'var' + (index === 1 ? '' : index) }

		const updatedVariables = [...variables, changeVariableToType(newVariable, type)]
		setVariables(updatedVariables)
		setCurrSelect(variables.length)
		setCreatingVariable(false)
	}

	const deleteVariable = () => {
		const updatedVariables = [...variables]
		updatedVariables.splice(currSelect, 1)
		setVariables(updatedVariables)
		setCurrSelect(0)
	}

	const duplicateVariable = () => {
		// Find suffix number for duplicate variable
		const nameSet = new Set()
		for (const variable of variables) {
			nameSet.add(variable.name)
		}

		const duplicate = { ...variables[currSelect] }

		const suffixNumList = duplicate.name.match(/\d+$/)
		let prefixName = duplicate.name

		let suffixNum = 2
		if (suffixNumList) {
			suffixNum = suffixNumList[0]
			prefixName = prefixName.substring(0, prefixName.length - (suffixNum + '').length)
		}

		while (nameSet.has(prefixName + suffixNum)) {
			suffixNum++
		}
		duplicate.name = prefixName + suffixNum

		setVariables([...variables, duplicate])
		setCurrSelect(variables.length)
		setCreatingVariable(false)
	}

	const focusOnFirstElement = () => {
		return firstRef.current.focus()
	}

	const handleOnConfirm = () => {
		const processedVariables = individualValuesToRanges(variables)
		props.onClose({ variables: processedVariables })
	}

	return (
		<SimpleDialog
			ok
			title="Variables"
			onConfirm={handleOnConfirm}
			focusOnFirstElement={focusOnFirstElement}
		>
			<div className="variable-list-modal-parent">
				<span className="error-warning">
					<strong>Warning:</strong> Variables with errors will not be subsituted correctly in the
					viewer.
					<br />
					Please resolve all highlighted variable errors.
				</span>
				<div className="variable-list-modal">
					<nav className="variable-list" role="navigation">
						{variables.map((variable, index) => (
							<VariableBlock
								key={variable.name}
								variable={{ ...variable }}
								currSelect={currSelect}
								isSelected={index === currSelect}
								creatingVariable={creatingVariable}
								firstRef={index === 0 ? firstRef : null}
								index={index}
								onClick={() => onClickVariable(index)}
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
					</nav>

					{creatingVariable ? (
						<NewVariable addVariable={addVariable} />
					) : (
						<VariableProperty
							variable={variables[currSelect]}
							onChange={onChange}
							duplicateVariable={duplicateVariable}
							deleteVariable={deleteVariable}
							tabRef={tabRef}
						/>
					)}
				</div>
			</div>
		</SimpleDialog>
	)
}

export default VariableListModal
