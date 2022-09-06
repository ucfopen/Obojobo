import React from 'react'
import { shallow, mount } from 'enzyme'

import VariableListModal from '../../../../src/scripts/oboeditor/components/variables/variable-list-modal'

describe('VariableListModal', () => {
	test('VariableListModal node', () => {
		const content = {
			variables: [
				{
					name: 'var1',
					type: 'mock'
				},
				{
					name: 'var2',
					type: 'mock'
				}
			]
		}
		const component = shallow(<VariableListModal content={content} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableListModal focus on first-tab when tab', () => {
		const content = {
			variables: [
				{
					name: 'var1',
					type: 'mock'
				},
				{
					name: 'var2',
					type: 'mock'
				}
			]
		}
		const component = mount(<VariableListModal content={content} />)
		component
			.find('.first-tab')
			.at(0)
			.simulate('focus')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableListModal handle invalid variables', () => {
		const content = {
			variables: null
		}
		const component = shallow(<VariableListModal content={content} />)

		expect(component.find('.single-variable').length).toEqual(0)
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableListModal calls onClickVarible', () => {
		const content = {
			variables: [
				{
					name: 'var1',
					type: 'static-value'
				},
				{
					name: 'var2',
					type: 'random-number'
				},
				{
					name: 'var3',
					type: 'static-list'
				}
			]
		}
		const component = mount(<VariableListModal content={content} />)

		component
			.find('.single-variable')
			.at(1)
			.simulate('click')

		expect(
			component
				.find('.single-variable')
				.at(1)
				.hasClass('variable-is-selected')
		).toEqual(true)

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('VariableListModal clicks on "+ Create Variable" button', () => {
		const content = {
			variables: [
				{
					name: 'var1',
					type: 'static-value'
				},
				{
					name: 'var2',
					type: 'static-value'
				}
			]
		}
		const component = mount(<VariableListModal content={content} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableListModal calls "onClose" when click "OK"', () => {
		const content = {
			variables: [
				{
					name: 'var1',
					type: 'static-value'
				},
				{
					name: 'var2',
					type: 'static-value'
				}
			]
		}
		const onClose = jest.fn()
		const component = mount(<VariableListModal content={content} onClose={onClose} />)

		component
			.find('.button')
			.at(3)
			.simulate('click')

		expect(onClose).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableListModal duplicates variable', () => {
		const content = {
			variables: [
				{
					name: 'var',
					type: 'static-value'
				},
				{
					name: 'mock',
					type: 'static-value'
				}
			]
		}
		const component = mount(<VariableListModal content={content} />)

		// Click duplicate button
		component
			.find('.button')
			.at(2)
			.simulate('click')

		expect(component.find('.single-variable').length).toEqual(3)
		// Check if duplicated element is selected
		expect(
			component
				.find('.single-variable')
				.at(2)
				.hasClass('variable-is-selected')
		).toEqual(true)

		expect(
			component
				.find('.single-variable')
				.at(2)
				.html()
		).toMatchInlineSnapshot(
			`"<button class=\\"single-variable variable-is-selected\\" tabindex=\\"0\\" aria-label=\\"Jump to variable var2\\"><h4>$var2</h4><small><span>Static value </span><b></b></small></button>"`
		)

		// Click duplicate button
		component
			.find('.button')
			.at(2)
			.simulate('click')

		expect(component.find('.single-variable').length).toEqual(4)
		// check if duplicated element is selected
		expect(
			component
				.find('.single-variable')
				.at(3)
				.html()
		).toMatchInlineSnapshot(
			`"<button class=\\"single-variable variable-is-selected\\" tabindex=\\"0\\" aria-label=\\"Jump to variable var3\\"><h4>$var3</h4><small><span>Static value </span><b></b></small></button>"`
		)

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableListModal calls "onChange"', () => {
		const content = {
			variables: [
				{
					name: 'var1',
					type: 'random-list'
				},
				{
					name: 'var2',
					type: 'static-value'
				}
			]
		}
		const component = mount(<VariableListModal content={content} />)

		// Simulate input changes
		component
			.find('.variable-property--input-item')
			.at(0)
			.simulate('change', { target: { name: 'name', value: 'mockNewName' } })

		expect(content.variables[0].name).toEqual('mockNewName')

		// Simulate checkbox changes
		component
			.find('input')
			.at(3)
			.simulate('change', { target: { name: 'unique', type: 'checkbox', checked: true } })

		expect(content.variables[0].unique).toEqual(true)

		expect(component.html()).toMatchSnapshot()
	})

	test('onChange resets properties if type is changed', () => {
		const content = {
			variables: [
				{
					name: 'var1',
					type: 'static-value',
					value: '4'
				},
				{
					name: 'var2',
					type: 'static-value'
				}
			]
		}
		const component = mount(<VariableListModal content={content} />)

		// Simulate input changes
		component
			.find('.variable-property--input-item')
			.at(0)
			.simulate('change', { target: { name: 'type', value: 'random-number' } })

		expect(content.variables[0].type).toEqual('random-number')
		expect(content.variables[0].value).toBeUndefined()
		expect(component.html()).toMatchSnapshot()
	})

	test('VariableListModal calls "addVariable"', () => {
		const content = {
			variables: [
				{
					name: 'mockName1',
					type: 'static-value'
				},
				{
					name: 'mockName2',
					type: 'static-value'
				}
			]
		}
		const component = mount(<VariableListModal content={content} />)

		// Click "create new variable" and select a type
		component
			.find('.button')
			.at(0)
			.simulate('click')
		component
			.find('.new-variable--type-list--single-item')
			.at(0)
			.simulate('click')

		expect(component.find('.single-variable').length).toEqual(3)

		// Click create new variable and select a type
		component
			.find('.button')
			.at(0)
			.simulate('click')
		component
			.find('.new-variable--type-list--single-item')
			.at(0)
			.simulate('click')

		expect(component.find('.single-variable').length).toEqual(4)

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableListModal calls "addVariable" - decimalPlacesMin and decimalPlacesMax are default to 0', () => {
		const content = {
			variables: [
				{
					name: 'mockName1',
					type: 'random-number'
				},
				{
					name: 'mockName2',
					type: 'random-list'
				}
			]
		}
		const component = mount(<VariableListModal content={content} />)

		// Click create new variable and select "random-number" type
		component
			.find('.button')
			.at(0)
			.simulate('click')
		component
			.find('.new-variable--type-list--single-item')
			.at(1)
			.simulate('click')

		expect(component.find('.single-variable').length).toEqual(3)

		expect(
			component
				.find('input')
				.at(4)
				.props().value
		).toEqual('0')
		expect(
			component
				.find('input')
				.at(5)
				.props().value
		).toEqual('0')

		expect(component.html()).toMatchSnapshot()
	})

	test('VariableListModal call "deleteVariable"', () => {
		global.confirm = () => true

		const content = {
			variables: [
				{
					name: 'mockName1',
					type: 'static-value'
				},
				{
					name: 'mockName2',
					type: 'static-value'
				}
			]
		}
		const component = mount(<VariableListModal content={content} />)

		// Click create new variable and select a type
		component
			.find('.button')
			.at(1)
			.simulate('click')

		expect(component.find('.single-variable').length).toEqual(1)
		expect(component.html()).toMatchSnapshot()
	})
})