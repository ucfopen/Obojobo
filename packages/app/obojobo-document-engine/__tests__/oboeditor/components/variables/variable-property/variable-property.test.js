import React from 'react'
import { shallow, mount } from 'enzyme'

import VariableProperty from '../../../../../src/scripts/oboeditor/components/variables/variable-property/variable-property'

describe('Variable Properties', () => {
	test('VariableProperty node', () => {
		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const onDeleteVariable = jest.fn()
		const component = shallow(
			<VariableProperty
				variable={variable}
				onDeleteVariable={onDeleteVariable}
				onChange={jest.fn()}
			/>
		)
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableProperty node with invalid variable', () => {
		const variable = null

		const onDeleteVariable = jest.fn()
		const component = shallow(
			<VariableProperty
				variable={variable}
				onDeleteVariable={onDeleteVariable}
				onChange={jest.fn()}
			/>
		)
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableProperty node without default name or type', () => {
		const variable = {}
		const onDeleteVariable = jest.fn()
		const component = shallow(
			<VariableProperty
				variable={variable}
				onDeleteVariable={onDeleteVariable}
				onChange={jest.fn()}
			/>
		)
		expect(
			component
				.find('input')
				.at(0)
				.props().value
		).toEqual('')
		expect(
			component
				.find('select')
				.at(0)
				.props().value
		).toEqual('')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableProperty clicks "delete" will call "onDeleteVariable"', () => {
		global.confirm = () => true

		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const onDeleteVariable = jest.fn()
		const component = mount(
			<VariableProperty
				variable={variable}
				onDeleteVariable={onDeleteVariable}
				onChange={jest.fn()}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(onDeleteVariable).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableProperty does not call "onDeleteVariable" when user cancels', () => {
		global.confirm = () => false

		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const onDeleteVariable = jest.fn()
		const component = mount(
			<VariableProperty
				variable={variable}
				onDeleteVariable={onDeleteVariable}
				onChange={jest.fn()}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(onDeleteVariable).not.toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableProperty calls onChange when input changes', () => {
		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const onChange = jest.fn()
		const component = mount(<VariableProperty variable={variable} onChange={onChange} />)

		component
			.find('input')
			.at(0)
			.simulate('change', { target: { value: '333' } })

		expect(onChange).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})
})
