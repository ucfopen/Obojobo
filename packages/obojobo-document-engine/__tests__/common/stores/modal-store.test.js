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
		jest.spyOn(ModalStore, '_show')

		Dispatcher.trigger('modal:show', { value: 'mockValue' })

		expect(ModalStore._show).toHaveBeenCalledWith('mockValue')
	})
})
