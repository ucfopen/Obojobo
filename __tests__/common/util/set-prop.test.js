import s from '../../../src/scripts/common/util/set-prop.js'

describe('setProp', () => {
	let target

	beforeEach(() => {
		target = {}
	})

	test('sets default values when no attrs passed', () => {
		s(target, {}, 'propName', 'default-value')
		expect(target).toEqual({
			propName: 'default-value'
		})
	})

	test('sets default values when attr does not exist', () => {
		s(target, { myProp: 'mocked-prop' }, 'propName', 'default-value')
		expect(target).toEqual({
			propName: 'default-value'
		})
	})

	test('sets values if in attrs', () => {
		s(target, { myProp: 'test-value' }, 'myProp', 'default-value')
		expect(target).toEqual({
			myProp: 'test-value'
		})
	})

	test('calls set function if available', () => {
		const setFn = jest.fn()
		setFn.mockImplementation(x => x)

		s(target, { myProp: 'test-value' }, 'myProp', 'default-value', setFn)
		expect(target).toEqual({
			myProp: 'test-value'
		})
		expect(setFn).toHaveBeenCalledTimes(1)
	})

	test('sets to default value if set function returns null', () => {
		s(target, { myProp: 'test-value' }, 'myProp', 'default-value', () => null)
		expect(target).toEqual({
			myProp: 'default-value'
		})
	})

	test('allowedValues restricts what is accepted', () => {
		const setFn = jest.fn()
		setFn.mockImplementation(x => x)

		s(target, { myProp: 'test-value' }, 'myProp', 'default-value', setFn, ['other-value'])
		expect(target).toEqual({
			myProp: 'default-value'
		})

		s(target, { myProp: 'test-value' }, 'myProp', 'default-value', setFn, ['test-value'])
		expect(target).toEqual({
			myProp: 'test-value'
		})
	})
})
