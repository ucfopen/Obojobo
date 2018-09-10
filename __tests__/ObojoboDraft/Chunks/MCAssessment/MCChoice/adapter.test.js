jest.mock('../../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../../src/scripts/common/models/obo-model'

import MCChoiceAdapter from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/adapter'

describe('MCChoice adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		MCChoiceAdapter.construct(model)
		expect(model.modelState).toMatchObject({ score: '' })
	})

	test('construct builds with attributes', () => {
		const attrs = {
			content: {
				score: 999
			}
		}
		const model = new OboModel(attrs)

		MCChoiceAdapter.construct(model, attrs)
		expect(model.modelState).toMatchObject({ score: 999 })
	})

	test('clone creates a copy', () => {
		const attrs = { content: { score: 999 } }
		const a = new OboModel(attrs)
		const b = new OboModel({})

		MCChoiceAdapter.construct(a, attrs)
		MCChoiceAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).not.toBe(b.modelState)
		expect(a.modelState).toMatchObject(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		const attrs = { content: { score: 777 } }
		const json = { content: {} }
		const model = new OboModel(attrs)

		MCChoiceAdapter.construct(model, attrs)
		MCChoiceAdapter.toJSON(model, json)

		expect(json).toMatchObject({ content: { score: 777 } })
	})
})
