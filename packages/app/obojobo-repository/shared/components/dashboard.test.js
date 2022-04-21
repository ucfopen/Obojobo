jest.mock('short-uuid')

// mock all of these components so we can check that they're rendered and
//  run their callbacks without worrying about fully implementing them all
jest.mock('./button', () => props => {
	return <mock-Button>{props.children}</mock-Button>
})
jest.mock('./button-link', () => props => {
	return <mock-ButtonLink>{props.children}</mock-ButtonLink>
})
jest.mock('./multi-button', () => props => {
	return <mock-MultiButton>{props.children}</mock-MultiButton>
})
jest.mock('./collection', () => props => {
	return <mock-Collection>{props.children}</mock-Collection>
})
jest.mock('./module', () => props => {
	return <mock-Module>{props.children}</mock-Module>
})
jest.mock('./search', () => props => {
	return <mock-Search>{props.children}</mock-Search>
})
jest.mock('react-modal', () => props => {
	return <mock-ReactModal {...props}></mock-ReactModal>
})
jest.mock('./collection-manage-modules-dialog', () => props => {
	return <mock-CollectionManageModulesDialog {...props}></mock-CollectionManageModulesDialog>
})
jest.mock('./collection-rename-dialog', () => props => {
	return <mock-CollectionRenameDialog {...props}></mock-CollectionRenameDialog>
})
jest.mock('./collection-bulk-add-modules-dialog', () => props => {
	return <mock-CollectionBulkAddModulesDialog {...props}></mock-CollectionBulkAddModulesDialog>
})
jest.mock('./module-manage-collections-dialog', () => props => {
	return <mock-ModuleManageCollectionsDialog {...props}></mock-ModuleManageCollectionsDialog>
})
jest.mock('./module-permissions-dialog', () => props => {
	return <mock-ModulePermissionsDialog {...props}></mock-ModulePermissionsDialog>
})
jest.mock('./module-options-dialog', () => props => {
	return <mock-ModuleOptionsDialog {...props}></mock-ModuleOptionsDialog>
})
jest.mock('./assessment-score-data-dialog', () => props => {
	return <mock-AssessmentScoreDataDialog {...props}></mock-AssessmentScoreDataDialog>
})

import React from 'react'
import { create, act } from 'react-test-renderer'

import Dashboard from './dashboard'
import Button from './button'
import ButtonLink from './button-link'
import MultiButton from './multi-button'
import Collection from './collection'
import Module from './module'
import Search from './search'

import ReactModal from 'react-modal'
import CollectionManageModulesDialog from './collection-manage-modules-dialog'
import CollectionBulkAddModulesDialog from './collection-bulk-add-modules-dialog'
import CollectionRenameDialog from './collection-rename-dialog'
import ModuleManageCollectionsDialog from './module-manage-collections-dialog'
import ModulePermissionsDialog from './module-permissions-dialog'
import ModuleOptionsDialog from './module-options-dialog'
import VersionHistoryDialog from './version-history-dialog'
import AssessmentScoreDataDialog from './assessment-score-data-dialog'

const { MODE_RECENT, MODE_ALL, MODE_COLLECTION, MODE_DELETED } = require('../repository-constants')

