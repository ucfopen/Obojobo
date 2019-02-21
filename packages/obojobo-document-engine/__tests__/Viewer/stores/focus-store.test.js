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

		expect(Dispatcher.on).toHaveBeenCalledWith('focus:navTargetContent', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:content', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:navigation', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:component', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:clearVisualFocus', expect.any(Function))
	})

	test('Expect focus event handlers to call internal methods', () => {
		FocusStore.constructor()

		const focusContentHandler = Dispatcher.on.mock.calls[1][1]
		const focusComponentHandler = Dispatcher.on.mock.calls[3][1]

		const focusOnContentSpy = jest.spyOn(FocusStore, '_focusOnContent')
		const focusComponentSpy = jest.spyOn(FocusStore, '_focusComponent')

		focusContentHandler({ value: { id: 'mock-id', isVisuallyFocused: 'mock-visually' } })
		expect(focusOnContentSpy).toHaveBeenCalledWith('mock-id', 'mock-visually')

		focusComponentHandler({ value: { id: 'mock-id', isVisuallyFocused: 'mock-visually' } })
		expect(focusComponentSpy).toHaveBeenCalledWith('mock-id', 'mock-visually')

		focusOnContentSpy.mockRestore()
		focusComponentSpy.mockRestore()
	})

	test('should init state with a specific structure and return it', () => {
		expect(FocusStore.getState()).toEqual({
			target: null,
			type: null,
			visualFocusTarget: null
		})
	})

	test('updateFocusTarget sets state properties', () => {
		FocusStore._updateFocusTarget('type', 'target')
		expect(FocusStore.getState()).toEqual({
			target: 'target',
			type: 'type',
			visualFocusTarget: null
		})
	})

	test('updateVisualFocus sets state.visualFocusTarget', () => {
		FocusStore._updateVisualFocus('visual-focus-target')
		expect(FocusStore.getState()).toEqual({
			target: null,
			type: null,
			visualFocusTarget: 'visual-focus-target'
		})
	})

	test('focusOnNavTargetContent updates focus target and triggers change', () => {
		const spy = jest.spyOn(FocusStore, '_updateFocusTarget')
		FocusStore._focusOnNavTargetContent()
		expect(spy).toHaveBeenCalledWith(FocusStore.TYPE_NAV_TARGET_CONTENT)
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('focusOnContent updates focus target and triggers change', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		const updateVisualFocusSpy = jest.spyOn(FocusStore, '_updateVisualFocus')
		FocusStore._focusOnContent('mock-id', false)
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_CONTENT, 'mock-id')
		expect(updateVisualFocusSpy).not.toHaveBeenCalled()
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		updateVisualFocusSpy.mockRestore()
	})

	test('focusOnContent updates focus target and triggers change (and updates visual focus if second argument is true', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		const updateVisualFocusSpy = jest.spyOn(FocusStore, '_updateVisualFocus')
		FocusStore._focusOnContent('mock-id', true)
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_CONTENT, 'mock-id')
		expect(updateVisualFocusSpy).toHaveBeenCalledWith('mock-id')
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		updateVisualFocusSpy.mockRestore()
	})

	test('focusOnContent defaults to second argument as true (isVisuallyFocused)', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		const updateVisualFocusSpy = jest.spyOn(FocusStore, '_updateVisualFocus')
		FocusStore._focusOnContent('mock-id')
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_CONTENT, 'mock-id')
		expect(updateVisualFocusSpy).toHaveBeenCalledWith('mock-id')
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		updateVisualFocusSpy.mockRestore()
	})

	test('focusComponent updates focus target and triggers change', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		const updateVisualFocusSpy = jest.spyOn(FocusStore, '_updateVisualFocus')
		FocusStore._focusComponent('mock-id', false)
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_COMPONENT, 'mock-id')
		expect(updateVisualFocusSpy).not.toHaveBeenCalled()
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		updateVisualFocusSpy.mockRestore()
	})

	test('focusComponent updates focus target and triggers change (and updates visual focus if second argument is true', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		const updateVisualFocusSpy = jest.spyOn(FocusStore, '_updateVisualFocus')
		FocusStore._focusComponent('mock-id', true)
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_COMPONENT, 'mock-id')
		expect(updateVisualFocusSpy).toHaveBeenCalledWith('mock-id')
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		updateVisualFocusSpy.mockRestore()
	})

	test('focusComponent defaults to second arugment as true (isVisuallyFocused)', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		const updateVisualFocusSpy = jest.spyOn(FocusStore, '_updateVisualFocus')
		FocusStore._focusComponent('mock-id')
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(FocusStore.TYPE_COMPONENT, 'mock-id')
		expect(updateVisualFocusSpy).toHaveBeenCalledWith('mock-id')
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
		updateVisualFocusSpy.mockRestore()
	})

	test('focusOnNavigation updates focus target and triggers change', () => {
		const spy = jest.spyOn(FocusStore, '_updateFocusTarget')
		FocusStore._focusOnNavigation()
		expect(spy).toHaveBeenCalledWith(FocusStore.TYPE_VIEWER, FocusStore.VIEWER_TARGET_NAVIGATION)
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('clearVisualFocus resets the visualFocusTarget and triggers change', () => {
		FocusStore.state.visualFocusTarget = 'some-value'
		FocusStore._clearVisualFocus()
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
