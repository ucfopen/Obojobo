jest.mock('../../../../src/scripts/common/util/range-parsing')

import {
	STATIC_VALUE,
	STATIC_LIST,
	RANDOM_NUMBER,
	RANDOM_LIST,
	RANDOM_SEQUENCE,
	PICK_ONE,
	PICK_LIST
} from '../../../../src/scripts/oboeditor/components/variables/constants'

import { getParsedRange } from '../../../../src/scripts/common/util/range-parsing'

import {
	changeVariableToType,
	validateVariableValue,
	validateMultipleVariables,
	rangesToIndividualValues,
	individualValuesToRanges
} from '../../../../src/scripts/oboeditor/components/variables/variable-util'

// this is literally the same block as in the source file - may be a more elegant way of doing this?
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
// we may want to make this some kind of shared constant somewhere, rather than the current approach?
const TYPE_KEYS = {
	[STATIC_VALUE]: ['name', 'type', 'value'],
	[STATIC_LIST]: ['name', 'type', 'value'],
	[PICK_ONE]: ['name', 'type', 'value'],
	[RANDOM_NUMBER]: ['name', 'type', 'valueMin', 'valueMax', 'decimalPlacesMin', 'decimalPlacesMax'],
	[RANDOM_LIST]: [
		'name',
		'type',
		'sizeMin',
		'sizeMax',
		'unique',
		'valueMin',
		'valueMax',
		'decimalPlacesMin',
		'decimalPlacesMax'
	],
	[RANDOM_SEQUENCE]: ['name', 'type', 'sizeMin', 'sizeMax', 'start', 'seriesType', 'step'],
	[PICK_LIST]: ['name', 'type', 'chooseMin', 'chooseMax', 'ordered']
}

