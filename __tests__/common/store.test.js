import { Store } from '../../src/scripts/common/store'
// import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

// jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
// 	return {
// 		trigger: jest.fn(),
// 		on: jest.fn(),
// 		off: jest.fn()
// 	}
// })

describe('Store', () => {
	beforeEach(() => {
		Store.init()
	})

	test('registers a model', done => {
		Store.registerModel('type')

		Store.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('type')).toEqual({})

			done()
		})
	})

	test('registers calls init', done => {
		let init = jest.fn()
		Store.registerModel('type', { init: init })

		Store.getItems(items => {
			expect(init).toHaveBeenCalled()

			done()
		})
	})

	test('registers default', done => {
		let init = jest.fn()
		Store.registerModel('chunk', { type: 'chunk', default: false, __testValue: 1 })
		Store.registerModel('chunk-default', { type: 'chunk', default: true, __testValue: 2 })
		Store.registerModel('page', { type: 'page', default: false, __testValue: 3 })
		Store.registerModel('page-default', { type: 'page', default: true, __testValue: 4 })

		Store.getItems(items => {
			expect(Store.getDefaultItemForModelType('chunk').__testValue).toBe(2)
			expect(Store.getDefaultItemForModelType('page').__testValue).toBe(4)

			done()
		})
	})

	test('gets item by type', done => {
		let init = jest.fn()
		Store.registerModel('chunk', { type: 'chunk', default: false, __testValue: 1 })
		Store.registerModel('chunk-default', { type: 'chunk', default: true, __testValue: 2 })
		Store.registerModel('page', { type: 'page', default: false, __testValue: 3 })
		Store.registerModel('page-default', { type: 'page', default: true, __testValue: 4 })

		Store.getItems(items => {
			expect(Store.getItemForType('chunk').__testValue).toBe(1)
			expect(Store.getItemForType('chunk-default').__testValue).toBe(2)
			expect(Store.getItemForType('page').__testValue).toBe(3)
			expect(Store.getItemForType('page-default').__testValue).toBe(4)

			done()
		})
	})

	test('sets variables and calls variable callback', done => {
		let var1cb = jest.fn()
		let var2cb = jest.fn()

		var2cb.mockImplementation((model, viewerState) => {
			return model + viewerState
		})

		Store.registerModel('type', {
			variables: {
				var1: var1cb,
				var2: var2cb
			}
		})

		Store.getItems(items => {
			let result = Store.getTextForVariable('var2', '__model', '__viewerState')
			expect(var1cb).toHaveBeenCalledTimes(0)
			expect(var2cb).toHaveBeenCalledTimes(1)
			expect(result).toBe('__model__viewerState')

			done()
		})
	})

	test('returns null for variable replacement for an unrecognized variable', done => {
		Store.registerModel('type')

		Store.getItems(items => {
			let result = Store.getTextForVariable('someVar', '__model', '__viewerState')
			expect(result).toBe(null)

			done()
		})
	})

	test('registers toolbar items', () => {
		Store.registerToolbarItem({
			id: 'test',
			a: 1,
			b: 2
		})

		expect(Store.registeredToolbarItems).toEqual({
			separator: {
				id: 'separator',
				type: 'separator'
			},
			test: {
				id: 'test',
				a: 1,
				b: 2
			}
		})
	})

	test('adds toolbar items', () => {
		Store.registerToolbarItem({
			id: 'test',
			a: 1,
			b: 2
		})

		Store.addToolbarItem('test')
		Store.addToolbarItem('separator')
		Store.addToolbarItem('test')

		expect(Store.toolbarItems).toEqual([
			{
				id: 'test',
				a: 1,
				b: 2
			},
			{
				id: 'separator',
				type: 'separator'
			},
			{
				id: 'test',
				a: 1,
				b: 2
			}
		])
	})

	test('loads dependencies', done => {
		document.head.appendChild = jest.fn()

		Store.loadDependency('example.js')
		expect(document.head.appendChild).toHaveBeenCalledTimes(1)

		Store.loadDependency('example.css')
		expect(document.head.appendChild).toHaveBeenCalledTimes(2)

		done()
	})
})
