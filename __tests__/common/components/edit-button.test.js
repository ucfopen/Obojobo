import React from 'react'
import EditButton from '../../../src/scripts/common/components/edit-button'
import renderer from 'react-test-renderer'

describe('EditButton', () => {
	test('EditButton component', () => {
		const component = renderer.create(<EditButton />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('EditButton component with onClick', () => {
		const component = renderer.create(<EditButton onClick={function() {}} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('EditButton component with shouldPreventTab', () => {
		const component = renderer.create(<EditButton shouldPreventTab={true} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
