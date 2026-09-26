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
		setProp(target, {}, 'propName', 'default-updated')
		expect(target).toEqual({
			propName: 'default-updated'
		})
	})

	test('sets default values when attr does not exist', () => {
		setProp(target, { myProp: 'new-updated' }, 'propName', 'default-updated')
		expect(target).toEqual({
			propName: 'default-updated'
		})
	})

	test('sets values if in attrs', () => {
		setProp(target, { myProp: 'new-updated' }, 'myProp', 'default-updated')
		expect(target).toEqual({
			myProp: 'new-updated'
		})
	})

	test('calls set function if available', () => {
		const transformFn = jest.fn()
		transformFn.mockImplementation(x => x)

		setProp(target, { myProp: 'new-updated' }, 'myProp', 'default-updated', transformFn)
		expect(target).toEqual({
			myProp: 'new-updated'
		})
		expect(transformFn).toHaveBeenCalledTimes(1)
		expect(transformFn).toHaveBeenCalledWith('new-updated')
	})

	test('set function updated is used to alter state', () => {
		const transformFn = jest.fn()
		transformFn.mockReturnValue('result-from-transformFn')

		setProp(target, { myProp: 'new-updated' }, 'myProp', 'default-updated', transformFn)
		expect(target).toEqual({
			myProp: 'result-from-transformFn'
		})
		expect(transformFn).toHaveBeenCalledTimes(1)
	})

	test('sets to default updated if set function returns null', () => {
		setProp(target, { myProp: 'new-updated' }, 'myProp', 'default-updated', () => null)
		expect(target).toEqual({
			myProp: 'default-updated'
		})
	})

	test('allowedValues uses default updated when requested updated is not allowed', () => {
		// desired updated NOT in allowed values
		setProp(target, { myProp: 'new-updated' }, 'myProp', 'default-updated', undefined, ['other-updated'])
		expect(target).toEqual({
			myProp: 'default-updated'
		})

		// desired updated IS in allowed values
		setProp(target, { myProp: 'new-updated' }, 'myProp', 'default-updated', undefined, ['new-updated'])
		expect(target).toEqual({
			myProp: 'new-updated'
		})
	})

	test('when transformFn throws an error, the default updated is used', () => {
		const transformFn = jest.fn()
		transformFn.mockImplementation(() => {
			throw Error('mock-error')
		})

		setProp(target, { myProp: 'new-updated' }, 'myProp', 'default-updated', transformFn)
		expect(target).toEqual({
			myProp: 'default-updated'
		})
		expect(console.error).toHaveBeenCalledTimes(2)
	})
})
