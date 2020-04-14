jest.mock('react-modal', () => props => {
	return <mock-ReactModal {...props}></mock-ReactModal>
})

jest.mock('./module-search-dialog-hoc')

import React from 'react'
import ReactModal from 'react-modal'
import CollectionManageModulesDialog from './collection-manage-modules-dialog'
import CollectionModuleListItem from './collection-module-list-item'
import ModuleSearchDialog from './module-search-dialog-hoc'

import { mount } from 'enzyme'

describe('CollectionManageModulesDialog', () => {
	jest.mock('./collection-module-list-item')

	let defaultProps

	// running any code that changes state throws a console error
	//  despite the tests passing and everything working
	// there does not appear to be any satisfactory way of avoiding this
	//  without also breaking the tests
	// next best thing is to just shut the console up for now
	// eslint-disable-next-line no-console
	const originalError = console.error
	beforeAll(() => {
		// eslint-disable-next-line no-console
		console.error = jest.fn()
	})
	afterAll(() => {
		// eslint-disable-next-line no-console
		console.error = originalError
	})

	beforeEach(() => {
		jest.clearAllMocks()

		defaultProps = {
			collection: {
				id: 'mockCollectionId',
				title: 'mockCollectionTitle'
			},
			collectionModules: [],
			loadCollectionModules: jest.fn(),
			collectionAddModule: jest.fn(),
			collectionRemoveModule: jest.fn(),
			onClose: jest.fn()
		}
	})

	const checkLoadCollectionModulesCall = () => {
		expect(defaultProps.loadCollectionModules).toHaveBeenCalledTimes(1)
		expect(defaultProps.loadCollectionModules).toHaveBeenCalledWith('mockCollectionId')
	}

	const checkModuleSearchModalDialogRendered = (component, isRendered) => {
		expect(component.find(ReactModal).length).toBe(isRendered ? 1 : 0)
		expect(component.find(ModuleSearchDialog).length).toBe(isRendered ? 1 : 0)
	}

	test('renders with "null" collection modules', () => {
		defaultProps.collectionModules = null
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		checkLoadCollectionModulesCall()
		expect(component.find(CollectionModuleListItem).length).toBe(0)
	})

	test('renders with no collection modules', () => {
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		checkLoadCollectionModulesCall()
		expect(component.find(CollectionModuleListItem).length).toBe(0)
	})

	test('renders with collection modules', () => {
		defaultProps.collectionModules = [
			{ draftId: 'mockDraftId' },
			{ draftId: 'mockDraftId2' },
			{ draftId: 'mockDraftId3' }
		]
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		checkLoadCollectionModulesCall()
		expect(component.find(CollectionModuleListItem).length).toBe(3)
	})

	test('"Add Module" button opens the module search modal', () => {
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		checkModuleSearchModalDialogRendered(component, false)

		component.find('Button.add-module-button').invoke('onClick')()

		checkModuleSearchModalDialogRendered(component, true)
	})

	test('modal closes the module search modal when callback is called', () => {
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		checkModuleSearchModalDialogRendered(component, false)

		component.find('Button.add-module-button').invoke('onClick')()

		checkModuleSearchModalDialogRendered(component, true)

		component.find(ReactModal).invoke('onRequestClose')()

		checkModuleSearchModalDialogRendered(component, false)
	})

	test('module search dialog closes the module search modal when callback is called', () => {
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		checkModuleSearchModalDialogRendered(component, false)

		component.find('Button.add-module-button').invoke('onClick')()

		checkModuleSearchModalDialogRendered(component, true)

		component.find(ModuleSearchDialog).invoke('onClose')()

		checkModuleSearchModalDialogRendered(component, false)
	})

	test('props.collectionRemoveModule is called when a module list item "x" button is clicked', () => {
		defaultProps.collectionModules = [
			{ draftId: 'mockDraftId' },
			{ draftId: 'mockDraftId2' },
			{ draftId: 'mockDraftId3' }
		]
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		checkLoadCollectionModulesCall()

		const moduleListItems = component.find(CollectionModuleListItem)
		expect(moduleListItems.length).toBe(3)
		expect(moduleListItems.at(0).prop('draftId')).toBe('mockDraftId')
		expect(moduleListItems.at(1).prop('draftId')).toBe('mockDraftId2')
		expect(moduleListItems.at(2).prop('draftId')).toBe('mockDraftId3')

		moduleListItems
			.at(1)
			.find('Button')
			.invoke('onClick')()

		expect(defaultProps.collectionRemoveModule).toHaveBeenCalledTimes(1)
		expect(defaultProps.collectionRemoveModule).toHaveBeenCalledWith(
			'mockDraftId2',
			'mockCollectionId'
		)
	})

	test('props.collectionAddModule is called when ModuleSearchDialog.onSelectModule is called', () => {
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		checkModuleSearchModalDialogRendered(component, false)

		component.find('Button.add-module-button').invoke('onClick')()

		checkModuleSearchModalDialogRendered(component, true)

		component.find(ModuleSearchDialog).invoke('onSelectModule')('mockDraftId')
		expect(defaultProps.collectionAddModule).toHaveBeenCalledTimes(1)
		expect(defaultProps.collectionAddModule).toHaveBeenCalledWith('mockDraftId', 'mockCollectionId')

		// adding a new module also closes the module search dialog
		checkModuleSearchModalDialogRendered(component, false)
	})

	test('"close" and "done" buttons call props.onClose', () => {
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		component.find('Button.close-button').invoke('onClick')()
		component.find('Button.done-button').invoke('onClick')()
		expect(defaultProps.onClose).toHaveBeenCalledTimes(2)
	})
})
