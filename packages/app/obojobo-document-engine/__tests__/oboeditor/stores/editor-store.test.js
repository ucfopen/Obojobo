/* eslint no-undefined: 0 */

import Common from '../../../src/scripts/common/index'
import EditorUtil from '../../../src/scripts/oboeditor/util/editor-util'
jest.mock('../../../src/scripts/oboeditor/util/editor-util')
jest.mock('../../../src/scripts/viewer/util/api-util')

// spy on dispatcher before loading EditorStore
const Dispatcher = Common.flux.Dispatcher
jest.spyOn(Dispatcher, 'on')
jest.spyOn(Dispatcher, 'trigger')

const EditorStore = require('../../../src/scripts/oboeditor/stores/editor-store').default

// gotta hold on to this because beforeEach will clear it before the tests
const eventCallbacks = Dispatcher.on.mock.calls[0][0]
const CONTENT_NODE = 'ObojoboDraft.Sections.Content'

describe('EditorStore', () => {
	beforeAll(() => {})
	beforeEach(() => {
		jest.clearAllMocks()
		EditorStore.setState({})
	})

	test('Regisers events w/ dispatcher', () => {
		expect(eventCallbacks).toMatchSnapshot()
	})

	test('editor:setContext event sets the context', () => {
		jest.spyOn(EditorStore, 'triggerChange')
		EditorStore.triggerChange.mockReturnValueOnce('')

		eventCallbacks['editor:setContext']({ value: { context: 'fake' } })

		expect(EditorStore.triggerChange).toHaveBeenCalled()
	})

	test('editor:rebuildMenu event rebuilds the menu', () => {
		jest.spyOn(EditorStore, 'triggerChange')
		EditorStore.triggerChange.mockReturnValueOnce('')
		jest.spyOn(EditorStore, 'buildMenu')
		EditorStore.buildMenu.mockReturnValueOnce('')

		eventCallbacks['editor:rebuildMenu']({ value: { model: 'fake' } })

		expect(EditorStore.buildMenu).toHaveBeenCalledWith('fake')
		expect(EditorStore.triggerChange).toHaveBeenCalled()
	})

	test('editor:goto calls gotoItem', () => {
		EditorStore.setState({
			itemsById: {
				mockId: { id: 'mockId' }
			}
		})
		jest.spyOn(EditorStore, 'gotoItem')
		EditorStore.gotoItem.mockReturnValueOnce(true)

		eventCallbacks['editor:goto']({ value: { id: 'mockId' } })

		expect(EditorStore.gotoItem).toHaveBeenCalledWith({ id: 'mockId' })
	})

	test('editor:gotoPath calls gotoItem', () => {
		EditorStore.setState({
			itemsByPath: {
				fake: { id: 'mockId' }
			}
		})
		jest.spyOn(EditorStore, 'gotoItem')
		EditorStore.gotoItem.mockReturnValueOnce(false)

		eventCallbacks['editor:gotoPath']({ value: { path: 'fake' } })

		expect(EditorStore.gotoItem).toHaveBeenCalledWith({ id: 'mockId' })
	})

	test('editor:addPage calls addPage', () => {
		jest.spyOn(EditorStore, 'addPage')
		EditorStore.addPage.mockReturnValueOnce(false)

		eventCallbacks['editor:addPage']({
			value: {
				newPage: 'mockPage',
				afterPageId: 'mockId'
			}
		})

		expect(EditorStore.addPage).toHaveBeenCalledWith('mockPage', 'mockId')
	})

	test('editor:addAssessment calls addAssessment', () => {
		jest.spyOn(EditorStore, 'addAssessment')
		EditorStore.addAssessment.mockReturnValueOnce(false)

		eventCallbacks['editor:addAssessment']({
			value: { newAssessment: 'mockAssessment' }
		})

		expect(EditorStore.addAssessment).toHaveBeenCalledWith('mockAssessment')
	})

	test('editor:deletePage calls deletePage', () => {
		jest.spyOn(EditorStore, 'deletePage')
		EditorStore.deletePage.mockReturnValueOnce(false)

		eventCallbacks['editor:deletePage']({ value: { pageId: 'mockId' } })

		expect(EditorStore.deletePage).toHaveBeenCalledWith('mockId')
	})

	test('editor:movePage calls movePage', () => {
		jest.spyOn(EditorStore, 'movePage')
		EditorStore.movePage.mockReturnValueOnce(false)

		eventCallbacks['editor:movePage']({
			value: { pageId: 'mockId', index: 1 }
		})

		expect(EditorStore.movePage).toHaveBeenCalledWith('mockId', 1)
	})

	test('editor:setStartPage calls setStartPage', () => {
		jest.spyOn(EditorStore, 'setStartPage')

		eventCallbacks['editor:setStartPage']({
			value: { pageId: 'mockId' }
		})

		expect(EditorStore.setStartPage).toHaveBeenCalledWith('mockId')
	})

	test('editor:renamePage calls renamePage', () => {
		jest.spyOn(EditorStore, 'renamePage')
		EditorStore.renamePage.mockReturnValueOnce(false)

		eventCallbacks['editor:renamePage']({
			value: { pageId: 'mockId', name: 'mockName' }
		})

		expect(EditorStore.renamePage).toHaveBeenCalledWith('mockId', 'mockName')
	})

	test('init builds state with basic options', () => {
		EditorStore.init(null, undefined, null, '', 'visual')
		expect(EditorStore.getState()).toMatchSnapshot()
	})

	test('init builds state with settings', () => {
		EditorStore.init(null, undefined, { mockSetting: true }, '', 'visual')
		expect(EditorStore.getState()).toMatchSnapshot()
	})

	test('init builds and goes to starting path', () => {
		EditorStore.init(null, 12, null, 'startingpath', 'visual')
		expect(EditorUtil.gotoPath).toHaveBeenCalledWith('startingpath')
	})

	test('init builds and goes to starting id', () => {
		EditorStore.init(null, 12, null, 'startingpath', 'visual')
		expect(EditorUtil.goto).toHaveBeenCalledWith(12)
	})

	test('init builds and goes to first with no starting id', () => {
		EditorUtil.getFirst.mockReturnValueOnce({ id: 'mockFirstId' })
		EditorStore.init(null, null, null, 'startingpath', 'visual')
		expect(EditorUtil.goto).toHaveBeenCalledWith('mockFirstId')
	})

	test('init builds with no first', () => {
		EditorUtil.getFirst.mockReturnValueOnce(undefined)
		EditorStore.init(null, null, null, 'startingpath', 'visual')
		expect(EditorUtil.goto).not.toHaveBeenCalledWith()
	})

	test('buildMenu should reset menu items', () => {
		jest.spyOn(EditorStore, 'generateNav')
		EditorStore.generateNav.mockImplementationOnce(model => model)

		const before = EditorStore.getState()
		EditorStore.buildMenu('mockModel')
		const after = EditorStore.getState()

		expect(after).toMatchSnapshot()

		// the before and after objects should'nt be ===
		expect(after.itemsById).not.toBe(before.itemsById)
		expect(after.itemsByPath).not.toBe(before.itemsByPath)
		expect(after.itemsByFullPath).not.toBe(before.itemsByFullPath)
	})

	test('gotoItem with null returns false', () => {
		expect(EditorStore.gotoItem(null)).toBe(false)
	})

	test('gotoItem with null target returns true', () => {
		EditorStore.setState({ navTargetId: null })
		EditorUtil.getNavTargetModel.mockReturnValueOnce({
			processTrigger: jest.fn()
		})
		expect(EditorStore.gotoItem({ id: 'mockId' })).toBe(true)
	})

	test('gotoItem doest do anything when already on that item', () => {
		EditorStore.setState({
			navTargetId: 'mockId'
		})
		expect(EditorStore.gotoItem({ id: 'mockId' })).toBe()
	})

	test('gotoItem sends triggers events and updates history', () => {
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		EditorStore.setState({
			navTargetId: 'mockId',
			navTargetHistory: [],
			itemsById: {
				mockId: {
					showChildren: true
				}
			}
		})
		const oldNavItem = { processTrigger: jest.fn() }
		const newNavItem = {
			id: 'newItem',
			showChildrenOnNavigation: true,
			processTrigger: jest.fn()
		}
		EditorUtil.getNavTargetModel.mockReturnValueOnce(oldNavItem)
		EditorUtil.getNavTargetModel.mockReturnValueOnce(newNavItem)

		expect(EditorStore.gotoItem(newNavItem)).toBe(true)
		const after = EditorStore.getState()
		expect(after).toMatchSnapshot()
		expect(oldNavItem.processTrigger).toHaveBeenCalledWith('onNavExit')
	})

	test('gotoItem sends updates history with no previous item', () => {
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		EditorStore.setState({
			navTargetId: 'mockId',
			navTargetHistory: [],
			itemsById: {
				mockId: {
					showChildren: true
				}
			}
		})
		const newNavItem = {
			id: 'newItem',
			showChildrenOnNavigation: true,
			processTrigger: jest.fn()
		}
		EditorUtil.getNavTargetModel.mockReturnValueOnce(null) // no previous item
		EditorUtil.getNavTargetModel.mockReturnValueOnce(newNavItem)

		expect(EditorStore.gotoItem(newNavItem)).toBe(true)
		const after = EditorStore.getState()
		expect(after).toMatchSnapshot()
	})

	test('generateNav with no model returns empty object', () => {
		expect(EditorStore.generateNav()).toEqual({})
	})

	test('generateNav with no navItem returns default object', () => {
		EditorStore.setState({ itemsById: {} })

		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce('testId')
				.mockReturnValueOnce('testId')
				.mockReturnValueOnce('testId'),
			children: {
				models: []
			}
		}

		jest.spyOn(Common.Registry, 'getItemForType')
		Common.Registry.getItemForType.mockReturnValueOnce({ getNavItem: null })

		expect(EditorStore.generateNav(model)).toEqual({
			children: [],
			flags: { complete: false, correct: false },
			fullPath: [],
			id: 'testId',
			label: '',
			path: '',
			showChildren: true,
			showChildrenOnNavigation: true,
			type: 'hidden'
		})
	})

	test('generateNav builds a navItem', () => {
		const item = {
			getNavItem: jest.fn().mockReturnValueOnce({
				id: 'mockItem',
				path: 'whatever'
			})
		}
		const childItem = {
			get: () => 9,
			children: {
				models: []
			},
			getNavItem: jest.fn().mockReturnValueOnce({
				id: 'mockItem2',
				path: 'whatever2'
			})
		}
		const model = {
			get: () => 11,
			getRoot: () => ({ get: () => 66 }),
			children: {
				models: [childItem]
			}
		}
		jest.spyOn(Common.Registry, 'getItemForType')
		Common.Registry.getItemForType.mockReturnValueOnce(item)
		Common.Registry.getItemForType.mockReturnValueOnce(childItem)

		EditorStore.setState({
			itemsByPath: {},
			itemsByFullPath: {},
			itemsById: {},
			visitId: 'visitId',
			mode: 'visual'
		})
		expect(EditorStore.generateNav(model)).toMatchSnapshot()
		expect(EditorStore.getState()).toMatchSnapshot()
	})

	test('addPage inserts a page into the content and calls menu rebuild', () => {
		jest.spyOn(Common.models.OboModel, 'getRoot')
		jest.spyOn(Common.models.OboModel, 'create')
		const childrenlist = []
		const mockContent = {
			get: jest.fn().mockReturnValueOnce(CONTENT_NODE),
			children: {
				add: child => childrenlist.push(child)
			},
			childrenlist // This is a mock construct for the sake of the test, ordinarily
			// the page would be added into children
		}
		Common.models.OboModel.getRoot.mockReturnValueOnce({
			children: [
				{
					get: jest.fn().mockReturnValueOnce('mockNode')
				},
				mockContent
			]
		})
		Common.models.OboModel.create.mockReturnValueOnce({ id: 'mockPage' })

		EditorStore.addPage({ id: 'mockPage' })

		expect(mockContent.childrenlist).toEqual([{ id: 'mockPage' }])
		expect(EditorUtil.rebuildMenu).toHaveBeenCalled()
		expect(EditorUtil.goto).toHaveBeenCalled()
	})

	test('addPage inserts a page into the content and calls menu rebuild after a page id', () => {
		jest.spyOn(Common.models.OboModel, 'getRoot')
		jest.spyOn(Common.models.OboModel, 'create')
		const childrenlist = []
		const mockContent = {
			get: jest.fn().mockReturnValueOnce(CONTENT_NODE),
			children: {
				add: child => childrenlist.push(child)
			},
			childrenlist // This is a mock construct for the sake of the test, ordinarily
			// the page would be added into children
		}
		Common.models.OboModel.getRoot.mockReturnValueOnce({
			children: [
				{
					get: jest.fn().mockReturnValueOnce('mockNode')
				},
				mockContent
			]
		})
		Common.models.OboModel.create.mockReturnValueOnce({ id: 'mockPage' })
		Common.models.OboModel.models['mock-id'] = { addChildAfter: jest.fn() }

		EditorStore.addPage({ id: 'mockPage' }, 'mock-id')

		expect(Common.models.OboModel.models['mock-id'].addChildAfter).toHaveBeenCalled()
		expect(EditorUtil.rebuildMenu).toHaveBeenCalled()
		expect(EditorUtil.goto).toHaveBeenCalled()
	})

	test('addAssessment inserts an assessment and calls menu rebuild', () => {
		jest.spyOn(Common.models.OboModel, 'getRoot')
		jest.spyOn(Common.models.OboModel, 'create')
		const childrenlist = []
		const mockRoot = {
			children: {
				add: child => childrenlist.push(child)
			},
			childrenlist // This is a mock construct for the sake of the test, ordinarily
			// the page would be added into children
		}
		Common.models.OboModel.getRoot.mockReturnValueOnce(mockRoot)
		Common.models.OboModel.create.mockReturnValueOnce({ id: 'mockAssessment' })

		EditorStore.addAssessment({ id: 'mockAssessment' })

		expect(mockRoot.childrenlist).toEqual([{ id: 'mockAssessment' }])
		expect(EditorUtil.rebuildMenu).toHaveBeenCalled()
		expect(EditorUtil.goto).toHaveBeenCalled()
	})

	test('deletePage calls model.remove and rebuilds menu', () => {
		jest.spyOn(EditorStore, 'triggerChange')
		EditorStore.triggerChange.mockReturnValueOnce(true)

		EditorStore.setState({
			currentPageModel: 'mock-current-model'
		})

		Common.models.OboModel.models.mockId = {
			remove: jest.fn(),
			getParentOfType: () => 'mockParentModule'
		}

		expect(Common.models.OboModel.models.mockId.remove).not.toHaveBeenCalled()
		expect(EditorUtil.rebuildMenu).not.toHaveBeenCalled()
		expect(EditorStore.getState().currentPageModel).toBe('mock-current-model')
		expect(EditorStore.triggerChange).not.toHaveBeenCalled()

		EditorStore.deletePage('mockId')

		expect(Common.models.OboModel.models.mockId.remove).toHaveBeenCalled()
		expect(EditorUtil.rebuildMenu).toHaveBeenCalledWith('mockParentModule')
		expect(EditorStore.getState()).toHaveProperty('currentPageModel', null)
		expect(EditorStore.triggerChange).toHaveBeenCalled()
	})

	test('deletePage calls model.remove and rebuilds menu, then goes to first', () => {
		jest.spyOn(EditorStore, 'triggerChange')
		EditorStore.triggerChange.mockReturnValueOnce(true)

		EditorStore.setState({
			currentPageModel: 'mock-current-model'
		})

		Common.models.OboModel.models.mockId = {
			remove: jest.fn(),
			getParentOfType: () => 'mockParentModule'
		}

		expect(Common.models.OboModel.models.mockId.remove).not.toHaveBeenCalled()
		expect(EditorUtil.rebuildMenu).not.toHaveBeenCalled()
		expect(EditorStore.getState().currentPageModel).toBe('mock-current-model')
		expect(EditorStore.triggerChange).not.toHaveBeenCalled()

		EditorUtil.getFirst.mockReturnValueOnce({ id: 'mock-id' })
		EditorStore.deletePage('mockId')

		expect(Common.models.OboModel.models.mockId.remove).toHaveBeenCalled()
		expect(EditorUtil.rebuildMenu).toHaveBeenCalledWith('mockParentModule')
		expect(EditorStore.getState()).toHaveProperty('currentPageModel', null)
		expect(EditorStore.triggerChange).toHaveBeenCalled()
		expect(EditorUtil.goto).toHaveBeenCalled()
	})

	test('renamePage rebuilds menu', () => {
		jest.spyOn(Common.models.OboModel, 'getRoot')
		jest.spyOn(EditorStore, 'triggerChange')
		EditorStore.triggerChange.mockReturnValueOnce(true)

		Common.models.OboModel.models['mockId'] = {
			get: () => ({
				title: 'mock-title'
			})
		}
		Common.models.OboModel.getRoot.mockReturnValueOnce('mockRoot')

		EditorStore.renamePage('mockId', 'mockTitle')

		expect(Common.models.OboModel.models.mockId.title).toEqual('mockTitle')
		expect(EditorUtil.rebuildMenu).toHaveBeenCalled()
		expect(EditorStore.triggerChange).toHaveBeenCalled()
	})

	test('movePage calls model.moveTo and rebuilds menu', () => {
		jest.spyOn(Common.models.OboModel, 'getRoot')
		jest.spyOn(EditorStore, 'triggerChange')
		EditorStore.triggerChange.mockReturnValueOnce(true)

		Common.models.OboModel.models.mockId = {
			moveTo: jest.fn()
		}
		Common.models.OboModel.getRoot.mockReturnValueOnce('mockRoot')

		EditorStore.movePage('mockId', 1)

		expect(Common.models.OboModel.models.mockId.moveTo).toHaveBeenCalled()
		expect(EditorUtil.rebuildMenu).toHaveBeenCalled()
		expect(EditorStore.triggerChange).toHaveBeenCalled()
	})
})
