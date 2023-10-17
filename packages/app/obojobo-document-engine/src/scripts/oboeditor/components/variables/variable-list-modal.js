import './variable-list-modal.scss'

import React, { useState, useRef } from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import VariableProperty from './variable-property/variable-property'
import NewVariable from './new-variable/new-variable'
import VariableBlock from './variable-block'
import { getParsedRange } from '../../../common/util/range-parsing'
import { changeVariableToType, validateVariableValue, validateMultipleVariables } from './variable-util'

const { Button } = Common.components
const { SimpleDialog } = Common.components.modal

const rangesToIndividualValues = vars => {
	if (!vars) {
		return []
	}

	return vars.map(v => {
		switch (v.type) {
			case 'random-list': {
				const size = getParsedRange(v.size)
				const decimalPlaces = getParsedRange(v.decimalPlaces)
				const value = getParsedRange(v.value)

				return {
					name: v.name,
					type: v.type,
					sizeMin: size.min,
					sizeMax: size.max,
					decimalPlacesMin: decimalPlaces.min,
					decimalPlacesMax: decimalPlaces.max,
					valueMin: value.min,
					valueMax: value.max,
					unique: v.unique
				}
			}

			case 'random-sequence': {
				const size = getParsedRange(v.size)

				return {
					name: v.name,
					type: v.type,
					sizeMin: size.min,
					sizeMax: size.max,
					start: v.start,
					step: v.step,
					seriesType: v.seriesType
				}
			}

			case 'random-number': {
				const value = getParsedRange(v.value)
				const decimalPlaces = getParsedRange(v.decimalPlaces)

				return {
					name: v.name,
					type: v.type,
					valueMin: value.min,
					valueMax: value.max,
					decimalPlacesMin: decimalPlaces.min,
					decimalPlacesMax: decimalPlaces.max
				}
			}

			case 'pick-list': {
				const choose = getParsedRange(v.choose)

				return {
					name: v.name,
					type: v.type,
					chooseMin: choose.min,
					chooseMax: choose.max,
					value: v.value,
					ordered: v.ordered
				}
			}

			case 'pick-one':
			case 'static-value':
			case 'static-list': {
				return {
					name: v.name,
					type: v.type,
					value: v.value
				}
			}

			default:
				throw 'Unexpected type!'
		}
	})
}

const individualValuesToRanges = vars => {
	if (!vars) {
		return []
	}

	return vars.map(v => {
		switch (v.type) {
			case 'random-list': {
				return {
					name: v.name,
					type: v.type,
					size: `[${v.sizeMin},${v.sizeMax}]`,
					decimalPlaces: `[${v.decimalPlacesMin},${v.decimalPlacesMax}]`,
					value: `[${v.valueMin},${v.valueMax}]`,
					unique: v.unique
				}
			}

			case 'random-sequence': {
				return {
					name: v.name,
					type: v.type,
					size: `[${v.sizeMin},${v.sizeMax}]`,
					start: v.start,
					step: v.step,
					seriesType: v.seriesType
				}
			}

			case 'random-number': {
				return {
					name: v.name,
					type: v.type,
					value: `[${v.valueMin},${v.valueMax}]`,
					decimalPlaces: `[${v.decimalPlacesMin},${v.decimalPlacesMax}]`
				}
			}

			case 'pick-list': {
				return {
					name: v.name,
					type: v.type,
					choose: `[${v.chooseMin},${v.chooseMax}]`,
					value: v.value,
					ordered: v.ordered
				}
			}

			case 'pick-one':
			case 'static-value':
			case 'static-list': {
				return {
					name: v.name,
					type: v.type,
					value: v.value
				}
			}

			default:
				throw 'Unexpected type!'
		}
	})
}

const VariableListModal = props => {
	const firstRef = useRef() // First element to fucus on when open the modal
	const tabRef = useRef() // First element to focus on when open a variable

	const [currSelect, setCurrSelect] = useState(0)
	const [creatingVariable, setCreatingVariable] = useState(false)
	const [variables, setVariables] = useState(validateMultipleVariables(rangesToIndividualValues(props.content.variables)))

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
		// this should also reset issues based on the new type
		if (name === 'type') {
			changeVariableToType(updatedVariables[currSelect], value)
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

		const duplicateVariable = { ...variables[currSelect] }

		const suffixNumList = duplicateVariable.name.match(/\d+$/)
		let prefixName = duplicateVariable.name

		let suffixNum = 2
		if (suffixNumList) {
			suffixNum = suffixNumList[0]
			prefixName = prefixName.substring(0, prefixName.length - (suffixNum + '').length)
		}

		while (nameSet.has(prefixName + suffixNum)) {
			suffixNum++
		}
		duplicateVariable.name = prefixName + suffixNum

		setVariables([...variables, duplicateVariable])
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
			<div className='variable-list-modal-parent'>
				<span className='error-warning'>
					<strong>Warning:</strong> Variables with errors will not be subsituted correctly in the viewer.
					<br/>
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
								onClickVariable={onClickVariable}
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
