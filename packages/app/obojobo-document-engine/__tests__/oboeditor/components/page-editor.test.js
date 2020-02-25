import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import APIUtil from 'src/scripts/viewer/util/api-util'
import PageEditor from 'src/scripts/oboeditor/components/page-editor'
import React from 'react'
import mockConsole from 'jest-mock-console'
import Common from 'src/scripts/common'
import Component from 'src/scripts/oboeditor/components/node/editor'

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
				toJSON: () => ({ children: [{ type: 'mockNode' }] })
			},
			model: { title: 'Mock Title' }
		}
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
				children: { set: jest.fn() },
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
			children: { set: jest.fn() },
			toJSON: () => ({ children: [{ type: 'mock node'}] })
		}

		const props = {
			page: {
				attributes: { children: [{ type: 'mock node'}] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node'}] })
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
			children: { set: jest.fn() },
			toJSON: () => ({ children: [{ type: 'mock node'}] })
		}

		const props = {
			page: {
				attributes: { children: [{ type: 'mock node'}] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node'}] })
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
				attributes: { children: [{ type: 'mock node'}] },
				get: jest.fn(),
				toJSON: () => ({ children: [{ type: 'mock node'}] })
			},
			model: { title: 'Mock Title' }
		}
		const thing = mount(<PageEditor {...props} />)

		expect(thing.instance()).toHaveProperty('exportToJSON', expect.any(Function))

		const result = thing.instance().exportToJSON(null)

		// make sure the return matches
		expect(result).toMatchInlineSnapshot(`undefined`)
	})

	test.skip('checkIfSaved return', () => {
		const eventMap = {}
		window.addEventListener = jest.fn((event, cb) => {
			eventMap[event] = cb
		})
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		APIUtil.getAllDrafts.mockResolvedValue({ value: [] })
		const props = {
			page: {
				attributes: { children: [{ type: 'mock node'}] },
				get: jest.fn()
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
})
