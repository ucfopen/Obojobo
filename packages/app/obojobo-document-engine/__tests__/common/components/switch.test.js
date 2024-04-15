import React from 'react'
import Switch from '../../../src/scripts/common/components/switch'
import TestRenderer from 'react-test-renderer'

describe('Switch', () => {
	test('Switch renders correctly with no options set', () => {
		const testRenderer = TestRenderer.create(<Switch />)
		const tree = testRenderer.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Switch renders correctly with all options set', () => {
		const testRenderer = TestRenderer.create(
			<Switch title="mocktitle" onChange={() => {}} checked={true} />
		)
		const tree = testRenderer.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Switch renders correctly with a title', () => {
		const testRenderer = TestRenderer.create(<Switch title="mocktitle" />)
		const testInstance = testRenderer.root
		const checkbox = testInstance.findByType('span')
		expect(checkbox.children).toEqual(['mocktitle'])
	})

	test('Switch renders when unchecked', () => {
		const testRenderer = TestRenderer.create(<Switch checked={false} />)
		const testInstance = testRenderer.root
		const checkbox = testInstance.findByType('input')
		expect(checkbox.props).toHaveProperty('checked', false)
	})

	test('Switch renders when checked', () => {
		const testRenderer = TestRenderer.create(<Switch checked={true} />)
		const testInstance = testRenderer.root
		const checkbox = testInstance.findByType('input')
		expect(checkbox.props).toHaveProperty('checked', true)
	})

	test('Switch calls onChange', () => {
		const onChecked = jest.fn()
		const component = TestRenderer.create(<Switch onChange={onChecked} />)
		const checkbox = component.root.findByType('input')

		// Initially, the onChange function should not have been called
		expect(onChecked).not.toHaveBeenCalled()

		// Simulate the change event by directly setting the checked attribute of the input element
		checkbox.props.onChange({ target: { checked: true } })

		// After simulating the change event, the onChange function should have been called once
		expect(onChecked).toHaveBeenCalledTimes(1)

		// Also, it should have been called with the expected argument
		expect(onChecked).toHaveBeenCalledWith(expect.objectContaining({ target: { checked: true } }))
	})
})
