jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

import BreakAdapter from '../../../../ObojoboDraft/Chunks/Break/adapter'

describe('Break adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		const expected = { width: 'normal' }
		BreakAdapter.construct(model)

		expect(model.modelState).toEqual(expected)
	})

	test('construct builds with attributes', () => {
		const attrs = { content: { width: 'large' } }
		const model = new OboModel(attrs)

		const expected = { width: 'large' }
		BreakAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
	})

	test('toText creates a text representation', () => {
		const model = { modelState: { width: 'large' } }
		const text = BreakAdapter.toText(model)

		expect(text).toEqual('---')
	})
})
