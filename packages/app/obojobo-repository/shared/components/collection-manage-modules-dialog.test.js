import React from 'react'
// import ReactModal from 'react-modal'
import CollectionManageModulesDialog from './collection-manage-modules-dialog'
import CollectionModuleListItem from './collection-module-list-item'
// import ModuleSearchDialog from './module-search-dialog-hoc'
import { mount } from 'enzyme'

describe('CollectionManageModulesDialog', () => {
	jest.mock('./collection-module-list-item')
	jest.mock('./module-search-dialog-hoc')

	let defaultProps

	beforeEach(() => {
		jest.clearAllMocks()

		defaultProps = {
			collection: {
				id: 'whatever',
				title: 'whatever'
			},
			collectionModules: [],
			loadCollectionModules: jest.fn(),
			collectionAddModule: jest.fn(),
			collectionRemoveModule: jest.fn(),
			onClose: jest.fn()
		}
	})

	test('renders with "null" collection modules', () => {
		defaultProps.collectionModules = null
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		expect(defaultProps.loadCollectionModules).toHaveBeenCalledTimes(1)
		expect(defaultProps.loadCollectionModules).toHaveBeenCalledWith('whatever')
		expect(component.find(CollectionModuleListItem).length).toBe(0)
	})

	test('renders with no collection modules', () => {
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		expect(defaultProps.loadCollectionModules).toHaveBeenCalledTimes(1)
		expect(defaultProps.loadCollectionModules).toHaveBeenCalledWith('whatever')
		expect(component.find(CollectionModuleListItem).length).toBe(0)
	})

	test('renders with collection modules', () => {
		defaultProps.collectionModules = [
			{ draftId: 'whatever' },
			{ draftId: 'whatever-2' },
			{ draftId: 'whatever-3' }
		]
		const component = mount(<CollectionManageModulesDialog {...defaultProps} />)

		expect(defaultProps.loadCollectionModules).toHaveBeenCalledTimes(1)
		expect(defaultProps.loadCollectionModules).toHaveBeenCalledWith('whatever')
		expect(component.find(CollectionModuleListItem).length).toBe(3)
	})

	// test('"close" and "done" buttons call props.onClose', () => {
	// 	const component = mount(<CollectionManageModulesDialog { ...defaultProps} />)

	// 	component.find('.close-button').simulate('click')
	// 	component.find('.done-button').simulate('click')
	// 	expect(defaultProps.onClose).toHaveBeenCalledTimes(2)
	// })

	// test('"add" button opens the module search modal', () => {
	// 	const component = mount(<CollectionManageModulesDialog { ...defaultProps} />)

	// 	component.find('.wrapper .new-button').simulate('click')
	// 	expect(component.find(ReactModal).length).toBe(1)
	// })
})
