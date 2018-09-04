import React from 'react'
import renderer from 'react-test-renderer'

import Bubble from '../../../../../src/scripts/common/components/modal/bubble/bubble'

describe('Bubble', () => {
	test('Bubble', () => {
		const component = renderer.create(<Bubble>contents</Bubble>)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
