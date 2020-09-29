import React from 'react'
import { mount } from 'enzyme'

import ColorPicker from 'obojobo-document-engine/src/scripts/oboeditor/assets/color-picker'

jest.mock('slate-react')
jest.mock('slate')

describe('Color Picker', () => {
	test('ColorPicker component', () => {
		const component = mount(<ColorPicker />)
		expect(component.html()).toMatchSnapshot()
	})

	test('Click on a color cell', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			},
			close: jest.fn()
		}

		const component = mount(<ColorPicker {...props} />)
		component
			.find('.color-picker--color-cell')
			.at(0)
			.simulate('click')

		expect(props.close).toHaveBeenCalled()
	})

	test('ColorPicker expanded', () => {
		const close = jest.fn()
		const component = mount(<ColorPicker close={close} />)
		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('ColorPicker expanded - click on a cell', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			},
			close: jest.fn()
		}

		const component = mount(<ColorPicker {...props} />)

		// Expand color options
		component
			.find('button')
			.at(0)
			.simulate('click')
		component
			.find('.color-picker--color-cell')
			.at(0)
			.simulate('click')

		expect(props.close).toHaveBeenCalled()
	})

	test('onChangeText', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			},
			close: jest.fn()
		}

		const component = mount(<ColorPicker {...props} />)

		// Expand color options
		component
			.find('button')
			.at(0)
			.simulate('click')

		const input = component.find('input').at(1)

		// Invalid input
		input.simulate('change', { target: { value: 'invalid' } })
		expect(component.find('input').get(1).props.value).toBe('')

		// Add the missing '#'
		input.simulate('change', { target: { value: '111111' } })
		expect(component.find('input').get(1).props.value).toBe('#111111')

		// Valid
		input.simulate('change', { target: { value: '#111111' } })
		expect(component.find('input').get(1).props.value).toBe('#111111')

		// Empty string
		input.simulate('change', { target: { value: '' } })
		expect(component.find('input').get(1).props.value).toBe('')
	})

	test('onChangeColor', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			},
			close: jest.fn()
		}

		const component = mount(<ColorPicker {...props} />)

		// Expand color options
		component
			.find('button')
			.at(0)
			.simulate('click')

		const input = component.find('input').at(0)

		input.simulate('change', { target: { value: '#000000' } })
		expect(component.find('input').get(1).props.value).toBe('#000000')
	})

	test('Click OK', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			},
			close: jest.fn()
		}

		const component = mount(<ColorPicker {...props} />)

		// Expand color options
		component
			.find('button')
			.at(0)
			.simulate('click')

		component
			.find('.color-picker--holder')
			.at(0)
			.simulate('click')
		component
			.find('input')
			.at(1)
			.simulate('change', { target: { value: '111111' } })

		// Click OK
		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(props.close).toHaveBeenCalled()
	})
})
