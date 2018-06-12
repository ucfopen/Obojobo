import s from '../../../src/scripts/common/util/set-model-state-prop.js'

describe('setModelStateProp', () => {
	let model

	beforeEach(() => {
		model = {
			modelState: {}
		}
	})

	test('sets default values when no attrs passed', () => {
		s(model, null, 'propName', 'default-value')
		expect(model.modelState).toEqual({
			propName: 'default-value'
		})
	})

	test('sets default values when no content passed', () => {
		s(model, {}, 'propName', 'default-value')
		expect(model.modelState).toEqual({
			propName: 'default-value'
		})
	})

	test('sets default values when attr does not exist', () => {
		s(
			model,
			{
				content: { myProp: 'mocked-prop' }
			},
			'propName',
			'default-value'
		)
		expect(model.modelState).toEqual({
			propName: 'default-value'
		})
	})

	test('sets values if in attrs', () => {
		s(
			model,
			{
				content: { myProp: 'test-value' }
			},
			'myProp',
			'default-value'
		)
		expect(model.modelState).toEqual({
			myProp: 'test-value'
		})
	})

	test('calls set function if available', () => {
		let setFn = jest.fn()
		setFn.mockImplementation(x => x)

		s(
			model,
			{
				content: { myProp: 'test-value' }
			},
			'myProp',
			'default-value',
			setFn
		)
		expect(model.modelState).toEqual({
			myProp: 'test-value'
		})
		expect(setFn).toHaveBeenCalledTimes(1)
	})

	test('sets to default value if set function returns null', () => {
		s(model, { content: { myProp: 'test-value' } }, 'myProp', 'default-value', () => null)
		expect(model.modelState).toEqual({
			myProp: 'default-value'
		})
	})

	test('allowedValues restricts what is accepted', () => {
		let setFn = jest.fn()
		setFn.mockImplementation(x => x)

		s(
			model,
			{
				content: { myProp: 'test-value' }
			},
			'myProp',
			'default-value',
			setFn,
			['other-value']
		)
		expect(model.modelState).toEqual({
			myProp: 'default-value'
		})

		s(
			model,
			{
				content: { myProp: 'test-value' }
			},
			'myProp',
			'default-value',
			setFn,
			['test-value']
		)
		expect(model.modelState).toEqual({
			myProp: 'test-value'
		})
	})
})
