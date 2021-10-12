jest.mock('react-modal', () => props => {
	return <mock-ReactModal {...props}></mock-ReactModal>
})
jest.mock('./people-search-dialog-hoc', () => props => {
	return <mock-PeopleSearchDialog {...props}>{props.children}</mock-PeopleSearchDialog>
})

import React from 'react'
import ReactModal from 'react-modal'
import { create, act } from 'react-test-renderer'

import ModulePermissionsDialog from './module-permissions-dialog'
import PeopleSearchDialog from './people-search-dialog-hoc'
import PeopleListItem from './people-list-item'
import Button from './button'

describe('ModulePermissionsDialog', () => {
	let defaultProps

	const originalConfirm = window.confirm

	beforeEach(() => {
		jest.resetAllMocks()

		defaultProps = {
			draftId: 'mockDraftId',
			title: 'Mock Module Title',
			currentUserId: 99,
			draftPermissions: {},
			loadUsersForModule: jest.fn(),
			addUserToModule: jest.fn(),
			deleteModulePermissions: jest.fn(),
			onClose: jest.fn(),
			openPeoplePicker: jest.fn()
		}
	})

	afterAll(() => {
		window.confirm = originalConfirm
	})

	const expectLoadUsersForModuleToBeCalledOnceWithId = () => {
		expect(defaultProps.loadUsersForModule).toHaveBeenCalledTimes(1)
		expect(defaultProps.loadUsersForModule).toHaveBeenCalledWith('mockDraftId')
	}

	const expectPeopleSearchModalToBeRendered = (component, isRendered) => {
		expect(component.root.findAllByType(ReactModal).length).toBe(isRendered ? 1 : 0)
		expect(component.root.findAllByType(PeopleSearchDialog).length).toBe(isRendered ? 1 : 0)
	}

	const expectModulePermissionsModalToBeRendered = (component, isRendered) => {
		expect(component.root.findAllByType(ReactModal).length).toBe(isRendered ? 1 : 0)
	}

	test('renders with "null" draftPermissions', () => {
		let component
		act(() => {
			component = create(<ModulePermissionsDialog {...defaultProps} />)
		})

		expectLoadUsersForModuleToBeCalledOnceWithId()
		expect(component.root.findAllByType(PeopleListItem).length).toBe(0)
	})

	test('renders with no draftPermissions', () => {
		defaultProps.draftPermissions['mockDraftId'] = {
			items: []
		}
		let component
		act(() => {
			component = create(<ModulePermissionsDialog {...defaultProps} />)
		})

		expectLoadUsersForModuleToBeCalledOnceWithId()
		expect(component.root.findAllByType(PeopleListItem).length).toBe(0)
	})

	test('renders with draftPermissions', () => {
		defaultProps.draftPermissions['mockDraftId'] = {
			items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 99 }]
		}

		let component

		act(() => {
			component = create(<ModulePermissionsDialog {...defaultProps} />)
		})
		act(() => {
			component.root.findByProps({ id: 'modulePermissionsDialog-addPeopleButton' }).props.onClick()
		})

		expectLoadUsersForModuleToBeCalledOnceWithId()
		const peopleListItems = component.root.findAllByType(PeopleListItem)
		expect(peopleListItems.length).toBe(4)
		expect(peopleListItems[0].props.isMe).toBe(false)
		expect(peopleListItems[1].props.isMe).toBe(false)
		expect(peopleListItems[2].props.isMe).toBe(false)
		expect(peopleListItems[3].props.isMe).toBe(true)
	})

	test('clicking the "Add People" button opens the search dialog', () => {
		const reusableComponent = <ModulePermissionsDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, false)

		act(() => {
			component.root.findByProps({ id: 'modulePermissionsDialog-addPeopleButton' }).props.onClick()
			component.update(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, true)
	})

	test('clicking the "Add People" button opens the search dialog and passes it draftPermissions', () => {
		defaultProps.draftPermissions['mockDraftId'] = {
			items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 99 }]
		}
		const reusableComponent = <ModulePermissionsDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		expectModulePermissionsModalToBeRendered(component, false)

		act(() => {
			component.root.findByProps({ id: 'modulePermissionsDialog-addPeopleButton' }).props.onClick()
			component.update(reusableComponent)
		})

		expectModulePermissionsModalToBeRendered(component, true)
	})

	test('modal closes the people search modal when callback is called', () => {
		const reusableComponent = <ModulePermissionsDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, false)

		act(() => {
			component.root.findByProps({ id: 'modulePermissionsDialog-addPeopleButton' }).props.onClick()
			component.update(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, true)

		act(() => {
			component.root.findByType(ReactModal).props.onRequestClose()
			component.update(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, false)
	})

	test('people search dialog closes the people search modal when callback is called', () => {
		const reusableComponent = <ModulePermissionsDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, false)

		act(() => {
			component.root.findByProps({ id: 'modulePermissionsDialog-addPeopleButton' }).props.onClick()
			component.update(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, true)

		act(() => {
			component.root.findByType(PeopleSearchDialog).props.onClose()
			component.update(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, false)
	})

	test('props.addUserToModule is called when PeopleSearchDialog.onSelectPerson is called', () => {
		const reusableComponent = <ModulePermissionsDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, false)

		act(() => {
			component.root.findByProps({ id: 'modulePermissionsDialog-addPeopleButton' }).props.onClick()
			component.update(reusableComponent)
		})

		expectPeopleSearchModalToBeRendered(component, true)

		act(() => {
			component.root.findByType(PeopleSearchDialog).props.onSelectPerson({ id: 1000 })
			component.update(reusableComponent)
		})
		expect(defaultProps.addUserToModule).toHaveBeenCalledTimes(1)
		expect(defaultProps.addUserToModule).toHaveBeenCalledWith('mockDraftId', 1000)

		//should also close the search modal
		expectPeopleSearchModalToBeRendered(component, false)
	})

	test('props.deleteModulePermissions is called when a peopleListItem "x" button is clicked', () => {
		defaultProps.draftPermissions['mockDraftId'] = {
			items: [{ id: 1 }, { id: 99 }]
		}
		const reusableComponent = <ModulePermissionsDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		expectLoadUsersForModuleToBeCalledOnceWithId()

		const peopleListItems = component.root.findAllByType(PeopleListItem)
		expect(peopleListItems.length).toBe(2)
		expect(peopleListItems[0].props.id).toBe(1)
		expect(peopleListItems[0].props.isMe).toBe(false)
		expect(peopleListItems[1].props.id).toBe(99)
		expect(peopleListItems[1].props.isMe).toBe(true)

		act(() => {
			peopleListItems[0].findByType(Button).props.onClick()
		})

		expect(defaultProps.deleteModulePermissions).toHaveBeenCalledTimes(1)
		expect(defaultProps.deleteModulePermissions).toHaveBeenCalledWith('mockDraftId', 1)
	})

	test('confirmation window denied when "x" button is clicked on peopleList item for current user', () => {
		window.confirm = jest.fn()
		window.confirm.mockReturnValue(false)

		defaultProps.draftPermissions['mockDraftId'] = {
			items: [{ id: 99 }]
		}
		const reusableComponent = <ModulePermissionsDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		const peopleListItem = component.root.findByType(PeopleListItem)
		expect(peopleListItem.props.id).toBe(99)
		expect(peopleListItem.props.isMe).toBe(true)

		act(() => {
			peopleListItem.findByType(Button).props.onClick()
		})

		expect(window.confirm).toHaveBeenCalledTimes(1)
		expect(window.confirm).toHaveBeenCalledWith('Remove yourself from this module?')

		expect(defaultProps.deleteModulePermissions).not.toHaveBeenCalled()
	})

	test('confirmation window confirmed when "x" button is clicked on peopleList item for current user', () => {
		window.confirm = jest.fn()
		window.confirm.mockReturnValue(true)

		defaultProps.draftPermissions['mockDraftId'] = {
			items: [{ id: 99 }]
		}
		const reusableComponent = <ModulePermissionsDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		const peopleListItem = component.root.findByType(PeopleListItem)
		expect(peopleListItem.props.id).toBe(99)
		expect(peopleListItem.props.isMe).toBe(true)

		act(() => {
			peopleListItem.findByType(Button).props.onClick()
		})

		expect(window.confirm).toHaveBeenCalledTimes(1)
		expect(window.confirm).toHaveBeenCalledWith('Remove yourself from this module?')

		expect(defaultProps.deleteModulePermissions).toHaveBeenCalledTimes(1)
		expect(defaultProps.deleteModulePermissions).toHaveBeenCalledWith('mockDraftId', 99)
	})

	test('"close" and "done" buttons call props.onClose', () => {
		let component
		act(() => {
			component = create(<ModulePermissionsDialog {...defaultProps} />)
		})

		act(() => {
			component.root.findByProps({ className: 'close-button' }).props.onClick()
			component.root.findByProps({ className: 'done-button secondary-button' }).props.onClick()
		})
		expect(defaultProps.onClose).toHaveBeenCalledTimes(2)
	})
})
