import React from 'react'
import Anchor from '../../../src/scripts/common/components/anchor'
import renderer from 'react-test-renderer'

test('Anchor', () => {
	const component = renderer.create(<Anchor />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('Anchor shouldPreventTab', () => {
	const component = renderer.create(<Anchor shouldPreventTab={true} />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})
