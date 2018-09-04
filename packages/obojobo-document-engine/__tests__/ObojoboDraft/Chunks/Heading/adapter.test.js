import Common from 'Common'
import HeadingAdapter from '../../../../ObojoboDraft/Chunks/Heading/adapter'

const { TextGroupAdapter } = Common.chunk.textChunk

describe('Heading adapter', () => {
	it('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		HeadingAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				textGroup: [{ text: { value: 'example text' } }],
				headingLevel: '2'
			}
		}

		HeadingAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		HeadingAdapter.construct(a)
		HeadingAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	it('can covert to JSON', () => {
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

	it('can convert to text', () => {
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
