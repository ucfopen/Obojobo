jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

import ModuleAdapter from '../../../../ObojoboDraft/Modules/Module/adapter'

describe('Module adapter', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('construct builds without attributes', () => {
		const model = new OboModel({})

		ModuleAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const attrs = {
			content: {
				start: 'mockStart'
			}
		}
		const model = new OboModel(attrs)

		ModuleAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
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
