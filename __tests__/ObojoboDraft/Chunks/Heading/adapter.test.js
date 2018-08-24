jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

import HeadingAdapter from '../../../../ObojoboDraft/Chunks/Heading/adapter'

describe('Heading adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		HeadingAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const attrs = {
			content: {
				textGroup: [{ text: { value: 'example text' } }],
				headingLevel: '2',
				align: 'right'
			}
		}
		const model = new OboModel(attrs)

		HeadingAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
	})

	test('clone produces a copy', () => {
		const a = new OboModel({})
		const b = new OboModel({})

		HeadingAdapter.construct(a)
		HeadingAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON creates a JSON representation', () => {
		const json = { content: {} }
		const attrs = {
			content: {
				textGroup: [{ text: { value: 'example text' } }],
				headingLevel: '2'
			}
		}
		const model = new OboModel(attrs)
		HeadingAdapter.construct(model, attrs)
		HeadingAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('toText ', () => {
		const attrs = {
			content: {
				textGroup: [{ text: { value: 'example text' } }],
				headingLevel: '2'
			}
		}
		const model = new OboModel(attrs)

		HeadingAdapter.construct(model, attrs)
		expect(HeadingAdapter.toText(model)).toMatch('example text')
	})
})
