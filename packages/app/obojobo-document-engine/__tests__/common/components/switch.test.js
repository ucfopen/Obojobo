import React from 'react'
import Switch from '../../../src/scripts/common/components/switch'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('Switch', () => {
	test('Switch renders correctly with no options set', () => {
		const component = renderer.create(<Switch />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Switch renders correctly with a title', () => {
		const component = renderer.create(<Switch title="mocktitle" />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Switch renders correctly when initialized on', () => {
		const component = renderer.create(<Switch initialChecked={true} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Switch calls handleCheckChange', () => {
		const onChecked = jest.fn()
		const component = mount(<Switch handleCheckChange={onChecked} />)

		const checkbox = component.find('input')
		expect(onChecked).not.toHaveBeenCalled()
		checkbox.simulate('change', { target: { checked: true } })
		expect(onChecked).toHaveBeenCalledTimes(1)
		expect(onChecked).toHaveBeenCalledWith(true)
	})
})
