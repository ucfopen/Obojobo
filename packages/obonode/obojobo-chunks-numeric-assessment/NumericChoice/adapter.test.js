jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model', () => {
	return require('obojobo-document-engine/__mocks__/obo-model-adapter-mock').default
})
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

import NumericChoiceAdapter from './adapter'

describe('NumericChoice adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		NumericChoiceAdapter.construct(model)
		expect(model.modelState).toMatchObject({ score: '' })
	})

	test('construct builds with attributes', () => {
		const attrs = {
			content: {
				score: 999
			}
		}
		const model = new OboModel(attrs)

		NumericChoiceAdapter.construct(model, attrs)
		expect(model.modelState).toMatchObject({ score: 999 })
	})

	test('clone creates a copy', () => {
		const attrs = { content: { score: 999 } }
		const a = new OboModel(attrs)
		const b = new OboModel({})

		NumericChoiceAdapter.construct(a, attrs)
		NumericChoiceAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).not.toBe(b.modelState)
		expect(a.modelState).toMatchObject(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		const attrs = { content: { score: 777 } }
		const json = { content: {} }
		const model = new OboModel(attrs)

		NumericChoiceAdapter.construct(model, attrs)
		NumericChoiceAdapter.toJSON(model, json)

		expect(json).toMatchObject({ content: { score: 777 } })
	})
})
