import Common from 'Common'
import HeadingAdapter from '../../../../ObojoboDraft/Chunks/Heading/adapter'

const { TextGroupAdapter } = Common.chunk.textChunk

describe('Heading adapter', () => {
	test('construct builds without attributes', () => {
		let model = { modelState: {} }
		HeadingAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		let model = { modelState: {} }
		let attrs = {
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
		let a = { modelState: {} }
		let b = { modelState: {} }

		HeadingAdapter.construct(a)
		HeadingAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON creates a JSON representation', () => {
		let model = { modelState: {} }
		let json = { content: {} }
		let attrs = {
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
		let model = { modelState: {} }
		let attrs = {
			content: {
				textGroup: [{ text: { value: 'example text' } }],
				headingLevel: '2'
			}
		}
		HeadingAdapter.construct(model, attrs)
		expect(HeadingAdapter.toText(model)).toMatch('example text')
	})
})