describe('VariableUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		// this function really just takes a string in the format of [#,#] and returns an object as below
		getParsedRange.mockReturnValue({ min: 0, max: 1 })
	})
	afterEach(() => {
		jest.restoreAllMocks()
	})

	test.each`
		propertyName          | propertyValue        | expectedReturn
		${'name'}             | ${''}                | ${true}
		${'name'}             | ${'!invalid'}        | ${true}
		${'name'}             | ${'invalid_420~'}    | ${true}
		${'name'}             | ${'1invalid'}        | ${true}
		${'name'}             | ${'valid_420'}       | ${false}
		${'name'}             | ${'_ALSO_420_VALID'} | ${false}
		${'decimalPlacesMin'} | ${''}                | ${true}
		${'decimalPlacesMin'} | ${'string'}          | ${true}
		${'decimalPlacesMin'} | ${'1.1'}             | ${true}
		${'decimalPlacesMin'} | ${'1'}               | ${false}
		${'decimalPlacesMin'} | ${'01'}              | ${false}
		${'decimalPlacesMax'} | ${''}                | ${true}
		${'decimalPlacesMax'} | ${'string'}          | ${true}
		${'decimalPlacesMax'} | ${'1.1'}             | ${true}
		${'decimalPlacesMax'} | ${'1'}               | ${false}
		${'decimalPlacesMax'} | ${'01'}              | ${false}
		${'sizeMin'}          | ${''}                | ${true}
		${'sizeMin'}          | ${'string'}          | ${true}
		${'sizeMin'}          | ${'1.1'}             | ${true}
		${'sizeMin'}          | ${'1'}               | ${false}
		${'sizeMin'}          | ${'01'}              | ${false}
		${'sizeMax'}          | ${''}                | ${true}
		${'sizeMax'}          | ${'string'}          | ${true}
		${'sizeMax'}          | ${'1.1'}             | ${true}
		${'sizeMax'}          | ${'1'}               | ${false}
		${'sizeMax'}          | ${'01'}              | ${false}
		${'chooseMin'}        | ${''}                | ${true}
		${'chooseMin'}        | ${'string'}          | ${true}
		${'chooseMin'}        | ${'1.1'}             | ${true}
		${'chooseMin'}        | ${'1'}               | ${false}
		${'chooseMin'}        | ${'01'}              | ${false}
		${'chooseMax'}        | ${''}                | ${true}
		${'chooseMax'}        | ${'string'}          | ${true}
		${'chooseMax'}        | ${'1.1'}             | ${true}
		${'chooseMax'}        | ${'1'}               | ${false}
		${'chooseMax'}        | ${'01'}              | ${false}
		${'valueMin'}         | ${''}                | ${true}
		${'valueMin'}         | ${'string'}          | ${true}
		${'valueMin'}         | ${'1'}               | ${false}
		${'valueMin'}         | ${'1.1'}             | ${false}
		${'valueMax'}         | ${''}                | ${true}
		${'valueMax'}         | ${'string'}          | ${true}
		${'valueMax'}         | ${'1'}               | ${false}
		${'valueMax'}         | ${'1.1'}             | ${false}
		${'start'}            | ${''}                | ${true}
		${'start'}            | ${'string'}          | ${true}
		${'start'}            | ${'1'}               | ${false}
		${'start'}            | ${'1.1'}             | ${false}
		${'step'}             | ${''}                | ${true}
		${'step'}             | ${'string'}          | ${true}
		${'step'}             | ${'1'}               | ${false}
		${'step'}             | ${'1.1'}             | ${false}
		${'seriesType'}       | ${''}                | ${true}
		${'seriesType'}       | ${'invalidOption'}   | ${true}
		${'seriesType'}       | ${'arithmetic'}      | ${false}
		${'seriesType'}       | ${'geometric'}       | ${false}
		${'unidentifiedType'} | ${''}                | ${false}
	`(
		"validateVariableValue returns $expectedReturn when $propertyName is '$propertyValue'",
		({ propertyName, propertyValue, expectedReturn }) => {
			expect(validateVariableValue(propertyName, propertyValue)).toBe(expectedReturn)
		}
	)

	test('validateMultipleVariables identifies all issues with multiple variables', async () => {
		// this isn't ideal since it's calling an actual secondary function besides the one we're testing
		// but unless it's possible to mock functions in a module while also testing that module, we're
		//  kind of stuck doing it this way
		// three variables - one with no problems, one with two problems, one with one problem
		const mockVariablesIn = [
			// no problems
			{ name: 'var1', valueMin: '100', valueMax: '101' },
			// two problems
			{ name: 'var2', valueMin: '', valueMax: '' },
			// one problem
			{ name: 'var3', valueMin: '100', valueMax: '' }
		]
		const variablesOut = validateMultipleVariables(mockVariablesIn)

		// this is probably not ideal, but it'll do
		expect(variablesOut).toEqual([
			mockVariablesIn[0],
			{
				...mockVariablesIn[1],
				errors: {
					valueMin: true,
					valueMax: true
				}
			},
			{
				...mockVariablesIn[2],
				errors: {
					valueMax: true
				}
			}
		])
	})

	const changeVariableAndCheckExpectationsWithType = (variableIn, type, expectErrors = false) => {
		const variableOut = changeVariableToType(variableIn, type)

		const expectedKeys = TYPE_KEYS[type]

		expect(Object.keys(variableOut).length).toEqual(
			expectErrors ? expectedKeys.length + 1 : expectedKeys.length
		)
		expectedKeys.forEach(expectedKey => {
			if (expectedKey !== 'name' && expectedKey !== 'type') {
				expect(variableOut[expectedKey]).toEqual(DEFAULT_VALUES[expectedKey])
			}
		})
		if (!expectErrors) expect(variableOut.errors).toBeUndefined()

		return variableOut
	}
	test('changeVariableToType manages variable type changes properly for all valid types', () => {
		// this will also run validateVariableValue, which isn't ideal if we only want to
		//  test one function - and we also have to adjust our expectations based on real
		//  errors rather than mocked errors
		let variableOut
		let variableIn = {
			name: 'mockvar',
			type: 'does-not-matter',
			someKey: '',
			someOtherKey: ''
		}
		variableOut = changeVariableAndCheckExpectationsWithType(variableIn, STATIC_VALUE)
		// make sure unnecessary props are stripped
		expect(variableOut.someKey).toBeUndefined()
		expect(variableOut.someOtherKey).toBeUndefined()

		// pretend we're changing the variable frome one type to a compatible type
		variableIn = { ...variableOut }
		variableOut = changeVariableAndCheckExpectationsWithType(variableIn, STATIC_LIST)

		// since in this case the variable types are compatible, there should not be any changes
		expect(variableOut).toEqual(variableIn)

		// same as the last one, but add something unnecessary
		variableIn = {
			...variableOut,
			surpriseNewKey: ''
		}
		variableOut = changeVariableAndCheckExpectationsWithType(variableIn, PICK_ONE)
		expect(variableOut.surpriseNewKey).toBeUndefined()

		// now change it to a new type
		variableOut = changeVariableAndCheckExpectationsWithType(variableIn, RANDOM_NUMBER)
		// we happen to know the previous type had this key that the new type does not, so
		//  this is a little magical
		expect(variableOut.value).toBeUndefined()

		variableIn = { ...variableOut }
		variableOut = changeVariableAndCheckExpectationsWithType(variableIn, RANDOM_LIST)
		// a little magical here as well - we happen to know that the previous type had all
		//  the same keys as the new type, but the new type also has two additional keys
		expect(Object.keys(variableIn).length).toBeLessThan(Object.keys(variableOut).length)

		variableIn = { ...variableOut }
		// expect an error here because the default value for 'seriesType' is intentionally incorrect
		variableOut = changeVariableAndCheckExpectationsWithType(variableIn, RANDOM_SEQUENCE, true)
		expect(Object.keys(variableOut.errors).length).toBe(1)
		expect(variableOut.errors).toEqual({ seriesType: true })

		variableIn = { ...variableOut }
		variableOut = changeVariableAndCheckExpectationsWithType(variableIn, PICK_LIST)
		// more magic, but we happen to know here that the new type has totally different keys than the old
		expect(variableOut.sizeMin).toBeUndefined()
		expect(variableOut.sizeMax).toBeUndefined()
		expect(variableOut.start).toBeUndefined()
		expect(variableOut.seriesType).toBeUndefined()
		expect(variableOut.step).toBeUndefined()
	})

	test('rangesToIndividualValues returns an empty array if given nothing', () => {
		expect(rangesToIndividualValues()).toEqual([])
	})

	test('rangesToIndividualValues performs substitutes and returns variables - random list', () => {
		let i = 1
		const mockRandomListVar = () => ({
			name: `mockvar${i++}`,
			type: RANDOM_LIST,
			size: '[0,0]',
			decimalPlaces: '[0,0]',
			value: '[0,0]',
			unique: false
		})

		// parses random list variables
		const variablesIn = [
			mockRandomListVar(),
			{
				...mockRandomListVar(),
				size: '[1,24]'
			},
			{
				...mockRandomListVar(),
				decimalPlaces: '[1,2]'
			}
		]

		const variablesOut = rangesToIndividualValues(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)
		expect(getParsedRange).toHaveBeenCalledTimes(variablesIn.length * 3)

		// iterator to keep track of calls to getParsedRange
		let k = 0
		// this is magical since we happen to know what the expected output should be
		for (let j = 0; j < variablesOut.length; j++) {
			expect(getParsedRange.mock.calls[k++][0]).toEqual(variablesIn[j].size)
			expect(getParsedRange.mock.calls[k++][0]).toEqual(variablesIn[j].decimalPlaces)
			expect(getParsedRange.mock.calls[k++][0]).toEqual(variablesIn[j].value)

			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: RANDOM_LIST,
				sizeMin: 0,
				sizeMax: 1,
				decimalPlacesMin: 0,
				decimalPlacesMax: 1,
				valueMin: 0,
				valueMax: 1,
				unique: false
			})
		}
	})

	test('rangesToIndividualValues performs substitutes and returns variables - random sequence', () => {
		let i = 1
		const mockRandomSequenceVar = () => ({
			name: `mockvar${i++}`,
			type: RANDOM_SEQUENCE,
			size: '[0,0]',
			start: 0,
			step: 0,
			seriesType: 'seriesType'
		})

		// parses random list variables
		const variablesIn = [
			mockRandomSequenceVar(),
			{
				...mockRandomSequenceVar(),
				size: '[1,24]'
			}
		]

		const variablesOut = rangesToIndividualValues(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)
		expect(getParsedRange).toHaveBeenCalledTimes(variablesIn.length)

		// this is magical since we happen to know what the expected output should be
		for (let j = 0; j < variablesOut.length; j++) {
			expect(getParsedRange.mock.calls[j][0]).toEqual(variablesIn[j].size)

			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: RANDOM_SEQUENCE,
				sizeMin: 0,
				sizeMax: 1,
				start: 0,
				step: 0,
				seriesType: 'seriesType'
			})
		}
	})

	test('rangesToIndividualValues performs substitutes and returns variables - random number', () => {
		let i = 1
		const mockRandomNumberVar = () => ({
			name: `mockvar${i++}`,
			type: RANDOM_NUMBER,
			value: '[0,0]',
			decimalPlaces: '[0,0]'
		})

		// parses random list variables
		const variablesIn = [
			mockRandomNumberVar(),
			{
				...mockRandomNumberVar(),
				decimalPlaces: '[1,4]'
			}
		]

		const variablesOut = rangesToIndividualValues(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)
		expect(getParsedRange).toHaveBeenCalledTimes(variablesIn.length * 2)

		// iterator to keep track of calls to getParsedRange
		let k = 0
		// this is magical since we happen to know what the expected output should be
		for (let j = 0; j < variablesOut.length; j++) {
			expect(getParsedRange.mock.calls[k++][0]).toEqual(variablesIn[j].value)
			expect(getParsedRange.mock.calls[k++][0]).toEqual(variablesIn[j].decimalPlaces)

			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: RANDOM_NUMBER,
				valueMin: 0,
				valueMax: 1,
				decimalPlacesMin: 0,
				decimalPlacesMax: 1
			})
		}
	})

	test('rangesToIndividualValues performs substitutes and returns variables - pick list', () => {
		let i = 1
		const mockPickListVar = () => ({
			name: `mockvar${i++}`,
			type: PICK_LIST,
			choose: '[0,0]',
			value: 'value',
			ordered: false
		})

		// parses random list variables
		const variablesIn = [
			mockPickListVar(),
			{
				...mockPickListVar(),
				choose: '[1,4]'
			}
		]

		const variablesOut = rangesToIndividualValues(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)
		expect(getParsedRange).toHaveBeenCalledTimes(variablesIn.length)

		// this is magical since we happen to know what the expected output should be
		for (let j = 0; j < variablesOut.length; j++) {
			expect(getParsedRange.mock.calls[j][0]).toEqual(variablesIn[j].choose)

			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: PICK_LIST,
				chooseMin: 0,
				chooseMax: 1,
				value: 'value',
				ordered: false
			})
		}
	})

	test('rangesToIndividualValues performs substitutes and returns variables - pick one, static value, static list', () => {
		let i = 1
		const mockVar = type => ({
			name: `mockvar${i++}`,
			type: type,
			value: 'value'
		})

		// parses random list variables
		const variablesIn = [
			mockVar(STATIC_VALUE),
			{
				...mockVar(PICK_ONE),
				value: 'pick_one_value'
			},
			{
				...mockVar(STATIC_LIST),
				value: 'static_list_value'
			}
		]

		const variablesOut = rangesToIndividualValues(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)
		expect(getParsedRange).not.toHaveBeenCalled()

		// this is magical since we happen to know what the expected output should be
		for (let j = 0; j < variablesOut.length; j++) {
			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: variablesIn[j].type,
				value: variablesIn[j].value
			})
		}
	})

	test('rangesToIndividualValues throws an error when finding an unsupported variable type', () => {
		const variablesIn = [
			{
				name: 'mockvar',
				type: 'mock-variable-type'
			}
		]
		expect(() => {
			rangesToIndividualValues(variablesIn)
		}).toThrow('Unexpected type!')
	})

	test('individualValuesToRanges returns an empty array if given nothing', () => {
		expect(individualValuesToRanges()).toEqual([])
	})

	test('individualValuesToRanges performs substitutes and returns variables - random list', () => {
		let i = 1
		const mockRandomListVar = () => ({
			name: `mockvar${i++}`,
			type: RANDOM_LIST,
			sizeMin: 0,
			sizeMax: 1,
			decimalPlacesMin: 0,
			decimalPlacesMax: 1,
			valueMin: 0,
			valueMax: 1,
			unique: false
		})

		// parses random list variables
		const variablesIn = [
			mockRandomListVar(),
			{
				...mockRandomListVar(),
				sizeMin: 1,
				sizeMax: 24
			},
			{
				...mockRandomListVar(),
				decimalPlacesMin: 1,
				decimalPlacesMax: 2
			}
		]

		const variablesOut = individualValuesToRanges(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)

		// this is magical since we happen to know what the expected output should be
		// it's also kind of doing the same exact thing the function we're testing is doing, but
		//  this is also the best way to check that output is correct, so it'll have to do for now
		for (let j = 0; j < variablesOut.length; j++) {
			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: RANDOM_LIST,
				size: `[${variablesIn[j].sizeMin},${variablesIn[j].sizeMax}]`,
				decimalPlaces: `[${variablesIn[j].decimalPlacesMin},${variablesIn[j].decimalPlacesMax}]`,
				value: `[${variablesIn[j].valueMin},${variablesIn[j].valueMax}]`,
				unique: false
			})
		}
	})

	test('individualValuesToRanges performs substitutes and returns variables - random sequence', () => {
		let i = 1
		const mockRandomSequenceVar = () => ({
			name: `mockvar${i++}`,
			type: RANDOM_SEQUENCE,
			sizeMin: 0,
			sizeMax: 1,
			start: 0,
			step: 0,
			seriesType: 'seriesType'
		})

		// parses random list variables
		const variablesIn = [
			mockRandomSequenceVar(),
			{
				...mockRandomSequenceVar(),
				sizeMin: 1,
				sizeMax: 24
			}
		]

		const variablesOut = individualValuesToRanges(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)

		// this is magical since we happen to know what the expected output should be
		// it's also kind of doing the same exact thing the function we're testing is doing, but
		//  this is also the best way to check that output is correct, so it'll have to do for now
		for (let j = 0; j < variablesOut.length; j++) {
			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: RANDOM_SEQUENCE,
				size: `[${variablesIn[j].sizeMin},${variablesIn[j].sizeMax}]`,
				start: 0,
				step: 0,
				seriesType: 'seriesType'
			})
		}
	})

	test('individualValuesToRanges performs substitutes and returns variables - random number', () => {
		let i = 1
		const mockRandomNumberVar = () => ({
			name: `mockvar${i++}`,
			type: RANDOM_NUMBER,
			valueMin: 0,
			valueMax: 1,
			decimalPlacesMin: 0,
			decimalPlacesMax: 1
		})

		// parses random list variables
		const variablesIn = [
			mockRandomNumberVar(),
			{
				...mockRandomNumberVar(),
				decimalPlacesMin: 1,
				decimalPlacesMax: 4
			}
		]

		const variablesOut = individualValuesToRanges(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)

		// this is magical since we happen to know what the expected output should be
		// it's also kind of doing the same exact thing the function we're testing is doing, but
		//  this is also the best way to check that output is correct, so it'll have to do for now
		for (let j = 0; j < variablesOut.length; j++) {
			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: RANDOM_NUMBER,
				value: `[${variablesIn[j].valueMin},${variablesIn[j].valueMax}]`,
				decimalPlaces: `[${variablesIn[j].decimalPlacesMin},${variablesIn[j].decimalPlacesMax}]`
			})
		}
	})

	test('individualValuesToRanges performs substitutes and returns variables - pick list', () => {
		let i = 1
		const mockPickListVar = () => ({
			name: `mockvar${i++}`,
			type: PICK_LIST,
			chooseMin: 0,
			chooseMax: 1,
			value: 'value',
			ordered: false
		})

		// parses random list variables
		const variablesIn = [
			mockPickListVar(),
			{
				...mockPickListVar(),
				chooseMin: 1,
				chooseMax: 4
			}
		]

		const variablesOut = individualValuesToRanges(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)

		// this is magical since we happen to know what the expected output should be
		// it's also kind of doing the same exact thing the function we're testing is doing, but
		//  this is also the best way to check that output is correct, so it'll have to do for now
		for (let j = 0; j < variablesOut.length; j++) {
			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: PICK_LIST,
				choose: `[${variablesIn[j].chooseMin},${variablesIn[j].chooseMax}]`,
				value: 'value',
				ordered: false
			})
		}
	})

	test('individualValuesToRanges performs substitutes and returns variables - pick one, static value, static list', () => {
		let i = 1
		const mockVar = type => ({
			name: `mockvar${i++}`,
			type: type,
			value: 'value'
		})

		// parses random list variables
		const variablesIn = [
			mockVar(STATIC_VALUE),
			{
				...mockVar(PICK_ONE),
				value: 'pick_one_value'
			},
			{
				...mockVar(STATIC_LIST),
				value: 'static_list_value'
			}
		]

		const variablesOut = individualValuesToRanges(variablesIn)
		expect(variablesOut.length).toEqual(variablesIn.length)

		// this is magical since we happen to know what the expected output should be
		for (let j = 0; j < variablesOut.length; j++) {
			expect(variablesOut[j]).toEqual({
				name: `mockvar${j + 1}`,
				type: variablesIn[j].type,
				value: variablesIn[j].value
			})
		}
	})

	test('individualValuesToRanges throws an error when finding an unsupported variable type', () => {
		const variablesIn = [
			{
				name: 'mockvar',
				type: 'mock-variable-type'
			}
		]
		expect(() => {
			individualValuesToRanges(variablesIn)
		}).toThrow('Unexpected type!')
	})
})
