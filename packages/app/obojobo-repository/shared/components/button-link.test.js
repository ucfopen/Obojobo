import React from 'react'
import ButtonLink from './button-link'
import renderer from 'react-test-renderer'

describe('ButtonLink', () => {
	test('renders when given props', () => {
		const mockProps = {
			url: '/path/to/url',
			target: '_blank',
			className: 'extraClass'
		}

		const component = renderer.create(<ButtonLink {...mockProps}>Link Text</ButtonLink>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('renders with no extra classes', () => {
		const mockProps = {
			url: '/path/to/url',
			target: '_blank'
		}

		const component = renderer.create(<ButtonLink {...mockProps}>Link Text</ButtonLink>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
