import React from 'react'
import SliderRail from './slider-rail'
import renderer from 'react-test-renderer'

describe('SliderRail', () => {
	test('SliderRail renders correctly', () => {
		const railProps = jest.fn()
		const component = renderer.create(<SliderRail getRailProps={railProps} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		expect(railProps).toHaveBeenCalled()
	})
})
