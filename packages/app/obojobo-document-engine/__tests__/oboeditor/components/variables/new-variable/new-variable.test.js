import React from 'react'
import { shallow, mount } from 'enzyme'

import NewVariable from '../../../../../src/scripts/oboeditor/components/variables/new-variable/new-variable'

describe('VariableValue', () => {
	test('VariableValue component', () => {
		const component = shallow(<NewVariable onAddVariable={jest.fn()} />)
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue submits for "enter" key', () => {
		const onAddVariable = jest.fn()
		const component = shallow(<NewVariable onAddVariable={onAddVariable} />)

		component
			.find('.new-variable--type-list')
			.at(0)
			.simulate('keyDown', {
				key: 'Enter'
			})

		expect(onAddVariable).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue does not submit for every key other than "enter"', () => {
		const onAddVariable = jest.fn()
		const component = shallow(<NewVariable onAddVariable={onAddVariable} />)

		component
			.find('.new-variable--type-list')
			.at(0)
			.simulate('keyDown', {
				key: 'i'
			})

		expect(onAddVariable).not.toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue handles "onChange"', () => {
		const onAddVariable = jest.fn()
		const component = mount(<NewVariable onAddVariable={onAddVariable} />)

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

	test('VariableValue calls "onAddVariable" on mouse click', () => {
		const onAddVariable = jest.fn()
		const component = mount(<NewVariable onAddVariable={onAddVariable} />)

		component
			.find('.new-variable--type-list--single-item')
			.at(2)
			.simulate('click', { type: 'click', clientX: 3, clienty: 3 })

		expect(onAddVariable).toHaveBeenCalled()

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue does not call "onAddVariable" radio list keyboard click', () => {
		const onAddVariable = jest.fn()
		const component = mount(<NewVariable onAddVariable={onAddVariable} />)

		component
			.find('.new-variable--type-list--single-item')
			.at(2)
			.simulate('click', { type: 'click', clientX: 0, clienty: 0 })

		expect(onAddVariable).not.toHaveBeenCalled()

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableValue selects item on "hover"', () => {
		const onAddVariable = jest.fn()
		const component = mount(<NewVariable onAddVariable={onAddVariable} />)

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
