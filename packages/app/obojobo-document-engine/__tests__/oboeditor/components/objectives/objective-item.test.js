import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import ObjectiveItem from 'src/scripts/oboeditor/components/objectives/objective-item'

describe('Objective Item', () => {
	test('ObjectiveItem renders correctly', () => {
		const props = {
			description: 'mock-description',
			id: 'mock-id',
			label: 'mock-label',
			selected: 'mock-selected',
			onCheck: jest.fn(),
			delete: jest.fn(),
			onUpdate: jest.fn(),
			onEdit: jest.fn()
		}

		const component = renderer.create(<ObjectiveItem {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ObjectiveItem edits objective', () => {
		const props = {
			description: 'mock-description',
			id: 'mock-id',
			label: 'mock-label',
			selected: 'mock-selected',
			onCheck: jest.fn(),
			delete: jest.fn(),
			onUpdate: jest.fn(),
			onEdit: jest.fn()
		}

		const component = mount(<ObjectiveItem {...props} />)
		component
			.find('a')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(props.onEdit).toHaveBeenCalled()
	})

	test('ObjectiveItem successfully deletes objective', () => {
		const confirm = jest.spyOn(window, 'confirm').mockReturnValue(true)

		const props = {
			description: 'mock-description',
			id: 'mock-id',
			label: 'mock-label',
			selected: 'mock-selected',
			onCheck: jest.fn(),
			delete: jest.fn(),
			onUpdate: jest.fn(),
			onEdit: jest.fn()
		}

		const component = mount(<ObjectiveItem {...props} />)
		component
			.find('div.close-btn')
			.at(0)
			.simulate('click')

		expect(confirm).toBeCalled()
		expect(props.delete).toHaveBeenCalled()
	})

	test('ObjectiveItem negates objective deletion', () => {
		const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false)

		const props = {
			description: 'mock-description',
			id: 'mock-id',
			label: 'mock-label',
			selected: 'mock-selected',
			onCheck: jest.fn(),
			delete: jest.fn(),
			onUpdate: jest.fn(),
			onEdit: jest.fn()
		}

		const component = mount(<ObjectiveItem {...props} />)
		component
			.find('div.close-btn')
			.at(0)
			.simulate('click')

		expect(confirm).toBeCalled()
	})

	test('ObjectiveItem allows checkbox selection', () => {
		const props = {
			description: 'mock-description',
			id: 'mock-id',
			label: 'mock-label',
			selected: 'mock-selected',
			onCheck: jest.fn(),
			delete: jest.fn(),
			onUpdate: jest.fn(),
			onEdit: jest.fn()
		}

		const component = mount(<ObjectiveItem {...props} />)
		component
			.find('input#mock-id')
			.at(0)
			.simulate('change', {
				target: { value: '' }
			})
	})
})
