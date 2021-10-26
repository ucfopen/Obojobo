jest.mock('../../../src/scripts/common/models/obo-model')
jest.mock('../../../src/scripts/common/page/focus')
jest.mock('../../../src/scripts/common/flux/dispatcher')

describe('FocusStore', () => {
	let FocusStore
	let Dispatcher

	beforeEach(() => {
		jest.resetAllMocks()
		jest.resetModules()
		Dispatcher = require('../../../src/scripts/common/flux/dispatcher').default
		FocusStore = require('../../../src/scripts/viewer/stores/focus-store').default
		FocusStore.init()
		FocusStore.triggerChange = jest.fn()
	})

	test('constructor adds event listeners for the focus events', () => {
		FocusStore.constructor()

		expect(Dispatcher.on).toHaveBeenCalledWith('focus:navTarget', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:navigation', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:component', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('focus:clearFadeEffect', expect.any(Function))
	})

	test('Expect focus event handlers to call internal methods', () => {
		expect(Dispatcher.on.mock.calls[4][0]).toBe('focus:component')
		const focusComponentHandler = Dispatcher.on.mock.calls[4][1]

		const focusComponentSpy = jest.spyOn(FocusStore, '_focusComponent')

		focusComponentHandler({
			value: {
				id: 'mock-id',
				animateScroll: false,
				fade: true,
				preventScroll: false
			}
		})
		expect(focusComponentSpy).toHaveBeenCalledWith('mock-id', false, true, false)

		focusComponentSpy.mockRestore()
	})

	test('should init state with a specific structure and return it', () => {
		expect(FocusStore.getState()).toEqual({
			target: null,
			type: null,
			visualFocusTarget: null,
			animateScroll: false,
			preventScroll: false
		})
	})

	test('updateFocusTarget sets state properties', () => {
		FocusStore._updateFocusTarget('type', 'target', false, false)
		expect(FocusStore.getState()).toEqual({
			target: 'target',
			type: 'type',
			visualFocusTarget: null,
			animateScroll: false,
			preventScroll: false
		})

		FocusStore._updateFocusTarget('type', 'target', true, true)
		expect(FocusStore.getState()).toEqual({
			target: 'target',
			type: 'type',
			visualFocusTarget: null,
			animateScroll: true,
			preventScroll: true
		})
	})

	test('fade property updates visualFocusTarget', () => {
		FocusStore._focusComponent('mock-id', false, true, false)
		expect(FocusStore.getState()).toEqual({
			target: 'mock-id',
			type: 'component',
			visualFocusTarget: 'mock-id',
			animateScroll: false,
			preventScroll: false
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
		FocusStore._focusComponent('mock-id', true, false, false)
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(
			FocusStore.TYPE_COMPONENT,
			'mock-id',
			true,
			false
		)
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
	})

	test('focusComponent updates focus target, triggers change and updates visualFocusTarget if fade=true', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		FocusStore._focusComponent('mock-id', true, true, true)
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(
			FocusStore.TYPE_COMPONENT,
			'mock-id',
			true,
			true
		)
		expect(FocusStore.getState().visualFocusTarget).toBe('mock-id')
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		updateFocusTargetSpy.mockRestore()
	})

	test('focusComponent defaults to animateScroll=false, fade=false, preventScroll=false', () => {
		const updateFocusTargetSpy = jest.spyOn(FocusStore, '_updateFocusTarget')
		FocusStore._focusComponent('mock-id')
		expect(updateFocusTargetSpy).toHaveBeenCalledWith(
			FocusStore.TYPE_COMPONENT,
			'mock-id',
			false,
			false
		)
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
