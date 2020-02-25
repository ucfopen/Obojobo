import React from 'react'
import { shallow, mount } from 'enzyme'

import NewVariable from '../../../../../src/scripts/oboeditor/components/variables/new-variable/new-variable'

describe('VariableValue', () => {
	test('VariableValue component', () => {
		const component = shallow(<NewVariable addVariable={jest.fn()} />)
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue submits for "enter" key', () => {
		const addVariable = jest.fn()
		const component = shallow(<NewVariable addVariable={addVariable} />)

		component
			.find('.new-variable--type-list')
			.at(0)
			.simulate('keyDown', {
				key: 'Enter'
			})

		expect(addVariable).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue does not submit for every key other than "enter"', () => {
		const addVariable = jest.fn()
		const component = shallow(<NewVariable addVariable={addVariable} />)

		component
			.find('.new-variable--type-list')
			.at(0)
			.simulate('keyDown', {
				key: 'i'
			})

		expect(addVariable).not.toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue handles "onChange"', () => {
		const addVariable = jest.fn()
		const component = mount(<NewVariable addVariable={addVariable} />)

		component
			.find('input')
			.at(1)
			.simulate('change', { target: { value: 'random-number' } })

		expect(
			component
				.find('input')
				.at(1)
				.props().checked
		).toEqual(true)

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue calls "addVariable" on mouse click', () => {
		const addVariable = jest.fn()
		const component = mount(<NewVariable addVariable={addVariable} />)

		component
			.find('.new-variable--type-list--single-item')
			.at(2)
			.simulate('click', { type: 'click', clientX: 3, clienty: 3 })

		expect(addVariable).toHaveBeenCalled()

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue does not call "addVariable" radio list keyboard click', () => {
		const addVariable = jest.fn()
		const component = mount(<NewVariable addVariable={addVariable} />)

		component
			.find('.new-variable--type-list--single-item')
			.at(2)
			.simulate('click', { type: 'click', clientX: 0, clienty: 0 })

		expect(addVariable).not.toHaveBeenCalled()

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue selects item on "hover"', () => {
		const addVariable = jest.fn()
		const component = mount(<NewVariable addVariable={addVariable} />)

		component
			.find('.new-variable--type-list--single-item')
			.at(2)
			.simulate('mouseEnter')

		expect(
			component
				.find('input')
				.at(2)
				.props().checked
		).toEqual(true)

		expect(component.html()).toMatchSnapshot()
	})
})
