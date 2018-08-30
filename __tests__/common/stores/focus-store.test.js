jest.mock('../../../src/scripts/common/models/obo-model')

import FocusStore from '../../../src/scripts/common/stores/focus-store'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import OboModel from '../../../src/scripts/common/models/obo-model'

describe('FocusStore', () => {
	beforeEach(() => {
		FocusStore.init()
		FocusStore.triggerChange = jest.fn()
	})

	test('should init state with a specific structure and return it', () => {
		expect(FocusStore.getState()).toEqual({
			focussedId: null,
			viewState: 'inactive'
		})
	})

	test('onDocumentFocusIn calls unfocus if element that was focused on is outside the component element', () => {
		const spy = jest.spyOn(FocusStore, '_unfocus')

		const mockContains = jest.fn()
		mockContains.mockReturnValueOnce(false)
		const mockEl = {
			contains: mockContains,
			focus: jest.fn()
		}

		OboModel.models = {
			testId: {
				getDomEl: () => {
					return mockEl
				}
			}
		}

		FocusStore._focus('testId')

		const mockTarget = jest.fn()
		FocusStore.onDocumentFocusIn({
			target: mockTarget
		})

		expect(FocusStore._unfocus).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('onDocumentFocusIn does not call unfocus if element that was focused on is inside the component element', () => {
		const spy = jest.spyOn(FocusStore, '_unfocus')

		const mockContains = jest.fn()
		mockContains.mockReturnValueOnce(true)
		const mockEl = {
			contains: mockContains,
			focus: jest.fn()
		}

		OboModel.models = {
			testId: {
				getDomEl: () => {
					return mockEl
				}
			}
		}

		FocusStore._focus('testId')

		const mockTarget = jest.fn()
		FocusStore.onDocumentFocusIn({
			target: mockTarget
		})

		expect(FocusStore._unfocus).not.toHaveBeenCalled()

		spy.mockRestore()
	})

	test('onDocumentFocusIn calls unfocus if focussedElement cannot be found', () => {
		const spy = jest.spyOn(FocusStore, '_unfocus')

		OboModel.models = {
			testId: {
				getDomEl: () => null
			}
		}

		FocusStore._focus('testId')

		const mockTarget = jest.fn()
		FocusStore.onDocumentFocusIn({
			target: mockTarget
		})

		expect(FocusStore._unfocus).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('onDocumentFocusIn calls unfocus if focussedModel cannot be found', () => {
		const spy = jest.spyOn(FocusStore, '_unfocus')

		OboModel.models = {}

		FocusStore._focus('testId')

		const mockTarget = jest.fn()
		FocusStore.onDocumentFocusIn({
			target: mockTarget
		})

		expect(FocusStore._unfocus).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('focus will update state, call focus on element, trigger change', () => {
		const mockFocus = jest.fn()
		OboModel.models = {
			testId: {
				getDomEl: () => {
					return {
						focus: mockFocus
					}
				}
			}
		}
		FocusStore._focus('testId')

		expect(mockFocus).toHaveBeenCalledTimes(1)
		expect(FocusStore.getState()).toEqual({
			focussedId: 'testId',
			viewState: 'active'
		})
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('focus with isVisuallyFocused = false will NOT update state, call focus on element, trigger change', () => {
		const mockFocus = jest.fn()
		OboModel.models = {
			testId: {
				getDomEl: () => {
					return {
						focus: mockFocus
					}
				}
			}
		}
		FocusStore._focus('testId', false)

		expect(mockFocus).toHaveBeenCalledTimes(1)
		expect(FocusStore.getState()).toEqual({
			focussedId: 'testId',
			viewState: 'inactive'
		})
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('unfocus will update state, trigger change', () => {
		FocusStore.setState({
			focussedId: 'testId',
			viewState: 'active'
		})

		FocusStore._unfocus()

		expect(FocusStore.getState()).toEqual({
			focussedId: null,
			viewState: 'inactive'
		})
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('focus:component calls FocusStore._focus', () => {
		const spy = jest.spyOn(FocusStore, '_focus')

		Dispatcher.trigger('focus:component', { value: { id: 'mockId', isVisuallyFocused: true } })

		expect(FocusStore._focus).toHaveBeenCalledWith('mockId', true)

		spy.mockRestore()
	})
})
