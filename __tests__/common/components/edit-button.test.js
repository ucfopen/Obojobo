import React from 'react'
import EditButton from '../../../src/scripts/common/components/edit-button'
import renderer from 'react-test-renderer'

test('EditButton', () => {
	const component = renderer.create(<EditButton />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('EditButton onClick', () => {
	const component = renderer.create(<EditButton onClick={function() {}} />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('EditButton shouldPreventTab', () => {
	const component = renderer.create(<EditButton shouldPreventTab={true} />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})
