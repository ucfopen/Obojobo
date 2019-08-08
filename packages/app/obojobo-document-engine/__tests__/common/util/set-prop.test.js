/* eslint-disable no-undefined */
/* eslint-disable no-console */

import setProp from '../../../src/scripts/common/util/set-prop.js'
import mockConsole from 'jest-mock-console'

describe('setProp', () => {
	let target
	let restoreConsole

	beforeEach(() => {
		target = {}
		restoreConsole = mockConsole('error')
	})

	afterEach(() => {
		restoreConsole()
	})

	test('sets default values when no attrs passed', () => {
		setProp(target, {}, 'propName', 'default-value')
		expect(target).toEqual({
			propName: 'default-value'
		})
	})

	test('sets default values when attr does not exist', () => {
		setProp(target, { myProp: 'new-value' }, 'propName', 'default-value')
		expect(target).toEqual({
			propName: 'default-value'
		})
	})

	test('sets values if in attrs', () => {
		setProp(target, { myProp: 'new-value' }, 'myProp', 'default-value')
		expect(target).toEqual({
			myProp: 'new-value'
		})
	})

	test('calls set function if available', () => {
		const transformFn = jest.fn()
		transformFn.mockImplementation(x => x)

		setProp(target, { myProp: 'new-value' }, 'myProp', 'default-value', transformFn)
		expect(target).toEqual({
			myProp: 'new-value'
		})
		expect(transformFn).toHaveBeenCalledTimes(1)
		expect(transformFn).toHaveBeenCalledWith('new-value')
	})

	test('set function value is used to alter state', () => {
		const transformFn = jest.fn()
		transformFn.mockReturnValue('result-from-transformFn')

		setProp(target, { myProp: 'new-value' }, 'myProp', 'default-value', transformFn)
		expect(target).toEqual({
			myProp: 'result-from-transformFn'
		})
		expect(transformFn).toHaveBeenCalledTimes(1)
	})

	test('sets to default value if set function returns null', () => {
		setProp(target, { myProp: 'new-value' }, 'myProp', 'default-value', () => null)
		expect(target).toEqual({
			myProp: 'default-value'
		})
	})

	test('allowedValues uses default value when requested value is not allowed', () => {
		// desired value NOT in allowed values
		setProp(target, { myProp: 'new-value' }, 'myProp', 'default-value', undefined, ['other-value'])
		expect(target).toEqual({
			myProp: 'default-value'
		})

		// desired value IS in allowed values
		setProp(target, { myProp: 'new-value' }, 'myProp', 'default-value', undefined, ['new-value'])
		expect(target).toEqual({
			myProp: 'new-value'
		})
	})

	test('when transformFn throws an error, the default value is used', () => {
		const transformFn = jest.fn()
		transformFn.mockImplementation(() => {
			throw Error('mock-error')
		})

		setProp(target, { myProp: 'new-value' }, 'myProp', 'default-value', transformFn)
		expect(target).toEqual({
			myProp: 'default-value'
		})
		expect(console.error).toHaveBeenCalledTimes(2)
	})
})
