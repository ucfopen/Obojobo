import React from 'react'
import Footer from './footer'
import renderer from 'react-test-renderer'

describe('Footer', () => {
	test('renders', () => {
		const component = renderer.create(<Footer />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
