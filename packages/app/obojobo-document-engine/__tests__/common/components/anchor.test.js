import React from 'react'
import Anchor from '../../../src/scripts/common/components/anchor'
import renderer from 'react-test-renderer'

describe('Anchor', () => {
	test('Anchor component', () => {
		const component = renderer.create(<Anchor />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Anchor shouldPreventTab', () => {
		const component = renderer.create(<Anchor shouldPreventTab={true} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
