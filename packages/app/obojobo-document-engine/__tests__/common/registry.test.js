import { Registry } from '../../src/scripts/common/registry'

describe('Registry', () => {
	beforeEach(() => {
		Registry.init()
	})

	test('registerModel registers a model', () => {
		expect.assertions(2)
		Registry.registerModel('type')

		Registry.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('type')).toEqual({})
		})
	})

	test('registerModel registers a model that already exists', () => {
		expect.assertions(2)
		Registry.registerModel('type')
		Registry.registerModel('type')

		Registry.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('type')).toEqual({})
		})
	})

	test('registers calls init', () => {
		expect.assertions(1)
		const init = jest.fn()
		Registry.registerModel('type', { init: init })

		Registry.getItems(() => {
			expect(init).toHaveBeenCalled()
		})
	})

	test('registers default', () => {
		expect.assertions(2)
		Registry.registerModel('chunk', {
			type: 'chunk',
			default: false,
			__testValue: 1
		})
		Registry.registerModel('chunk-default', {
			type: 'chunk',
			default: true,
			__testValue: 2
		})
		Registry.registerModel('page', {
			type: 'page',
			default: false,
			__testValue: 3
		})
		Registry.registerModel('page-default', {
			type: 'page',
			default: true,
			__testValue: 4
		})

		Registry.getItems(() => {
			expect(Registry.getDefaultItemForModelType('chunk').__testValue).toBe(2)
			expect(Registry.getDefaultItemForModelType('page').__testValue).toBe(4)
		})
	})

	test('gets item by type', () => {
		expect.assertions(4)
		Registry.registerModel('chunk', {
			type: 'chunk',
			default: false,
			__testValue: 1
		})
		Registry.registerModel('chunk-default', {
			type: 'chunk',
			default: true,
			__testValue: 2
		})
		Registry.registerModel('page', {
			type: 'page',
			default: false,
			__testValue: 3
		})
		Registry.registerModel('page-default', {
			type: 'page',
			default: true,
			__testValue: 4
		})

		Registry.getItems(() => {
			expect(Registry.getItemForType('chunk').__testValue).toBe(1)
			expect(Registry.getItemForType('chunk-default').__testValue).toBe(2)
			expect(Registry.getItemForType('page').__testValue).toBe(3)
			expect(Registry.getItemForType('page-default').__testValue).toBe(4)
		})
	})

	test('sets variables and calls variable callback', () => {
		expect.assertions(3)
		const var1cb = jest.fn()
		const var2cb = jest.fn()

		var2cb.mockImplementation((model, viewerState) => {
			return model + viewerState
		})

		Registry.registerModel('type', {
			variables: {
				var1: var1cb,
				var2: var2cb
			}
		})

		Registry.getItems(() => {
			const result = Registry.getTextForVariable('var2', '__model', '__viewerState')
			expect(var1cb).toHaveBeenCalledTimes(0)
			expect(var2cb).toHaveBeenCalledTimes(1)
			expect(result).toBe('__model__viewerState')
		})
	})

	test('returns null for variable replacement for an unrecognized variable', () => {
		expect.assertions(1)
		Registry.registerModel('type')

		Registry.getItems(() => {
			const result = Registry.getTextForVariable('someVar', '__model', '__viewerState')
			expect(result).toBe(null)
		})
	})

	test('registers toolbar items', () => {
		Registry.registerToolbarItem({
			id: 'test',
			a: 1,
			b: 2
		})

		expect(Registry.registeredToolbarItems).toEqual({
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
		Registry.registerToolbarItem({
			id: 'test',
			a: 1,
			b: 2
		})

		Registry.addToolbarItem('test')
		Registry.addToolbarItem('separator')
		Registry.addToolbarItem('test')

		expect(Registry.toolbarItems).toEqual([
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

		Registry.loadDependency('example.js', callback)
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

		Registry.loadDependency('example.css', () => {
			// make sure appendChild was already called
			expect(document.head.appendChild).toHaveBeenCalledTimes(1)
		})
	})

	test('loads dependencies', () => {
		expect.assertions(1)
		document.head.appendChild = jest.fn()

		Registry.loadDependency('example.js')
		Registry.loadDependency('example.css')

		expect(document.head.appendChild).toHaveBeenCalledTimes(2)
	})
})
