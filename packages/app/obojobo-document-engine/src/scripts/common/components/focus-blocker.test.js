import React from 'react'
import FocusBlocker from './focus-blocker'
import renderer from 'react-test-renderer'

describe('FocusBlocker', () => {
	test('FocusBlocker component', () => {
		const component = renderer.create(<FocusBlocker />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
