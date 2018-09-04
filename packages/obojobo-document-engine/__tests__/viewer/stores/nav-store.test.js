jest.mock('../../../src/scripts/viewer/util/api-util', () => ({
	postEvent: jest.fn()
}))

// Nav Util
jest.mock('../../../src/scripts/viewer/util/nav-util', () => ({
	getFirst: jest.fn(),
	getPrev: jest.fn(),
	getNext: jest.fn(),
	setFlag: jest.fn(),
	canNavigate: jest.fn(),
	gotoPath: jest.fn(),
	goto: jest.fn(),
	toggle: jest.fn(),
	getOrderedList: jest.fn(),
	getNavTargetModel: jest.fn()
}))

const Common = require('../../../src/scripts/common/index').default
const NavUtil = require('../../../src/scripts/viewer/util/nav-util')
const APIUtil = require('../../../src/scripts/viewer/util/api-util')

// spy on dispatcher before loading navstore
const Dispatcher = Common.flux.Dispatcher
jest.spyOn(Dispatcher, 'on')
jest.spyOn(Dispatcher, 'trigger')

const NavStore = require('../../../src/scripts/viewer/stores/nav-store').default
// gotta hold on to this because beforeEach will clear it before the tests
const eventCallbacks = Dispatcher.on.mock.calls[0][0]

