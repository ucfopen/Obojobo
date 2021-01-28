import React from 'react'
import renderer from 'react-test-renderer'

mockStaticDate()

// require used to make sure it's loaded after mock date
const Footer = require('./footer')

describe('Footer', () => {
	test('renders', () => {
		const component = renderer.create(<Footer />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
