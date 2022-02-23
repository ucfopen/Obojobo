jest.mock('../../common/models/obo-model')
jest.mock('../../common/page/focus')

import Dispatcher from '../../common/flux/dispatcher'
import FocusStore from './focus-store'

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
		expect(dispatcherSpy).toHaveBeenCalledWith('focus:clear', expect.any(Function))

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
		const spy5 = jest.spyOn(FocusStoreClass.prototype, '_clear').mockImplementation(jest.fn())

		//eslint-disable-next-line no-unused-vars
		const focusStore = new FocusStoreClass()

		Dispatcher.trigger('focus:navTarget')
		Dispatcher.trigger('focus:navigation')
		Dispatcher.trigger('focus:component', {
			value: {
				id: 'mock-id',
				animateScroll: 'mock-animate-scroll',
				preventScroll: 'mock-prevent-scroll',
				fade: 'mock-fade',
				region: 'mock-region'
			}
		})
		Dispatcher.trigger('focus:clearFadeEffect')
		Dispatcher.trigger('focus:clear')

		expect(spy1).toHaveBeenCalledWith()
		expect(spy2).toHaveBeenCalledWith()
		expect(spy3).toHaveBeenCalledWith(
			'mock-id',
			'mock-animate-scroll',
			'mock-fade',
			'mock-prevent-scroll',
			'mock-region'
		)
		expect(spy4).toHaveBeenCalledWith()
		expect(spy5).toHaveBeenCalledWith()

		spy1.mockRestore()
		spy2.mockRestore()
		spy3.mockRestore()
		spy4.mockRestore()
		spy5.mockRestore()
	})

	test('init sets initial state', () => {
		const focusStore = new FocusStoreClass()

		focusStore.init()

		expect(focusStore.state).toEqual({
			target: null,
			type: null,
			visualFocusTarget: null,
			animateScroll: false,
			preventScroll: false
		})
	})

	test('updateFocusTarget sets state properties', () => {
		const focusStore = new FocusStoreClass()
		focusStore.init()

		focusStore._updateFocusTarget('mock-type', 'mock-target', true, true, 'mock-region')
		expect(focusStore.getState()).toEqual({
			target: 'mock-target',
			type: 'mock-type',
			visualFocusTarget: null,
			animateScroll: true,
			preventScroll: true,
			region: 'mock-region'
		})

		focusStore._updateFocusTarget('mock-type', 'mock-target', false, false, 'mock-region')
		expect(focusStore.getState()).toEqual({
			target: 'mock-target',
			type: 'mock-type',
			visualFocusTarget: null,
			animateScroll: false,
			preventScroll: false,
			region: 'mock-region'
		})

		focusStore._updateFocusTarget('mock-type', 'mock-target', 'tRUe', 0, 'mock-region')
		expect(focusStore.getState()).toEqual({
			target: 'mock-target',
			type: 'mock-type',
			visualFocusTarget: null,
			animateScroll: true,
			preventScroll: false,
			region: 'mock-region'
		})

		focusStore._updateFocusTarget('mock-type', 'mock-target', 'TruE', 1, 'mock-region')
		expect(focusStore.getState()).toEqual({
			target: 'mock-target',
			type: 'mock-type',
			visualFocusTarget: null,
			animateScroll: true,
			preventScroll: true,
			region: 'mock-region'
		})

		focusStore._updateFocusTarget('mock-type')
		expect(focusStore.getState()).toEqual({
			target: null,
			type: 'mock-type',
			visualFocusTarget: null,
			animateScroll: false,
			preventScroll: false,
			region: null
		})
	})

	test('_focusComponent(fade = true) updates visualFocusTarget', () => {
		const focusStore = new FocusStoreClass()
		focusStore.init()

		focusStore._focusComponent('mock-id', null, true, null)

		expect(focusStore.getState().visualFocusTarget).toBe('mock-id')
	})

	test('_focusComponent(fade = false) does NOT update visualFocusTarget', () => {
		const focusStore = new FocusStoreClass()
		focusStore.init()

		focusStore._focusComponent('mock-id', null, false, null)

		expect(focusStore.getState().visualFocusTarget).toBe(null)
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
		expect(focusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		triggerChangeSpy.mockRestore()
	})

	test('_focusComponent updates focus target and triggers change', () => {
		const updateFocusTargetSpy = jest
			.spyOn(FocusStoreClass.prototype, '_updateFocusTarget')
			.mockImplementation(jest.fn())
		const triggerChangeSpy = jest
			.spyOn(FocusStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		const focusStore = new FocusStoreClass()

		focusStore.init()
		focusStore._focusComponent(
			'mock-id',
			'mock-animate-scroll',
			'mock-fade',
			'mock-prevent-scroll',
			'mock-region'
		)

		expect(updateFocusTargetSpy).toHaveBeenCalledWith(
			FocusStore.TYPE_COMPONENT,
			'mock-id',
			'mock-animate-scroll',
			'mock-prevent-scroll',
			'mock-region'
		)
		expect(focusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		triggerChangeSpy.mockRestore()
	})

	test('_focusComponent defaults to animateScroll=false, fade=false, preventScroll=false, region=null', () => {
		const focusStore = new FocusStoreClass()
		focusStore.init()
		focusStore._focusComponent('mock-id')

		expect(focusStore.getState()).toEqual({
			target: 'mock-id',
			type: FocusStore.TYPE_COMPONENT,
			animateScroll: false,
			visualFocusTarget: null,
			preventScroll: false,
			region: null
		})
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

	test('_clear inits state (except for visualFocusTarget) and triggers a change', () => {
		const triggerChangeSpy = jest
			.spyOn(FocusStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		const focusStore = new FocusStoreClass()

		focusStore.state = {
			visualFocusTarget: 'mock-focus-target',
			otherValues: 'mock-other-values'
		}
		focusStore._clear()

		expect(triggerChangeSpy).toHaveBeenCalledTimes(1)
		expect(focusStore.state).toEqual({
			target: null,
			type: null,
			animateScroll: false,
			visualFocusTarget: 'mock-focus-target',
			preventScroll: false
		})

		triggerChangeSpy.mockRestore()
	})

	test('_clear does nothing if there is nothing to clear', () => {
		const triggerChangeSpy = jest
			.spyOn(FocusStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		const focusStore = new FocusStoreClass()
		focusStore.state = { type: null }

		focusStore._clear()

		expect(triggerChangeSpy).toHaveBeenCalledTimes(0)

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
