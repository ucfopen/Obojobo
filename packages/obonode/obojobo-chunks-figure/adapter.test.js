jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model', () => {
	return require('obojobo-document-engine/__mocks__/obo-model-adapter-mock').default
})
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

import FigureAdapter from './adapter'

describe('Figure adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		FigureAdapter.construct(model)

		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const attrs = {
			content: {
				url: 'http://website.com/image.jpg',
				size: 'custom',
				width: 100,
				height: 100,
				alt: 'An image',
				captionWidth: 'text-width'
			}
		}
		const model = new OboModel(attrs)
		FigureAdapter.construct(model, attrs)

		expect(model.modelState).toMatchSnapshot()
	})

	test.each`
		size        | captionWidth
		${'large'}  | ${'image-width'}
		${'medium'} | ${'image-width'}
		${'small'}  | ${'text-width'}
		${'custom'} | ${'text-width'}
	`('size="$size", captionWidth="$captionWidth"', ({ size, captionWidth }) => {
		const attrs = {
			content: {
				url: 'http://website.com/image.jpg',
				size,
				width: 100,
				height: 100,
				alt: 'An image',
				captionWidth: 'text-width'
			}
		}
		const model = new OboModel(attrs)
		FigureAdapter.construct(model, attrs)

		expect(model.modelState.captionWidth).toBe(captionWidth)
	})

	test('clone creates a copy', () => {
		const a = new OboModel({})
		const b = new OboModel({})

		FigureAdapter.construct(a)
		FigureAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	test('toJSON creates a JSON representation', () => {
		const attrs = {
			content: {
				url: 'http://website.com/image.jpg',
				alt: 'An image',
				textGroup: [{ text: { value: 'mock-tg' } }]
			}
		}
		const model = new OboModel(attrs)
		const expected = {
			content: {
				alt: 'An image',
				captionWidth: 'image-width',
				height: null,
				size: 'small',
				textGroup: [
					{
						text: {
							value: 'mock-tg',
							styleList: null
						},
						data: {}
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

	test('toText creates a text representation (With caption)', () => {
		const attrs = {
			content: {
				textGroup: [{ text: { value: 'mock-tg' } }],
				url: 'http://website.com/image.jpg',
				alt: 'An image'
			}
		}
		const model = new OboModel(attrs)

		FigureAdapter.construct(model, attrs)
		expect(FigureAdapter.toText(model, attrs)).toMatch(
			'Image: http://website.com/image.jpg\n Caption: mock-tg'
		)
	})

	test('toText creates a text representation (Without caption)', () => {
		const attrs = {
			content: {
				url: 'http://website.com/image.jpg',
				alt: 'An image'
			}
		}
		const model = new OboModel(attrs)

		FigureAdapter.construct(model, attrs)
		expect(FigureAdapter.toText(model, attrs)).toMatch(
			'Image: http://website.com/image.jpg\n Caption: An image'
		)
	})
})
