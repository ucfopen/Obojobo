import React from 'react'
import { mount } from 'enzyme'

import ColorPicker from 'obojobo-document-engine/src/scripts/oboeditor/assets/color-picker.js'

jest.mock('slate-react')
jest.mock('slate')

describe('Color Picker', () => {
	test('ColorPicker component', () => {
		const component = mount(<ColorPicker />)
		expect(component.html()).toMatchSnapshot()
	})

	test('ColorPicker - click on a cell', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = mount(<ColorPicker {...props} />)
		component
			.find('.color-picker--color-cell')
			.at(0)
			.simulate('click')

		expect(props.onClose).toHaveBeenCalled()
	})

	test('ColorPicker expanded', () => {
		const onClose = jest.fn()
		const component = mount(<ColorPicker onClose={onClose} />)
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
			onClose: jest.fn()
		}

		const component = mount(<ColorPicker {...props} />)
		component
			.find('.color-picker--button')
			.at(0)
			.simulate('click')
		component
			.find('.color-picker--color-cell')
			.at(0)
			.simulate('click')

		expect(props.onClose).toHaveBeenCalled()
	})

	test('ColorPicker - onChange', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = mount(<ColorPicker {...props} />)

		// click on "More Color"
		component
			.find('.color-picker--button')
			.at(0)
			.simulate('click')

		// Invalid Hex
		component
			.find('input')
			.at(0)
			.simulate('change', { target: { value: 'invalid' } })
		expect(component.find('input').get(0).props.value).toBe('')

		// Valid hex
		component
			.find('input')
			.at(0)
			.simulate('change', { target: { value: '111111' } })
		expect(component.find('input').get(0).props.value).toBe('111111')

		// Empty string
		component
			.find('input')
			.at(0)
			.simulate('change', { target: { value: '' } })
		expect(component.find('input').get(0).props.value).toBe('')
	})

	test('click ok', () => {
		const props = {
			editor: {
				toggleEditable: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = mount(<ColorPicker {...props} />)

		// Click on "More Color"
		component
			.find('.color-picker--button')
			.at(0)
			.simulate('click')
		component
			.find('input')
			.at(0)
			.simulate('change', { target: { value: '111111' } })
		component
			.find('.button')
			.at(0)
			.simulate('click')

		expect(props.onClose).toHaveBeenCalled()
	})
})
