import HtmlAdapter from '../../../../ObojoboDraft/Chunks/HTML/adapter'

describe('HTML adapter', () => {
	test('can be constructed WITHOUT attributes', () => {
		const model = { modelState: {} }
		HtmlAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		const attrs = { content: { html: 'html', align: 'center' } }
		HtmlAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const a = { modelState: {} }
		const b = { modelState: {} }

		HtmlAdapter.construct(a)
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
