import React from 'react'
import DeleteButton from '../../../src/scripts/common/components/delete-button'
import renderer from 'react-test-renderer'

test('DeleteButton', () => {
	const component = renderer.create(<DeleteButton />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('DeleteButton shouldPreventTab', () => {
	const component = renderer.create(<DeleteButton shouldPreventTab={true} />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('DeleteButton tabIndex', () => {
	const component = renderer.create(<DeleteButton tabIndex={50} />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('DeleteButton disabled', () => {
	const component = renderer.create(<DeleteButton disabled />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('DeleteButton onClick', () => {
	const component = renderer.create(<DeleteButton onClick={function() {}} />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})
