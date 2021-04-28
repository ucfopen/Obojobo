import React from 'react'
import renderer from 'react-test-renderer'

import NumericChoice from './viewer-component'

describe('NumericChoice', () => {
	test('NumericChoice component', () => {
		const component = renderer.create(<NumericChoice />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
