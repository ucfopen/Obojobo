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
		let store = new Store('store-name')

		expect(store.name).toBe('store-name')
	})

	test('init resets state', () => {
		let store = new Store('store-name')

		store.init()
		store.state = { a: 1 }
		store.init()

		expect(store.state).toEqual({})
	})

	test('triggerChange dispatched a change event', () => {
		let store = new Store('store-name')

		store.triggerChange()

		expect(Dispatcher.trigger).toHaveBeenCalledWith('store-name:change')
	})

	test('onChange listens for change event', () => {
		let store = new Store('store-name')
		let cb = new Function()

		store.onChange(cb)

		expect(Dispatcher.on).toHaveBeenCalledWith('store-name:change', cb)
	})

	test('offChange stops listening for change event', () => {
		let store = new Store('store-name')
		let cb = new Function()

		store.offChange(cb)

		expect(Dispatcher.off).toHaveBeenCalledWith('store-name:change', cb)
	})

	test('setAndTrigger updates state and triggers a change', () => {
		let store = new Store('store-name')
		store.init()

		store.setAndTrigger({ a: 1, b: 2 })

		expect(store.state).toEqual({ a: 1, b: 2 })
		expect(Dispatcher.trigger).toHaveBeenCalledWith('store-name:change')
	})

	test('getState returns a copy of state', () => {
		let store = new Store('store-name')
		let state = { a: 1, b: 2 }

		store.init()
		store.state = state

		expect(store.getState()).not.toBe(state)
		expect(store.getState()).toEqual(state)
	})

	test('setState sets a copy of the given state', () => {
		let store = new Store('store-name')
		let state = { a: 1, b: 2 }

		store.init()
		store.setState(state)

		expect(store.state).not.toBe(state)
		expect(store.state).toEqual(state)
	})

	test('updateStateByContext sets states', () => {
		let store = new Store('store-name')
		let state = { a: {}, b: {} }

		store.init()
		store.setState(state)
		store.updateStateByContext({ a: 1, b: 2 }, 'mockContext')

		expect(store.state).toEqual({ a: { mockContext: 1 }, b: { mockContext: 2 } })
	})

	test('updateStateByContext sets states that dont exist', () => {
		let store = new Store('store-name')

		store.init()
		store.updateStateByContext({ a: 1, b: 2 }, 'mockContext')

		expect(store.state).toEqual({ a: { mockContext: 1 }, b: { mockContext: 2 } })
	})
})
