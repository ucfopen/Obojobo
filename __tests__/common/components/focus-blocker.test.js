import React from 'react'
import FocusBlocker from '../../../src/scripts/common/components/focus-blocker'
import renderer from 'react-test-renderer'

describe('FocusBlocker', () => {
	test('FocusBlocker component', () => {
		const component = renderer.create(<FocusBlocker />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