describe('Dashboard', () => {
	const mockShortFromUUID = jest.fn()

	const standardMyCollections = [
		{
			id: 'mockCollectionId',
			title: 'D Collection Title ',
			createdAt: new Date(10000000000).toISOString(),
			updatedAt: new Date(200000000000).toISOString()
		},
		{
			id: 'mockCollectionId2',
			title: 'A Collection Title 2',
			createdAt: new Date(20000000000).toISOString(),
			updatedAt: new Date(400000000000).toISOString()
		},
		{
			id: 'mockCollectionId3',
			title: 'C Collection Title 3',
			createdAt: new Date(30000000000).toISOString(),
			updatedAt: new Date(300000000000).toISOString()
		},
		{
			id: 'mockCollectionId4',
			title: 'B Collection Title 4',
			createdAt: new Date(40000000000).toISOString(),
			updatedAt: new Date(100000000000).toISOString()
		},
		{
			id: 'mockCollectionId5',
			title: 'E Collection Title 5',
			createdAt: new Date(50000000000).toISOString(),
			updatedAt: new Date(500000000000).toISOString()
		}
	]

	const standardMyModules = [
		{
			draftId: 'mockDraftId',
			title: 'D Module Title ',
			accessLevel: 'Full',
			createdAt: new Date(10000000000).toISOString(),
			updatedAt: new Date(200000000000).toISOString()
		},
		{
			draftId: 'mockDraftId2',
			title: 'A Module Title 2',
			accessLevel: 'Full',
			createdAt: new Date(20000000000).toISOString(),
			updatedAt: new Date(400000000000).toISOString()
		},
		{
			draftId: 'mockDraftId3',
			title: 'C Module Title 3',
			accessLevel: 'Partial',
			createdAt: new Date(30000000000).toISOString(),
			updatedAt: new Date(300000000000).toISOString()
		},
		{
			draftId: 'mockDraftId4',
			title: 'B Module Title 4',
			accessLevel: 'Partial',
			createdAt: new Date(40000000000).toISOString(),
			updatedAt: new Date(100000000000).toISOString()
		},
		{
			draftId: 'mockDraftId5',
			title: 'E Module Title 5',
			accessLevel: 'Minimal',
			createdAt: new Date(50000000000).toISOString(),
			updatedAt: new Date(500000000000).toISOString()
		}
	]

	let dashboardProps
	let short

	const originalAlert = global.alert
	const originalConfirm = window.confirm
	const originalLocationAssign = window.location.assign

	// make document.cookie available (kind of) for checking sort method changes
	let cookie = {}
	beforeAll(() => {
		Object.defineProperty(document, 'cookie', {
			get: () => cookie,
			set: string => {
				const parts = string.split(';')
				const propAndValue = parts[0].split('=')
				cookie[propAndValue[0]] = {
					value: propAndValue[1],
					path: parts[parts.length - 1].split('=')[1]
				}
			},
			configurable: true
		})

		ReactModal.setAppElement = jest.fn()
		delete global.alert
	})

	beforeEach(() => {
		jest.resetAllMocks()
		global.alert = jest.fn()

		dashboardProps = {
			currentUser: {
				id: 99,
				avatarUrl: '/path/to/avatar',
				firstName: 'firstName',
				lastName: 'lastName',
				perms: [
					'canViewEditor',
					'canEditDrafts',
					'canDeleteDrafts',
					'canCreateDrafts',
					'canPreviewDrafts'
				]
			},
			mode: MODE_RECENT,
			dialog: null,
			selectedModule: {},
			draftPermissions: {},
			myCollections: [],
			myModules: [],
			selectedModules: [],
			multiSelectMode: false,
			moduleSortOrder: 'alphabetical',
			collectionSortOrder: 'alphabetical',
			moduleCount: 0,
			moduleSearchString: '',
			collectionSearchString: '',
			shareSearchString: '',
			searchPeople: {
				hasFetched: false,
				isFetching: false,
				timestamp: 3,
				items: []
			},
			versionHistory: {
				isFetching: false,
				hasFetched: false,
				items: []
			},
			attempts: {
				isFetching: false,
				hasFetched: false,
				items: []
			},
			closeModal: jest.fn(),
			getModules: jest.fn(),
			getDeletedModules: jest.fn(),
			bulkRestoreModules: jest.fn(() => Promise.resolve())
		}

		short = require('short-uuid')
		mockShortFromUUID.mockReturnValue('mockCollectionShortId')
		short.mockReturnValue({
			fromUUID: mockShortFromUUID
		})
	})

	afterEach(() => {
		cookie = {}
	})

	afterAll(() => {
		global.alert = originalAlert
		window.confirm = originalConfirm
		window.location.assign = originalLocationAssign
	})

	const expectRecentAndAllModeNewOptions = component => {
		const multiButton = component.root.findByType(MultiButton).children[0]
		// four buttons and a divider
		expect(multiButton.children.length).toBe(5)
		expect(multiButton.children[0].children[0].children[0]).toBe('New Collection')
		expect(multiButton.children[1].type).toBe('hr')
		expect(multiButton.children[2].children[0].children[0]).toBe('New Module')
		expect(multiButton.children[3].children[0].children[0]).toBe('New Tutorial')
		expect(multiButton.children[4].children[0].children[0]).toBe('Upload...')
	}

	const expectRecentModeControlBar = component => {
		const expectedControlBarClasses =
			'repository--main-content--control-bar is-not-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		// MODE_RECENT control bar only has the 'New...' button, no module filter
		expect(controlBar.children.length).toBe(1)
		expect(controlBar.children[0].props.title).toEqual('New...')
		expect(component.root.findAllByType(Search).length).toBe(0)
	}

	const expectAllModeControlBar = component => {
		const expectedControlBarClasses =
			'repository--main-content--control-bar is-not-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		// MODE_ALL control bar has the 'New...' button, 'Deleted Modules' link button and module filter
		expect(controlBar.children.length).toBe(3)
		expect(controlBar.children[0].props.title).toEqual('New...')
		expect(controlBar.children[1].type).toEqual(ButtonLink)
		expect(controlBar.children[1].props.url).toBe('/dashboard/deleted')

		expect(component.root.findAllByType(Search).length).toBe(1)
		expect(controlBar.children[2].type).toEqual(Search)
	}

	const expectCollectionModeControlBar = component => {
		const expectedControlBarClasses =
			'repository--main-content--control-bar is-not-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		// MODE_COLLECTION will have the 'New...' button, module filter, and collection management options
		expect(controlBar.children.length).toBe(5)
		expect(controlBar.children[0].props.title).toEqual('New...')
		expect(component.root.findAllByType(Search).length).toBe(1)

		expect(controlBar.children[1].type).toEqual(Button)
		expect(controlBar.children[1].props.children).toBe('Manage Modules')

		expect(controlBar.children[2].type).toEqual(Button)
		expect(controlBar.children[2].props.children).toBe('Rename')

		expect(controlBar.children[3].type).toEqual(Button)
		expect(controlBar.children[3].props.children).toBe('Delete Collection')

		expect(controlBar.children[4].type).toEqual(Search)
	}

	const expectDeletedModeControlBar = component => {
		const expectedControlBarClasses =
			'repository--main-content--control-bar is-not-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		// MODE_DELETED control bar has the 'Return to All Modules' link button and module filter
		expect(controlBar.children.length).toBe(2)
		expect(controlBar.children[0].type).toEqual(ButtonLink)
		expect(controlBar.children[0].props.url).toBe('/dashboard/all')

		expect(component.root.findAllByType(Search).length).toBe(1)
		expect(controlBar.children[1].type).toEqual(Search)
	}

	const expectMultiSelectControlBar = (
		component,
		isCollectionMode = false,
		isDeleteMode = false
	) => {
		const expectedControlBarClasses = 'repository--main-content--control-bar is-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		if (isDeleteMode) {
			expect(controlBar.children.length).toBe(3)

			expect(controlBar.children[0].props.className).toBe('module-count')
			expect(controlBar.children[0].type).toBe('span')
			expect(controlBar.children[1].props.children).toEqual('Restore All')
			expect(controlBar.children[2].props.className).toEqual('close-button')
			expect(controlBar.children[2].children[0].children[0]).toBe('×')
		} else {
			expect(controlBar.children.length).toBe(4)

			expect(controlBar.children[0].props.className).toBe('module-count')
			expect(controlBar.children[0].type).toBe('span')
			// In MODE_COLLECTION the bulk action will be to remove modules from the current collection
			// In both other modes the bulk action will be to open a dialog to choose a collection to add all modules to
			const collectionOperationButtonString = isCollectionMode
				? 'Remove All From Collection'
				: 'Add All To Collection'
			expect(controlBar.children[1].props.children).toEqual(collectionOperationButtonString)
			expect(controlBar.children[2].props.children).toEqual('Delete All')
			expect(controlBar.children[3].props.className).toEqual('close-button')
			expect(controlBar.children[3].children[0].children[0]).toBe('×')
		}

		const moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(5)
		moduleComponents.forEach(moduleComponent => {
			expect(moduleComponent.props.isMultiSelectMode).toBe(true)
		})
	}

	const getPlaceholderComponents = component => {
		const expectedPlaceholderClass = 'repository--item-list--collection--empty-placeholder'
		return component.root.findAllByProps({ className: expectedPlaceholderClass })
	}

	const expectCookiePropForPath = (prop, value, path) => {
		expect(document.cookie[prop].value).toBe(value)
		expect(document.cookie[prop].path).toBe(path)
	}

	const expectDialogToBeRendered = (component, dialogComponent, title) => {
		expect(ReactModal.setAppElement).toHaveBeenCalledTimes(1)
		expect(component.root.findByType(ReactModal).props.contentLabel).toBe(title)
		expect(component.root.findAllByType(dialogComponent).length).toBe(1)
	}

	const expectMethodToBeCalledOnceWith = (method, calledWith = []) => {
		expect(method).toHaveBeenCalledTimes(1)
		expect(method.mock.calls[0]).toEqual(calledWith)
		method.mockReset()
	}

	const expectModeRecentRender = component => {
		//numerous changes to check for within the main content area
		const mainContent = component.root.findByProps({ className: 'repository--main-content' })

		expectRecentModeControlBar(component)

		// MODE_RECENT will apply an extra class to the 'My Modules' title
		const expectedModulesTitleClasses =
			'repository--main-content--title repository--my-modules-title stretch-width'
		expect(mainContent.children[1].props.className).toBe(expectedModulesTitleClasses)
		expect(mainContent.children[1].children[0].children[0]).toBe('My Recent Modules')

		// no filters should be on the page since there are no modules or collections to filter
		expect(component.root.findAllByType(Search).length).toBe(0)

		// MODE_RECENT will remove the module sorting options
		const expectedModuleSortClasses = 'repository--main-content--sort repository--module-sort'
		expect(component.root.findAllByProps({ className: expectedModuleSortClasses }).length).toBe(0)
		// MODE_RECENT is the only one with a 'My Collections' area
		const expectedCollectionsTitleClasses =
			'repository--main-content--title repository--my-collections-title'
		expect(mainContent.children[3].props.className).toBe(expectedCollectionsTitleClasses)

		expectRecentAndAllModeNewOptions(component)

		// MODE_RECENT should show a placeholder area for modules or collections if either is empty
		const placeholderComponents = getPlaceholderComponents(component)
		expect(placeholderComponents.length).toBe(2)
		expect(placeholderComponents[0].findByType(Button).children[0].children[0]).toBe('New Module')
		expect(placeholderComponents[1].findByType(Button).children[0].children[0]).toBe(
			'New Collection'
		)

		// 'All Modules' button should not be rendered; myModules.length === moduleCount
		expect(component.root.findAllByType(ButtonLink).length).toBe(0)

		// Shouldn't be any modal dialogs open, either
		expect(component.root.findAllByType(ReactModal).length).toBe(0)
	}

	const expectModeAllOrModeCollectionRender = cookiePath => {
		dashboardProps.myModules = [...standardMyModules]
		const reusableComponent = <Dashboard {...dashboardProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		// the current sort methods for modules and collections are stored in a cookie
		//  this cookie should be set initially when the component first renders
		//  this cookie should also change when a sort method is chosen while 'document' is defined
		expectCookiePropForPath('moduleSortOrder', 'alphabetical', cookiePath)
		expectCookiePropForPath('collectionSortOrder', 'alphabetical', cookiePath)

		let moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(5)

		const expectedModuleSortClass = 'repository--main-content--sort repository--module-sort'
		const moduleSortParent = component.root.findByProps({ className: expectedModuleSortClass })
		const moduleSort = moduleSortParent.children[1]

		// default sort method should be 'alphabetical'
		expect(moduleSort.props.value).toBe('alphabetical')
		expect(moduleComponents[0].props.draftId).toBe('mockDraftId2')
		expect(moduleComponents[1].props.draftId).toBe('mockDraftId4')
		expect(moduleComponents[2].props.draftId).toBe('mockDraftId3')
		expect(moduleComponents[3].props.draftId).toBe('mockDraftId')
		expect(moduleComponents[4].props.draftId).toBe('mockDraftId5')

		// sort order should change when the drop-down changes
		act(() => {
			moduleSort.props.onChange({ target: { value: 'newest' } })
			component.update(reusableComponent)
		})

		expectCookiePropForPath('moduleSortOrder', 'newest', cookiePath)
		expectCookiePropForPath('collectionSortOrder', 'alphabetical', cookiePath)

		// changing the sort method should resort modules automatically
		moduleComponents = component.root.findAllByType(Module)
		expect(moduleSort.props.value).toBe('newest')
		expect(moduleComponents[0].props.draftId).toBe('mockDraftId5')
		expect(moduleComponents[1].props.draftId).toBe('mockDraftId4')
		expect(moduleComponents[2].props.draftId).toBe('mockDraftId3')
		expect(moduleComponents[3].props.draftId).toBe('mockDraftId2')
		expect(moduleComponents[4].props.draftId).toBe('mockDraftId')

		act(() => {
			moduleSort.props.onChange({ target: { value: 'last updated' } })
			component.update(reusableComponent)
		})

		expectCookiePropForPath('moduleSortOrder', 'last updated', cookiePath)
		expectCookiePropForPath('collectionSortOrder', 'alphabetical', cookiePath)

		moduleComponents = component.root.findAllByType(Module)
		expect(moduleSort.props.value).toBe('last updated')
		expect(moduleComponents[0].props.draftId).toBe('mockDraftId5')
		expect(moduleComponents[1].props.draftId).toBe('mockDraftId2')
		expect(moduleComponents[2].props.draftId).toBe('mockDraftId3')
		expect(moduleComponents[3].props.draftId).toBe('mockDraftId')
		expect(moduleComponents[4].props.draftId).toBe('mockDraftId4')

		// Shouldn't be any modal dialogs open, either
		expect(component.root.findAllByType(ReactModal).length).toBe(0)

		return component
	}

	const expectNormalModulesAreaClassesWithTitle = (mainContent, title) => {
		const expectedModulesTitleClasses =
			'repository--main-content--title repository--my-modules-title '
		expect(mainContent.children[1].props.className).toBe(expectedModulesTitleClasses)
		expect(mainContent.children[1].children[0].children[0]).toBe(title)
	}

	const expectNonRecentNewModuleOptions = component => {
		// MODE_COLLECTION has no 'New Collection' option under the 'New Module +' button
		const multiButton = component.root.findByType(MultiButton).children[0]
		// four buttons and the 'hr' under the 'new collection' button
		expect(multiButton.children.length).toBe(3)
		expect(multiButton.children[0].children[0].children[0]).toBe('New Module')
		expect(multiButton.children[1].children[0].children[0]).toBe('New Tutorial')
		expect(multiButton.children[2].children[0].children[0]).toBe('Upload...')
	}

	test('renders with default props', () => {
		const component = create(<Dashboard {...dashboardProps} />)

		// there shouldn't ever be a case where 'mode' is missing
		//  but the default case is equivalent to MODE_RECENT
		expectModeRecentRender(component)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with mode = MODE_RECENT', () => {
		dashboardProps.mode = MODE_RECENT
		const component = create(<Dashboard {...dashboardProps} />)

		expectModeRecentRender(component)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with mode = MODE_ALL', () => {
		dashboardProps.mode = MODE_ALL
		const component = create(<Dashboard {...dashboardProps} />)

		//numerous changes to check for within the main content area
		const mainContent = component.root.findByProps({ className: 'repository--main-content' })
		//some in the control bar
		expectAllModeControlBar(component)

		// MODE_ALL will not apply an extra class to the 'My Modules' title
		expectNormalModulesAreaClassesWithTitle(mainContent, 'My Modules')

		// MODE_ALL does not render the 'All Modules' button, but it does render a 'Deleted Modules' button
		const buttonLinkComponents = component.root.findAllByType(ButtonLink)
		expect(buttonLinkComponents.length).toBe(1)

		expect(buttonLinkComponents[0].type).toEqual(ButtonLink)
		expect(buttonLinkComponents[0].props.url).toBe('/dashboard/deleted')

		expectRecentAndAllModeNewOptions(component)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with mode = MODE_COLLECTION', () => {
		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		const component = create(<Dashboard {...dashboardProps} />)

		//numerous changes to check for within the main content area
		const mainContent = component.root.findByProps({ className: 'repository--main-content' })
		//some in the control bar
		const expectedControlBarClasses =
			'repository--main-content--control-bar is-not-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })
		// MODE_COLLECTION should have a lot in the control bar:
		//  'New Module +' button and various controls for the current collection
		expect(controlBar.children.length).toBe(5)
		// three buttons in the 'New Module +' multibutton and three for managing the current collection
		expect(controlBar.findAllByType(Button).length).toBe(6)
		expect(component.root.findAllByType(Search).length).toBe(1)

		// MODE_COLLECTION will not apply an extra class to the 'My Modules' title
		expectNormalModulesAreaClassesWithTitle(mainContent, "Modules in 'Mock Collection Title'")

		// MODE_COLLECTION does not render the 'All Modules' button
		expect(component.root.findAllByType(ButtonLink).length).toBe(0)

		expectNonRecentNewModuleOptions(component)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders in MODE_RECENT with fewer modules than moduleCount, no collections', () => {
		dashboardProps.mode = MODE_RECENT
		// putting these in non-sequential order to test MODE_RECENT sorting
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.moduleCount = 10
		// moduleSortOrder should always be 'last updated' for MODE_RECENT dashboards
		dashboardProps.moduleSortOrder = 'last updated'
		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		const moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(5)

		// MODE_RECENT should always sort according to updated_date in descending order
		expect(moduleComponents[0].props.draftId).toBe('mockDraftId5')
		expect(moduleComponents[1].props.draftId).toBe('mockDraftId2')
		expect(moduleComponents[2].props.draftId).toBe('mockDraftId3')
		expect(moduleComponents[3].props.draftId).toBe('mockDraftId')
		expect(moduleComponents[4].props.draftId).toBe('mockDraftId4')

		// MODE_RECENT should display the 'All Modules' button
		expect(component.root.findAllByType(ButtonLink).length).toBe(1)
		const allModulesButton = component.root.findByType(ButtonLink)
		// it should also have the same parent as the module components
		expect(allModulesButton.parent).toStrictEqual(moduleComponents[0].parent.parent)

		// MODE_RECENT without any collections should render a placeholder in the collections list
		const placeholderComponents = getPlaceholderComponents(component)
		expect(placeholderComponents.length).toBe(1)
		expect(placeholderComponents[0].findByType(Button).children[0].children[0]).toBe(
			'New Collection'
		)
		// and no collection filter
		expect(component.root.findAllByType(Search).length).toBe(0)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders in MODE_RECENT with collections and sorts them correctly', () => {
		dashboardProps.mode = MODE_RECENT
		// module sort order for MODE_RECENT is explicitly set to 'last updated' in express
		dashboardProps.moduleSortOrder = 'last updated'
		// putting these in non-sequential order to test MODE_RECENT sorting
		dashboardProps.myCollections = [...standardMyCollections]
		const reusableComponent = <Dashboard {...dashboardProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		// the current sort methods for modules and collections are stored in a cookie
		//  this cookie should be set initially when the component first renders
		//  this cookie should also change when a sort method is chosen while 'document' is defined
		expectCookiePropForPath('moduleSortOrder', 'last updated', '/dashboard')
		expectCookiePropForPath('collectionSortOrder', 'alphabetical', '/dashboard')

		let collectionComponents = component.root.findAllByType(Collection)
		expect(collectionComponents.length).toBe(5)

		const expectedCollectionSortClass = 'repository--main-content--sort repository--collection-sort'
		const collectionSortParent = component.root.findByProps({
			className: expectedCollectionSortClass
		})
		const collectionSort = collectionSortParent.children[1]

		// default sort method should be 'alphabetical'
		expect(collectionSort.props.value).toBe('alphabetical')
		expect(collectionComponents[0].props.id).toBe('mockCollectionId2')
		expect(collectionComponents[1].props.id).toBe('mockCollectionId4')
		expect(collectionComponents[2].props.id).toBe('mockCollectionId3')
		expect(collectionComponents[3].props.id).toBe('mockCollectionId')
		expect(collectionComponents[4].props.id).toBe('mockCollectionId5')

		// sort order should change when the drop-down changes
		act(() => {
			collectionSort.props.onChange({ target: { value: 'newest' } })
			component.update(reusableComponent)
		})

		expectCookiePropForPath('moduleSortOrder', 'last updated', '/dashboard')
		expectCookiePropForPath('collectionSortOrder', 'newest', '/dashboard')

		// changing the sort method should resort collections automatically
		collectionComponents = component.root.findAllByType(Collection)
		expect(collectionSort.props.value).toBe('newest')
		expect(collectionComponents[0].props.id).toBe('mockCollectionId5')
		expect(collectionComponents[1].props.id).toBe('mockCollectionId4')
		expect(collectionComponents[2].props.id).toBe('mockCollectionId3')
		expect(collectionComponents[3].props.id).toBe('mockCollectionId2')
		expect(collectionComponents[4].props.id).toBe('mockCollectionId')

		act(() => {
			collectionSort.props.onChange({ target: { value: 'last updated' } })
			component.update(reusableComponent)
		})

		expectCookiePropForPath('moduleSortOrder', 'last updated', '/dashboard')
		expectCookiePropForPath('collectionSortOrder', 'last updated', '/dashboard')

		collectionComponents = component.root.findAllByType(Collection)
		expect(collectionSort.props.value).toBe('last updated')
		expect(collectionComponents[0].props.id).toBe('mockCollectionId5')
		expect(collectionComponents[1].props.id).toBe('mockCollectionId2')
		expect(collectionComponents[2].props.id).toBe('mockCollectionId3')
		expect(collectionComponents[3].props.id).toBe('mockCollectionId')
		expect(collectionComponents[4].props.id).toBe('mockCollectionId4')
	})

	test('renders filtered collections in MODE_RECENT properly', () => {
		dashboardProps.mode = MODE_RECENT
		// putting these in non-sequential order to test MODE_RECENT sorting
		dashboardProps.myCollections = [...standardMyCollections]
		dashboardProps.filterCollections = jest.fn()
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		let collectionComponents = component.root.findAllByType(Collection)
		expect(collectionComponents.length).toBe(5)
		expect(collectionComponents[0].props.id).toBe('mockCollectionId2')
		expect(collectionComponents[1].props.id).toBe('mockCollectionId4')
		expect(collectionComponents[2].props.id).toBe('mockCollectionId3')
		expect(collectionComponents[3].props.id).toBe('mockCollectionId')
		expect(collectionComponents[4].props.id).toBe('mockCollectionId5')

		// changing the text of the search field should call props.filterCollections
		const filterChangePayload = { target: { value: 'string' } }
		component.root.findByType(Search).props.onChange(filterChangePayload)
		expect(dashboardProps.filterCollections).toHaveBeenCalledTimes(1)
		expect(dashboardProps.filterCollections).toHaveBeenCalledWith(filterChangePayload)

		// normally props.filteredCollections would be set in a reducer at the end of
		//  a chain of methods starting with props.filterCollections
		// here we can just set the prop manually and see what happens
		act(() => {
			dashboardProps.filteredCollections = [
				{
					id: 'mockCollectionId3',
					title: 'C Collection Title 3',
					createdAt: new Date(30000000000).toISOString(),
					updatedAt: new Date(300000000000).toISOString()
				},
				{
					id: 'mockCollectionId4',
					title: 'B Collection Title 4',
					createdAt: new Date(40000000000).toISOString(),
					updatedAt: new Date(100000000000).toISOString()
				}
			]
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		// should also still be sorting them alphabetically by default
		collectionComponents = component.root.findAllByType(Collection)
		expect(collectionComponents.length).toBe(2)
		expect(collectionComponents[0].props.id).toBe('mockCollectionId4')
		expect(collectionComponents[1].props.id).toBe('mockCollectionId3')
	})

	test('renders in MODE_ALL with modules and sorts them correctly', () => {
		dashboardProps.mode = MODE_ALL

		const component = expectModeAllOrModeCollectionRender('/dashboard/all')
		expectAllModeControlBar(component)

		component.unmount()
	})

	test('renders filtered modules in MODE_ALL properly', () => {
		dashboardProps.mode = MODE_ALL
		// putting these in non-sequential order to test MODE_ALL sorting
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.filterModules = jest.fn()
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		let moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(5)
		expect(moduleComponents[0].props.draftId).toBe('mockDraftId2')
		expect(moduleComponents[1].props.draftId).toBe('mockDraftId4')
		expect(moduleComponents[2].props.draftId).toBe('mockDraftId3')
		expect(moduleComponents[3].props.draftId).toBe('mockDraftId')
		expect(moduleComponents[4].props.draftId).toBe('mockDraftId5')

		// changing the text of the search field should call props.filterModules
		const filterChangePayload = { target: { value: 'string' } }
		component.root.findByType(Search).props.onChange(filterChangePayload)
		expect(dashboardProps.filterModules).toHaveBeenCalledTimes(1)
		expect(dashboardProps.filterModules).toHaveBeenCalledWith(filterChangePayload)

		// normally props.filteredModules would be set in a reducer at the end of
		//  a chain of methods starting with props.filterModules
		// here we can just set the prop manually and see what happens
		act(() => {
			dashboardProps.filteredModules = [
				{
					draftId: 'mockDraftId3',
					title: 'C Module Title 3',
					createdAt: new Date(30000000000).toISOString(),
					updatedAt: new Date(300000000000).toISOString()
				},
				{
					draftId: 'mockDraftId4',
					title: 'B Module Title 4',
					createdAt: new Date(40000000000).toISOString(),
					updatedAt: new Date(100000000000).toISOString()
				}
			]
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		// should also still be sorting them alphabetically by default
		moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(2)
		expect(moduleComponents[0].props.draftId).toBe('mockDraftId4')
		expect(moduleComponents[1].props.draftId).toBe('mockDraftId3')

		component.unmount()
	})

	// MODE_COLLECTION and MODE_ALL handle module rendering/sorting the same way
	//  the only difference is the path attached to cookies
	test('renders in MODE_COLLECTION with modules and sorts them correctly', () => {
		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		const component = expectModeAllOrModeCollectionRender(
			'/collections/mock-collection-title-mockCollectionShortId'
		)
		expectCollectionModeControlBar(component)

		// MODE_COLLECTION sort order cookies will use shortUUID to generate cookie paths
		//  three calls - one on the initial render, then one for each of the two sort order changes
		expect(mockShortFromUUID).toHaveBeenCalledTimes(3)
		mockShortFromUUID.mock.calls.forEach(call => expect(call[0]).toBe('mockCollectionId'))

		component.unmount()
	})

	// This is less repetitive but maybe should be individual tests per mode
	test('renders with multiSelectMode=true, no selected modules, in all modes', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.multiSelectMode = true

		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		// module list should be the same regardless of mode
		const moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(5)
		moduleComponents.forEach(moduleComponent => {
			expect(moduleComponent.props.isMultiSelectMode).toBe(true)
		})

		// no mode - shouldn't ever happen, but should be the same as 'recent' mode
		expectRecentModeControlBar(component)

		dashboardProps.mode = MODE_RECENT
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})
		expectRecentModeControlBar(component)

		dashboardProps.mode = MODE_ALL
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})
		expectAllModeControlBar(component)

		dashboardProps.mode = MODE_DELETED
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})
		expectDeletedModeControlBar(component)

		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})
		expectCollectionModeControlBar(component)

		component.unmount()
	})

	test('renders with multiSelectMode=true, some selected modules, in all modes', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.multiSelectMode = true
		dashboardProps.selectedModules = [standardMyModules[0].draftId, standardMyModules[1].draftId]
		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		// no mode - shouldn't ever happen, but should be the same as 'recent' mode
		expectMultiSelectControlBar(component)

		dashboardProps.mode = MODE_RECENT
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})
		expectMultiSelectControlBar(component)

		dashboardProps.mode = MODE_ALL
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})
		expectMultiSelectControlBar(component)

		dashboardProps.mode = MODE_DELETED
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})
		expectMultiSelectControlBar(component, false, true)

		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})
		expectMultiSelectControlBar(component, true)

		component.unmount()
	})

	test('renders selected module count properly when one or multiple modules are selected', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.multiSelectMode = true
		dashboardProps.selectedModules = [standardMyModules[0], standardMyModules[1]]
		dashboardProps.numFullSelected = 2

		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		const expectedControlBarClasses = 'repository--main-content--control-bar is-multi-select-mode'
		let controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		expect(controlBar.children[0].children[0]).toEqual(
			'2 Modules Selected (2 Full, 0 Partial, 0 Minimal):'
		)

		dashboardProps.selectedModules = [standardMyModules[0]]
		dashboardProps.numFullSelected = 1

		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		controlBar = component.root.findByProps({ className: expectedControlBarClasses })
		expect(controlBar.children[0].children[0]).toEqual(
			'1 Module Selected (1 Full, 0 Partial, 0 Minimal):'
		)

		component.unmount()
	})

	test('updates selected module count properly when new module is selected', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.multiSelectMode = true
		dashboardProps.selectedModules = [standardMyModules[0]]
		dashboardProps.numFullSelected = 1
		dashboardProps.selectModules = jest.fn()

		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		const expectedControlBarClasses = 'repository--main-content--control-bar is-multi-select-mode'
		let controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		// Begin with one full access level module selected
		expect(controlBar.children[0].children[0]).toEqual(
			'1 Module Selected (1 Full, 0 Partial, 0 Minimal):'
		)

		const moduleComponents = component.root.findAllByType(Module)

		// Select a partial access level module
		act(() => {
			const mockClickEvent = {
				shiftKey: false
			}
			moduleComponents[1].props.onSelect(mockClickEvent)
		})

		dashboardProps.selectedModules = [standardMyModules[0], standardMyModules[3]]

		controlBar = component.root.findByProps({ className: expectedControlBarClasses })
		expect(controlBar.children[0].children[0]).toEqual(
			'2 Modules Selected (1 Full, 1 Partial, 0 Minimal):'
		)

		// Select a minimal access level module
		act(() => {
			const mockClickEvent = {
				shiftKey: false
			}
			moduleComponents[4].props.onSelect(mockClickEvent)
		})

		dashboardProps.selectedModules = [standardMyModules[0], standardMyModules[3]]

		controlBar = component.root.findByProps({ className: expectedControlBarClasses })
		expect(controlBar.children[0].children[0]).toEqual(
			'3 Modules Selected (1 Full, 1 Partial, 1 Minimal):'
		)

		component.unmount()
	})

	test('updates selected module count properly when module is deselected', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.multiSelectMode = true
		dashboardProps.selectedModules = [
			standardMyModules[0],
			standardMyModules[3],
			standardMyModules[4]
		]
		dashboardProps.numFullSelected = 1
		dashboardProps.numPartialSelected = 1
		dashboardProps.numMinimalSelected = 1
		dashboardProps.deselectModules = jest.fn()

		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		const expectedControlBarClasses = 'repository--main-content--control-bar is-multi-select-mode'
		let controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		// Begin with one of each access level selected
		expect(controlBar.children[0].children[0]).toEqual(
			'3 Modules Selected (1 Full, 1 Partial, 1 Minimal):'
		)

		const moduleComponents = component.root.findAllByType(Module)

		// Deselect a partial access level module
		act(() => {
			const mockClickEvent = {
				shiftKey: false
			}
			moduleComponents[1].props.onSelect(mockClickEvent)
		})

		dashboardProps.selectedModules = [standardMyModules[0], standardMyModules[4]]

		controlBar = component.root.findByProps({ className: expectedControlBarClasses })
		expect(controlBar.children[0].children[0]).toEqual(
			'2 Modules Selected (1 Full, 0 Partial, 1 Minimal):'
		)

		// Deselect a minimal access level module
		act(() => {
			const mockClickEvent = {
				shiftKey: false
			}
			moduleComponents[4].props.onSelect(mockClickEvent)
		})

		dashboardProps.selectedModules = [standardMyModules[0]]

		controlBar = component.root.findByProps({ className: expectedControlBarClasses })
		expect(controlBar.children[0].children[0]).toEqual(
			'1 Module Selected (1 Full, 0 Partial, 0 Minimal):'
		)

		component.unmount()
	})

	// Module filter only appears in 'all' and 'collection' modes - reusable function so we can check both
	const expectModuleFiltrationWorks = () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.filterModules = jest.fn()
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		let moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(5)
		expect(moduleComponents[0].props.draftId).toBe('mockDraftId2')
		expect(moduleComponents[1].props.draftId).toBe('mockDraftId4')
		expect(moduleComponents[2].props.draftId).toBe('mockDraftId3')
		expect(moduleComponents[3].props.draftId).toBe('mockDraftId')
		expect(moduleComponents[4].props.draftId).toBe('mockDraftId5')

		// changing the text of the search field should call props.filterModules
		const filterChangePayload = { target: { value: 'string' } }
		component.root.findByType(Search).props.onChange(filterChangePayload)
		expect(dashboardProps.filterModules).toHaveBeenCalledTimes(1)
		expect(dashboardProps.filterModules).toHaveBeenCalledWith(filterChangePayload)

		// normally props.filteredModules would be set in a reducer at the end of
		//  a chain of methods starting with props.filterModules
		// here we can just set the prop manually and see what happens
		act(() => {
			dashboardProps.filteredModules = [
				{
					draftId: 'mockDraftId3',
					title: 'C Module Title 3',
					createdAt: new Date(30000000000).toISOString(),
					updatedAt: new Date(300000000000).toISOString()
				},
				{
					draftId: 'mockDraftId4',
					title: 'B Module Title 4',
					createdAt: new Date(40000000000).toISOString(),
					updatedAt: new Date(100000000000).toISOString()
				}
			]
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		// should also still be sorting them alphabetically by default
		moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(2)
		expect(moduleComponents[0].props.draftId).toBe('mockDraftId4')
		expect(moduleComponents[1].props.draftId).toBe('mockDraftId3')

		component.unmount()
	}
	test('renders filtered modules properly - "all" mode', () => {
		dashboardProps.mode = MODE_ALL
		expectModuleFiltrationWorks()
	})
	test('renders filtered modules properly - "collection" mode', () => {
		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId1',
			title: 'Mock Collection'
		}
		expectModuleFiltrationWorks()
	})

	test('"New Collection", "New Module" and "Upload..." buttons call functions appropriately', async () => {
		const newModuleMockPayload = [
			{
				draftId: 'mockId1',
				createdAt: 1
			},
			{
				draftId: 'mockId2',
				createdAt: 2
			}
		]
		const newModule = {
			payload: {
				value: {
					modules: newModuleMockPayload,
					allCount: newModuleMockPayload.length
				}
			}
		}

		dashboardProps.mode = MODE_RECENT
		dashboardProps.createNewCollection = jest.fn()
		dashboardProps.createNewModule = jest.fn()
		dashboardProps.importModuleFile = jest.fn()
		const component = create(<Dashboard {...dashboardProps} />)
		// four buttons under the 'New Module +' MultiButton component
		const multiButton = component.root.findByType(MultiButton).children[0]

		// 'New Collection' button should call createNewCollection with no arguments
		expect(multiButton.children[0].children[0].children[0]).toBe('New Collection')
		await act(async () => {
			multiButton.children[0].props.onClick()
		})
		expect(dashboardProps.createNewCollection).toHaveBeenCalledTimes(1)
		expect(dashboardProps.createNewCollection).toHaveBeenCalledWith()
		dashboardProps.createNewCollection.mockReset()

		// 'New Module' buttons will also pass extra arguments depending on dashboard mode
		//  in the case of MODE_RECENT, this extra argument will just be an object with 'mode'
		// 'New Module' button should call createNewModule with false and extra args
		expect(multiButton.children[2].children[0].children[0]).toBe('New Module')
		dashboardProps.createNewModule.mockResolvedValue(newModule)
		await act(async () => {
			multiButton.children[2].props.onClick()
		})
		expect(dashboardProps.createNewModule).toHaveBeenCalledTimes(1)
		expect(dashboardProps.createNewModule).toHaveBeenCalledWith(false, { mode: MODE_RECENT })
		dashboardProps.createNewModule.mockReset()

		// 'New Tutorial' button should call createNewModule with true and extra args
		expect(multiButton.children[3].children[0].children[0]).toBe('New Tutorial')
		dashboardProps.createNewModule.mockResolvedValue(newModule)
		await act(async () => {
			multiButton.children[3].props.onClick()
		})
		expect(dashboardProps.createNewModule).toHaveBeenCalledTimes(1)
		expect(dashboardProps.createNewModule).toHaveBeenCalledWith(true, { mode: MODE_RECENT })
		dashboardProps.createNewModule.mockReset()

		// 'Upload...' button should call importModuleFile with no arguments
		expect(multiButton.children[4].children[0].children[0]).toBe('Upload...')
		await act(async () => {
			multiButton.children[4].props.onClick()
		})
		expect(dashboardProps.importModuleFile).toHaveBeenCalledTimes(1)
		dashboardProps.importModuleFile.mockReset()

		// two buttons in placeholders - one for collections and one for modules
		const placeholderComponents = getPlaceholderComponents(component)
		expect(placeholderComponents.length).toBe(2)
		expect(placeholderComponents[0].findByType(Button).children[0].children[0]).toBe('New Module')
		expect(placeholderComponents[1].findByType(Button).children[0].children[0]).toBe(
			'New Collection'
		)

		// 'New Module' button should call createNewModule with false and extra args
		dashboardProps.createNewModule.mockResolvedValue(newModule)
		await act(async () => {
			placeholderComponents[0].findByType(Button).props.onClick()
		})
		expect(dashboardProps.createNewModule).toHaveBeenCalledTimes(1)
		expect(dashboardProps.createNewModule).toHaveBeenCalledWith(false, { mode: MODE_RECENT })
		dashboardProps.createNewModule.mockReset()

		// 'New Collection' button should call createNewCollection with no arguments
		await act(async () => {
			placeholderComponents[1].findByType(Button).props.onClick()
		})
		expect(dashboardProps.createNewCollection).toHaveBeenCalledTimes(1)
		dashboardProps.createNewCollection.mockReset()
	})

	test('"Add All To Collection" button calls functions appropriately', () => {
		const mockSelectedModules = [standardMyModules[0], standardMyModules[1]]

		dashboardProps.showCollectionBulkAddModulesDialog = jest.fn(() => Promise.resolve())

		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.multiSelectMode = true
		dashboardProps.selectedModules = mockSelectedModules

		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		const expectedControlBarClasses = 'repository--main-content--control-bar is-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		const mockClickEvent = {
			preventDefault: jest.fn()
		}

		// Delete All button will be second option in 'recent' and 'all' modes
		const addAllButton = controlBar.findAllByType(Button)[0]
		expect(addAllButton.children[0].children[0]).toBe('Add All To Collection')

		act(() => {
			addAllButton.props.onClick(mockClickEvent)
		})
		expect(dashboardProps.showCollectionBulkAddModulesDialog).toHaveBeenCalledTimes(1)
		expect(dashboardProps.showCollectionBulkAddModulesDialog).toHaveBeenCalledWith(
			mockSelectedModules
		)

		component.unmount()
	})

	// This will only be available in MODE_COLLECTION
	test('"Remove All From Collection" button calls functions appropriately', async () => {
		const mockSelectedModules = [standardMyModules[1], standardMyModules[2]]

		dashboardProps.bulkRemoveModulesFromCollection = jest.fn(() => Promise.resolve())

		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.multiSelectMode = true
		dashboardProps.selectedModules = mockSelectedModules
		dashboardProps.deselectModules = jest.fn()

		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		const expectedControlBarClasses = 'repository--main-content--control-bar is-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		const mockClickEvent = {
			preventDefault: jest.fn()
		}

		// Delete All button will be second option in 'recent' and 'all' modes
		const removeAllButton = controlBar.findAllByType(Button)[0]
		expect(removeAllButton.children[0].children[0]).toBe('Remove All From Collection')

		window.prompt = jest.fn()
		window.prompt.mockReturnValueOnce('NOT REMOVE')
		await act(async () => {
			removeAllButton.props.onClick(mockClickEvent)
		})
		expect(dashboardProps.bulkRemoveModulesFromCollection).not.toHaveBeenCalled()

		window.prompt.mockReturnValueOnce('REMOVE')
		await act(async () => {
			removeAllButton.props.onClick(mockClickEvent)
		})
		expect(dashboardProps.bulkRemoveModulesFromCollection).toHaveBeenCalledTimes(1)
		expect(dashboardProps.bulkRemoveModulesFromCollection).toHaveBeenCalledWith(
			mockSelectedModules.map(draft => draft.draftId),
			'mockCollectionId'
		)

		component.unmount()
	})

	test('"Delete All" button calls functions appropriately', async () => {
		dashboardProps.bulkDeleteModules = jest.fn(() => Promise.resolve())
		dashboardProps.selectedModules = [standardMyModules[0], standardMyModules[1]]
		dashboardProps.multiSelectMode = true
		dashboardProps.deselectModules = jest.fn()
		const reusableComponent = <Dashboard {...dashboardProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		const mockClickEvent = {
			preventDefault: jest.fn()
		}

		// Delete All button will be second option in 'recent' and 'all' modes
		const deleteAllButton = component.root.findAllByType(Button)[1]
		expect(deleteAllButton.children[0].children[0]).toBe('Delete All')

		window.prompt = jest.fn()
		window.prompt.mockReturnValueOnce('NOT DELETE')
		await act(async () => {
			deleteAllButton.props.onClick(mockClickEvent)
		})
		expect(dashboardProps.bulkDeleteModules).not.toHaveBeenCalled()

		window.prompt.mockReturnValueOnce('DELETE')
		await act(async () => {
			deleteAllButton.props.onClick(mockClickEvent)
		})
		expect(dashboardProps.bulkDeleteModules).toHaveBeenCalledTimes(1)

		component.unmount()
	})

	test('"Deselect All" button calls functions appropriately', () => {
		dashboardProps.deselectModules = jest.fn()
		dashboardProps.selectedModules = ['mockId', 'mockId2']
		dashboardProps.multiSelectMode = true
		const reusableComponent = <Dashboard {...dashboardProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		// cancel button will be third option in 'recent' and 'all' modes
		const deselectAllButton = component.root.findAllByType(Button)[2]
		expect(deselectAllButton.children[0].children[0]).toBe('×')

		act(() => {
			deselectAllButton.props.onClick()
		})
		expect(dashboardProps.deselectModules).toHaveBeenCalledWith(['mockId', 'mockId2'])

		component.unmount()
	})

	test('pressing Esc when multiSelectMode=true calls functions appropriately', () => {
		dashboardProps.deselectModules = jest.fn()
		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		// eslint-disable-next-line no-undef
		document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }))
		expect(dashboardProps.deselectModules).toHaveBeenCalledTimes(0)

		dashboardProps.multiSelectMode = true
		act(() => {
			component.update(<Dashboard {...dashboardProps} />)
		})

		// eslint-disable-next-line no-undef
		document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }))
		expect(dashboardProps.deselectModules).toHaveBeenCalledTimes(1)

		component.unmount()
	})

	test('selecting module calls functions appropriately', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.selectModules = jest.fn()
		dashboardProps.deselectModules = jest.fn()

		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		const moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents[0].props.isSelected).toBe(false)

		act(() => {
			const mockClickEvent = {
				shiftKey: false
			}
			moduleComponents[0].props.onSelect(mockClickEvent)
		})
		expect(dashboardProps.selectModules).toHaveBeenCalledTimes(1)
		expect(dashboardProps.selectModules).toHaveBeenCalledWith([standardMyModules[1]])

		dashboardProps.selectedModules = [standardMyModules[1]]
		dashboardProps.multiSelectMode = true

		act(() => {
			component.update(<Dashboard {...dashboardProps} />)
		})
		expect(moduleComponents[0].props.isSelected).toBe(true)

		act(() => {
			const mockClickEvent = {
				shiftKey: false
			}
			moduleComponents[0].props.onSelect(mockClickEvent)
		})
		expect(dashboardProps.deselectModules).toHaveBeenCalledTimes(1)
		expect(dashboardProps.deselectModules).toHaveBeenCalledWith([standardMyModules[1]])

		component.unmount()
	})

	test("shift-clicking a module's parent container with no other modules selected or preselected does not select any modules", () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.selectModules = jest.fn()
		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		// Module components are wrapped with a parent div that catches click events to handle shift-click selection
		const moduleComponentParents = component.root.findAllByProps({
			className: 'repository--item-list--collection--module-container'
		})

		act(() => {
			const mockClickEvent = {
				shiftKey: true
			}
			moduleComponentParents[2].props.onClick(mockClickEvent)
		})
		expect(dashboardProps.selectModules).toHaveBeenCalledTimes(0)
		dashboardProps.selectModules.mockReset()

		component.unmount()
	})

	// calling a module's 'onSelect' is different from shift-clicking its parent
	test('shift-clicking a module with no other modules selected or preselected selects that module', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.selectModules = jest.fn()
		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		// Module components are wrapped with a parent div that catches click events to handle shift-click selection
		const moduleComponents = component.root.findAllByType(Module)

		act(() => {
			const mockClickEvent = {
				shiftKey: true
			}
			moduleComponents[2].props.onSelect(mockClickEvent)
		})
		expect(dashboardProps.selectModules).toHaveBeenCalledTimes(1)
		expect(dashboardProps.selectModules).toHaveBeenCalledWith([standardMyModules[2]])
		dashboardProps.selectModules.mockReset()

		component.unmount()
	})

	test('shift-clicking a module after preselecting another module selects both modules plus any in between', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.selectModules = jest.fn()
		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		// Module components are wrapped with a parent div that catches click events to handle shift-click selection
		const moduleComponentParents = component.root.findAllByProps({
			className: 'repository--item-list--collection--module-container'
		})

		act(() => {
			const mockClickEvent = {
				shiftKey: true
			}
			moduleComponentParents[2].props.onClick(mockClickEvent)
		})
		expect(dashboardProps.selectModules).toHaveBeenCalledTimes(0)
		dashboardProps.selectModules.mockReset()

		const moduleComponents = component.root.findAllByType(Module)

		// make sure that clicking earlier in the module list works properly
		act(() => {
			const mockClickEvent = {
				shiftKey: true
			}
			moduleComponents[1].props.onSelect(mockClickEvent)
		})
		expect(dashboardProps.selectModules).toHaveBeenCalledTimes(1)
		// this seems a bit magical without knowing the sort order based on last updated times - maybe replace with some variables and math later
		expect(dashboardProps.selectModules).toHaveBeenCalledWith([
			standardMyModules[3],
			standardMyModules[2]
		])
		dashboardProps.selectModules.mockReset()

		component.unmount()
	})

	test('shift-clicking a module when modules are already selected properly selects additonal modules', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.selectModules = jest.fn()
		dashboardProps.selectedModules = [standardMyModules[3]]
		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		const moduleComponents = component.root.findAllByType(Module)

		act(() => {
			const mockClickEvent = {
				shiftKey: true
			}
			moduleComponents[1].props.onSelect(mockClickEvent)
		})
		expect(dashboardProps.selectModules).toHaveBeenCalledTimes(1)
		// mockDraftId4 is already in 'selectedModules', so it will not be passed to 'selectModules'
		expect(dashboardProps.selectModules).toHaveBeenCalledWith([standardMyModules[1]])
		dashboardProps.selectModules.mockReset()
	})

	test('renders "Module Options" dialog and adjusts callbacks for each mode', () => {
		dashboardProps.showModuleManageCollections = jest.fn()
		dashboardProps.showModulePermissions = jest.fn()
		dashboardProps.deleteModule = jest.fn()
		dashboardProps.startLoadingAnimation = jest.fn()
		dashboardProps.stopLoadingAnimation = jest.fn()
		dashboardProps.dialog = 'module-more'
		dashboardProps.mode = MODE_RECENT
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expectDialogToBeRendered(component, ModuleOptionsDialog, 'Module Options')
		const dialogComponent = component.root.findByType(ModuleOptionsDialog)

		dialogComponent.props.showModuleManageCollections()
		expectMethodToBeCalledOnceWith(dashboardProps.showModuleManageCollections)
		dialogComponent.props.showModulePermissions()
		expectMethodToBeCalledOnceWith(dashboardProps.showModulePermissions)
		// draftId for the menu's module would normally be passed here
		dialogComponent.props.deleteModule('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.deleteModule, [
			'mockDraftId',
			{ mode: MODE_RECENT }
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_ALL
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		dialogComponent.props.showModuleManageCollections()
		expectMethodToBeCalledOnceWith(dashboardProps.showModuleManageCollections)
		dialogComponent.props.showModulePermissions()
		expectMethodToBeCalledOnceWith(dashboardProps.showModulePermissions)
		// draftId for the menu's module would normally be passed here
		dialogComponent.props.deleteModule('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.deleteModule, ['mockDraftId', { mode: MODE_ALL }])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		dialogComponent.props.showModuleManageCollections()
		expectMethodToBeCalledOnceWith(dashboardProps.showModuleManageCollections)
		dialogComponent.props.showModulePermissions()
		expectMethodToBeCalledOnceWith(dashboardProps.showModulePermissions)
		// draftId for the menu's module would normally be passed here
		dialogComponent.props.deleteModule('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.deleteModule, [
			'mockDraftId',
			{ collectionId: 'mockCollectionId', mode: MODE_COLLECTION }
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		const notLoadingClass = 'repository--item-list--collection--item--multi-wrapper '
		const isLoadingClass = 'repository--item-list--collection--item--multi-wrapper fade'

		// make sure loading states are set/unset properly - maybe should be its own test?
		act(() => {
			dialogComponent.props.startLoadingAnimation()
		})
		expect(component.root.findAllByProps({ className: notLoadingClass }).length).toBe(0)
		expect(component.root.findAllByProps({ className: isLoadingClass }).length).toBe(1)

		act(() => {
			dialogComponent.props.stopLoadingAnimation()
		})
		expect(component.root.findAllByProps({ className: notLoadingClass }).length).toBe(1)
		expect(component.root.findAllByProps({ className: isLoadingClass }).length).toBe(0)
	})

	test('renders "Module Access" dialog and adjusts callbacks for each mode', () => {
		dashboardProps.dialog = 'module-permissions'
		dashboardProps.loadUsersForModule = jest.fn()
		dashboardProps.addUserToModule = jest.fn()
		dashboardProps.draftPermissions = jest.fn()
		dashboardProps.deleteModulePermissions = jest.fn()
		dashboardProps.mode = MODE_RECENT
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expectDialogToBeRendered(component, ModulePermissionsDialog, 'Module Access')
		const dialogComponent = component.root.findByType(ModulePermissionsDialog)

		dialogComponent.props.loadUsersForModule('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadUsersForModule, ['mockDraftId'])
		dialogComponent.props.addUserToModule('mockDraftId', 99)
		expectMethodToBeCalledOnceWith(dashboardProps.addUserToModule, ['mockDraftId', 99])
		dialogComponent.props.deleteModulePermissions('mockDraftId', 99)
		expectMethodToBeCalledOnceWith(dashboardProps.deleteModulePermissions, [
			'mockDraftId',
			99,
			{ mode: MODE_RECENT }
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_ALL
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})
		dialogComponent.props.loadUsersForModule('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadUsersForModule, ['mockDraftId'])
		dialogComponent.props.addUserToModule('mockDraftId', 99)
		expectMethodToBeCalledOnceWith(dashboardProps.addUserToModule, ['mockDraftId', 99])
		dialogComponent.props.deleteModulePermissions('mockDraftId', 99)
		expectMethodToBeCalledOnceWith(dashboardProps.deleteModulePermissions, [
			'mockDraftId',
			99,
			{ mode: MODE_ALL }
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})
		dialogComponent.props.loadUsersForModule('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadUsersForModule, ['mockDraftId'])
		dialogComponent.props.addUserToModule('mockDraftId', 99)
		expectMethodToBeCalledOnceWith(dashboardProps.addUserToModule, ['mockDraftId', 99])
		dialogComponent.props.deleteModulePermissions('mockDraftId', 99)
		expectMethodToBeCalledOnceWith(dashboardProps.deleteModulePermissions, [
			'mockDraftId',
			99,
			{ collectionId: 'mockCollectionId', mode: MODE_COLLECTION }
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		component.unmount()
	})

	test('renders "Version History" dialog and runs callbacks properly', () => {
		dashboardProps.dialog = 'module-version-history'
		dashboardProps.selectedModule.title = 'Mock Module Title'
		dashboardProps.restoreVersion = jest.fn()

		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expectDialogToBeRendered(component, VersionHistoryDialog, 'Module Version History')
		const dialogComponent = component.root.findByType(VersionHistoryDialog)
		expect(dialogComponent.props.title).toBe('Mock Module Title - Version History')

		dialogComponent.props.restoreVersion()
		expect(dashboardProps.restoreVersion).toHaveBeenCalledTimes(1)

		dialogComponent.props.onClose()
		expect(dashboardProps.closeModal).toHaveBeenCalledTimes(1)

		component.unmount()
	})

	test('renders "Assessment Scores" dialog and runs callbacks properly', () => {
		dashboardProps.dialog = 'module-assessment-score-data'
		dashboardProps.selectedModule.title = 'Mock Module Title'

		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expectDialogToBeRendered(component, AssessmentScoreDataDialog, 'Module Assessment Score Data')
		const dialogComponent = component.root.findByType(AssessmentScoreDataDialog)
		expect(dialogComponent.props.title).toBe('Mock Module Title - Assessment Scores')

		dialogComponent.props.onClose()
		expect(dashboardProps.closeModal).toHaveBeenCalledTimes(1)

		component.unmount()
	})

	test('renders "Module Collections" dialog and adjusts callbacks for each mode', async () => {
		dashboardProps.dialog = 'module-manage-collections'
		dashboardProps.loadModuleCollections = jest.fn()
		dashboardProps.loadCollectionModules = jest.fn()
		dashboardProps.moduleAddToCollection = jest.fn()
		dashboardProps.moduleRemoveFromCollection = jest.fn()
		dashboardProps.mode = MODE_RECENT
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expectDialogToBeRendered(component, ModuleManageCollectionsDialog, 'Module Collections')
		const dialogComponent = component.root.findByType(ModuleManageCollectionsDialog)

		dialogComponent.props.loadModuleCollections('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadModuleCollections, ['mockDraftId'])
		dialogComponent.props.moduleAddToCollection('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.moduleAddToCollection, [
			'mockDraftId',
			'mockCollectionId'
		])
		dialogComponent.props.moduleRemoveFromCollection('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.moduleRemoveFromCollection, [
			'mockDraftId',
			'mockCollectionId'
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_ALL
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		dialogComponent.props.loadModuleCollections('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadModuleCollections, ['mockDraftId'])
		dialogComponent.props.moduleAddToCollection('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.moduleAddToCollection, [
			'mockDraftId',
			'mockCollectionId'
		])
		dialogComponent.props.moduleRemoveFromCollection('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.moduleRemoveFromCollection, [
			'mockDraftId',
			'mockCollectionId'
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		dashboardProps.moduleAddToCollection.mockResolvedValue(null)
		dashboardProps.moduleRemoveFromCollection.mockResolvedValue(null)
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		dialogComponent.props.loadModuleCollections('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadModuleCollections, ['mockDraftId'])
		// in MODE_COLLECTION, this becomes a promise chain
		await dialogComponent.props.moduleAddToCollection('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.moduleAddToCollection, [
			'mockDraftId',
			'mockCollectionId'
		])
		expectMethodToBeCalledOnceWith(dashboardProps.loadCollectionModules, [
			'mockCollectionId',
			{ collectionId: 'mockCollectionId', mode: MODE_COLLECTION }
		])
		// in MODE_COLLECTION, this becomes a promise chain
		await dialogComponent.props.moduleRemoveFromCollection('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.moduleRemoveFromCollection, [
			'mockDraftId',
			'mockCollectionId'
		])
		expectMethodToBeCalledOnceWith(dashboardProps.loadCollectionModules, [
			'mockCollectionId',
			{ collectionId: 'mockCollectionId', mode: MODE_COLLECTION }
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)
	})

	test('renders collection module management dialog and adjusts callbacks for each mode', () => {
		dashboardProps.dialog = 'collection-manage-modules'
		dashboardProps.loadCollectionModules = jest.fn()
		dashboardProps.collectionAddModule = jest.fn()
		dashboardProps.collectionRemoveModule = jest.fn()
		dashboardProps.mode = MODE_RECENT
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expectDialogToBeRendered(component, CollectionManageModulesDialog, '')
		const dialogComponent = component.root.findByType(CollectionManageModulesDialog)

		dialogComponent.props.loadCollectionModules('mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadCollectionModules, ['mockCollectionId'])
		dialogComponent.props.collectionAddModule('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.collectionAddModule, [
			'mockDraftId',
			'mockCollectionId'
		])
		dialogComponent.props.collectionRemoveModule('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.collectionRemoveModule, [
			'mockDraftId',
			'mockCollectionId'
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_ALL
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		dialogComponent.props.loadCollectionModules('mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadCollectionModules, ['mockCollectionId'])
		dialogComponent.props.collectionAddModule('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.collectionAddModule, [
			'mockDraftId',
			'mockCollectionId'
		])
		dialogComponent.props.collectionRemoveModule('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.collectionRemoveModule, [
			'mockDraftId',
			'mockCollectionId'
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_ALL
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		dialogComponent.props.loadCollectionModules('mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadCollectionModules, ['mockCollectionId'])
		dialogComponent.props.collectionAddModule('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.collectionAddModule, [
			'mockDraftId',
			'mockCollectionId',
			{ collectionId: 'mockCollectionId', mode: MODE_COLLECTION }
		])
		dialogComponent.props.collectionRemoveModule('mockDraftId', 'mockCollectionId')
		expectMethodToBeCalledOnceWith(dashboardProps.collectionRemoveModule, [
			'mockDraftId',
			'mockCollectionId',
			{ collectionId: 'mockCollectionId', mode: MODE_COLLECTION }
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_ALL
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})
	})

	test('renders collection multi-module add dialog and runs callbacks properly', () => {
		dashboardProps.dialog = 'collection-bulk-add-modules'

		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expectDialogToBeRendered(component, CollectionBulkAddModulesDialog, '')
		const dialogComponent = component.root.findByType(CollectionBulkAddModulesDialog)
		expect(dialogComponent.props.title).toBe('')

		dialogComponent.props.onClose()
		expect(dashboardProps.closeModal).toHaveBeenCalledTimes(1)

		component.unmount()
	})

	test('renders "Rename Collection" dialog and adjusts callbacks for each mode', () => {
		dashboardProps.dialog = 'collection-rename'
		dashboardProps.renameCollection = jest.fn()
		dashboardProps.mode = MODE_RECENT
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expectDialogToBeRendered(component, CollectionRenameDialog, 'Rename Collection')
		const dialogComponent = component.root.findByType(CollectionRenameDialog)

		dialogComponent.props.onAccept('mockCollectionId', 'New Collection Title')
		expectMethodToBeCalledOnceWith(dashboardProps.renameCollection, [
			'mockCollectionId',
			'New Collection Title'
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		// dialog shouldn't be available in MODE_ALL, but just to be sure it acts the same
		dashboardProps.mode = MODE_ALL
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		dialogComponent.props.onAccept('mockCollectionId', 'New Collection Title')
		expectMethodToBeCalledOnceWith(dashboardProps.renameCollection, [
			'mockCollectionId',
			'New Collection Title'
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		act(() => {
			component.update(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		dialogComponent.props.onAccept('mockCollectionId', 'New Collection Title')
		expectMethodToBeCalledOnceWith(dashboardProps.renameCollection, [
			'mockCollectionId',
			'New Collection Title',
			{ collectionId: 'mockCollectionId', mode: MODE_COLLECTION }
		])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)
	})

	test('renders no dialogs if props.dialog value is unsupported', () => {
		dashboardProps.dialog = 'some-unsupported-value'
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expect(component.root.findAllByType(ReactModal).length).toBe(0)

		component.unmount()
	})

	test('MODE_COLLECTION collection management buttons work correctly', async () => {
		dashboardProps.mode = MODE_COLLECTION
		dashboardProps.showCollectionManageModules = jest.fn()
		dashboardProps.showCollectionRename = jest.fn()
		dashboardProps.deleteCollection = jest.fn()
		dashboardProps.deleteCollection.mockResolvedValueOnce(null)
		dashboardProps.collection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		const expectedControlBarClasses =
			'repository--main-content--control-bar is-not-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		controlBar.findByProps({ className: 'manage-modules' }).props.onClick()
		expectMethodToBeCalledOnceWith(dashboardProps.showCollectionManageModules, [
			dashboardProps.collection
		])

		controlBar.findByProps({ className: 'rename' }).props.onClick()
		expectMethodToBeCalledOnceWith(dashboardProps.showCollectionRename, [dashboardProps.collection])

		// delete button clicked - canceled
		window.confirm = jest.fn()
		window.confirm.mockReturnValue(false)
		controlBar.findByProps({ className: 'dangerous-button' }).props.onClick()
		expectMethodToBeCalledOnceWith(window.confirm, [
			'Delete collection "Mock Collection Title"? Modules in this collection will not be deleted.'
		])
		expect(dashboardProps.deleteCollection).not.toHaveBeenCalled()

		// delete button clicked - confirmed
		delete window.location
		window.location = {
			assign: jest.fn()
		}

		window.confirm.mockReset()
		window.confirm.mockReturnValue(true)
		controlBar.findByProps({ className: 'dangerous-button' }).props.onClick()
		expectMethodToBeCalledOnceWith(window.confirm, [
			'Delete collection "Mock Collection Title"? Modules in this collection will not be deleted.'
		])
		await expectMethodToBeCalledOnceWith(dashboardProps.deleteCollection, [
			dashboardProps.collection
		])
		expect(window.location.assign).toBeCalledWith('/dashboard')
	})

	test('renders with MODE_DELETED correctly, no modules, no multiselect', () => {
		dashboardProps.mode = MODE_DELETED
		const component = create(<Dashboard {...dashboardProps} />)

		//numerous changes to check for within the main content area
		const mainContent = component.root.findByProps({ className: 'repository--main-content' })
		//some in the control bar
		expectDeletedModeControlBar(component)

		const moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(0)

		// MODE_DELETED will change the 'My Modules' title to 'My Deleted Modules'
		expectNormalModulesAreaClassesWithTitle(mainContent, 'My Deleted Modules')
	})

	test('renders with MODE_DELETE correctly, modules', () => {
		dashboardProps.mode = MODE_DELETED
		dashboardProps.myModules = [...standardMyModules]

		const component = create(<Dashboard {...dashboardProps} />)

		expectDeletedModeControlBar(component)

		const moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(standardMyModules.length)
	})

	test('restoreModules function gets called as expected', async () => {
		const originalAlert = global.alert
		global.alert = jest.fn()

		const mockSelectedModules = [standardMyModules[0], standardMyModules[1]]

		dashboardProps.mode = MODE_DELETED
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.multiSelectMode = true
		dashboardProps.selectedModules = mockSelectedModules
		dashboardProps.deselectModules = jest.fn()

		dashboardProps.bulkRestoreModules = jest.fn().mockResolvedValue(true)

		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		// Actual testing starts here
		const mockClickEvent = { preventDefault: jest.fn() }

		const restoreAllButton = component.root.findAllByType(Button)[0]
		expect(restoreAllButton.children[0].children[0]).toBe('Restore All')

		await act(async () => {
			restoreAllButton.props.onClick(mockClickEvent)
		})
		expect(dashboardProps.bulkRestoreModules).toHaveBeenCalled()
		expect(dashboardProps.bulkRestoreModules).toHaveBeenCalledWith(
			mockSelectedModules.map(module => module.draftId)
		)

		component.unmount()

		return dashboardProps.bulkRestoreModules().then(() => {
			expect(global.alert).toHaveBeenCalledTimes(1)
			expect(global.alert).toHaveBeenCalledWith('The selected modules were successfully restored.')

			global.alert = originalAlert
		})
	})
})
