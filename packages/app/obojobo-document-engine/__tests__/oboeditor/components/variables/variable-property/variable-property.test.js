import React from 'react'
import { shallow, mount } from 'enzyme'

import VariableProperties from '../../../../../src/scripts/oboeditor/components/variables/variable-property/variable-property'

describe('Variable Properties', () => {
	test('VariableProperties node', () => {
		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const onDeleteVariable = jest.fn()
		const component = shallow(
			<VariableProperties variable={variable} onDeleteVariable={onDeleteVariable} />
		)
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableProperties clicks "delete" will call "onDeleteVariable"', () => {
		global.confirm = () => true

		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const onDeleteVariable = jest.fn()
		const component = mount(
			<VariableProperties variable={variable} onDeleteVariable={onDeleteVariable} />
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(onDeleteVariable).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableProperties does not call "onDeleteVariable" when user cancels', () => {
		global.confirm = () => false

		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const onDeleteVariable = jest.fn()
		const component = mount(
			<VariableProperties variable={variable} onDeleteVariable={onDeleteVariable} />
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(onDeleteVariable).not.toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableProperties calls onChange when input changes', () => {
		const variable = {
			name: 'static_var',
			type: 'static-value',
			value: '3'
		}

		const onChange = jest.fn()
		const component = mount(<VariableProperties variable={variable} onChange={onChange} />)

		component
			.find('input')
			.at(0)
			.simulate('change', { target: { value: '333' } })

		expect(onChange).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})
})
