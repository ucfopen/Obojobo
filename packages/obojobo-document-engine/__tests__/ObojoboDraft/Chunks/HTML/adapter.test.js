import HtmlAdapter from '../../../../ObojoboDraft/Chunks/HTML/adapter'

describe('HTML adapter', () => {
	test('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		HtmlAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		let model = { modelState: {} }
		let attrs = { content: { html: 'html', align: 'center' } }
		HtmlAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		HtmlAdapter.construct(a)
		HtmlAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		let model = {
			modelState: {
				html: 'html',
				align: 'center'
			}
		}
		let json = { content: {} }

		HtmlAdapter.toJSON(model, json)
		expect(json).toMatchSnapshot()
	})

	test('toText creates a text representation', () => {
		let model = { modelState: { html: 'expected text to be returned' } }
		expect(HtmlAdapter.toText(model)).toMatch('expected text to be returned')
	})
})
