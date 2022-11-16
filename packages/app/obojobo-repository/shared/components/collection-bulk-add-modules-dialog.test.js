import React from 'react'
import { create, act } from 'react-test-renderer'

import CollectionBulkAddModulesDialog from './collection-bulk-add-modules-dialog'
import Checkbox from './checkbox'
import Search from './search'

describe('CollectionBulkAddModulesDialog', () => {
	let defaultProps

	beforeEach(() => {
		defaultProps = {
			collections: [
				{
					id: 'mockCollectionId',
					title: 'A Collection Title'
				},
				{
					id: 'mockCollectionId2',
					title: 'B Collection Title'
				},
				{
					id: 'mockCollectionId3',
					title: 'C Collection Title'
				}
			],
			selectedModules: ['mockDraftId1', 'mockDraftId2'],
			bulkAddModulesToCollection: jest.fn(),
			onClose: jest.fn()
		}
	})

	test('renders with "null" collections', () => {
		defaultProps.collections = null
		let component
		act(() => {
			component = create(<CollectionBulkAddModulesDialog {...defaultProps} />)
		})

		expect(component.root.findAllByType(Checkbox).length).toBe(0)
	})

	test('renders all collection options', () => {
		let component
		act(() => {
			component = create(<CollectionBulkAddModulesDialog {...defaultProps} />)
		})

		expect(component.root.findAllByType(Checkbox).length).toBe(3)
	})

	test('renders collections with no title', () => {
		defaultProps.collections = [
			{
				id: 'mockCollectionId1',
				title: 'A Collection Title'
			},
			{
				id: 'mockCollectionId2'
			}
		]

		let component
		act(() => {
			component = create(<CollectionBulkAddModulesDialog {...defaultProps} />)
		})

		expect(component.root.findAllByType(Checkbox).length).toBe(2)
	})

	test('renders filtered collection options', () => {
		const reusableComponent = <CollectionBulkAddModulesDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		let checkBoxes = component.root.findAllByType(Checkbox)
		expect(checkBoxes.length).toBe(3)

		act(() => {
			component.root.findByType(Search).props.onChange('   A ')
			component.update(reusableComponent)
		})

		checkBoxes = component.root.findAllByType(Checkbox)
		expect(component.root.findAllByType(Checkbox).length).toBe(1)
		expect(checkBoxes[0].parent.findByType('span').children[0]).toBe('A Collection Title')

		act(() => {
			component.root.findByType(Search).props.onChange(' ')
			component.update(reusableComponent)
		})

		checkBoxes = component.root.findAllByType(Checkbox)
		expect(component.root.findAllByType(Checkbox).length).toBe(3)
	})

	test('renders filtered collections options when some have no title', () => {
		defaultProps.collections = [
			{
				id: 'mockCollectionId1',
				title: 'A Collection Title'
			},
			{
				id: 'mockCollectionId2'
			}
		]
		const reusableComponent = <CollectionBulkAddModulesDialog {...defaultProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		let checkBoxes = component.root.findAllByType(Checkbox)
		expect(checkBoxes.length).toBe(2)

		act(() => {
			component.root.findByType(Search).props.onChange('   A ')
			component.update(reusableComponent)
		})
		checkBoxes = component.root.findAllByType(Checkbox)
		expect(component.root.findAllByType(Checkbox).length).toBe(1)
		expect(checkBoxes[0].parent.findByType('span').children[0]).toBe('A Collection Title')
	})

	test('close button runs prop functions correctly', () => {
		let component
		act(() => {
			component = create(<CollectionBulkAddModulesDialog {...defaultProps} />)
		})

		const closeButton = component.root.findByProps({ className: 'close-button' })
		act(() => {
			closeButton.props.onClick()
		})

		expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
	})

	const clickAddButton = component => {
		const addButton = component.root.findByProps({ className: 'done-button secondary-button' })
		act(() => {
			addButton.props.onClick()
		})
	}
	const expectAddCallbackCalledWith = expectedCollectionIds => {
		expect(defaultProps.bulkAddModulesToCollection).toHaveBeenCalledTimes(1)
		expect(defaultProps.bulkAddModulesToCollection).toHaveBeenCalledWith(
			['mockDraftId1', 'mockDraftId2'],
			expectedCollectionIds
		)
		defaultProps.bulkAddModulesToCollection.mockReset()
	}

	test('"Add" button calls corresponding functions with the correct arguments', () => {
		let component
		act(() => {
			component = create(<CollectionBulkAddModulesDialog {...defaultProps} />)
		})

		clickAddButton(component)

		expectAddCallbackCalledWith([])
		expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
	})

	test('the list of selected collections is modified appropriately when collections are clicked', () => {
		let component
		act(() => {
			component = create(<CollectionBulkAddModulesDialog {...defaultProps} />)
		})

		const checkBoxes = component.root.findAllByType(Checkbox)

		// add the first collection to the list
		act(() => {
			checkBoxes[0].parent.props.onClick()
		})

		clickAddButton(component)
		// Checking the state would require a lot of extra test setup - this is easier and works well enough
		expectAddCallbackCalledWith(['mockCollectionId'])

		// add the third collection to the list
		act(() => {
			checkBoxes[2].parent.props.onClick()
		})

		clickAddButton(component)
		expectAddCallbackCalledWith(['mockCollectionId', 'mockCollectionId3'])

		// remove the first collection from the list
		act(() => {
			checkBoxes[0].parent.props.onClick()
		})

		clickAddButton(component)
		expectAddCallbackCalledWith(['mockCollectionId3'])
	})
})
