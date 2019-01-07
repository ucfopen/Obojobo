import React from 'react'
import renderer from 'react-test-renderer'

import Icon from 'ObojoboDraft/Chunks/Table/icon'

describe('Table Icon', () => {
	test('Icon', () => {
		const component = renderer.create(<Icon />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
