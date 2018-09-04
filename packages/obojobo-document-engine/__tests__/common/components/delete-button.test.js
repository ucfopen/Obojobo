import React from 'react'
import DeleteButton from '../../../src/scripts/common/components/delete-button'
import renderer from 'react-test-renderer'

describe('DeleteButton', () => {
	test('DeleteButton component', () => {
		const component = renderer.create(<DeleteButton />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component with shouldPreventTab', () => {
		const component = renderer.create(<DeleteButton shouldPreventTab={true} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component with tabIndex', () => {
		const component = renderer.create(<DeleteButton tabIndex={50} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component disabled', () => {
		const component = renderer.create(<DeleteButton disabled />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component with onClick', () => {
		const component = renderer.create(<DeleteButton onClick={function() {}} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
