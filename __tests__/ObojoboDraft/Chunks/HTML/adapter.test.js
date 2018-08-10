jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

import HtmlAdapter from '../../../../ObojoboDraft/Chunks/HTML/adapter'

describe('HTML adapter', () => {
	test('can be constructed WITHOUT attributes', () => {
		const model = new OboModel({})
		HtmlAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const attrs = { content: { html: 'html', align: 'center' } }
		const model = new OboModel(attrs)
		HtmlAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const a = new OboModel({})
		const b = new OboModel({})

		HtmlAdapter.construct(a, {})
		HtmlAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		const model = {
			modelState: {
				html: 'html',
				align: 'center'
			}
		}
		const json = { content: {} }

		HtmlAdapter.toJSON(model, json)
		expect(json).toMatchSnapshot()
	})

	test('toText creates a text representation', () => {
		const model = { modelState: { html: 'expected text to be returned' } }
		expect(HtmlAdapter.toText(model)).toMatch('expected text to be returned')
	})
})
