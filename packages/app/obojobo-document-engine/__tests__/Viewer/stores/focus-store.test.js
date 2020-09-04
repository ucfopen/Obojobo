jest.mock('../../../src/scripts/common/models/obo-model')
jest.mock('../../../src/scripts/common/page/focus')

import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import FocusStore from '../../../src/scripts/viewer/stores/focus-store'

describe('FocusStore', () => {
	let FocusStoreClass

	beforeEach(() => {
		// Remove any added dispatcher events and create a brand new FocusStore instance
		// since the imported FocusStore is actually a class instance!
		Dispatcher.off()
		FocusStoreClass = FocusStore.constructor
	})

	test('constructor adds event listeners for the focus events', () => {
		const dispatcherSpy = jest.spyOn(Dispatcher, 'on').mockImplementation(jest.fn())

		FocusStore.constructor()

		expect(dispatcherSpy).toHaveBeenCalledWith('focus:navTarget', expect.any(Function))
		expect(dispatcherSpy).toHaveBeenCalledWith('focus:navigation', expect.any(Function))
		expect(dispatcherSpy).toHaveBeenCalledWith('focus:component', expect.any(Function))
		expect(dispatcherSpy).toHaveBeenCalledWith('focus:clearFadeEffect', expect.any(Function))

		dispatcherSpy.mockRestore()
	})

	test('Expect focus event handlers to call internal methods', () => {
		const spy1 = jest
			.spyOn(FocusStoreClass.prototype, '_focusOnNavTarget')
			.mockImplementation(jest.fn())
		const spy2 = jest
			.spyOn(FocusStoreClass.prototype, '_focusOnNavigation')
			.mockImplementation(jest.fn())
		const spy3 = jest
			.spyOn(FocusStoreClass.prototype, '_focusComponent')
			.mockImplementation(jest.fn())
		const spy4 = jest
			.spyOn(FocusStoreClass.prototype, '_clearFadeEffect')
			.mockImplementation(jest.fn())

		//eslint-disable-next-line no-unused-vars
		const focusStore = new FocusStoreClass()

		Dispatcher.trigger('focus:navTarget')
		Dispatcher.trigger('focus:navigation')
		Dispatcher.trigger('focus:component', {
			value: {
				id: 'mock-id',
				scroll: 'mock-scroll',
				animateScroll: 'mock-animate-scroll',
				fade: 'mock-fade',
				region: 'mock-region'
			}
		})
		Dispatcher.trigger('focus:clearFadeEffect')

		expect(spy1).toHaveBeenCalledWith()
		expect(spy2).toHaveBeenCalledWith()
		expect(spy3).toHaveBeenCalledWith(
			'mock-id',
			'mock-scroll',
			'mock-animate-scroll',
			'mock-fade',
			'mock-region'
		)
		expect(spy4).toHaveBeenCalledWith()

		spy1.mockRestore()
		spy2.mockRestore()
		spy3.mockRestore()
		spy4.mockRestore()
	})

	test('init sets initial state', () => {
		const focusStore = new FocusStoreClass()

		focusStore.init()

		expect(focusStore.state).toEqual({
			target: null,
			type: null,
			scroll: true,
			animateScroll: false,
			visualFocusTarget: null
		})
	})

	test('_updateFocusTarget sets state properties', () => {
		const focusStore = new FocusStoreClass()

		focusStore.init()
		focusStore._updateFocusTarget('mock-type', 'mock-target', true, true, 'mock-region')

		expect(focusStore.state).toEqual({
			type: 'mock-type',
			target: 'mock-target',
			scroll: true,
			animateScroll: true,
			region: 'mock-region',
			visualFocusTarget: null
		})
	})

	test('_updateFocusTarget sets scroll and animateScroll to true even when a string', () => {
		const focusStore = new FocusStoreClass()

		focusStore.init()
		focusStore._updateFocusTarget('mock-type', 'mock-target', 'true', 'tRuE', 'mock-region')

		expect(focusStore.state).toEqual({
			type: 'mock-type',
			target: 'mock-target',
			scroll: true,
			animateScroll: true,
			region: 'mock-region',
			visualFocusTarget: null
		})
	})

	test('_focusOnNavTarget updates focus target and triggers change', () => {
		const updateFocusTargetSpy = jest
			.spyOn(FocusStoreClass.prototype, '_updateFocusTarget')
			.mockImplementation(jest.fn())
		const triggerChangeSpy = jest
			.spyOn(FocusStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		const focusStore = new FocusStoreClass()

		focusStore.init()
		focusStore._focusOnNavTarget()

		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_NAV_TARGET)
		expect(triggerChangeSpy).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		triggerChangeSpy.mockRestore()
	})

	test('_focusComponent updates the focus target (with default values), sets visualFocusTarget and triggers change', () => {
		const updateFocusTargetSpy = jest
			.spyOn(FocusStoreClass.prototype, '_updateFocusTarget')
			.mockImplementation(jest.fn())
		const triggerChangeSpy = jest
			.spyOn(FocusStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		const focusStore = new FocusStoreClass()

		focusStore.init()
		focusStore._focusComponent('mock-id')

		expect(focusStore.state.visualFocusTarget).toEqual(null)
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(
			FocusStore.TYPE_COMPONENT,
			'mock-id',
			true,
			false,
			null
		)
		expect(triggerChangeSpy).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		triggerChangeSpy.mockRestore()
	})

	test('_focusComponent updates the focus target (with custom values), sets visualFocusTarget and triggers change', () => {
		const updateFocusTargetSpy = jest
			.spyOn(FocusStoreClass.prototype, '_updateFocusTarget')
			.mockImplementation(jest.fn())
		const triggerChangeSpy = jest
			.spyOn(FocusStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		const focusStore = new FocusStoreClass()

		focusStore.init()
		focusStore._focusComponent('mock-id', false, true, true, 'mock-region')

		expect(focusStore.state.visualFocusTarget).toEqual('mock-id')
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(
			FocusStore.TYPE_COMPONENT,
			'mock-id',
			false,
			true,
			'mock-region'
		)
		expect(triggerChangeSpy).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		triggerChangeSpy.mockRestore()
	})

	test('_focusOnNavigation updates the focus target and triggers change', () => {
		const updateFocusTargetSpy = jest
			.spyOn(FocusStoreClass.prototype, '_updateFocusTarget')
			.mockImplementation(jest.fn())
		const triggerChangeSpy = jest
			.spyOn(FocusStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		const focusStore = new FocusStoreClass()

		focusStore.init()
		focusStore._focusOnNavigation()

		expect(updateFocusTargetSpy).toHaveBeenCalledWith(
			FocusStore.TYPE_VIEWER,
			FocusStore.VIEWER_TARGET_NAVIGATION
		)
		expect(triggerChangeSpy).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		triggerChangeSpy.mockRestore()
	})

	test('clearFadeEffect resets the visualFocusTarget and triggers change', () => {
		const triggerChangeSpy = jest
			.spyOn(FocusStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		const focusStore = new FocusStoreClass()

		focusStore.init()
		focusStore.state.visualFocusTarget = 'mock-focus-target'
		focusStore._clearFadeEffect()

		expect(focusStore.state.visualFocusTarget).toBe(null)
		expect(triggerChangeSpy).toHaveBeenCalledTimes(1)

		triggerChangeSpy.mockRestore()
	})

	test('getState returns state', () => {
		const mockState = {}
		FocusStore.state = mockState
		expect(FocusStore.getState()).toBe(mockState)
	})

	test('setStates sets the state', () => {
		const mockState = {}
		FocusStore.setState(mockState)
		expect(FocusStore.state).toBe(mockState)
	})
})
