import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('../../../src/scripts/common/text/styleable-text-renderer')

import StyleableText from '../../../src/scripts/common/text/styleable-text-component'
import StyleRenderer from '../../../src/scripts/common/text/styleable-text-renderer'

describe('StyleableText Component', () => {
	test('StyleableText component', () => {
		StyleRenderer.mockReturnValueOnce({ type: 'b', children: [] })

		const component = renderer.create(<StyleableText />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('StyleableText component a', () => {
		StyleRenderer.mockReturnValueOnce({
			type: 'a',
			children: [],
			attrs: { href: 'website.com' }
		})

		const component = renderer.create(<StyleableText />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('StyleableText component a with no attributes', () => {
		StyleRenderer.mockReturnValueOnce({
			type: 'a',
			children: []
		})

		const component = renderer.create(<StyleableText />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('StyleableText component span', () => {
		StyleRenderer.mockReturnValueOnce({
			type: 'span',
			children: [],
			attrs: { class: 'mockClass' }
		})

		const component = renderer.create(<StyleableText />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('StyleableText component span with no attributes', () => {
		StyleRenderer.mockReturnValueOnce({
			type: 'span',
			children: []
		})

		const component = renderer.create(<StyleableText />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('StyleableText component with children', () => {
		StyleRenderer.mockReturnValueOnce({
			type: 'b',
			children: [
				{
					nodeType: 'text',
					html: '<a/>' // HTML child
				},
				{
					nodeType: 'text',
					text: '' // empty text child
				},
				{
					nodeType: 'text',
					text: 'mockText \n' // text child with \n on the end
				},
				{
					nodeType: 'text',
					text: 'mockText'
				},
				{
					nodeType: 'notText',
					type: 'i',
					children: []
				}
			]
		})

		const component = renderer.create(<StyleableText />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
