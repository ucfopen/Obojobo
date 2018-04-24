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

// gotta spy on dispatcher before loading navstore
jest.spyOn(Common.flux.Dispatcher, 'on')
jest.spyOn(Common.flux.Dispatcher, 'trigger')
const NavStore = require('../../../src/scripts/viewer/stores/nav-store').default
// gotta hold on to this because beforeEach will clear it before the tests
const eventCallbacks = Common.flux.Dispatcher.on.mock.calls[0][0]

describe('NavStore', () => {
	beforeAll(() => {})
	beforeEach(() => {
		jest.clearAllMocks()
		NavStore.setState({})
	})

	it('Regisers events w/ dispatcher', () => {
		expect(eventCallbacks).toMatchSnapshot()
	})

	it('nav:rebuildMenu event rebuilds the menu', () => {
		jest.spyOn(NavStore, 'buildMenu')
		NavStore.buildMenu.mockReturnValueOnce('')
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()
		eventCallbacks['nav:rebuildMenu']({ value: { model: 'fake' } })

		expect(NavStore.buildMenu).toHaveBeenCalledWith('fake')
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
	})

	it('nav:gotoPath event calls gotoItem and postEvent', () => {
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

	it('nav:setFlag event updates state and calls trigger', () => {
		NavStore.setState({
			navTargetId: 7,
			itemsById: {
				fake: { id: 'mock', flags: {} }
			}
		})

		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

		eventCallbacks['nav:setFlag']({ value: { id: 'fake', flagName: 'spoof' } })

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('nav:prev changes page and posts event', () => {
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

	it('nav:next changes page and posts event', () => {
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

	it('nav:goto changes page and posts event', () => {
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

	it('nav:lock event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })

		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:lock']()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('nav:unlock event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:unlock']()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('nav:close event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:close']()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('nav:open event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:open']()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('nav:close event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: 'unchanged' })
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:close']()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('nav:toggle event fires and updates state', () => {
		NavStore.setState({ locked: 'unchanged', open: false })
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

		// mock getRoot
		jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce('root')

		// go
		eventCallbacks['nav:toggle']()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('nav:openExternalLink fires event and opens a window', () => {
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()
		window.open = jest.fn()

		// go
		eventCallbacks['nav:openExternalLink']({ value: { url: 'mockUrl' } })
		expect(window.open).toHaveBeenCalledTimes(1)
		expect(window.open).toHaveBeenCalledWith('mockUrl')
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
	})

	it('nav:showChildren event fires and updates state', () => {
		NavStore.setState({ itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:showChildren']({ value: { id: 'mockID' } })
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('nav:hideChildren event fires and updates state', () => {
		NavStore.setState({ itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:hideChildren']({ value: { id: 'mockID' } })
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	// @TODO - these moved?
	it.skip('score:set sets a correct flag on the item with a score of 100', () => {
		NavStore.setState({ itemsById: { mockID: { showChildren: 'unchanged' } } })
		// go
		eventCallbacks['score:set']({ value: { id: 'mockID', score: 100 } })

		expect(NavUtil.setFlag).toHaveBeenCalledTimes(1)
		expect(NavUtil.setFlag.mock.calls[0]).toMatchSnapshot()
	})

	// @TODO - these moved?
	it.skip('score:set sets a correct flag on the item with a score of 23', () => {
		NavStore.setState({ itemsById: { mockID: { showChildren: 'unchanged' } } })
		// go
		eventCallbacks['score:set']({ value: { id: 'mockID', score: 23 } })

		expect(NavUtil.setFlag).toHaveBeenCalledTimes(1)
		expect(NavUtil.setFlag.mock.calls[0]).toMatchSnapshot()
	})

	it('should init state with basic options', () => {
		NavStore.init(null, 12, '', 11)
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('should init state locked state', () => {
		NavStore.init(null, 12, '', 11, { 'nav:isLocked': { value: true } })
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('should init state open state', () => {
		NavStore.init(null, 12, '', 11, { 'nav:isOpen': { value: true } })
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('should init and go to starting path', () => {
		NavStore.init(null, 12, 'startingpath', 11)
		expect(NavUtil.gotoPath).toHaveBeenCalledWith('startingpath')
	})

	it('should init go to starting id', () => {
		NavStore.init(null, 12, 'startingpath', 11)
		expect(NavUtil.goto).toHaveBeenCalledWith(12)
	})

	it('should init and go to first with no starting id', () => {
		NavUtil.getFirst.mockReturnValueOnce({ id: 'mockFirstId' })
		NavStore.init(null, null, 'startingpath', 11)
		expect(NavUtil.goto).toHaveBeenCalledWith('mockFirstId')
	})

	it('buildMenu should reset menu items', () => {
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

	it('gotoItem with null returns false', () => {
		expect(NavStore.gotoItem(null)).toBe(false)
	})

	it('gotoItem doest do anything when already on that item', () => {
		NavStore.setState({
			navTargetId: 'mockId'
		})
		expect(NavStore.gotoItem({ id: 'mockId' })).toBe()
	})

	it('gotoItem sends triggers events and updates history', () => {
		// simulate trigger
		Common.flux.Dispatcher.trigger.mockReturnValueOnce()

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
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
	})

	it('generateNav with no model returns empty objec ', () => {
		expect(NavStore.generateNav()).toEqual({})
	})

	it('generateNav builds a navItem', () => {
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
