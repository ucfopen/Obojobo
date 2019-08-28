import React from 'react'
import Slider from '../../../src/scripts/common/components/slider'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('Slider', () => {
	test('Slider renders correctly with no options set', () => {
		const component = renderer.create(<Slider />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Slider renders correctly with a title', () => {
		const component = renderer.create(<Slider title="mocktitle" />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Slider renders correctly when initialized on', () => {
		const component = renderer.create(<Slider initialChecked={true} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Slider calls handleCheckChange', () => {
		const onChecked = jest.fn()
		const component = mount(<Slider handleCheckChange={onChecked} />)

		const checkbox = component.find('input')
		expect(onChecked).not.toHaveBeenCalled()
		checkbox.simulate('change', { target: { checked: true } })
		expect(onChecked).toHaveBeenCalledTimes(1)
		expect(onChecked).toHaveBeenCalledWith(true)
	})
})