describe('NavStore', () => {
	beforeAll(() => {})
	beforeEach(() => {
		jest.clearAllMocks()
		NavStore.setState({})
	})

	test('Regisers events w/ dispatcher', () => {
		expect(eventCallbacks).toMatchSnapshot()
	})

	test('nav:setContext event sets the context', () => {
		jest.spyOn(NavStore, 'triggerChange')
		NavStore.triggerChange.mockReturnValueOnce('')

		eventCallbacks['nav:setContext']({ value: { context: 'fake' } })

		expect(NavStore.triggerChange).toHaveBeenCalled()
	})

	test('nav:rebuildMenu event rebuilds the menu', () => {
		jest.spyOn(NavStore, 'buildMenu')
		NavStore.buildMenu.mockReturnValueOnce('')
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()
		eventCallbacks['nav:rebuildMenu']({ value: { model: 'fake' } })

		expect(NavStore.buildMenu).toHaveBeenCalledWith('fake')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
	})

	test('nav:gotoPath event calls gotoItem and postEvent', () => {
		NavStore.setState({
			navTargetId: 7,
			itemsByPath: {
				fake: { id: 'mock' }
			}
		})
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')
		jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)
		eventCallbacks['nav:gotoPath']({ value: { path: 'fake' } })

		expect(NavStore.gotoItem).toHaveBeenCalledWith({ id: 'mock' })
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:gotoPath event does not go to incorrect item', () => {
		NavStore.setState({
			navTargetId: 7,
			itemsByPath: {
				fake: { id: 'mock' }
			}
		})
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')
		jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(false)
		eventCallbacks['nav:gotoPath']({ value: { path: 'fake' } })

		expect(NavStore.gotoItem).toHaveBeenCalledWith({ id: 'mock' })
		expect(APIUtil.postEvent).not.toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:setFlag event updates state and calls trigger', () => {
		NavStore.setState({
			navTargetId: 7,
			itemsById: {
				fake: { id: 'mock', flags: {} }
			}
		})

		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		eventCallbacks['nav:setFlag']({ value: { id: 'fake', flagName: 'spoof' } })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:prev changes page and posts event', () => {
		NavStore.setState({
			navTargetId: 7
		})

		// simulate a valid gotoItem Call
		jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// simulate nextItem lookup
		NavUtil.getPrev.mockReturnValueOnce({ id: 'mockPrev' })

		// go
		eventCallbacks['nav:prev']()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:prev does not change to invalid page', () => {
		NavStore.setState({
			navTargetId: 7
		})

		// simulate a valid gotoItem Call
		jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(false)

		// go
		eventCallbacks['nav:prev']()
		expect(APIUtil.postEvent).not.toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:next changes page and posts event', () => {
		NavStore.setState({
			navTargetId: 7
		})

		// simulate a valid gotoItem Call
		jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// simulate nextItem lookup
		NavUtil.getNext.mockReturnValueOnce({ id: 'mockNext' })

		// go
		eventCallbacks['nav:next']()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:next does not change to invalid page', () => {
		NavStore.setState({
			navTargetId: 7
		})

		// simulate a valid gotoItem Call
		jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(false)

		// go
		eventCallbacks['nav:next']()
		expect(APIUtil.postEvent).not.toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:goto changes page and posts event', () => {
		NavStore.setState({
			navTargetId: 7,
			itemsById: {
				mock: { id: 'mock', flags: {} }
			}
		})

		// simulate a valid gotoItem Call
		jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:goto']({ value: { id: 'mock' } })
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:goto does not go to a fake page', () => {
		NavStore.setState({
			navTargetId: 7,
			itemsById: {
				mock: { id: 'mock', flags: {} }
			}
		})

		// simulate a valid gotoItem Call
		jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(false)

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:goto']({ value: { id: 'mock' } })
		expect(APIUtil.postEvent).not.toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:lock event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })

		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:lock']()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:unlock event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:unlock']()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:close event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:close']()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:open event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:open']()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:close event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:close']()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:toggle event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: false })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:toggle']()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:openExternalLink fires event and opens a window', () => {
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()
		window.open = jest.fn()

		// go
		eventCallbacks['nav:openExternalLink']({ value: { url: 'mockUrl' } })
		expect(window.open).toHaveBeenCalledTimes(1)
		expect(window.open).toHaveBeenCalledWith('mockUrl')
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:showChildren event fires and updates state', () => {
		NavStore.setState({ itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:showChildren']({ value: { id: 'mockID' } })
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:hideChildren event fires and updates state', () => {
		NavStore.setState({ itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:hideChildren']({ value: { id: 'mockID' } })
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('question:scoreSet sets flag with a score of 100', () => {
		NavStore.setState({ itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['question:scoreSet']({ value: { id: 'mockID', score: 0 } })
		expect(NavUtil.setFlag).toHaveBeenCalledTimes(1)
		expect(NavUtil.setFlag.mock.calls[0]).toMatchSnapshot()
	})

	test('question:scoreSet does not set flag if question not found', () => {
		NavStore.setState({ itemsById: {} })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['question:scoreSet']({ value: { id: 'mockID', score: 0 } })
		expect(NavUtil.setFlag).not.toHaveBeenCalled()
		expect(NavUtil.setFlag.mock.calls[0]).toMatchSnapshot()
	})

	test('question:scoreSet sets flag with a score of 100', () => {
		NavStore.setState({ itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['question:scoreSet']({ value: { id: 'mockID', score: 100 } })
		expect(NavUtil.setFlag).toHaveBeenCalledTimes(1)
		expect(NavUtil.setFlag.mock.calls[0]).toMatchSnapshot()
	})

	test('init builds state with basic options', () => {
		NavStore.init(null, 12, '', 11)
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('init builds state locked state', () => {
		NavStore.init(null, 12, '', 11, { 'nav:isLocked': { value: true } })
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('init builds state open state', () => {
		NavStore.init(null, 12, '', 11, { 'nav:isOpen': { value: true } })
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('init builds and goes to starting path', () => {
		NavStore.init(null, 12, 'startingpath', 11)
		expect(NavUtil.gotoPath).toHaveBeenCalledWith('startingpath')
	})

	test('init builds and goes to starting id', () => {
		NavStore.init(null, 12, 'startingpath', 11)
		expect(NavUtil.goto).toHaveBeenCalledWith(12)
	})

	test('init builds and goes to first with no starting id', () => {
		NavUtil.getFirst.mockReturnValueOnce({ id: 'mockFirstId' })
		NavStore.init(null, null, 'startingpath', 11)
		expect(NavUtil.goto).toHaveBeenCalledWith('mockFirstId')
	})

	test('init builds with no first', () => {
		NavUtil.getFirst.mockReturnValueOnce(undefined)
		NavStore.init(null, null, 'startingpath', 11)
		expect(NavUtil.goto).not.toHaveBeenCalledWith()
	})

	test('buildMenu should reset menu items', () => {
		jest.spyOn(NavStore, 'generateNav')
		NavStore.generateNav.mockImplementationOnce(model => model)

		let before = NavStore.getState()
		NavStore.buildMenu('mockModel')
		let after = NavStore.getState()

		expect(after).toMatchSnapshot()

		// the before and after objects should'nt be ===
		expect(after.itemsById).not.toBe(before.itemsById)
		expect(after.itemsByPath).not.toBe(before.itemsByPath)
		expect(after.itemsByFullPath).not.toBe(before.itemsByFullPath)
	})

	test('gotoItem with null returns false', () => {
		expect(NavStore.gotoItem(null)).toBe(false)
	})

	test('gotoItem with null target returns true', () => {
		NavStore.setState({ navTargetId: null })
		NavUtil.getNavTargetModel.mockReturnValueOnce({
			processTrigger: jest.fn()
		})
		expect(NavStore.gotoItem({ id: 'mockId' })).toBe(true)
	})

	test('gotoItem doest do anything when already on that item', () => {
		NavStore.setState({
			navTargetId: 'mockId'
		})
		expect(NavStore.gotoItem({ id: 'mockId' })).toBe()
	})

	test('gotoItem sends triggers events and updates history', () => {
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		NavStore.setState({
			navTargetId: 'mockId',
			navTargetHistory: [],
			itemsById: {
				mockId: {
					showChildren: true
				}
			}
		})
		let oldNavItem = { processTrigger: jest.fn() }
		let newNavItem = {
			id: 'newItem',
			showChildrenOnNavigation: true,
			processTrigger: jest.fn()
		}
		NavUtil.getNavTargetModel.mockReturnValueOnce(oldNavItem)
		NavUtil.getNavTargetModel.mockReturnValueOnce(newNavItem)

		expect(NavStore.gotoItem(newNavItem)).toBe(true)
		let after = NavStore.getState()
		expect(after).toMatchSnapshot()
		expect(oldNavItem.processTrigger).toHaveBeenCalledWith('onNavExit')
		expect(newNavItem.processTrigger).toHaveBeenCalledWith('onNavEnter')
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(2)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:unfocus')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
	})

	test('gotoItem sends updates history with no previous item', () => {
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		NavStore.setState({
			navTargetId: 'mockId',
			navTargetHistory: [],
			itemsById: {
				mockId: {
					showChildren: true
				}
			}
		})
		let oldNavItem = { processTrigger: jest.fn() }
		let newNavItem = {
			id: 'newItem',
			showChildrenOnNavigation: true,
			processTrigger: jest.fn()
		}
		NavUtil.getNavTargetModel.mockReturnValueOnce(null) // no previous item
		NavUtil.getNavTargetModel.mockReturnValueOnce(newNavItem)

		expect(NavStore.gotoItem(newNavItem)).toBe(true)
		let after = NavStore.getState()
		expect(after).toMatchSnapshot()
		expect(newNavItem.processTrigger).toHaveBeenCalledWith('onNavEnter')
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(2)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:unfocus')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
	})

	test('generateNav with no model returns empty object', () => {
		expect(NavStore.generateNav()).toEqual({})
	})

	test('generateNav with no navItem returns default object', () => {
		NavStore.setState({ itemsById: {} })

		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce('testId')
				.mockReturnValueOnce('testId')
				.mockReturnValueOnce('testId'),
			children: {
				models: []
			}
		}

		jest.spyOn(Common.Store, 'getItemForType')
		Common.Store.getItemForType.mockReturnValueOnce({ getNavItem: null })

		expect(NavStore.generateNav(model)).toEqual({
			children: [],
			flags: { complete: false, correct: false, visited: false },
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
		let item = {
			getNavItem: jest.fn().mockReturnValueOnce({
				id: 'mockItem',
				path: 'whatever'
			})
		}
		let childItem = {
			get: () => 9,
			children: {
				models: []
			},
			getNavItem: jest.fn().mockReturnValueOnce({
				id: 'mockItem2',
				path: 'whatever2'
			})
		}
		let model = {
			get: () => 11,
			getRoot: () => ({ get: () => 66 }),
			children: {
				models: [childItem]
			}
		}
		jest.spyOn(Common.Store, 'getItemForType')
		Common.Store.getItemForType.mockReturnValueOnce(item)
		Common.Store.getItemForType.mockReturnValueOnce(childItem)

		NavStore.setState({
			itemsByPath: {},
			itemsByFullPath: {},
			itemsById: {},
			visitId: 'visitId'
		})
		expect(NavStore.generateNav(model)).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})
})
