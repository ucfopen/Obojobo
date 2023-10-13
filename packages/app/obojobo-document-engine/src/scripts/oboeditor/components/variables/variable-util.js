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
	const desiredAttrsList = ['name', 'type']
	switch(type) {
		case STATIC_VALUE:
		case STATIC_LIST:
		case PICK_ONE:
			desiredAttrsList.push('value')
			break
		case RANDOM_NUMBER:
			desiredAttrsList.push(...['valueMin','valueMax','decimalPlacesMin','decimalPlacesMax'])
			break
		case RANDOM_LIST:
			desiredAttrsList.push(...['sizeMin','sizeMax','unique','valueMin','valueMax','decimalPlacesMin','decimalPlacesMax'])
			break
		case RANDOM_SEQUENCE:
			desiredAttrsList.push(...['sizeMin','sizeMax','start','seriesType', 'step'])
			break
		case PICK_LIST:
			desiredAttrsList.push(...['chooseMin','chooseMax','ordered'])
			break
	}

	// strip any unwanted attributes
	for (const attr in variable) {
		if ( ! desiredAttrsList.includes(attr)) delete variable[attr]
	}
	// add any missing attributes
	desiredAttrsList.forEach(attr => {
		if ( ! Object.keys(variable).includes(attr)) variable[attr] = DEFAULT_VALUES[attr] ?? ''
	})

	// check for new issues
	const variableErrors = {}
	for (const attr in variable) {
		const error = validateVariableValue(attr, variable[attr])
		if (error) variableErrors[attr] = true
	}
	if (Object.keys(variableErrors).length) {
		variable.errors = variableErrors
	}

	return variable
}

const validateVariableValue = (name, value) => {
	switch(name) {
		// variable names should only contain alphanumeric characters and underscores
		// variable names should only ever start with an underscore or a letter
		case 'name':
			return ! (new RegExp(/^[_a-zA-Z]{1}([_a-zA-Z0-9])*$/).test(value))
		// min/max list sizes and decimal place values must be integers
		case 'decimalPlacesMin':
		case 'decimalPlacesMax':
		case 'sizeMin':
		case 'sizeMax':
		case 'chooseMin':
		case 'chooseMax':
			return ( value === '' || ! Number.isInteger(Number(value)))
		// min/max and sequence start/step numeric values have to be numbers, but not integers
		// this should be constrained by the input fields, but we can check it here just to be safe
		case 'valueMin':
		case 'valueMax':
		case 'start':
		case 'step':
			return (value === '' || isNaN(Number(value)))
		// this will be an empty string by default, but one of the options must be chosen to be valid
		case 'seriesType':
			return ! (value === 'arithmetic' || value === 'geometric')
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

export {
	changeVariableToType,
	validateVariableValue,
	validateMultipleVariables
}
