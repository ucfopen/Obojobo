import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import ObjectiveEdit from 'src/scripts/oboeditor/components/objectives/objective-edit'

describe('Objective Edit', () => {
	test('ObjectiveEdit renders correctly', () => {
		const props = {
			data: {
				id: 'mock-id',
				label: 'mock-label',
				description: 'description'
			},
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = renderer.create(<ObjectiveEdit {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ObjectiveEdit allows confirmation', () => {
		const props = {
			data: {
				id: 'mock-id',
				label: 'mock-label',
				description: 'description'
			},
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = mount(<ObjectiveEdit {...props} />)

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

	test('ObjectiveEdit does not allow confirmation if label and decription are missing', () => {
		const props = {
			data: {
				id: 'mock-id',
				label: '',
				description: ''
			},
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = mount(<ObjectiveEdit {...props} />)

		component
			.find('button')
			.at(1)
			.simulate('click')
		expect(props.onConfirm).not.toHaveBeenCalled()
	})

	test('ObjectiveEdit does not allow confirmation if label is missing', () => {
		const props = {
			data: {
				id: 'mock-id',
				label: '',
				description: ''
			},
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = mount(<ObjectiveEdit {...props} />)

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

	test('ObjectiveEdit does not allow confirmation if description is missing', () => {
		const props = {
			data: {
				id: 'mock-id',
				label: '',
				description: ''
			},
			onCancel: jest.fn(),
			onConfirm: jest.fn()
		}

		const component = mount(<ObjectiveEdit {...props} />)

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
