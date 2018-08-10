import FigureAdapter from '../../../../ObojoboDraft/Chunks/Figure/adapter'
import TextGroup from '../../../../src/scripts/common/text-group/text-group'
import StylableText from '../../../../src/scripts/common/text/styleable-text'

describe('Figure adapter', () => {
	test('construct builds without attributes', () => {
		const model = { modelState: {} }
		FigureAdapter.construct(model)

		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				url: 'http://website.com/image.jpg',
				size: 'custom',
				width: 100,
				height: 100,
				alt: 'An image'
			}
		}
		FigureAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const a = { modelState: {} }
		const b = { modelState: {} }

		FigureAdapter.construct(a)
		FigureAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON creates a JSON representation', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				url: 'http://website.com/image.jpg',
				alt: 'An image'
			}
		}
		const expected = {
			content: {
				alt: 'An image',
				height: null,
				size: 'small',
				textGroup: [
					{
						data: {
							align: 'left',
							indent: 0
						},
						text: {
							styleList: null,
							value: ''
						}
					}
				],
				url: 'http://website.com/image.jpg',
				width: null
			}
		}

		FigureAdapter.construct(model, attrs)
		FigureAdapter.toJSON(model, attrs)

		expect(attrs).toEqual(expected)
	})

	test('toText creates a text representation', () => {
		const modelAlt = { modelState: {} }
		const modelTextGroup = { modelState: {} }
		const tg = TextGroup.create()

		tg.addAt(0, new StylableText('TextGroup text'))

		const attrsAlt = {
			content: {
				url: 'http://website.com/image.jpg',
				alt: 'Alt text'
			}
		}

		const attrsTextGroup = {
			content: {
				url: 'http://website.com/image.jpg',
				textGroup: tg.items
			}
		}

		FigureAdapter.construct(modelAlt, attrsAlt)
		FigureAdapter.construct(modelTextGroup, attrsTextGroup)
		expect(FigureAdapter.toText(modelAlt, attrsAlt)).toMatch(
			'Image: http://website.com/image.jpg\n Caption: Alt text'
		)
		expect(FigureAdapter.toText(modelTextGroup, attrsTextGroup)).toMatch('TextGroup text')
	})
})
