import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import ObjectiveInput from 'src/scripts/oboeditor/components/objectives/objective-input'

describe('Objective Input', () => {
	test('ObjectiveInput renders correctly', () => {
		const props = {
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = renderer.create(<ObjectiveInput {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ObjectiveInput allows confirmation', () => {
		const props = {
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = mount(<ObjectiveInput {...props} />)

		// Writing mock label and description
		component.find('input#objective-label').simulate('change', {
			target: { value: 'mock-label' }
		})

		component.find('input#objective-input').simulate('change', {
			target: { value: 'mock-description' }
		})

		// Actual testing starts here
		component
			.find('button')
			.at(1)
			.simulate('click')
		expect(props.onConfirm).toHaveBeenCalled()
	})

	test('ObjectiveInput does not allow confirmation if label and decription are missing', () => {
		const props = {
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = mount(<ObjectiveInput {...props} />)

		component
			.find('button')
			.at(1)
			.simulate('click')
		expect(props.onConfirm).not.toHaveBeenCalled()
	})

	test('ObjectiveInput does not allow confirmation if label is missing', () => {
		const props = {
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = mount(<ObjectiveInput {...props} />)

		// Writing mock description
		component.find('input#objective-input').simulate('change', {
			target: { value: 'mock-description' }
		})

		// Actual testing starts here
		component
			.find('button')
			.at(1)
			.simulate('click')
		expect(props.onConfirm).not.toHaveBeenCalled()
	})

	test('ObjectiveInput does not allow confirmation if description is missing', () => {
		const props = {
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = mount(<ObjectiveInput {...props} />)

		// Writing mock label
		component.find('input#objective-label').simulate('change', {
			target: { value: 'mock-label' }
		})

		// Actual testing starts here
		component
			.find('button')
			.at(1)
			.simulate('click')
		expect(props.onConfirm).not.toHaveBeenCalled()
	})
})
