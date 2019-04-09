import React from 'react'
import Slider from '../../../src/scripts/common/components/slider'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('Slider', () => {
	test('Slider renders correctly', () => {
		const component = renderer.create(<Slider title={'mocktitle'} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Slider calls handleCheckChange', () => {
		const onChecked = jest.fn()
		const component = mount(<Slider title={'mocktitle'} handleCheckChange={onChecked} />)
		const tree = component.html()

		component.find('input').simulate('change', { target: { checked: true } })

		expect(tree).toMatchSnapshot()
		expect(onChecked).toHaveBeenCalled()
	})
})
