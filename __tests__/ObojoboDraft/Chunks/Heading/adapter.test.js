import HeadingAdapter from '../../../../ObojoboDraft/Chunks/Heading/adapter'

describe('Heading adapter', () => {
	test('construct builds without attributes', () => {
		const model = { modelState: {} }
		HeadingAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				textGroup: [{ text: { value: 'example text' } }],
				headingLevel: '2',
				align: 'right'
			}
		}

		HeadingAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('clone produces a copy', () => {
		const a = { modelState: {} }
		const b = { modelState: {} }

		HeadingAdapter.construct(a)
		HeadingAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON creates a JSON representation', () => {
		const model = { modelState: {} }
		const json = { content: {} }
		const attrs = {
			content: {
				textGroup: [{ text: { value: 'example text' } }],
				headingLevel: '2'
			}
		}
		HeadingAdapter.construct(model, attrs)
		HeadingAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('toText ', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				textGroup: [{ text: { value: 'example text' } }],
				headingLevel: '2'
			}
		}
		HeadingAdapter.construct(model, attrs)
		expect(HeadingAdapter.toText(model)).toMatch('example text')
	})
})
