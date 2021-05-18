import './variable-list-modal.scss'

import React, { useState, useRef } from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import VariableProperty from './variable-property/variable-property'
import NewVariable from './new-variable/new-variable'
import VariableBlock from './variable-block'
import { RANDOM_NUMBER, RANDOM_LIST } from './constants'
import withoutUndefined from '../../../common/util/without-undefined'
import { getParsedRange } from '../../../common/util/range-parsing'

const { Button } = Common.components
const { SimpleDialog } = Common.components.modal

const rangesToIndividualValues = vars => {
	if (!vars) {
		return []
	}

	return vars.map(v => {
		console.log('reading ', v)
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
	console.log('vlm', props)
	const firstRef = useRef() // First element to fucus on when open the modal
	const tabRef = useRef() // First element to focus on when open a variable

	const [currSelect, setCurrSelect] = useState(0)
	const [creatingVariable, setCreatingVariable] = useState(false)
	const [variables, setVariables] = useState(rangesToIndividualValues(props.content.variables))

	const onClickVariable = index => {
		setCreatingVariable(false)
		setCurrSelect(index)
		tabRef.current.focus() // Tab focus on the first element
	}

	const onChange = event => {
		const name = event.target.name
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value

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
		if (type === RANDOM_NUMBER || type === RANDOM_LIST) {
			newVariable['decimalPlacesMin'] = '0'
			newVariable['decimalPlacesMax'] = '0'
		}
		const updatedVariables = [...variables, newVariable]
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

	console.log('variables', variables)

	return (
		<SimpleDialog
			ok
			title="Variables"
			onConfirm={() => props.onClose({ variables: individualValuesToRanges(variables) })}
			focusOnFirstElement={focusOnFirstElement}
		>
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
		</SimpleDialog>
	)
}

export default VariableListModal
