import ModalStore from '../../../src/scripts/common/stores/modal-store'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

describe('ModalStore', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.useFakeTimers()

		ModalStore.init()
		ModalStore.triggerChange = jest.fn()
	})

	test('should init state with a specific structure and return it', () => {
		expect(ModalStore.getState()).toEqual({
			modals: []
		})
	})

	test('show will update state and trigger change', () => {
		ModalStore._show({ component: 'example' })

		expect(ModalStore.getState()).toEqual({
			modals: [{ component: 'example' }]
		})
		expect(ModalStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('hide will update state and trigger change', () => {
		ModalStore._show({ component: 'example' })
		ModalStore._hide()

		expect(ModalStore.getState()).toEqual({
			modals: []
		})
		expect(ModalStore.triggerChange).toHaveBeenCalledTimes(2)
	})

	test('setState saves the provided state', () => {
		const state = { a: 1, b: 2 }
		ModalStore.setState(state)

		expect(ModalStore.getState()).toEqual(state)
	})

	test('modal:show calls ModalStore._show', () => {
		const spy = jest.spyOn(ModalStore, '_show')

		Dispatcher.trigger('modal:show', { value: 'mockValue' })

		expect(ModalStore._show).toHaveBeenCalledWith('mockValue')

		spy.mockRestore()
	})

	test('_show stores document.activeElement, _hide calls focus on stored activeElement', () => {
		const mockEl = {
			focus: jest.fn()
		}

		// Mock document.activeElement:
		const origActiveElement = document.activeElement
		Object.defineProperty(document, 'activeElement', {
			value: mockEl,
			enumerable: true,
			configurable: true
		})

		// Mock body.contains
		const origBodyContains = document.body.contains
		document.body.contains = jest.fn()
		document.body.contains.mockReturnValueOnce(true)

		ModalStore._show({ component: 'example' })

		expect(ModalStore.lastActiveElement).toBe(mockEl)

		ModalStore._hide()

		expect(ModalStore.lastActiveElement).not.toBeDefined()
		expect(mockEl.focus).toHaveBeenCalledTimes(1)

		// Restore overrides:
		Object.defineProperty(document, 'activeElement', {
			value: origActiveElement
		})
		document.body.contains = origBodyContains
	})

	test('_hide does not call focus on stored activeElement if element cannot be found', () => {
		const mockEl = {
			focus: jest.fn()
		}

		// Mock document.activeElement:
		const origActiveElement = document.activeElement
		Object.defineProperty(document, 'activeElement', {
			value: mockEl,
			enumerable: true,
			configurable: true
		})

		// Mock body.contains
		const origBodyContains = document.body.contains
		document.body.contains = jest.fn()
		document.body.contains.mockReturnValueOnce(false)

		ModalStore._show({ component: 'example' })

		expect(ModalStore.lastActiveElement).toBe(mockEl)

		ModalStore._hide()

		expect(ModalStore.lastActiveElement).not.toBeDefined()
		expect(mockEl.focus).not.toHaveBeenCalled()

		// Restore overrides:
		Object.defineProperty(document, 'activeElement', {
			value: origActiveElement
		})
		document.body.contains = origBodyContains
	})
})
