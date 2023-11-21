jest.mock('../../../src/scripts/viewer/util/viewer-api', () => ({
	postEvent: jest.fn(),
	getVisitSessionStatus: jest.fn()
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

jest.mock('../../../src/scripts/viewer/util/focus-util', () => ({
	clearFadeEffect: jest.fn()
}))

const Common = require('../../../src/scripts/common/index').default
const NavUtil = require('../../../src/scripts/viewer/util/nav-util')
const ViewerAPI = require('../../../src/scripts/viewer/util/viewer-api')
const FocusUtil = require('../../../src/scripts/viewer/util/focus-util')

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
		NavStore.setState()
		ViewerAPI.getVisitSessionStatus.mockResolvedValue({ status: 'ok' })
	})

	test('Registers events w/ dispatcher', () => {
		expect(eventCallbacks).toMatchSnapshot()
	})

	test('nav:setContext event sets the context', () => {
		const spy = jest.spyOn(NavStore, 'triggerChange')
		NavStore.triggerChange.mockReturnValueOnce('')

		eventCallbacks['nav:setContext']({ value: { context: 'fake' } })

		expect(NavStore.triggerChange).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('nav:setContext event sets the context to the default', () => {
		const spy = jest.spyOn(NavStore, 'triggerChange')
		NavStore.triggerChange.mockReturnValueOnce('')

		eventCallbacks['nav:resetContext']({ value: { context: 'practice' } })

		expect(NavStore.triggerChange).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('nav:rebuildMenu event rebuilds the menu', () => {
		const spy = jest.spyOn(NavStore, 'buildMenu')
		NavStore.buildMenu.mockReturnValueOnce('')
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()
		eventCallbacks['nav:rebuildMenu']({ value: { model: 'fake' } })

		expect(NavStore.buildMenu).toHaveBeenCalledWith('fake')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')

		spy.mockRestore()
	})

	test('nav:gotoPath event calls gotoItem and postEvent', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 7,
			itemsByPath: {
				fake: { id: 'mock' }
			},
			draftId: 'mockDraftId'
		})
		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)
		eventCallbacks['nav:gotoPath']({ value: { path: 'fake' } })

		expect(NavStore.gotoItem).toHaveBeenCalledWith({ id: 'mock' })
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:gotoPath event does not go to incorrect item', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 7,
			itemsByPath: {
				fake: { id: 'mock' }
			}
		})
		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(false)
		eventCallbacks['nav:gotoPath']({ value: { path: 'fake' } })

		expect(NavStore.gotoItem).toHaveBeenCalledWith({ id: 'mock' })
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:gotoPath event does not go to item if nav store not initialized', () => {
		NavStore.setState({
			isInitialized: false,
			navTargetId: 7,
			itemsByPath: {
				fake: { id: 'mock' }
			},
			draftId: 'mockDraftId'
		})
		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)
		eventCallbacks['nav:gotoPath']({ value: { path: 'fake' } })

		expect(NavStore.gotoItem).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(0)
		expect(NavStore.pendingTarget).toEqual({
			type: 'path',
			target: 'fake'
		})

		spy.mockRestore()
	})

	test('nav:setFlag event updates state and calls trigger', () => {
		NavStore.setState({
			isInitialized: true,
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
			isInitialized: true,
			navTargetId: 7,
			locked: false,
			draftId: 'mockDraftId'
		})

		// simulate a valid gotoItem Call
		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)

		// simulate nextItem lookup
		NavUtil.getPrev.mockReturnValueOnce({ id: 'mockPrev' })

		// go
		eventCallbacks['nav:prev']()
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:prev does not change to invalid page', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 7,
			locked: false
		})

		// simulate a valid gotoItem Call
		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(false)

		// go
		eventCallbacks['nav:prev']()
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:prev does not change page when locked', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 7,
			locked: true
		})

		const spy = jest.spyOn(NavStore, 'gotoItem')

		// go
		eventCallbacks['nav:prev']()
		expect(NavStore.gotoItem).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:next changes page and posts event', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 7,
			locked: false,
			draftId: 'mockDraftId'
		})

		// simulate a valid gotoItem Call
		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)

		// simulate nextItem lookup
		NavUtil.getNext.mockReturnValueOnce({ id: 'mockNext' })

		// go
		eventCallbacks['nav:next']()
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:next does not change to invalid page', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 7,
			locked: false
		})

		// simulate a valid gotoItem Call
		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(false)

		// go
		eventCallbacks['nav:next']()
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:next does not change page when locked', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 7,
			locked: true
		})

		const spy = jest.spyOn(NavStore, 'gotoItem')

		// go
		eventCallbacks['nav:next']()
		expect(NavStore.gotoItem).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:goto changes page and posts event', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 7,
			itemsById: {
				mock: { id: 'mock', flags: {} }
			},
			draftId: 'mockDraftId'
		})

		// simulate a valid gotoItem Call
		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)

		// go
		eventCallbacks['nav:goto']({ value: { id: 'mock' } })
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:goto does nothing if nav store not initialized', () => {
		NavStore.setState({
			isInitialized: false,
			navTargetId: 7,
			itemsById: {
				mock: { id: 'mock', flags: {} }
			},
			draftId: 'mockDraftId'
		})

		// simulate a valid gotoItem Call
		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)

		// go
		eventCallbacks['nav:goto']({ value: { id: 'mock' } })
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(NavStore.pendingTarget).toEqual({
			type: 'goto',
			target: 'mock'
		})

		spy.mockRestore()
	})

	test('nav:goto does not go to a fake page', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 7,
			itemsById: {
				mock: { id: 'mock', flags: {} }
			}
		})

		// simulate a valid gotoItem Call
		const gotoItemSpy = jest.spyOn(NavStore, 'gotoItem')
		const gotoFirstSpy = jest.spyOn(NavStore, 'gotoFirst')
		NavStore.gotoItem.mockReturnValueOnce(false)

		// make sure the nav defaults to the first page if an ID isn't found
		eventCallbacks['nav:goto']({ value: { id: 'does-not-exist' } })
		expect(gotoFirstSpy).toHaveBeenCalled()
		expect(gotoItemSpy).not.toHaveBeenCalled()

		gotoItemSpy.mockRestore()
		gotoFirstSpy.mockRestore()
	})

	test('nav:goto does nothing if gotoItem returns false', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 'mockId',
			itemsById: {
				mockId: { id: 'mockId', flags: {} }
			}
		})

		expect(Dispatcher.trigger).not.toHaveBeenCalled()
		eventCallbacks['nav:goto']({ value: { id: 'mockId' } })
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('nav:goto does nothing if payload is undefined', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 'mockId',
			itemsById: {
				mockId: { id: 'mockId', flags: {} }
			}
		})

		expect(Dispatcher.trigger).not.toHaveBeenCalled()
		eventCallbacks['nav:goto']()
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('nav:goto does nothing if payload.value is undefined', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 'mockId',
			itemsById: {
				mockId: { id: 'mockId', flags: {} }
			}
		})

		expect(Dispatcher.trigger).not.toHaveBeenCalled()
		eventCallbacks['nav:goto']({})
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('nav:goto still changes page when locked if ignoreLock is not provided', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 'mockId',
			navTargetHistory: [],
			itemsById: {
				mockId: { id: 'mockId', flags: {} }
			},
			locked: true
		})

		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)

		// go
		eventCallbacks['nav:goto']({ value: { id: 'mockId' } })
		expect(NavStore.gotoItem).toHaveBeenCalledTimes(1)
		expect(NavStore.gotoItem).toHaveBeenCalledWith({ flags: {}, id: 'mockId' })
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('nav:goto still changes page when locked if ignoreLock is true', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 'mockId',
			navTargetHistory: [],
			itemsById: {
				mockId: { id: 'mockId', flags: {} }
			},
			locked: true
		})

		const spy = jest.spyOn(NavStore, 'gotoItem')
		NavStore.gotoItem.mockReturnValueOnce(true)

		// go
		eventCallbacks['nav:goto']({ value: { id: 'mockId', ignoreLock: true } })
		expect(NavStore.gotoItem).toHaveBeenCalledTimes(1)
		expect(NavStore.gotoItem).toHaveBeenCalledWith({ flags: {}, id: 'mockId' })
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('nav:goto does not change page when locked if ignoreLock is false', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 'mockId',
			itemsById: {
				mockId: { id: 'mockId', flags: {} }
			},
			locked: true
		})

		const spy = jest.spyOn(NavStore, 'gotoItem')

		// go
		eventCallbacks['nav:goto']({ value: { id: 'mockId', ignoreLock: false } })
		expect(NavStore.gotoItem).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('nav:lock event fires and updates state', () => {
		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: 'unchanged',
			draftId: 'mockDraftId'
		})

		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:lock']()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:unlock event fires and updates state', () => {
		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: 'unchanged',
			draftId: 'mockDraftId'
		})
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:unlock']()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:close event fires and updates state', () => {
		jest.useFakeTimers()
		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: 'unchanged',
			draftId: 'mockDraftId'
		})
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:close']()
		jest.runOnlyPendingTimers()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:close twice only fires one event', () => {
		jest.useFakeTimers()
		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: 'unchanged',
			draftId: 'mockDraftId'
		})
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:close']()
		eventCallbacks['nav:close']()
		jest.runOnlyPendingTimers()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0][0]).toBe('navstore:change')
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0][0]).toHaveProperty('action', 'nav:close')
		expect(NavStore.getState()).toHaveProperty('open', false)
	})

	test('calling the same nav state twice with delay only fires one event', () => {
		jest.useFakeTimers()
		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: 'unchanged',
			draftId: 'mockDraftId'
		})
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:close']()
		jest.runOnlyPendingTimers()

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0][0]).toHaveProperty('action', 'nav:close')
		expect(NavStore.getState()).toHaveProperty('open', false)

		eventCallbacks['nav:close']()
		jest.runOnlyPendingTimers()

		// no change
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(NavStore.getState()).toHaveProperty('open', false)
	})

	test('nav:close followed by nav:toggle doesnt call open', () => {
		jest.useFakeTimers()
		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: 'unchanged',
			draftId: 'mockDraftId'
		})
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:close']()
		eventCallbacks['nav:toggle']()
		jest.runOnlyPendingTimers()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0][0]).toBe('navstore:change')
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0][0]).toHaveProperty('action', 'nav:close')
		expect(NavStore.getState()).toHaveProperty('open', false)
	})

	test('nav:close followed by nav:toggle with delay DOES call open', () => {
		jest.useFakeTimers()
		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: 'unchanged',
			draftId: 'mockDraftId'
		})
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:close']()
		jest.runOnlyPendingTimers()

		eventCallbacks['nav:toggle']()
		jest.runOnlyPendingTimers()

		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(2)
		expect(ViewerAPI.postEvent.mock.calls[0][0]).toHaveProperty('action', 'nav:close')
		expect(ViewerAPI.postEvent.mock.calls[1][0]).toHaveProperty('action', 'nav:open')
		expect(NavStore.getState()).toHaveProperty('open', true)
	})

	test('nav:open event fires and updates state', () => {
		jest.useFakeTimers()
		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: 'unchanged',
			draftId: 'mockDraftId'
		})
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:open']()
		jest.runOnlyPendingTimers()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:close event fires and updates state', () => {
		jest.useFakeTimers()

		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: 'open',
			draftId: 'mockDraftId'
		})
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:close']()
		jest.runOnlyPendingTimers()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:toggle event fires and updates state', () => {
		jest.useFakeTimers()
		NavStore.setState({
			isInitialized: true,
			locked: 'unchanged',
			open: false,
			draftId: 'mockDraftId'
		})
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:toggle']()
		jest.runOnlyPendingTimers()
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(ViewerAPI.postEvent).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.postEvent.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:openExternalLink fires event and opens a window', () => {
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:openExternalLink']({ value: { url: 'mockUrl' } })
		expect(window.open).toHaveBeenCalledTimes(1)
		expect(window.open).toHaveBeenCalledWith('mockUrl')
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
	})

	test('nav:showChildren event fires and updates state', () => {
		NavStore.setState({ isInitialized: true, itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:showChildren']({ value: { id: 'mockID' } })
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('nav:hideChildren event fires and updates state', () => {
		NavStore.setState({ isInitialized: true, itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['nav:hideChildren']({ value: { id: 'mockID' } })
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('question:scoreSet sets flag with a score of 100', () => {
		NavStore.setState({ isInitialized: true, itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['question:scoreSet']({ value: { id: 'mockID', score: 0 } })
		expect(NavUtil.setFlag).toHaveBeenCalledTimes(1)
		expect(NavUtil.setFlag.mock.calls[0]).toMatchSnapshot()
	})

	test('question:scoreSet does not set flag if question not found', () => {
		NavStore.setState({ isInitialized: true, itemsById: {} })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['question:scoreSet']({ value: { id: 'mockID', score: 0 } })
		expect(NavUtil.setFlag).not.toHaveBeenCalled()
		expect(NavUtil.setFlag.mock.calls[0]).toMatchSnapshot()
	})

	test('question:scoreSet sets flag with a score of 100', () => {
		NavStore.setState({ isInitialized: true, itemsById: { mockID: { showChildren: 'unchanged' } } })
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		// go
		eventCallbacks['question:scoreSet']({
			value: { id: 'mockID', score: 100 }
		})
		expect(NavUtil.setFlag).toHaveBeenCalledTimes(1)
		expect(NavUtil.setFlag.mock.calls[0]).toMatchSnapshot()
	})

	test('init builds state with basic options', () => {
		NavStore.init('mockDraftId', null, 12, '', 11)
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('init builds state locked state', () => {
		NavStore.init('mockDraftId', null, 12, '', 11, { 'nav:isLocked': { value: true } })
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('init builds state open state', () => {
		NavStore.init('mockDraftId', null, 12, '', 11, { 'nav:isOpen': { value: true } })
		expect(NavStore.getState()).toMatchSnapshot()
	})

	test('init builds and goes to starting path', () => {
		NavStore.init('mockDraftId', null, 12, 'startingpath', 11)
		expect(NavUtil.gotoPath).toHaveBeenCalledWith('startingpath')
	})

	test('init builds and goes to starting id', () => {
		NavStore.init('mockDraftId', null, 12, 'startingpath', 11)
		expect(NavUtil.goto).toHaveBeenCalledWith(12)
	})

	test('init builds and goes to first with no starting id', () => {
		NavUtil.getFirst.mockReturnValueOnce({ id: 'mockFirstId' })
		NavStore.init('mockDraftId', null, null, 'startingpath', 11)
		expect(NavUtil.goto).toHaveBeenCalledWith('mockFirstId')
	})

	test('init builds with no first', () => {
		NavUtil.getFirst.mockReturnValueOnce(undefined) //eslint-disable-line
		NavStore.init('mockDraftId', null, null, 'startingpath', 11)
		expect(NavUtil.goto).not.toHaveBeenCalledWith()
	})

	test('buildMenu should reset menu items', () => {
		const spy = jest.spyOn(NavStore, 'generateNav')
		NavStore.generateNav.mockImplementationOnce(model => model)

		const before = NavStore.getState()
		NavStore.buildMenu('mockModel')
		const after = NavStore.getState()

		expect(after).toMatchSnapshot()

		// the before and after objects should'nt be ===
		expect(after.itemsById).not.toBe(before.itemsById)
		expect(after.itemsByPath).not.toBe(before.itemsByPath)
		expect(after.itemsByFullPath).not.toBe(before.itemsByFullPath)

		spy.mockRestore()
	})

	test('gotoItem with null returns false', () => {
		expect(NavStore.gotoItem(null)).toBe(false)
	})

	test('gotoItem with null target returns true', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: null
		})
		NavUtil.getNavTargetModel.mockReturnValueOnce({
			processTrigger: jest.fn()
		})
		expect(NavStore.gotoItem({ id: 'mockId' })).toBe(true)
	})

	test('gotoItem doest do anything when already on that item', () => {
		NavStore.setState({
			isInitialized: true,
			navTargetId: 'mockId'
		})
		expect(NavStore.gotoItem({ id: 'mockId' })).toBe(false)
	})

	test('gotoItem sends triggers events and updates history', () => {
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		NavStore.setState({
			isInitialized: true,
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
		NavUtil.getNavTargetModel.mockReturnValueOnce(oldNavItem)
		NavUtil.getNavTargetModel.mockReturnValueOnce(newNavItem)

		expect(NavStore.gotoItem(newNavItem)).toBe(true)
		const after = NavStore.getState()
		expect(after).toMatchSnapshot()
		expect(FocusUtil.clearFadeEffect).toHaveBeenCalledTimes(1)
		expect(oldNavItem.processTrigger).toHaveBeenCalledWith('onNavExit')
		expect(newNavItem.processTrigger).toHaveBeenCalledWith('onNavEnter')
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(2)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('nav:targetChanged', {
			value: {
				from: 'mockId',
				to: 'newItem'
			}
		})
	})

	test('gotoItem sends updates history with no previous item', () => {
		// simulate trigger
		Dispatcher.trigger.mockReturnValueOnce()

		NavStore.setState({
			isInitialized: true,
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
		NavUtil.getNavTargetModel.mockReturnValueOnce(null) // no previous item
		NavUtil.getNavTargetModel.mockReturnValueOnce(newNavItem)

		expect(NavStore.gotoItem(newNavItem)).toBe(true)
		const after = NavStore.getState()
		expect(after).toMatchSnapshot()
		expect(FocusUtil.clearFadeEffect).toHaveBeenCalledTimes(1)
		expect(newNavItem.processTrigger).toHaveBeenCalledWith('onNavEnter')
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(2)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('navstore:change')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('nav:targetChanged', {
			value: {
				from: 'mockId',
				to: 'newItem'
			}
		})
	})

	test('generateNav with no model returns empty object', () => {
		expect(NavStore.generateNav()).toEqual({})
	})

	test('generateNav with no navItem returns default object', () => {
		NavStore.setState({
			isInitialized: true,
			itemsById: {}
		})

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

		const spy = jest.spyOn(Common.Registry, 'getItemForType')
		Common.Registry.getItemForType.mockReturnValueOnce({ getNavItem: null })

		expect(NavStore.generateNav(model)).toEqual({
			children: [],
			flags: { complete: false, correct: false },
			parent: null,
			fullPath: [],
			id: 'testId',
			label: '',
			path: '',
			showChildren: true,
			showChildrenOnNavigation: true,
			sourceModel: model,
			type: 'hidden'
		})

		spy.mockRestore()
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
		const spy = jest.spyOn(Common.Registry, 'getItemForType')
		Common.Registry.getItemForType.mockReturnValueOnce(item)
		Common.Registry.getItemForType.mockReturnValueOnce(childItem)

		NavStore.setState({
			isInitialized: true,
			itemsByPath: {},
			itemsByFullPath: {},
			itemsById: {},
			visitId: 'visitId'
		})
		expect(NavStore.generateNav(model)).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()

		spy.mockRestore()
	})

	test('gotoStartingTarget calls NavUtil.gotoPath for a pending path', () => {
		NavStore.setState({
			isInitialized: true,
			itemsById: {}
		})

		expect(NavUtil.gotoPath).not.toHaveBeenCalled()
		expect(NavUtil.goto).not.toHaveBeenCalled()

		NavStore.pendingTarget = {
			type: 'path',
			target: 'mockPendingTarget'
		}
		NavStore.gotoStartingTarget('mockId', 'mockPath')

		expect(NavUtil.gotoPath).toHaveBeenCalledWith('mockPendingTarget')
		expect(NavUtil.gotoPath).toHaveBeenCalledTimes(1)
		expect(NavUtil.goto).toHaveBeenCalledTimes(0)
		expect(NavStore.pendingTarget).toBe(null)
	})

	test('gotoStartingTarget calls NavUtil.goto for a pending goto', () => {
		NavStore.setState({
			isInitialized: true,
			itemsById: {}
		})

		expect(NavUtil.gotoPath).not.toHaveBeenCalled()
		expect(NavUtil.goto).not.toHaveBeenCalled()

		NavStore.pendingTarget = {
			type: 'goto',
			target: 'mockPendingTarget'
		}
		NavStore.gotoStartingTarget('mockId', 'mockPath')

		expect(NavUtil.goto).toHaveBeenCalledWith('mockPendingTarget')
		expect(NavUtil.goto).toHaveBeenCalledTimes(1)
		expect(NavUtil.gotoPath).toHaveBeenCalledTimes(0)
		expect(NavStore.pendingTarget).toBe(null)
	})

	test('gotoStartingTarget calls gotoPath for the starting path, does nothing else if no startingId and no first target exists', () => {
		NavStore.setState({
			isInitialized: true,
			itemsById: {}
		})
		NavUtil.getFirst = () => null

		expect(NavUtil.gotoPath).not.toHaveBeenCalled()
		expect(NavUtil.goto).not.toHaveBeenCalled()

		NavStore.gotoStartingTarget(null, 'mockPath')

		expect(NavUtil.gotoPath).toHaveBeenCalledWith('mockPath')
		expect(NavUtil.gotoPath).toHaveBeenCalledTimes(1)
		expect(NavUtil.goto).toHaveBeenCalledTimes(0)
	})

	test('gotoStartingTarget calls gotoPath for the starting path, then calls goto if given a starting id', () => {
		NavStore.setState({
			isInitialized: true,
			itemsById: {}
		})
		NavUtil.getFirst = () => null

		expect(NavUtil.gotoPath).not.toHaveBeenCalled()
		expect(NavUtil.goto).not.toHaveBeenCalled()

		NavStore.gotoStartingTarget('mockId', 'mockPath')

		expect(NavUtil.gotoPath).toHaveBeenCalledWith('mockPath')
		expect(NavUtil.gotoPath).toHaveBeenCalledTimes(1)
		expect(NavUtil.goto).toHaveBeenCalledWith('mockId')
		expect(NavUtil.goto).toHaveBeenCalledTimes(1)
	})

	test('gotoStartingTarget calls gotoPath for the starting path, then calls goto if no starting id BUT a first target exists', () => {
		NavStore.setState({
			isInitialized: true,
			itemsById: {}
		})
		NavUtil.getFirst = () => ({ id: 'mockFirstTargetId' })

		expect(NavUtil.gotoPath).not.toHaveBeenCalled()
		expect(NavUtil.goto).not.toHaveBeenCalled()

		NavStore.gotoStartingTarget(null, 'mockPath')

		expect(NavUtil.gotoPath).toHaveBeenCalledWith('mockPath')
		expect(NavUtil.gotoPath).toHaveBeenCalledTimes(1)
		expect(NavUtil.goto).toHaveBeenCalledWith('mockFirstTargetId')
		expect(NavUtil.goto).toHaveBeenCalledTimes(1)
	})
})
