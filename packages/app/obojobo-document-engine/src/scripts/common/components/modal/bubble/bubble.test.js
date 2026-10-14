import React from 'react'
import renderer from 'react-test-renderer'

import Bubble from './bubble'

describe('Bubble', () => {
	test('Bubble', () => {
		const component = renderer.create(<Bubble>contents</Bubble>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
