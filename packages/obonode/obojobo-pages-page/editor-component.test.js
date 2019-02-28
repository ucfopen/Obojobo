import React from 'react'
import renderer from 'react-test-renderer'

import Page from './editor-component'

describe('Page Editor Node', () => {
	test('Page builds the expected component', () => {
		const component = renderer.create(<Page />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
