import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import ObjectiveListModal from 'src/scripts/oboeditor/components/objectives/objective-list-modal'

describe('Objective List Modal', () => {
	test('ObjectiveListModal renders correctly', () => {
		const props = {
			content: {
				objectives: []
			},
			objectiveContext: {
				objectives: [
					{ objectiveId: 'mock-id-1', objectiveLabel: 'mock-label-1' },
					{ objectiveId: 'mock-id-2', objectiveLabel: 'mock-label-2' }
				],
				addObjective: jest.fn(),
				removeObjective: jest.fn(),
				updateObjective: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = renderer.create(<ObjectiveListModal {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ObjectiveListModal unmounts correctly', () => {
		const props = {
			content: { objectives: [] },
			objectiveContext: { objectives: [] },
			onClose: jest.fn()
		}

		const component = mount(<ObjectiveListModal {...props} />)
		component.unmount()
		expect(props.onClose).toHaveBeenCalled()
	})

	test('ObjectiveListModal deletes objective', () => {
		const confirm = jest.spyOn(window, 'confirm').mockReturnValue(true)

		const props = {
			content: {
				objectives: []
			},
			objectiveContext: {
				objectives: [
					{ objectiveId: 'mock-id-1', objectiveLabel: 'mock-label-1' },
					{ objectiveId: 'mock-id-2', objectiveLabel: 'mock-label-2' }
				],
				addObjective: jest.fn(),
				removeObjective: jest.fn(),
				updateObjective: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = mount(<ObjectiveListModal {...props} />)
		component
			.find('div.close-btn')
			.at(0)
			.simulate('click')

		expect(confirm).toBeCalled()
	})

	test('ObjectiveListModal creates new objective', () => {
		const props = {
			content: {
				objectives: []
			},
			objectiveContext: {
				objectives: [
					{ objectiveId: 'mock-id-1', objectiveLabel: 'mock-label-1' },
					{ objectiveId: 'mock-id-2', objectiveLabel: 'mock-label-2' }
				],
				addObjective: jest.fn(),
				removeObjective: jest.fn(),
				updateObjective: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = mount(<ObjectiveListModal {...props} />)

		// Creating new objective (opens ObjectiveInput)
		component
			.find('.obojobo-draft--components--button')
			.at(0)
			.find('button')
			.at(0)
			.simulate('click')

		// Writing mock label and description so that confirmation is allowed
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
		expect(props.objectiveContext.addObjective).toHaveBeenCalled()
	})

	test('ObjectiveListModal cancels new objective creation', () => {
		const props = {
			content: {
				objectives: []
			},
			objectiveContext: {
				objectives: [
					{ objectiveId: 'mock-id-1', objectiveLabel: 'mock-label-1' },
					{ objectiveId: 'mock-id-2', objectiveLabel: 'mock-label-2' }
				],
				addObjective: jest.fn(),
				removeObjective: jest.fn(),
				updateObjective: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = mount(<ObjectiveListModal {...props} />)

		// Creating new objective (opens ObjectiveInput)
		component
			.find('.obojobo-draft--components--button')
			.at(0)
			.find('button')
			.at(0)
			.simulate('click')

		// Canceling creation
		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component).toMatchSnapshot()
	})

	test('ObjectiveListModal initializes edit mode', () => {
		const props = {
			content: {
				objectives: []
			},
			objectiveContext: {
				objectives: [
					{
						objectiveId: 'mock-id-1',
						objectiveLabel: 'mock-label-1',
						description: 'mock-description-1'
					}
				],
				addObjective: jest.fn(),
				removeObjective: jest.fn(),
				updateObjective: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = mount(<ObjectiveListModal {...props} />)

		// Initializing edit mode (opens ObjectiveEdit)
		component
			.find('a.edit-link')
			.at(0)
			.simulate('click')

		// Writing mock label and description so that confirmation is allowed
		component.find('input#objective-label').simulate('change', {
			target: { value: 'mock-label' }
		})

		component.find('input#objective-input').simulate('change', {
			target: { value: 'mock-description' }
		})

		// Confirming edit
		component
			.find('button')
			.at(1)
			.simulate('click')

		// Actual testing starts here
		expect(props.objectiveContext.updateObjective).toHaveBeenCalled()
	})

	test('ObjectiveListModal cancels edit mode', () => {
		const props = {
			content: {
				objectives: []
			},
			objectiveContext: {
				objectives: [
					{
						objectiveId: 'mock-id-1',
						objectiveLabel: 'mock-label-1',
						description: 'mock-description-1'
					}
				],
				addObjective: jest.fn(),
				removeObjective: jest.fn(),
				updateObjective: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = mount(<ObjectiveListModal {...props} />)

		// Initializing edit mode (opens ObjectiveEdit)
		component
			.find('a.edit-link')
			.at(0)
			.simulate('click')

		// Canceling edit mode
		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component).toMatchSnapshot()
	})

	test('ObjectiveListModal allows checkbox deselection', () => {
		const objectiveId = 'mock-id-1'

		const props = {
			content: {
				objectives: [{ objectiveId, objectiveLabel: 'mock-label-1' }]
			},
			objectiveContext: {
				objectives: [{ objectiveId, objectiveLabel: 'mock-label-1' }],
				addObjective: jest.fn(),
				removeObjective: jest.fn(),
				updateObjective: jest.fn()
			}
		}

		const component = mount(<ObjectiveListModal {...props} />)

		component.find(`input#${objectiveId}`).simulate('change', {
			target: { value: 'mock-label' }
		})

		expect(component).toMatchSnapshot()
	})

	test('ObjectiveListModal allows checkbox selection', () => {
		const objectiveId = 'mock-id-1'

		const props = {
			content: {
				objectives: []
			},
			objectiveContext: {
				objectives: [{ objectiveId, objectiveLabel: 'mock-label-1' }],
				addObjective: jest.fn(),
				removeObjective: jest.fn(),
				updateObjective: jest.fn()
			}
		}

		const component = mount(<ObjectiveListModal {...props} />)

		component.find(`input#${objectiveId}`).simulate('change', {
			target: { value: 'mock-label' }
		})

		expect(component).toMatchSnapshot()
	})

	test('ObjectiveListModal allows users to exit modal', () => {
		const props = {
			content: {
				objectives: []
			},
			objectiveContext: {
				objectives: [{ objectiveId: 'mock-id-1', objectiveLabel: 'mock-label-1' }],
				addObjective: jest.fn(),
				removeObjective: jest.fn(),
				updateObjective: jest.fn()
			},
			onClose: jest.fn()
		}

		const component = mount(<ObjectiveListModal {...props} />)

		component
			.find('button')
			.at(3)
			.simulate('click')
		expect(props.onClose).toHaveBeenCalled()
	})
})
