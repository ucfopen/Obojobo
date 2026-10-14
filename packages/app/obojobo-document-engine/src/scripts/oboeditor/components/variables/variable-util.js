import { getParsedRange } from '../../../common/util/range-parsing'

import {
	STATIC_VALUE,
	STATIC_LIST,
	RANDOM_NUMBER,
	RANDOM_LIST,
	RANDOM_SEQUENCE,
	PICK_ONE,
	PICK_LIST
} from './constants'

// reasonable default values for any given attribute
const DEFAULT_VALUES = {
	value: '',
	valueMin: '0',
	valueMax: '0',
	decimalPlacesMin: '0',
	decimalPlacesMax: '0',
	sizeMin: '1',
	sizeMax: '1',
	unique: false,
	start: '0',
	seriesType: '',
	step: '0',
	chooseMin: '0',
	chooseMax: '0',
	ordered: false
}

const changeVariableToType = (variable, type) => {
	const alteredVariable = { ...variable }
	const desiredAttrsList = ['name', 'type']
	switch (type) {
		case STATIC_VALUE:
		case STATIC_LIST:
		case PICK_ONE:
			desiredAttrsList.push('value')
			break
		case RANDOM_NUMBER:
			desiredAttrsList.push(...['valueMin', 'valueMax', 'decimalPlacesMin', 'decimalPlacesMax'])
			break
		case RANDOM_LIST:
			desiredAttrsList.push(
				...[
					'sizeMin',
					'sizeMax',
					'unique',
					'valueMin',
					'valueMax',
					'decimalPlacesMin',
					'decimalPlacesMax'
				]
			)
			break
		case RANDOM_SEQUENCE:
			desiredAttrsList.push(...['sizeMin', 'sizeMax', 'start', 'seriesType', 'step'])
			break
		case PICK_LIST:
			desiredAttrsList.push(...['chooseMin', 'chooseMax', 'ordered'])
			break
	}

	// strip any unwanted attributes
	for (const attr in alteredVariable) {
		if (!desiredAttrsList.includes(attr)) delete alteredVariable[attr]
	}
	// add any missing attributes
	desiredAttrsList.forEach(attr => {
		if (!Object.keys(alteredVariable).includes(attr)) alteredVariable[attr] = DEFAULT_VALUES[attr]
	})

	// check for new issues
	const variableErrors = {}
	for (const attr in alteredVariable) {
		const error = validateVariableValue(attr, alteredVariable[attr])
		if (error) variableErrors[attr] = true
	}
	if (Object.keys(variableErrors).length) {
		alteredVariable.errors = variableErrors
	}

	return alteredVariable
}

const validateVariableValue = (name, value) => {
	switch (name) {
		// variable names should only contain alphanumeric characters and underscores
		// variable names should only ever start with an underscore or a letter
		case 'name':
			return !new RegExp(/^[_a-zA-Z]{1}([_a-zA-Z0-9])*$/).test(value)
		// min/max list sizes and decimal place values must be integers
		case 'decimalPlacesMin':
		case 'decimalPlacesMax':
		case 'sizeMin':
		case 'sizeMax':
		case 'chooseMin':
		case 'chooseMax':
			return value === '' || !Number.isInteger(Number(value))
		// min/max and sequence start/step numeric values have to be numbers, but not integers
		// this should be constrained by the input fields, but we can check it here just to be safe
		case 'valueMin':
		case 'valueMax':
		case 'start':
		case 'step':
			return value === '' || isNaN(Number(value))
		// this will be an empty string by default, but one of the options must be chosen to be valid
		case 'seriesType':
			return !(value === 'arithmetic' || value === 'geometric')
		// no validation should be necessary otherwise
		default:
			break
	}
	return false
}

const validateMultipleVariables = variables => {
	for (const v in variables) {
		const variable = variables[v]
		const variableErrors = {}
		for (const attr in variable) {
			const error = validateVariableValue(attr, variable[attr])
			if (error) variableErrors[attr] = true
		}
		if (Object.keys(variableErrors).length) {
			variables[v].errors = variableErrors
		}
	}
	return variables
}

const rangesToIndividualValues = vars => {
	if (!vars) return []

	return vars.map(v => {
		switch (v.type) {
			case RANDOM_LIST: {
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

			case RANDOM_SEQUENCE: {
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

			case RANDOM_NUMBER: {
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

			case PICK_LIST: {
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

			case PICK_ONE:
			case STATIC_VALUE:
			case STATIC_LIST: {
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
	if (!vars) return []

	return vars.map(v => {
		switch (v.type) {
			case RANDOM_LIST: {
				return {
					name: v.name,
					type: v.type,
					size: `[${v.sizeMin},${v.sizeMax}]`,
					decimalPlaces: `[${v.decimalPlacesMin},${v.decimalPlacesMax}]`,
					value: `[${v.valueMin},${v.valueMax}]`,
					unique: v.unique
				}
			}

			case RANDOM_SEQUENCE: {
				return {
					name: v.name,
					type: v.type,
					size: `[${v.sizeMin},${v.sizeMax}]`,
					start: v.start,
					step: v.step,
					seriesType: v.seriesType
				}
			}

			case RANDOM_NUMBER: {
				return {
					name: v.name,
					type: v.type,
					value: `[${v.valueMin},${v.valueMax}]`,
					decimalPlaces: `[${v.decimalPlacesMin},${v.decimalPlacesMax}]`
				}
			}

			case PICK_LIST: {
				return {
					name: v.name,
					type: v.type,
					choose: `[${v.chooseMin},${v.chooseMax}]`,
					value: v.value,
					ordered: v.ordered
				}
			}

			case PICK_ONE:
			case STATIC_VALUE:
			case STATIC_LIST: {
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

export {
	changeVariableToType,
	validateVariableValue,
	validateMultipleVariables,
	rangesToIndividualValues,
	individualValuesToRanges
}
