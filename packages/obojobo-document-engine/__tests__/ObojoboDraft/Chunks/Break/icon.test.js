import React from 'react'
import renderer from 'react-test-renderer'

import Icon from 'ObojoboDraft/Chunks/Break/icon'

describe('Break Icon', () => {
	test('Break Icon', () => {
		const component = renderer.create(<Icon />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
