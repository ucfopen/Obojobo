import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import MoreInfoButton from '../../../src/scripts/common/components/more-info-button'

describe('MoreInfoButton', () => {
	test('Renders default props', () => {
		const component = renderer.create(<MoreInfoButton />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Renders label', () => {
		const component = renderer.create(<MoreInfoButton label="Testing 123" />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Renders mouse over', () => {
		const component = mount(<MoreInfoButton label="Testing 123" />)
		component.instance().state.mode = 'hidden'

		component.find('button').simulate('mouseOver')

		expect(component.instance().state.mode).toEqual('hover')

		component.find('button').simulate('mouseOver')

		expect(component.instance().state.mode).toEqual('hover')
	})

	test('Renders mouse out', () => {
		const component = mount(<MoreInfoButton label="Testing 123" />)
		component.instance().state.mode = 'hover'

		component.find('button').simulate('mouseOut')

		expect(component.instance().state.mode).toEqual('hidden')

		component.find('button').simulate('mouseOut')

		expect(component.instance().state.mode).toEqual('hidden')
	})

	test('Renders click', () => {
		const component = mount(<MoreInfoButton label="Testing 123" />)
		component.instance().state.mode = 'hidden'

		component.find('button').simulate('click')

		expect(component.instance().state.mode).toEqual('clicked')

		component.find('button').simulate('click')

		expect(component.instance().state.mode).toEqual('hidden')
	})
})
