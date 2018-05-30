import IFrameAdapter from '../../../../ObojoboDraft/Chunks/IFrame/adapter'

describe('IFrame adapter', () => {
	test('construct builds without attributes', () => {
		let model = { modelState: {} }
		IFrameAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				src: 'mockSrc',
				allow: 'mockAllow'
			}
		}

		IFrameAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		IFrameAdapter.construct(a)
		IFrameAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	it('toJSON builds a JSON representation', () => {
		let model = { modelState: {} }
		let attrs = { content: { src: 'mockSrc' } }
		let json = { content: {} }

		IFrameAdapter.construct(model, attrs)
		IFrameAdapter.toJSON(model, json)
		expect(json).toMatchSnapshot()
	})

	it('toText creates a text representation', () => {
		let model = { modelState: {} }
		let attrs = { content: { src: 'mockSrc' } }

		IFrameAdapter.construct(model, attrs)
		expect(IFrameAdapter.toText(model)).toMatch('mockSrc')
	})
})
