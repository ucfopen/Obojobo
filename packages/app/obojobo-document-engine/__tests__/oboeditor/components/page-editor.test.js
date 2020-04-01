import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import APIUtil from 'src/scripts/viewer/util/api-util'
import PageEditor from 'src/scripts/oboeditor/components/page-editor'
import React from 'react'
import mockConsole from 'jest-mock-console'
import Common from 'src/scripts/common'
import Component from 'src/scripts/oboeditor/components/node/editor'

import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('src/scripts/viewer/util/api-util')
jest.mock('src/scripts/common/util/modal-util')
jest.mock('src/scripts/oboeditor/components/node/editor', () => ({
	helpers: {
		slateToObo: jest.fn(),
		oboToSlate: jest.fn().mockReturnValue({ text: '' })
	}
}))
// Editor Store
jest.mock('src/scripts/oboeditor/stores/editor-store', () => ({
	state: { startingId: 'mock-id' }
}))

jest.mock('src/scripts/oboeditor/components/navigation/editor-nav')
jest.mock('src/scripts/oboeditor/components/toolbars/file-toolbar')
jest.mock('src/scripts/oboeditor/components/toolbars/paragraph-styles')
// jest.mock('src/scripts/oboeditor/components/toolbars/content-toolbar')
//jest.mock('obojobo-document-engine/src/scripts/common/registry')

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
let restoreConsole

