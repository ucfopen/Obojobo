import IFrameAdapter from '../../../../ObojoboDraft/Chunks/IFrame/adapter'

describe('IFrame adapter', () => {
	it('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		IFrameAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = { content: { src: 'test src' } }

		IFrameAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		IFrameAdapter.construct(a)
		IFrameAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	it('can convert to JSON', () => {
		let model = { modelState: {} }
		let attrs = { content: { src: 'test src' } }
		let json = { content: {} }

		IFrameAdapter.construct(model, attrs)
		IFrameAdapter.toJSON(model, json)
		expect(json).toMatchSnapshot()
	})

	it('can convert to text', () => {
		let model = { modelState: {} }
		let attrs = { content: { src: 'test src' } }

		IFrameAdapter.construct(model, attrs)
		expect(IFrameAdapter.toText(model)).toMatch('test src')
	})
})
