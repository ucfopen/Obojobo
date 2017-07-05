import React from 'react'
import FocusBlocker from '../../../src/scripts/common/components/focus-blocker'
import renderer from 'react-test-renderer'

test('FocusBlocker', () => {
	const component = renderer.create(<FocusBlocker />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})
