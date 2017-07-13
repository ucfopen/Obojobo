import HtmlAdapter from '../../../../ObojoboDraft/Chunks/HTML/adapter'

describe('HTML adapter', () => {
	it('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		HtmlAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = { content: { html: 'html', align: 'center' } }
		HtmlAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		HtmlAdapter.construct(a)
		HtmlAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	it('can be converted to JSON', () => {
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

	it('can be converted to text', () => {
		let model = { modelState: { html: 'expected text to be returned' } }
		expect(HtmlAdapter.toText(model)).toMatch('expected text to be returned')
	})
})
