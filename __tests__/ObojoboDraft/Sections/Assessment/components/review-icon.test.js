import React from 'react'
import renderer from 'react-test-renderer'

import ReviewIcon from '../../../../../ObojoboDraft/Sections/Assessment/components/review-icon'

describe('ReviewIcon', () => {
	test('ReviewIcon component', () => {
		const component = renderer.create(<ReviewIcon />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
