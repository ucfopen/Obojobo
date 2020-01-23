import React from 'react'
import Slider from '../../../../src/scripts/common/components/slider/slider'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('Slider', () => {
	test('Slider renders correctly', () => {
		const component = renderer.create(<Slider step={1} domain={[1, 5]} values={[1, 3]} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Slider onChange calls props.onChange', () => {
		const onChange = jest.fn()

		const component = mount(<Slider step={1} domain={[1, 5]} values={[1, 3]} onChange={onChange} />)

		component.instance().onChange([])

		expect(onChange).toHaveBeenCalled()
	})
})
