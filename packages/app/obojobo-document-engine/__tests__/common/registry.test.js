import { Registry } from '../../src/scripts/common/registry'

describe('Registry', () => {
	beforeEach(() => {
		Registry.init()
	})

	test('registerModel registers a model', () => {
		expect.assertions(2)
		Registry.registerModel('mockType')

		Registry.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('mockType')).toMatchInlineSnapshot(`
			Object {
			  "cloneBlankNode": [Function],
			  "commandHandler": null,
			  "componentClass": null,
			  "default": false,
			  "getPasteNode": [Function],
			  "icon": null,
			  "init": [Function],
			  "insertItem": null,
			  "isInsertable": false,
			  "name": "",
			  "oboToSlate": null,
			  "plugins": null,
			  "slateToObo": null,
			  "supportsChildren": false,
			  "switchType": Object {},
			  "templateObject": "",
			  "type": null,
			  "variables": Object {},
			}
		`)
		})
	})

	test('registerModel registers a model that already exists', () => {
		expect.assertions(2)
		Registry.registerModel('mockType')
		Registry.registerModel('mockType')

		Registry.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('mockType')).toMatchInlineSnapshot(`
			Object {
			  "cloneBlankNode": [Function],
			  "commandHandler": null,
			  "componentClass": null,
			  "default": false,
			  "getPasteNode": [Function],
			  "icon": null,
			  "init": [Function],
			  "insertItem": null,
			  "isInsertable": false,
			  "name": "",
			  "oboToSlate": null,
			  "plugins": null,
			  "slateToObo": null,
			  "supportsChildren": false,
			  "switchType": Object {},
			  "templateObject": "",
			  "type": null,
			  "variables": Object {},
			}
		`)
		})
	})

	test('registerModel cloneBlankNode really does clone the template', () => {
		expect.hasAssertions()

		const insertJSON = { mockProperty: {} }
		Registry.registerModel('mockType', { insertJSON })

		Registry.getItems(items => {
			const item = items.get('mockType')
			const clone = item.cloneBlankNode()

			// expect the objects to look the same
			expect(clone.mockProperty).toEqual(insertJSON.mockProperty)

			// but not reference the same object
			expect(clone.mockProperty).not.toBe(insertJSON.mockProperty)
		})
	})

	test('registerEditorModel registers a model', () => {
		expect.hasAssertions()
		Registry.registerEditorModel({
			name: 'mockType',
			menuLabel: 'mockLabel',
			icon: 'mockIcon',
			isInsertable: true,
			json: {
				emptyNode: 'mockjson'
			},
			helpers: {
				slateToObo: 'mockSlateToObo',
				oboToSlate: 'mockOboToSlate'
			},
			plugins: 'mockPlugins',
			getNavItem: 'mockGetNavItem',
			supportsChildren: true,
			ignore: true
		})

		Registry.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('mockType')).toMatchInlineSnapshot(`
			Object {
			  "cloneBlankNode": [Function],
			  "commandHandler": null,
			  "componentClass": null,
			  "default": false,
			  "getNavItem": "mockGetNavItem",
			  "getPasteNode": undefined,
			  "icon": "mockIcon",
			  "ignore": true,
			  "init": [Function],
			  "insertItem": null,
			  "insertJSON": "mockjson",
			  "isInsertable": true,
			  "name": "mockLabel",
			  "oboToSlate": "mockOboToSlate",
			  "plugins": "mockPlugins",
			  "slateToObo": "mockSlateToObo",
			  "supportsChildren": true,
			  "switchType": Object {},
			  "templateObject": "",
			  "type": null,
			  "variables": Object {},
			}
		`)
		})
	})

	test('registerEditorModel registers a model with no json', () => {
		expect.hasAssertions()
		Registry.registerEditorModel({
			name: 'mockType',
			menuLabel: 'mockLabel',
			icon: 'mockIcon',
			isInsertable: true,
			helpers: {
				slateToObo: 'mockSlateToObo',
				oboToSlate: 'mockOboToSlate'
			},
			plugins: 'mockPlugins',
			getNavItem: 'mockGetNavItem',
			supportsChildren: true,
			ignore: true
		})

		Registry.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('mockType')).toMatchInlineSnapshot(`
			Object {
			  "cloneBlankNode": [Function],
			  "commandHandler": null,
			  "componentClass": null,
			  "default": false,
			  "getNavItem": "mockGetNavItem",
			  "getPasteNode": undefined,
			  "icon": "mockIcon",
			  "ignore": true,
			  "init": [Function],
			  "insertItem": null,
			  "insertJSON": undefined,
			  "isInsertable": true,
			  "name": "mockLabel",
			  "oboToSlate": "mockOboToSlate",
			  "plugins": "mockPlugins",
			  "slateToObo": "mockSlateToObo",
			  "supportsChildren": true,
			  "switchType": Object {},
			  "templateObject": "",
			  "type": null,
			  "variables": Object {},
			}
		`)
		})
	})

	test('registerEditorModel registers a model with helpers', () => {
		expect.hasAssertions()
		Registry.registerEditorModel({
			name: 'mockType',
			menuLabel: 'mockLabel',
			icon: 'mockIcon',
			isInsertable: true,
			plugins: 'mockPlugins',
			getNavItem: 'mockGetNavItem',
			supportsChildren: true,
			ignore: true
		})

		Registry.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('mockType')).toMatchInlineSnapshot(`
			Object {
			  "cloneBlankNode": [Function],
			  "commandHandler": null,
			  "componentClass": null,
			  "default": false,
			  "getNavItem": "mockGetNavItem",
			  "getPasteNode": undefined,
			  "icon": "mockIcon",
			  "ignore": true,
			  "init": [Function],
			  "insertItem": null,
			  "insertJSON": undefined,
			  "isInsertable": true,
			  "name": "mockLabel",
			  "oboToSlate": undefined,
			  "plugins": "mockPlugins",
			  "slateToObo": undefined,
			  "supportsChildren": true,
			  "switchType": Object {},
			  "templateObject": "",
			  "type": null,
			  "variables": Object {},
			}
		`)
		})
	})

	test('registerEditorModel registers a model with no supportsChildren', () => {
		expect.hasAssertions()
		Registry.registerEditorModel({
			name: 'mockType',
			menuLabel: 'mockLabel',
			icon: 'mockIcon',
			isInsertable: true,
			plugins: 'mockPlugins',
			getNavItem: 'mockGetNavItem',
			ignore: true
		})

		Registry.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('mockType')).toMatchInlineSnapshot(`
			Object {
			  "cloneBlankNode": [Function],
			  "commandHandler": null,
			  "componentClass": null,
			  "default": false,
			  "getNavItem": "mockGetNavItem",
			  "getPasteNode": undefined,
			  "icon": "mockIcon",
			  "ignore": true,
			  "init": [Function],
			  "insertItem": null,
			  "insertJSON": undefined,
			  "isInsertable": true,
			  "name": "mockLabel",
			  "oboToSlate": undefined,
			  "plugins": "mockPlugins",
			  "slateToObo": undefined,
			  "supportsChildren": false,
			  "switchType": Object {},
			  "templateObject": "",
			  "type": null,
			  "variables": Object {},
			}
		`)
		})
	})

	test('registerEditorModel registers a model with no ignore', () => {
		expect.hasAssertions()
		Registry.registerEditorModel({
			name: 'mockType',
			menuLabel: 'mockLabel',
			icon: 'mockIcon',
			isInsertable: true,
			plugins: 'mockPlugins',
			getNavItem: 'mockGetNavItem'
		})

		Registry.getItems(items => {
			expect(items.size).toBe(1)
			expect(items.get('mockType')).toMatchInlineSnapshot(`
			Object {
			  "cloneBlankNode": [Function],
			  "commandHandler": null,
			  "componentClass": null,
			  "default": false,
			  "getNavItem": "mockGetNavItem",
			  "getPasteNode": undefined,
			  "icon": "mockIcon",
			  "ignore": false,
			  "init": [Function],
			  "insertItem": null,
			  "insertJSON": undefined,
			  "isInsertable": true,
			  "name": "mockLabel",
			  "oboToSlate": undefined,
			  "plugins": "mockPlugins",
			  "slateToObo": undefined,
			  "supportsChildren": false,
			  "switchType": Object {},
			  "templateObject": "",
			  "type": null,
			  "variables": Object {},
			}
		`)
		})
	})

	test('registers calls init', () => {
		expect.assertions(1)
		const init = jest.fn()
		Registry.registerModel('mockType', { init: init })

		Registry.getItems(() => {
			expect(init).toHaveBeenCalled()
		})
	})

	test('registers calls getPasteNode', () => {
		Registry.registerModel('mockType')

		const inputNode = { nockKey: 'mockValue' }
		const node = Registry.getItemForType('mockType').getPasteNode(inputNode)

		expect(node).toEqual(inputNode)
	})

	test('registers default', () => {
		expect.assertions(3)
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
			expect(Registry.getDefaultItemForModelType('non-existant')).toBe(null)
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

	test('insertableItems processes the items the first time its called', () => {
		Registry.registerModel('insertable', {
			type: 'chunk',
			default: false,
			__testValue: 1,
			isInsertable: true
		})
		expect(Registry.insertableItems.length).toEqual(1)

		Registry.registerModel('insertable', {
			type: 'chunk',
			default: false,
			__testValue: 1,
			isInsertable: true
		})

		expect(Registry.insertableItems.length).toEqual(1)
	})
})