describe('PageEditor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()
		restoreConsole = mockConsole('error')
		jest.spyOn(ReactEditor, 'focus').mockReturnValue(true)
		jest.spyOn(Common.Registry, 'getItems').mockImplementation(fn =>
			fn([
				{
					plugins: {
						normalizeNode: jest.fn(),
						isVoid: jest.fn()
					}
				}
			])
		)
	})

	afterEach(() => {
		restoreConsole()
	})

	test('PageEditor component', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
		const component = renderer.create(<PageEditor {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('PageEditor component with decoration', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
		jest.spyOn(Common.Registry, 'getItemForType').mockReturnValue({
			plugins: {
				decorate: () => [
					{
						placeholder: 'Type your label here',
						anchor: { path: [0, 0], offset: 0 },
						focus: { path: [0, 0], offset: 0 }
					}
				]
			}
		})
		const component = mount(<PageEditor {...props} />)
		expect(
			component.instance().decorate([
				{
					type: BREAK_NODE,
					children: [{ text: '' }]
				},
				[0]
			])
		).toMatchSnapshot()
	})

	test('PageEditor component with Elements', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
		jest.spyOn(Common.Registry, 'getItemForType').mockReturnValue({
			plugins: {
				renderNode: () => <p>Mock Content</p> //eslint-disable-line react/display-name
			}
		})
		const component = mount(<PageEditor {...props} />)
		expect(
			component.instance().renderElement({
				element: {
					type: 'a',
					href: 'mockLink',
					children: [{ text: '' }]
				},
				children: ''
			})
		).toMatchSnapshot()

		expect(
			component.instance().renderElement({
				element: {
					type: 'mock Element',
					href: 'mockLink',
					children: [{ text: '' }]
				},
				children: ''
			})
		).toMatchSnapshot()
	})

	test('PageEditor component with no page', () => {
		const props = {
			page: null,
			model: { title: 'Mock Title' }
		}

		const component = renderer.create(<PageEditor {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('updating a component with no page doesnt update state', () => {
		const props = {
			page: null,
			model: { title: 'Mock Title' }
		}
		const thing = renderer.create(<PageEditor {...props} />)

		const instance = thing.getInstance()
		const spyImport = jest.spyOn(instance, 'importFromJSON')
		const spyExport = jest.spyOn(instance, 'exportToJSON')
		instance.componentDidUpdate(props)
		expect(spyImport).not.toHaveBeenCalled()
		expect(spyExport).not.toHaveBeenCalled()
	})

	test('updating a component from no page to a page updates state', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }], type: ASSESSMENT_NODE })
			},
			model: { title: 'Mock Title' }
		}
		jest.spyOn(Common.Registry, 'getItemForType').mockReturnValue({
			oboToSlate: () => ({ text: '' })
		})
		const thing = renderer.create(<PageEditor {...props} />)

		const instance = thing.getInstance()
		const spyImport = jest.spyOn(instance, 'importFromJSON')
		const spyExport = jest.spyOn(instance, 'exportToJSON')
		const spyState = jest.spyOn(instance, 'setState')
		instance.componentDidUpdate({})
		expect(spyImport).toHaveBeenCalledTimes(1)
		expect(spyState).toHaveBeenCalledTimes(1)
		expect(spyExport).not.toHaveBeenCalled()
	})

	test('updating a component from a page to no page updates state', () => {
		const props = {
			page: null,
			model: { title: 'Mock Title' }
		}
		const thing = renderer.create(<PageEditor {...props} />)

		const instance = thing.getInstance()
		const spyImport = jest.spyOn(instance, 'importFromJSON')
		const spyExport = jest.spyOn(instance, 'exportToJSON')
		const spyState = jest.spyOn(instance, 'setState')
		instance.componentDidUpdate({ page: true })
		expect(spyImport).not.toHaveBeenCalled()
		expect(spyState).toHaveBeenCalledTimes(1)
		expect(spyExport).not.toHaveBeenCalled()
	})

	test('PageEditor component changes pages', () => {
		const props = {
			page: {
				id: 1,
				set: jest.fn(),
				attributes: {
					children: [{ type: 'mockNode' }]
				},
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}

		let thing
		renderer.act(() => {
			thing = renderer.create(<PageEditor {...props} />)
		})

		expect(thing.toJSON()).toMatchSnapshot()

		renderer.act(() => {
			props.page.id = 2
			thing.update(<PageEditor {...props} />)
		})

		expect(thing.toJSON()).toMatchSnapshot()
	})

	test('PageEditor component with page updating to another page', () => {
		const prevProps = {
			page: {
				id: 122,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: BREAK_NODE,
							content: {},
							children: []
						}
					]
				},
				get: jest.fn().mockReturnValue(ASSESSMENT_NODE),
				toJSON: () => ({
					children: [
						{
							type: BREAK_NODE,
							content: {},
							children: []
						}
					]
				})
			},
			model: { title: 'Mock Title' }
		}

		const newProps = {
			page: {
				id: 123,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: BREAK_NODE,
							content: {},
							children: []
						}
					]
				},
				get: jest.fn(),
				toJSON: () => ({
					children: [
						{
							type: BREAK_NODE,
							content: {},
							children: []
						}
					]
				})
			},
			model: { title: 'Mock Title' }
		}

		const spy = jest.spyOn(PageEditor.prototype, 'exportToJSON')
		spy.mockReturnValueOnce() // override the default method

		// render
		const thing = mount(<PageEditor {...prevProps} />)

		// get a copy of state
		const prevState = thing.state()

		// update to the second page
		thing.setProps(newProps)
		thing.update()

		// save action should have occured
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith(prevProps.page, prevState.value)
		spy.mockClear()
	})

	test('PageEditor component alters value majorly', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
		jest.spyOn(Editor, 'leaf').mockReturnValueOnce([{ text: '' }, []])
		const component = mount(<PageEditor {...props} />)

		const value = [
			{
				type: 'mocknode',
				children: [{ text: '' }]
			}
		]

		component.instance().onChange(value)
	})

	test('PageEditor component alters value majorly with multi-select', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
		jest.spyOn(ReactEditor, 'isFocused').mockReturnValue(true)
		window.getSelection = jest.fn().mockReturnValue({
			getRangeAt: () => ({
				commonAncestorContainer: {
					parentNode: {
						tagName: 'fakeTag',
						getBoundingClientRect: () => ({})
					}
				}
			})
		})
		jest.spyOn(Editor, 'leaf').mockReturnValue([{ text: 'mock text', _latex: true }, []])
		const component = mount(<PageEditor {...props} />)

		const value = [
			{
				type: 'mocknode',
				children: [{ text: '' }]
			}
		]

		component.instance().onChange(value)
	})

	test('PageEditor component alters value majorly with latex', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
		jest.spyOn(ReactEditor, 'isFocused').mockReturnValue(true)
		window.getSelection = jest.fn().mockReturnValue({
			getRangeAt: () => ({
				commonAncestorContainer: {
					parentNode: {
						tagName: 'span',
						getBoundingClientRect: () => ({})
					}
				}
			})
		})
		jest.spyOn(Editor, 'leaf').mockReturnValue([{ text: 'mock text', _latex: true }, []])
		const component = mount(<PageEditor {...props} />)

		const value = [
			{
				type: 'mocknode',
				children: [{ text: '' }]
			}
		]

		component.instance().onChange(value)
	})

	test('toggleEditable changes the state', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
		const component = mount(<PageEditor {...props} />)
		const inst = component.instance()

		inst.toggleEditable(false)

		expect(component.state()).toMatchInlineSnapshot(`
		Object {
		  "contentRect": null,
		  "editable": false,
		  "saved": true,
		  "showPlaceholders": true,
		  "value": Array [
		    Object {
		      "text": "",
		    },
		  ],
		}
	`)
	})

	test('markUnsaved changes the state', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
		const component = mount(<PageEditor {...props} />)
		const inst = component.instance()

		inst.markUnsaved()

		expect(component.state()).toMatchInlineSnapshot(`
		Object {
		  "contentRect": null,
		  "editable": true,
		  "saved": false,
		  "showPlaceholders": true,
		  "value": Array [
		    Object {
		      "text": "",
		    },
		  ],
		}
	`)
	})

	test('Ensures the plugins work as expected', () => {
		APIUtil.getAllDrafts.mockResolvedValue({ value: [] })

		const props = {
			page: {
				id: 2,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: BREAK_NODE,
							content: {},
							children: []
						}
					]
				},
				get: jest.fn(),
				children: {
					reset: jest.fn()
				},
				toJSON: () => ({
					children: [
						{
							type: BREAK_NODE,
							content: {},
							children: []
						}
					]
				})
			},
			model: {
				children: [
					{
						get: () => ASSESSMENT_NODE,
						children: []
					},
					{
						get: () => CONTENT_NODE,
						flatJSON: () => {
							return { content: {}, children: [] }
						},
						children: {
							models: [
								{
									get: () => null
								}
							]
						}
					},
					{
						get: () => 'mockNode'
					}
				],
				flatJSON: () => {
					return { content: {}, children: [] }
				}
			}
		}
		const component = mount(<PageEditor {...props} />)
		const plugins = component.instance().plugins

		component.instance().editor.normalizeNode([{}, [0]])
		component.instance().editor.isVoid({})
		component.instance().editor.insertData({
			types: ['application/x-slate-fragment'],
			getData: jest.fn()
		})

		component.unmount()

		expect(plugins).toMatchSnapshot()
	})

	test('exportToJSON returns expected json for assessment node', () => {
		const spy = jest.spyOn(Common.Registry, 'getItemForType')
		spy.mockReturnValueOnce({
			slateToObo: jest.fn().mockReturnValue({
				children: ['mock-children'],
				content: 'mock-content'
			})
		})

		const page = {
			get: () => 'ObojoboDraft.Sections.Assessment',
			set: jest.fn(),
			children: {
				reset: jest.fn()
			},
			toJSON: () => ({
				type: 'ObojoboDraft.Sections.Assessment',
				children: [{ type: 'mock node' }]
			})
		}

		const props = {
			page: {
				attributes: { children: [{ type: 'mock node' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node' }] })
			},
			model: { title: 'Mock Title' }
		}

		const value = {
			document: {
				nodes: {
					get: () => ({
						children: 'mock-children',
						content: 'mock-content'
					})
				}
			}
		}

		const thing = mount(<PageEditor {...props} />)

		expect(thing.instance()).toHaveProperty('exportToJSON', expect.any(Function))

		const result = thing.instance().exportToJSON(page, value)
		expect(result).toMatchInlineSnapshot(`
		Object {
		  "children": Array [
		    "mock-children",
		  ],
		  "content": "mock-content",
		}
	`)

		expect(page.set).toHaveBeenCalledWith('children', ['mock-children'])
		expect(page.set).toHaveBeenCalledWith('content', 'mock-content')
	})

	test('exportToJSON returns expected json for page node', () => {
		const spy = jest.spyOn(Common.Registry, 'getItemForType')
		spy.mockReturnValueOnce({
			slateToObo: jest.fn().mockReturnValue({
				children: 'mock-children',
				content: 'mock-content'
			})
		})

		Component.helpers.slateToObo.mockReturnValue('mock-converted-node-value')

		const page = {
			get: () => 'will-result-in-else-path-taken',
			set: jest.fn(),
			children: {
				reset: jest.fn()
			},
			toJSON: () => ({ children: [{ type: 'mock node' }] })
		}

		const props = {
			page: {
				attributes: { children: [{ type: 'mock node' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node' }] })
			},
			model: { title: 'Mock Title' }
		}

		const value = ['node-one', 'node-two']

		const thing = mount(<PageEditor {...props} />)

		expect(thing.instance()).toHaveProperty('exportToJSON', expect.any(Function))

		const result = thing.instance().exportToJSON(page, value)

		// make sure the nodes are passed to the converter
		expect(Component.helpers.slateToObo).toHaveBeenCalledTimes(2)
		expect(Component.helpers.slateToObo).toHaveBeenCalledWith('node-one')
		expect(Component.helpers.slateToObo).toHaveBeenCalledWith('node-two')

		// make sure the updated children are set on the page
		expect(page.set).toHaveBeenCalledTimes(1)
		expect(page.set).toHaveBeenCalledWith('children', [
			'mock-converted-node-value',
			'mock-converted-node-value'
		])

		// make sure the return matches
		expect(result).toMatchInlineSnapshot(`
				Object {
				  "children": Array [
				    "mock-converted-node-value",
				    "mock-converted-node-value",
				  ],
				}
		`)
	})

	test('exportToJSON returns undefined for null page', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mock node' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node' }] })
			},
			model: { title: 'Mock Title' }
		}
		const thing = mount(<PageEditor {...props} />)

		expect(thing.instance()).toHaveProperty('exportToJSON', expect.any(Function))

		const result = thing.instance().exportToJSON(null)

		// make sure the return matches
		expect(result).toMatchInlineSnapshot(`undefined`)
	})

	test('checkIfSaved return', () => {
		const eventMap = {}
		window.addEventListener = jest.fn((event, cb) => {
			eventMap[event] = cb
		})
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		APIUtil.getAllDrafts.mockResolvedValue({ value: [] })
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node' }] })
			},
			model: { title: 'Mock Title' }
		}
		const component = mount(<PageEditor {...props} />)

		// eslint-disable-next-line no-undefined
		expect(eventMap.beforeunload({})).toEqual(undefined)

		component.setState({ saved: false })

		expect(eventMap.beforeunload({})).toEqual(true)

		component.unmount()
	})

	test('onKeyDown() calls editor functions', () => {
		const editor = {
			undo: jest.fn(),
			redo: jest.fn()
		}

		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node' }] }),
				set: jest.fn(),
				children: {
					reset: jest.fn()
				}
			},
			model: {
				title: 'Mock Title',
				flatJSON: () => ({ content: {} }),
				children: []
			}
		}

		const component = mount(<PageEditor {...props} />)
		const instance = component.instance()
		instance.editor = editor

		instance.onKeyDownGlobal({
			preventDefault: jest.fn(),
			key: 's',
			metaKey: true
		})

		instance.onKeyDownGlobal({
			preventDefault: jest.fn(),
			key: 'z',
			metaKey: true
		})

		instance.onKeyDownGlobal({
			preventDefault: jest.fn(),
			key: 'y',
			metaKey: true
		})

		instance.onKeyDownGlobal({
			preventDefault: jest.fn(),
			key: 's'
		})

		expect(editor.undo).toHaveBeenCalled()
		expect(editor.redo).toHaveBeenCalled()
	})

	test('onKeyDown runs through full list of options', () => {
		const editor = {
			undo: jest.fn(),
			redo: jest.fn(),
			isInline: jest.fn()
		}

		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node' }] }),
				set: jest.fn(),
				children: {
					reset: jest.fn()
				}
			},
			model: {
				title: 'Mock Title',
				flatJSON: () => ({ content: {} }),
				children: []
			}
		}

		const component = mount(<PageEditor {...props} />)
		const instance = component.instance()
		instance.editor = editor

		instance.onKeyDown({
			preventDefault: jest.fn(),
			key: 's',
			metaKey: true,
			defaultPrevented: true
		})

		jest.spyOn(Editor, 'nodes').mockImplementation((editor, opts) => {
			opts.match({ children: [{ text: '' }] })
			return [
				[{ type: ASSESSMENT_NODE }, [0]],
				[{ type: BREAK_NODE }, [0]]
			]
		})
		jest.spyOn(Common.Registry, 'getItemForType')
		instance.onKeyDown({
			preventDefault: jest.fn(),
			key: 's',
			metaKey: true
		})

		const onKeyDown = jest.fn()
		jest.spyOn(Common.Registry, 'getItemForType').mockReturnValue({
			plugins: { onKeyDown }
		})
		instance.onKeyDown({
			preventDefault: jest.fn(),
			key: 's',
			metaKey: true
		})

		expect(onKeyDown).toHaveBeenCalled()
	})

	test('saveModule calls APIUtil', () => {
		const editor = {
			undo: jest.fn(),
			redo: jest.fn()
		}

		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node' }] }),
				set: jest.fn(),
				children: {
					reset: jest.fn()
				}
			},
			model: {
				title: 'Mock Title',
				flatJSON: () => ({ content: {}, children: [] }),
				children: [
					{
						get: () => CONTENT_NODE,
						flatJSON: () => ({ children: [] }),
						children: {
							models: [
								{
									get: () => 'mock value'
								}
							]
						}
					},
					{
						get: () => ASSESSMENT_NODE
					}
				]
			}
		}

		const component = mount(<PageEditor {...props} />)
		const instance = component.instance()
		instance.editor = editor

		instance.onKeyDown({
			preventDefault: jest.fn(),
			key: 's',
			metaKey: true
		})

		expect(APIUtil.postDraft).toHaveBeenCalled()
	})

	test('onResized sets state.contentRect', () => {
		const props = {
			page: {
				attributes: { children: [{ type: 'mockNode' }] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
		const component = mount(<PageEditor {...props} />)

		expect(component.state().contentRect).toBe(null)
		component.instance().onResized({ contentRect: 'mock-content-rect' })
		expect(component.state().contentRect).toBe('mock-content-rect')
	})

	test('setupResizeObserver does nothing if the browser does not support ResizeObserver', () => {
		const originalResizeObserver = window.ResizeObserver

		window.ResizeObserver = undefined //eslint-disable-line no-undefined
		expect(PageEditor.prototype.setupResizeObserver()).toBe(false)

		window.ResizeObserver = {}
		expect(PageEditor.prototype.setupResizeObserver()).toBe(false)

		window.ResizeObserver = { prototype: {} }
		expect(PageEditor.prototype.setupResizeObserver()).toBe(false)

		window.ResizeObserver = { prototype: { observe: jest.fn() } }
		expect(PageEditor.prototype.setupResizeObserver()).toBe(false)

		window.ResizeObserver = { prototype: { disconnect: jest.fn() } }
		expect(PageEditor.prototype.setupResizeObserver()).toBe(false)

		window.ResizeObserver = jest.fn()
		window.ResizeObserver.prototype = { observe: jest.fn(), disconnect: jest.fn() }
		expect(
			PageEditor.prototype.setupResizeObserver.bind({
				onResized: jest.fn(),
				pageEditorContainerRef: { current: jest.fn() }
			})()
		).toBe(true)

		window.ResizeObserver = originalResizeObserver
	})

	test('setupResizeObserver creates a new ResizeObserver and observes the container ref', () => {
		const originalResizeObserver = window.ResizeObserver

		const onResized = jest.fn()
		const pageEditorContainerRefCurrent = jest.fn()
		window.ResizeObserver = class ResizeObserver {
			constructor(fn) {
				this.__callback = fn
			}

			observe() {}

			disconnect() {}
		}
		const observeSpy = jest.spyOn(window.ResizeObserver.prototype, 'observe')

		const thisValue = {
			onResized,
			pageEditorContainerRef: { current: pageEditorContainerRefCurrent }
		}
		expect(PageEditor.prototype.setupResizeObserver.bind(thisValue)()).toBe(true)

		expect(thisValue.resizeObserver).toBeInstanceOf(window.ResizeObserver)
		expect(thisValue.resizeObserver.__callback).toBe(onResized)
		expect(observeSpy).toHaveBeenCalledWith(pageEditorContainerRefCurrent)

		window.ResizeObserver = originalResizeObserver
	})
})
