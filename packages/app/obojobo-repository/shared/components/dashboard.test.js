// mock all of these components so we can check that they're rendered and
//  run their callbacks without worrying about fully implementing them all
jest.mock('./multi-button', () => props => {
	return <mock-MultiButton>{props.children}</mock-MultiButton>
})
jest.mock('react-modal', () => props => {
	return <mock-ReactModal {...props}></mock-ReactModal>
})
jest.mock('./module-permissions-dialog', () => props => {
	return <mock-ModulePermissionsDialog {...props}></mock-ModulePermissionsDialog>
})
jest.mock('./module-options-dialog', () => props => {
	return <mock-ModuleOptionsDialog {...props}></mock-ModuleOptionsDialog>
})

import React from 'react'
import { create, act } from 'react-test-renderer'

import Dashboard from './dashboard'
import MultiButton from './multi-button'
import Button from './button'
import Module from './module'
import Search from './search'

import ReactModal from 'react-modal'
import ModulePermissionsDialog from './module-permissions-dialog'
import ModuleOptionsDialog from './module-options-dialog'
import VersionHistoryDialog from './version-history-dialog'
import AssessmentScoreDataDialog from './assessment-score-data-dialog'

describe('Dashboard', () => {
	const standardMyModules = [
		{
			draftId: 'mockDraftId',
			title: 'D Module Title ',
			createdAt: new Date(10000000000).toISOString(),
			updatedAt: new Date(200000000000).toISOString()
		},
		{
			draftId: 'mockDraftId2',
			title: 'A Module Title 2',
			createdAt: new Date(20000000000).toISOString(),
			updatedAt: new Date(400000000000).toISOString()
		},
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
		},
		{
			draftId: 'mockDraftId5',
			title: 'E Module Title 5',
			createdAt: new Date(50000000000).toISOString(),
			updatedAt: new Date(500000000000).toISOString()
		}
	]

	let dashboardProps

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
	})

	beforeEach(() => {
		jest.resetAllMocks()

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

			dialog: null,
			selectedModule: {},
			draftPermissions: {},
			myCollections: [],
			myModules: [],
			selectedModules: [],
			multiSelectMode: false,
			sortOrder: 'alphabetical',
			moduleCount: 0,
			moduleSearchString: '',
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
			closeModal: jest.fn()
		}
	})

	afterEach(() => {
		cookie = {}
	})

	afterAll(() => {
		window.confirm = originalConfirm
		window.location.assign = originalLocationAssign
	})

	const expectDashboardRender = () => {
		dashboardProps.myModules = [...standardMyModules]
		const reusableComponent = <Dashboard {...dashboardProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		// the current sort methods for modules and collections are stored in a cookie
		//  this cookie should be set initially when the component first renders
		//  this cookie should also change when a sort method is chosen while 'document' is defined
		expectCookiePropForPath('sortOrder', 'alphabetical', '/dashboard')

		//numerous changes to check for within the main content area
		const mainContent = component.root.findByProps({ className: 'repository--main-content' })
		//some in the control bar
		const expectedControlBarClasses =
			'repository--main-content--control-bar is-not-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		expect(controlBar.children.length).toBe(2)
		expect(component.root.findAllByType(Search).length).toBe(1)

		expectNormalModulesAreaClassesWithTitle(mainContent, 'My Modules')

		let moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(5)

		expectNewModuleOptions(component)

		const expectedModuleSortClass = 'repository--main-content--sort'
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

		expectCookiePropForPath('sortOrder', 'newest', '/dashboard')

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

		expectCookiePropForPath('sortOrder', 'last updated', '/dashboard')

		moduleComponents = component.root.findAllByType(Module)
		expect(moduleSort.props.value).toBe('last updated')
		expect(moduleComponents[0].props.draftId).toBe('mockDraftId5')
		expect(moduleComponents[1].props.draftId).toBe('mockDraftId2')
		expect(moduleComponents[2].props.draftId).toBe('mockDraftId3')
		expect(moduleComponents[3].props.draftId).toBe('mockDraftId')
		expect(moduleComponents[4].props.draftId).toBe('mockDraftId4')

		// Shouldn't be any modal dialogs open, either
		expect(component.root.findAllByType(ReactModal).length).toBe(0)

		component.unmount()
	}

	const expectMultiSelectDashboardRender = () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.multiSelectMode = true
		const reusableComponent = <Dashboard {...dashboardProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		const expectedControlBarClasses = 'repository--main-content--control-bar is-multi-select-mode'
		const controlBar = component.root.findByProps({ className: expectedControlBarClasses })

		expect(controlBar.children.length).toBe(3)
		expect(component.root.findAllByType(Search).length).toBe(0)

		expectMultiSelectOptions(controlBar)

		const moduleComponents = component.root.findAllByType(Module)
		expect(moduleComponents.length).toBe(5)
		expect(moduleComponents[0].props.isMultiSelectMode).toBe(true)

		component.unmount()
	}

	const expectNormalModulesAreaClassesWithTitle = (mainContent, title) => {
		const expectedModulesTitleClasses = 'repository--main-content--title'
		expect(mainContent.children[1].props.className).toBe(expectedModulesTitleClasses)
		expect(mainContent.children[1].children[0].children[0]).toBe(title)
	}

	const expectNewModuleOptions = component => {
		const multiButton = component.root.findByType(MultiButton).children[0]
		// three child buttons
		expect(multiButton.children.length).toBe(3)
		expect(multiButton.children[0].children[0].children[0]).toBe('New Module')
		expect(multiButton.children[1].children[0].children[0]).toBe('New Tutorial')
		expect(multiButton.children[2].children[0].children[0]).toBe('Upload...')
	}

	const expectMultiSelectOptions = controlBar => {
		expect(controlBar.children[0].props.className).toBe('module-count')
		expect(controlBar.children[1].children[0].children[0]).toBe('Delete All')
		expect(controlBar.children[2].children[0].children[0]).toBe('×')
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

	test('renders with default props', () => {
		expectDashboardRender()
	})

	test('renders with multiSelectMode=true', () => {
		expectMultiSelectDashboardRender()
	})

	test('renders filtered modules properly', () => {
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

	test('"New Module" and "Upload..." buttons call functions appropriately', async () => {
		const newModule = {
			payload: {
				value: [
					{
						draftId: 'mockId1',
						createdAt: 1
					},
					{
						draftId: 'mockId2',
						createdAt: 2
					}
				]
			}
		}
		dashboardProps.createNewModule = jest.fn()
		dashboardProps.importModuleFile = jest.fn()
		const component = create(<Dashboard {...dashboardProps} />)

		const setNewModuleId = jest.fn()
		const handleClick = jest.spyOn(React, 'useState')
		handleClick.mockImplementation(newModuleId => [newModuleId, setNewModuleId])

		// three buttons under the 'New Module +' MultiButton component
		const multiButton = component.root.findByType(MultiButton).children[0]

		// 'New Module' button should call createNewModule with false
		expect(multiButton.children[0].children[0].children[0]).toBe('New Module')
		dashboardProps.createNewModule.mockResolvedValue(newModule)
		await act(async () => {
			multiButton.children[0].props.onClick()
		})

		expect(dashboardProps.createNewModule).toHaveBeenCalledTimes(1)
		expect(setNewModuleId).toBeTruthy()
		dashboardProps.createNewModule.mockReset()

		// 'New Tutorial' button should call createNewModule with true
		expect(multiButton.children[1].children[0].children[0]).toBe('New Tutorial')
		dashboardProps.createNewModule.mockResolvedValue(newModule)
		await act(async () => {
			multiButton.children[1].props.onClick()
		})
		expect(dashboardProps.createNewModule).toHaveBeenCalledTimes(1)
		expect(setNewModuleId).toBeTruthy()
		dashboardProps.createNewModule.mockReset()

		// 'Upload...' button should call importModuleFile with no arguments
		expect(multiButton.children[2].children[0].children[0]).toBe('Upload...')
		await act(async () => {
			multiButton.children[2].props.onClick()
		})
		expect(dashboardProps.importModuleFile).toHaveBeenCalledTimes(1)
		dashboardProps.importModuleFile.mockReset()

		handleClick.mockRestore()

		component.unmount()
	})

	test('"Delete All" button calls functions appropriately', async () => {
		dashboardProps.bulkDeleteModules = jest.fn()
		dashboardProps.selectedModules = ['mockId', 'mockId2']
		dashboardProps.multiSelectMode = true
		const reusableComponent = <Dashboard {...dashboardProps} />
		let component
		act(() => {
			component = create(reusableComponent)
		})

		const mockClickEvent = {
			preventDefault: jest.fn()
		}

		const deleteAllButton = component.root.findAllByType(Button)[0]
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

		const deselectAllButton = component.root.findAllByType(Button)[1]
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
		expect(dashboardProps.selectModules).toHaveBeenCalledWith(['mockDraftId2'])

		dashboardProps.selectedModules = ['mockDraftId2']
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
		expect(dashboardProps.deselectModules).toHaveBeenCalledWith(['mockDraftId2'])

		component.unmount()
	})

	test('selecting modules with shift calls functions appropriately', () => {
		dashboardProps.myModules = [...standardMyModules]
		dashboardProps.selectModules = jest.fn()
		let component
		act(() => {
			component = create(<Dashboard {...dashboardProps} />)
		})

		const moduleComponents = component.root.findAllByType(Module)

		act(() => {
			const mockClickEvent = {
				shiftKey: true
			}
			moduleComponents[2].props.onSelect(mockClickEvent)
		})
		expect(dashboardProps.selectModules).toHaveBeenCalledTimes(1)
		expect(dashboardProps.selectModules).toHaveBeenCalledWith([
			'mockDraftId2',
			'mockDraftId4',
			'mockDraftId3'
		])
		dashboardProps.selectModules.mockReset()

		act(() => {
			const mockClickEvent = {
				shiftKey: true
			}
			moduleComponents[1].props.onSelect(mockClickEvent)
		})
		expect(dashboardProps.selectModules).toHaveBeenCalledTimes(1)
		expect(dashboardProps.selectModules).toHaveBeenCalledWith(['mockDraftId4', 'mockDraftId3'])

		component.unmount()
	})

	test('renders "Module Options" dialog', () => {
		dashboardProps.showModuleManageCollections = jest.fn()
		dashboardProps.showModulePermissions = jest.fn()
		dashboardProps.deleteModule = jest.fn()
		dashboardProps.dialog = 'module-more'
		const component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)

		expectDialogToBeRendered(component, ModuleOptionsDialog, 'Module Options')
		const dialogComponent = component.root.findByType(ModuleOptionsDialog)

		dialogComponent.props.showModulePermissions()
		expectMethodToBeCalledOnceWith(dashboardProps.showModulePermissions)
		// draftId for the menu's module would normally be passed here
		dialogComponent.props.deleteModule('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.deleteModule, ['mockDraftId'])
		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		dialogComponent.props.onClose()
		expectMethodToBeCalledOnceWith(dashboardProps.closeModal)

		component.unmount()
	})

	test('renders "Module Access" dialog', () => {
		dashboardProps.dialog = 'module-permissions'
		dashboardProps.loadUsersForModule = jest.fn()
		dashboardProps.addUserToModule = jest.fn()
		dashboardProps.draftPermissions = jest.fn()
		dashboardProps.deleteModulePermissions = jest.fn()
		const component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)

		expectDialogToBeRendered(component, ModulePermissionsDialog, 'Module Access')
		const dialogComponent = component.root.findByType(ModulePermissionsDialog)

		dialogComponent.props.loadUsersForModule('mockDraftId')
		expectMethodToBeCalledOnceWith(dashboardProps.loadUsersForModule, ['mockDraftId'])
		dialogComponent.props.addUserToModule('mockDraftId', 99)
		expectMethodToBeCalledOnceWith(dashboardProps.addUserToModule, ['mockDraftId', 99])
		dialogComponent.props.deleteModulePermissions('mockDraftId', 99)
		expectMethodToBeCalledOnceWith(dashboardProps.deleteModulePermissions, ['mockDraftId', 99])

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

	test('renders no dialogs if props.dialog value is unsupported', () => {
		dashboardProps.dialog = 'some-unsupported-value'
		let component
		act(() => {
			component = create(<Dashboard key="dashboardComponent" {...dashboardProps} />)
		})

		expect(component.root.findAllByType(ReactModal).length).toBe(0)

		component.unmount()
	})
})
