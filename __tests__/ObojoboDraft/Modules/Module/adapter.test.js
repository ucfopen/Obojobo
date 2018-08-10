import ModuleAdapter from '../../../../ObojoboDraft/Modules/Module/adapter'

describe('Module adapter', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('construct builds without attributes', () => {
		const model = { modelState: {} }

		ModuleAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				start: 'mockStart'
			}
		}

		ModuleAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes and unlimited ', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				start: 'unlimited'
			}
		}

		ModuleAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const a = {
			modelState: {
				start: 'mockStart'
			}
		}
		const b = { modelState: {} }

		ModuleAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	test('toJSON builds a JSON representation', () => {
		const a = {
			modelState: {
				start: 'mockStart'
			}
		}
		const b = { content: {} }

		ModuleAdapter.toJSON(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState.start).toEqual(b.content.start)
	})
})
