import React from 'react'
import { mount } from 'enzyme'
import { Editor } from 'slate'

import ColorPicker from './color-picker'

jest.mock('slate-react')
jest.mock('slate')

describe('Color Picker', () => {
	beforeEach(() => {
		Editor.marks.mockReturnValue({})
	})

	afterEach(() => {
		Editor.marks.mockRestore()
		Editor.addMark.mockRestore()
		Editor.removeMark.mockRestore()
	})

	test('ColorPicker component', () => {
		const component = mount(<ColorPicker />)
		expect(component.html()).toMatchSnapshot()
	})

	test('ColorPicker expanded', () => {
		const component = mount(<ColorPicker />)
		component
			.find('.expand-button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('ColorPicker shows the selected item', () => {
		Editor.marks.mockReturnValue({ color: '#990000' })
		const component = mount(<ColorPicker />)

		// Expect the second color-cell (for #990000) to be selected
		expect(
			component
				.find('.color-cell')
				.at(1)
				.props().className
		).toBe('color-cell is-selected')
	})

	test('ColorPicker - expanded - shows the selected item', () => {
		Editor.marks.mockReturnValue({ color: '#990000' })
		const component = mount(<ColorPicker />)

		// Click the expand button
		component
			.find('.expand-button')
			.at(0)
			.simulate('click')

		// Expect the color-cell for #990000 to be selected
		expect(
			component
				.find('.color-cell')
				.at(5)
				.props().className
		).toBe('color-cell is-selected')
	})

	test('ColorPicker defaults to the expanded view if an expanded color is selected', () => {
		Editor.marks.mockReturnValue({ color: '#e69138' })
		const component = mount(<ColorPicker />)

		// Expect the color cell for #e69138 to be selected
		expect(
			component
				.find('.color-cell')
				.at(11)
				.props().className
		).toBe('color-cell is-selected')

		// Expect signs that the dialog is expanded (No expand button and all the colors visible)
		expect(component.find('.expand-button').length).toBe(0)
		expect(component.find('.color-cell').length).toBe(35)
	})

	test('Click on a color cell', () => {
		const props = {
			editor: {},
			close: jest.fn()
		}

		// Click on the color-cell for #990000
		const component = mount(<ColorPicker {...props} />)
		component
			.find('.color-cell')
			.at(1)
			.simulate('click')

		// Expect dialog to be closed and the selected text updated with the color #990000
		expect(props.close).toHaveBeenCalled()
		expect(Editor.addMark).toHaveBeenCalledWith(props.editor, 'color', '#990000')
		expect(Editor.removeMark).not.toHaveBeenCalled()
	})

	test('Click on a color cell - expanded', () => {
		const props = {
			editor: {},
			close: jest.fn()
		}

		// Click the expand button
		const component = mount(<ColorPicker {...props} />)
		component
			.find('.expand-button')
			.at(0)
			.simulate('click')

		// Click on the color-cell for #990000
		component
			.find('.color-cell')
			.at(5)
			.simulate('click')

		// Expect dialog to be closed and the selected text updated with the color #990000
		expect(props.close).toHaveBeenCalled()
		expect(Editor.addMark).toHaveBeenCalledWith(props.editor, 'color', '#990000')
		expect(Editor.removeMark).not.toHaveBeenCalled()
	})

	test('Click on a color cell - expanded and selecting an expanded color', () => {
		const props = {
			editor: {},
			close: jest.fn()
		}

		// Click the expand button
		const component = mount(<ColorPicker {...props} />)
		component
			.find('.expand-button')
			.at(0)
			.simulate('click')

		// Click on the color-cell for #e69138
		component
			.find('.color-cell')
			.at(11)
			.simulate('click')

		// Expect dialog to be closed and the selected text updated with the color #e69138
		expect(props.close).toHaveBeenCalled()
		expect(Editor.addMark).toHaveBeenCalledWith(props.editor, 'color', '#e69138')
		expect(Editor.removeMark).not.toHaveBeenCalled()
	})

	test('Clicking on the custom color icon does not modify selected text or close the dialog', () => {
		const props = {
			editor: {},
			close: jest.fn()
		}

		// Click the expand button
		const component = mount(<ColorPicker {...props} />)
		component
			.find('.expand-button')
			.at(0)
			.simulate('click')

		// Click on the custom-color-icon
		component
			.find('.custom-color-icon')
			.at(0)
			.simulate('click')

		// Expect the dialog to still be open and no text updated
		expect(props.close).not.toHaveBeenCalled()
		expect(Editor.addMark).not.toHaveBeenCalled()
		expect(Editor.removeMark).not.toHaveBeenCalled()
	})

	test('Inputting valid color values works', () => {
		const props = {
			editor: {},
			close: jest.fn()
		}
		const component = mount(<ColorPicker {...props} />)

		// Click the expand button
		component
			.find('.expand-button')
			.at(0)
			.simulate('click')

		// Input "#990000" into the custom color input field
		const input = component.find('.color-string-input').at(0)
		input.simulate('change', { target: { value: '#990000' } })

		// The custom color icon should update to be #990000
		expect(
			component
				.find('.custom-color-icon')
				.at(0)
				.props().style.backgroundColor
		).toBe('#990000')

		// The #990000 color cell should be selected
		expect(
			component
				.find('.color-cell')
				.at(5)
				.props().className
		).toBe('color-cell is-selected')

		// The OK button can be clicked
		expect(
			component
				.find('.ok-button button')
				.at(0)
				.props().disabled
		).not.toBeDefined()

		// Submit the form to commit the choice
		const form = component.find('form').at(0)
		form.simulate('submit')

		// The dialog should have been closed and the selected text updated
		expect(props.close).toHaveBeenCalled()
		expect(Editor.addMark).toHaveBeenCalledWith(props.editor, 'color', '#990000')
		expect(Editor.removeMark).not.toHaveBeenCalled()
	})

	test('Inputting a hex value without a # character still works', () => {
		const props = {
			editor: {},
			close: jest.fn()
		}
		const component = mount(<ColorPicker {...props} />)

		// Click the expand button
		component
			.find('.expand-button')
			.at(0)
			.simulate('click')

		// Input "#990000" into the custom color input field
		const input = component.find('.color-string-input').at(0)
		input.simulate('change', { target: { value: '990000' } })

		// The custom color icon should update to be #990000
		expect(
			component
				.find('.custom-color-icon')
				.at(0)
				.props().style.backgroundColor
		).toBe('#990000')

		// The #990000 color cell should be selected
		expect(
			component
				.find('.color-cell')
				.at(5)
				.props().className
		).toBe('color-cell is-selected')

		// The OK button can be clicked
		expect(
			component
				.find('.ok-button button')
				.at(0)
				.props().disabled
		).not.toBeDefined()

		// Submit the form to commit the choice
		const form = component.find('form').at(0)
		form.simulate('submit')

		// The dialog should have been closed and the selected text updated
		expect(props.close).toHaveBeenCalled()
		expect(Editor.addMark).toHaveBeenCalledWith(props.editor, 'color', '#990000')
		expect(Editor.removeMark).not.toHaveBeenCalled()
	})

	test('Inputting an invalid value does nothing', () => {
		const props = {
			editor: {},
			close: jest.fn()
		}
		const component = mount(<ColorPicker {...props} />)

		// Click the expand button
		component
			.find('.expand-button')
			.at(0)
			.simulate('click')

		// Input garbage into the custom color input field
		const input = component.find('.color-string-input').at(0)
		input.simulate('change', { target: { value: 'this is an invalid value!' } })

		// The custom color icon should not have updated
		expect(
			component
				.find('.custom-color-icon')
				.at(0)
				.props().style.backgroundColor
		).toBe('')

		// No color cell should be selected
		expect(component.find('.is-selected').length).toBe(0)

		// The OK button cannot be clicked
		expect(
			component
				.find('.ok-button button')
				.at(0)
				.props().disabled
		).toBe(true)

		// Submit the form to commit the choice
		const form = component.find('form').at(0)
		form.simulate('submit')

		// The dialog should have been closed but nothing updated
		expect(props.close).toHaveBeenCalled()
		expect(Editor.addMark).not.toHaveBeenCalled()
		expect(Editor.removeMark).not.toHaveBeenCalled()
	})

	test('Inputting the empty string removes existing marks', () => {
		const props = {
			editor: {},
			close: jest.fn()
		}
		const component = mount(<ColorPicker {...props} />)

		// Click the expand button
		component
			.find('.expand-button')
			.at(0)
			.simulate('click')

		// Input "#990000" into the custom color input field
		const input = component.find('.color-string-input').at(0)
		input.simulate('change', { target: { value: '' } })

		// The custom color icon should not update
		expect(
			component
				.find('.custom-color-icon')
				.at(0)
				.props().style.backgroundColor
		).toBe('')

		// No color cell should be selected
		expect(component.find('.is-selected').length).toBe(0)

		// The OK button can be clicked
		expect(
			component
				.find('.ok-button button')
				.at(0)
				.props().disabled
		).not.toBeDefined()

		// Submit the form to commit the choice
		const form = component.find('form').at(0)
		form.simulate('submit')

		// The dialog should have been closed and the selected text updated
		expect(props.close).toHaveBeenCalled()
		expect(Editor.addMark).not.toHaveBeenCalled()
		expect(Editor.removeMark).toHaveBeenCalledWith(props.editor, 'color')
	})
})
