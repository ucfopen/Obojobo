import ModuleAdapter from '../../../../ObojoboDraft/Modules/Module/adapter'

describe('Module adapter', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('construct builds without attributes', () => {
		let model = { modelState: {} }

		ModuleAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				start: 'mockStart'
			}
		}

		ModuleAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes and unlimited ', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				start: 'unlimited'
			}
		}

		ModuleAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		let a = {
			modelState: {
				start: 'mockStart'
			}
		}
		let b = { modelState: {} }

		ModuleAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	test('toJSON builds a JSON representation', () => {
		let a = {
			modelState: {
				start: 'mockStart'
			}
		}
		let b = { content: {} }

		ModuleAdapter.toJSON(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState.start).toEqual(b.content.start)
	})
})
