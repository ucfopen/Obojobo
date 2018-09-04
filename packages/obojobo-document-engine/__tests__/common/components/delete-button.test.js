import React from 'react'
import DeleteButton from '../../../src/scripts/common/components/delete-button'
import renderer from 'react-test-renderer'

describe('DeleteButton', () => {
	test('DeleteButton component', () => {
		const component = renderer.create(<DeleteButton />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component with shouldPreventTab', () => {
		const component = renderer.create(<DeleteButton shouldPreventTab={true} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component with tabIndex', () => {
		const component = renderer.create(<DeleteButton tabIndex={50} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component disabled', () => {
		const component = renderer.create(<DeleteButton disabled />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('DeleteButton component with onClick', () => {
		const component = renderer.create(<DeleteButton onClick={function() {}} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
