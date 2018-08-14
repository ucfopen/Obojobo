/* eslint no-undefined: 0 */

// Common
jest.mock('../../../src/scripts/common/index', () => ({
	models: {
		OboModel: {
			models: {}
		}
	},
	flux: {
		Dispatcher: {
			trigger: jest.fn()
		}
	}
}))

const Common = require('../../../src/scripts/common/index')
const NavUtil = require('../../../src/scripts/viewer/util/nav-util').default

const buildComplexNestedState = () => {
	const mockItem4 = {
		id: 4,
		type: 'link'
	}

	const mockItem3 = {
		id: 3,
		type: 'notHidden'
	}

	const mockItem2 = {
		id: 2,
		type: 'hidden',
		showChildren: true,
		children: [mockItem3]
	}

	const mockItem1 = {
		id: 1,
		type: 'link',
		showChildren: true,
		children: [mockItem2, mockItem4]
	}

	return {
		navTargetId: 4,
		itemsById: {
			1: mockItem1,
			2: mockItem2,
			3: mockItem3,
			4: mockItem4
		},
		items: mockItem1
	}
}

describe('NavUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		Common.flux.Dispatcher.trigger.mockReturnValue('mockTriggerReturn')
		Common.models.OboModel.models = {}
	})

	test('rebuildMenu', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.rebuildMenu('mockModel')
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:rebuildMenu', {
			value: { model: 'mockModel' }
		})
		expect(x).toBe('mockTriggerReturn')
	})

	test('gotoPath', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.gotoPath('mockPath')
		const expectedValue = { value: { path: 'mockPath' } }
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:gotoPath', expectedValue)
		expect(x).toBe('mockTriggerReturn')
	})

	test('setFlag', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.setFlag('mockId', 'mockFlagName', 'mockFlagValue')
		const expectedValue = {
			value: {
				id: 'mockId',
				flagName: 'mockFlagName',
				flagValue: 'mockFlagValue'
			}
		}
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:setFlag', expectedValue)
		expect(x).toBe('mockTriggerReturn')
	})

	test('goPrev', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.goPrev()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:prev')
		expect(x).toBe('mockTriggerReturn')
	})

	test('goNext', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.goNext()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:next')
		expect(x).toBe('mockTriggerReturn')
	})

	test('goto', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.goto('mockId')
		const expectedValue = {
			value: {
				id: 'mockId'
			}
		}
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:goto', expectedValue)
		expect(x).toBe('mockTriggerReturn')
	})

	test('lock', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.lock()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:lock')
		expect(x).toBe('mockTriggerReturn')
	})

	test('unlock', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.unlock()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:unlock')
		expect(x).toBe('mockTriggerReturn')
	})

	test('close', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.close()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:close')
		expect(x).toBe('mockTriggerReturn')
	})

	test('open', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.open()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:open')
		expect(x).toBe('mockTriggerReturn')
	})

	test('toggle', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.toggle()
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:toggle')
		expect(x).toBe('mockTriggerReturn')
	})

	test('openExternalLink', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.openExternalLink('mockUrl')
		const expectedValue = {
			value: {
				url: 'mockUrl'
			}
		}
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith(
			'nav:openExternalLink',
			expectedValue
		)
		expect(x).toBe('mockTriggerReturn')
	})

	test('showChildren', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.showChildren('mockId')
		const expectedValue = {
			value: {
				id: 'mockId'
			}
		}
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:showChildren', expectedValue)
		expect(x).toBe('mockTriggerReturn')
	})

	test('hideChildren', () => {
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
		const x = NavUtil.hideChildren('mockId')
		const expectedValue = {
			value: {
				id: 'mockId'
			}
		}
		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:hideChildren', expectedValue)
		expect(x).toBe('mockTriggerReturn')
	})

	test('getNavTarget', () => {
		const mockState = {
			navTargetId: 'mockId',
			itemsById: {
				mockId: 'mockItem'
			}
		}
		const x = NavUtil.getNavTarget(mockState)
		expect(x).toBe('mockItem')
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getNavTargetModel returns OboModel reference', () => {
		const mockState = {
			navTargetId: 'mockId',
			itemsById: {
				mockId: {
					id: 'mockItemId'
				}
			}
		}

		Common.models.OboModel.models.mockItemId = 'mockModel'
		const x = NavUtil.getNavTargetModel(mockState)
		expect(x).toBe('mockModel')
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getNavTargetModel returns null when navTarget has no OboModel', () => {
		const mockState = {
			navTargetId: 'mockId',
			itemsById: {
				mockId: {
					id: 'mockItemId'
				}
			}
		}

		const x = NavUtil.getNavTargetModel(mockState)
		expect(x).toBe(null)
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getNavTargetModel returns null with no navTarget', () => {
		const mockState = {
			navTargetId: 'mockId',
			itemsById: {}
		}

		Common.models.OboModel.models.mockItemId = 'mockModel'
		const x = NavUtil.getNavTargetModel(mockState)
		expect(x).toBe(null)
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getFirst finds the first link in items', () => {
		const mockState = buildComplexNestedState()

		const x = NavUtil.getFirst(mockState)
		expect(x).toBe(mockState.itemsById[1])

		// change the first item to make it not a link, we should find the next link item
		mockState.itemsById[1].type = 'not-a-link'
		const y = NavUtil.getFirst(mockState)
		expect(y).toBe(mockState.itemsById[4])

		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getFirst returns null with no links', () => {
		const mockState = buildComplexNestedState()
		mockState.itemsById[1].type = 'not-a-link'
		mockState.itemsById[4].type = 'not-a-link'

		const x = NavUtil.getFirst(mockState)
		expect(x).toBeNull()
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getPrev', () => {
		const mockState = buildComplexNestedState()

		// current navtarget is 4
		// the next link that is 'previous' is mockItem1
		const x = NavUtil.getPrev(mockState)
		expect(x).toBe(mockState.itemsById[1])
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getPrev returns null when theres no previous link', () => {
		const mockState = buildComplexNestedState()
		mockState.itemsById[1].type = 'not-a-link'
		// current navtarget is 4
		// the next link that is 'previous' is mockItem1
		const x = NavUtil.getPrev(mockState)
		expect(x).toBeNull()
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getPrev returns null when the current target isnt valid', () => {
		const mockState = buildComplexNestedState()
		mockState.navTargetId = 99
		// current navtarget is 4
		// the next link that is 'previous' is mockItem1
		const x = NavUtil.getPrev(mockState)
		expect(x).toBeNull()
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getNext', () => {
		const mockState = buildComplexNestedState()
		mockState.navTargetId = 1

		const x = NavUtil.getNext(mockState)
		expect(x).toBe(mockState.itemsById[4])

		mockState.navTargetId = 4
		const y = NavUtil.getNext(mockState)
		expect(y).toBeNull()

		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getNext returns null when the current target isnt valid', () => {
		const mockState = buildComplexNestedState()
		mockState.navTargetId = 99
		// current navtarget is 4
		// the next link that is 'previous' is mockItem1
		const x = NavUtil.getNext(mockState)
		expect(x).toBeNull()
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getPrevModel', () => {
		const mockState = buildComplexNestedState()

		const x = NavUtil.getPrevModel(mockState)
		expect(x).toBe(undefined)
	})

	test('getPrevModel returns null when not found', () => {
		const mockState = buildComplexNestedState()
		mockState.navTargetId = 99

		const x = NavUtil.getPrevModel(mockState)
		expect(x).toBe(null)
	})

	test('getNextModel', () => {
		const mockState = buildComplexNestedState()
		mockState.navTargetId = 1

		const x = NavUtil.getNextModel(mockState)
		expect(x).toBe(undefined)
	})

	test('getNextModel returns null when not found', () => {
		const mockState = buildComplexNestedState()
		mockState.navTargetId = 99

		const x = NavUtil.getNextModel(mockState)
		expect(x).toBe(null)
	})

	test('getNavItemForModel', () => {
		const state = {
			itemsById: {
				testId: 'mockItem'
			}
		}
		const model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		const item = NavUtil.getNavItemForModel(state, model)

		expect(item).toEqual('mockItem')
	})

	test('getNavItemForModel returns null', () => {
		const state = {
			itemsById: {}
		}
		const model = {
			get: jest.fn()
		}

		const item = NavUtil.getNavItemForModel(state, model)

		expect(item).toEqual(null)
	})

	test('getNavLabelForModel', () => {
		const state = {
			itemsById: {
				testId: { label: 'mockLabel' }
			}
		}
		const model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		const item = NavUtil.getNavLabelForModel(state, model)

		expect(item).toEqual('mockLabel')
	})

	test('getNavLabelForModel returns null', () => {
		const state = {
			itemsById: jest.fn().mockReturnValueOnce(undefined)
		}
		const model = {
			get: jest.fn()
		}

		const item = NavUtil.getNavLabelForModel(state, model)

		expect(item).toEqual(null)
	})

	test('canNavigate', () => {
		const mockState = {
			locked: true
		}
		expect(NavUtil.canNavigate(mockState)).toBe(false)

		mockState.locked = false
		expect(NavUtil.canNavigate(mockState)).toBe(true)

		delete mockState.locked
		expect(NavUtil.canNavigate(mockState)).toBe(true)
	})

	test('getOrderedList returns item when not hidden', () => {
		const mockState = {
			items: {
				type: 'notHidden'
			}
		}

		Common.models.OboModel.models.mockItemId = 'mockModel'
		const x = NavUtil.getOrderedList(mockState)
		expect(x).toEqual([{ type: 'notHidden' }])
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getOrderedList returns empty array when hidden', () => {
		const mockState = {
			items: {
				type: 'hidden'
			}
		}

		Common.models.OboModel.models.mockItemId = 'mockModel'
		const x = NavUtil.getOrderedList(mockState)
		expect(x).toEqual([])
		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getOrderedList returns nested children in order and obeys hidden flags', () => {
		const mockState = buildComplexNestedState()

		Common.models.OboModel.models.mockItemId = 'mockModel'
		const x = NavUtil.getOrderedList(mockState)

		// returns expected objects in a depth first order
		expect(x).toHaveLength(3)
		expect(x[0]).toHaveProperty('id', 1)
		expect(x[1]).toHaveProperty('id', 3)
		expect(x[2]).toHaveProperty('id', 4)

		expect(Common.flux.Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('getOrderedList returns assessment item', () => {
		const assessmentModel = {
			get: jest.fn().mockReturnValueOnce('ObojoboDraft.Sections.Assessment')
		}
		const assessmentItem = {
			id: 'mockAssessment',
			flags: {},
			type: 'none',
			showChildren: false
		}

		Common.models.OboModel.models.mockAssessment = assessmentModel
		const list = NavUtil.getOrderedList({ items: assessmentItem })

		expect(list).toHaveLength(1)
		expect(list[0]).toHaveProperty('id', 'mockAssessment')
		expect(list[0]).toHaveProperty('flags', { assessment: true })
	})

	test('setContext calls Dispatcher.trigger', () => {
		NavUtil.setContext('mockContext')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('nav:setContext', {
			value: { context: 'mockContext' }
		})
	})
})
