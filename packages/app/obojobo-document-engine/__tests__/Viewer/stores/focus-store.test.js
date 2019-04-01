jest.mock('../../../src/scripts/common/models/obo-model')

import FocusStore from '../../../src/scripts/viewer/stores/focus-store'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../src/scripts/common/page/focus')
jest.mock('../../../src/scripts/common/flux/dispatcher')

describe('FocusStore', () => {
	beforeEach(() => {
		FocusStore.init()
		FocusStore.triggerChange = jest.fn()

		jest.resetAllMocks()
	})

	test('constructor adds event listeners for the focus events', () => {
		FocusStore.constructor()

		expect(Dispatcher.on).toHaveBeenCalledWith('focus:navTarget', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:navigation', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:component', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:clearFadeEffect', expect.any(Function))
	})

	test('Expect focus event handlers to call internal methods', () => {
		FocusStore.constructor()

		const focusComponentHandler = Dispatcher.on.mock.calls[2][1]

		const focusComponentSpy = jest.spyOn(FocusStore, '_focusComponent')

		focusComponentHandler({ value: { id: 'mock-id', fade: true, animateScroll: false } })
		expect(focusComponentSpy).toHaveBeenCalledWith('mock-id', false, true)

		focusComponentSpy.mockRestore()
	})

	test('should init state with a specific structure and return it', () => {
		expect(FocusStore.getState()).toEqual({
			target: null,
			type: null,
			visualFocusTarget: null,
			animateScroll: false
		})
	})

	test('updateFocusTarget sets state properties', () => {
		FocusStore._updateFocusTarget('type', 'target', false)
		expect(FocusStore.getState()).toEqual({
			target: 'target',
			type: 'type',
			visualFocusTarget: null,
			animateScroll: false
		})

		FocusStore._updateFocusTarget('type', 'target', true)
		expect(FocusStore.getState()).toEqual({
			target: 'target',
			type: 'type',
			visualFocusTarget: null,
			animateScroll: true
		})
	})

	test('fade property updates visualFocusTarget', () => {
		FocusStore._focusComponent('mock-id', false, true)
		expect(FocusStore.getState()).toEqual({
			target: 'mock-id',
			type: 'component',
			visualFocusTarget: 'mock-id',
			animateScroll: false
		})
	})

	test('focusOnNavTarget updates focus target and triggers change', () => {
		const spy = jest.spyOn(FocusStore, '_updateFocusTarget')
		FocusStore._focusOnNavTarget()
		expect(spy).toHaveBeenCalledWith(FocusStore.TYPE_NAV_TARGET)
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('focusComponent updates focus target and triggers change', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		FocusStore._focusComponent('mock-id', true, false)
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_COMPONENT, 'mock-id', true)
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
	})

	test('focusComponent updates focus target, triggers change and updates visualFocusTarget if fade=true', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		FocusStore._focusComponent('mock-id', true, true)
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_COMPONENT, 'mock-id', true)
		expect(FocusStore.getState().visualFocusTarget).toBe('mock-id')
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
	})

	test('focusComponent defaults to animateScroll=false, fade=false', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		FocusStore._focusComponent('mock-id')
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_COMPONENT, 'mock-id', false)
		expect(FocusStore.getState().visualFocusTarget).toBe(null)
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
	})

	test('focusOnNavigation updates focus target and triggers change', () => {
		const spy = jest.spyOn(FocusStore, '_updateFocusTarget')
		FocusStore._focusOnNavigation()
		expect(spy).toHaveBeenCalledWith(FocusStore.TYPE_VIEWER, FocusStore.VIEWER_TARGET_NAVIGATION)
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('clearFadeEffect resets the visualFocusTarget and triggers change', () => {
		FocusStore.state.visualFocusTarget = 'some-value'
		FocusStore._clearFadeEffect()
		expect(FocusStore.getState().visualFocusTarget).toEqual(null)
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)
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
