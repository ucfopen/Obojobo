import { Store } from '../../src/scripts/common/store'

describe('Store', () => {
	beforeEach(() => {
		Store.init()
	})

	test('registers a model', () => {
		expect.assertions(2)
		Store.registerModel('type')

		Store.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('type')).toEqual({})
		})
	})

	test('registers calls init', () => {
		expect.assertions(1)
		const init = jest.fn()
		Store.registerModel('type', { init: init })

		Store.getItems(() => {
			expect(init).toHaveBeenCalled()
		})
	})

	test('registers default', () => {
		expect.assertions(2)
		Store.registerModel('chunk', { type: 'chunk', default: false, __testValue: 1 })
		Store.registerModel('chunk-default', { type: 'chunk', default: true, __testValue: 2 })
		Store.registerModel('page', { type: 'page', default: false, __testValue: 3 })
		Store.registerModel('page-default', { type: 'page', default: true, __testValue: 4 })

		Store.getItems(() => {
			expect(Store.getDefaultItemForModelType('chunk').__testValue).toBe(2)
			expect(Store.getDefaultItemForModelType('page').__testValue).toBe(4)
		})
	})

	test('gets item by type', () => {
		expect.assertions(4)
		Store.registerModel('chunk', { type: 'chunk', default: false, __testValue: 1 })
		Store.registerModel('chunk-default', { type: 'chunk', default: true, __testValue: 2 })
		Store.registerModel('page', { type: 'page', default: false, __testValue: 3 })
		Store.registerModel('page-default', { type: 'page', default: true, __testValue: 4 })

		Store.getItems(() => {
			expect(Store.getItemForType('chunk').__testValue).toBe(1)
			expect(Store.getItemForType('chunk-default').__testValue).toBe(2)
			expect(Store.getItemForType('page').__testValue).toBe(3)
			expect(Store.getItemForType('page-default').__testValue).toBe(4)
		})
	})

	test('sets variables and calls variable callback', () => {
		expect.assertions(3)
		const var1cb = jest.fn()
		const var2cb = jest.fn()

		var2cb.mockImplementation((model, viewerState) => {
			return model + viewerState
		})

		Store.registerModel('type', {
			variables: {
				var1: var1cb,
				var2: var2cb
			}
		})

		Store.getItems(() => {
			const result = Store.getTextForVariable('var2', '__model', '__viewerState')
			expect(var1cb).toHaveBeenCalledTimes(0)
			expect(var2cb).toHaveBeenCalledTimes(1)
			expect(result).toBe('__model__viewerState')
		})
	})

	test('returns null for variable replacement for an unrecognized variable', () => {
		expect.assertions(1)
		Store.registerModel('type')

		Store.getItems(() => {
			const result = Store.getTextForVariable('someVar', '__model', '__viewerState')
			expect(result).toBe(null)
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

	test('loads dependencies registered onload callback for javascript', () => {
		expect.assertions(2)
		document.head.appendChild = jest.fn()
		const callback = {}

		Store.loadDependency('example.js', callback)
		expect(document.head.appendChild).toHaveBeenCalledTimes(1)
		expect(document.head.appendChild).toHaveBeenCalledWith(
			expect.objectContaining({
				onload: callback
			})
		)
	})

	test('loads dependencies executes callback after appendchild for css', () => {
		expect.assertions(1)
		document.head.appendChild = jest.fn()

		Store.loadDependency('example.css', () => {
			// make sure appendChild was already called
			expect(document.head.appendChild).toHaveBeenCalledTimes(1)
		})
	})

	test('loads dependencies', () => {
		expect.assertions(1)
		document.head.appendChild = jest.fn()

		Store.loadDependency('example.js')
		Store.loadDependency('example.css')

		expect(document.head.appendChild).toHaveBeenCalledTimes(2)
	})
})
