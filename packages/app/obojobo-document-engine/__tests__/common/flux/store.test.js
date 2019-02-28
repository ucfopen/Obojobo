import Store from '../../../src/scripts/common/flux/store'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})

describe('Store', () => {
	test('creates new instance', () => {
		const store = new Store('store-name')

		expect(store.name).toBe('store-name')
	})

	test('init resets state', () => {
		const store = new Store('store-name')

		store.init()
		store.state = { a: 1 }
		store.init()

		expect(store.state).toEqual({})
	})

	test('triggerChange dispatched a change event', () => {
		const store = new Store('store-name')

		store.triggerChange()

		expect(Dispatcher.trigger).toHaveBeenCalledWith('store-name:change')
	})

	test('onChange listens for change event', () => {
		const store = new Store('store-name')
		const cb = () => {}

		store.onChange(cb)

		expect(Dispatcher.on).toHaveBeenCalledWith('store-name:change', cb)
	})

	test('offChange stops listening for change event', () => {
		const store = new Store('store-name')
		const cb = () => {}

		store.offChange(cb)

		expect(Dispatcher.off).toHaveBeenCalledWith('store-name:change', cb)
	})

	test('setAndTrigger updates state and triggers a change', () => {
		const store = new Store('store-name')
		store.init()

		store.setAndTrigger({ a: 1, b: 2 })

		expect(store.state).toEqual({ a: 1, b: 2 })
		expect(Dispatcher.trigger).toHaveBeenCalledWith('store-name:change')
	})

	test('getState returns a copy of state', () => {
		const store = new Store('store-name')
		const state = { a: 1, b: 2 }

		store.init()
		store.state = state

		expect(store.getState()).not.toBe(state)
		expect(store.getState()).toEqual(state)
	})

	test('setState sets a copy of the given state', () => {
		const store = new Store('store-name')
		const state = { a: 1, b: 2 }

		store.init()
		store.setState(state)

		expect(store.state).not.toBe(state)
		expect(store.state).toEqual(state)
	})

	test('updateStateByContext sets states', () => {
		const store = new Store('store-name')
		const state = { a: {}, b: {} }

		store.init()
		store.setState(state)
		store.updateStateByContext({ a: 1, b: 2 }, 'mockContext')

		expect(store.state).toEqual({ a: { mockContext: 1 }, b: { mockContext: 2 } })
	})

	test('updateStateByContext sets states that dont exist', () => {
		const store = new Store('store-name')

		store.init()
		store.updateStateByContext({ a: 1, b: 2 }, 'mockContext')

		expect(store.state).toEqual({ a: { mockContext: 1 }, b: { mockContext: 2 } })
	})
})
