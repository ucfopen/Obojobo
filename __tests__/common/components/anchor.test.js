import React from 'react'
import Anchor from '../../../src/scripts/common/components/anchor'
import renderer from 'react-test-renderer'

test('Uh', () => {
	const component = renderer.create(
		<Anchor />
	)
	let tree = component.toJSON()
	expect(tree).toMatchSnapshot()
})