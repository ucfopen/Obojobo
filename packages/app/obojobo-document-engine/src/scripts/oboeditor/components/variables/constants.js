const STATIC_VALUE = 'static-value'
const RANDOM_NUMBER = 'random-number'
const STATIC_LIST = 'static-list'
const RANDOM_LIST = 'random-list'
const RANDOM_SEQUENCE = 'random-sequence'
const PICK_ONE = 'pick-one'
const PICK_LIST = 'pick-list'

const typeList = [
	STATIC_VALUE,
	RANDOM_NUMBER,
	STATIC_LIST,
	RANDOM_LIST,
	RANDOM_SEQUENCE,
	PICK_ONE,
	PICK_LIST
]
const mapTypeToString = {
	[STATIC_VALUE]: 'Static Number or Text Value',
	[RANDOM_NUMBER]: 'Random Number',
	[STATIC_LIST]: 'Static List',
	[RANDOM_LIST]: 'Random List',
	[RANDOM_SEQUENCE]: 'Random Sequence',
	[PICK_ONE]: 'Pick One',
	[PICK_LIST]: 'Pick List'
}
const mapTypeToDescription = {
	[STATIC_VALUE]: 'Define a single numeric value',
	[RANDOM_NUMBER]: 'Generate a single number between min and max',
	[STATIC_LIST]: 'Define a list of values',
	[RANDOM_LIST]: 'Generate a list of numbers of any size',
	[RANDOM_SEQUENCE]: 'Generate a list of ascending/descending numbers',
	[PICK_ONE]: 'Choose one item at random from a list you create',
	[PICK_LIST]: 'Generate a sub-list by randomly choosing from a list'
}

const SERIES_TYPE_OPTIONS = ['', 'arithmetic', 'geometric']

export {
	STATIC_VALUE,
	RANDOM_NUMBER,
	STATIC_LIST,
	RANDOM_LIST,
	RANDOM_SEQUENCE,
	PICK_ONE,
	PICK_LIST,
	SERIES_TYPE_OPTIONS,
	typeList,
	mapTypeToString,
	mapTypeToDescription
}
