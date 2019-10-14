import { mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import APIUtil from 'src/scripts/viewer/util/api-util'
import PageEditor from 'src/scripts/oboeditor/components/page-editor'
import React from 'react'
import mockConsole from 'jest-mock-console'
import Common from 'src/scripts/common'
import Component from 'src/scripts/oboeditor/components/node/editor'
import { Value } from 'slate'

jest.mock('slate-react')
jest.mock('src/scripts/viewer/util/api-util')
jest.mock('src/scripts/common/util/modal-util')
jest.mock('src/scripts/oboeditor/components/node/editor', () => ({
	helpers: {
		slateToObo: jest.fn(),
		oboToSlate: jest.fn()
	}
}))
// Editor Store
jest.mock('src/scripts/oboeditor/stores/editor-store', () => ({
	state: { startingId: 'mock-id'}
}))

jest.mock('src/scripts/oboeditor/components/navigation/editor-nav')
jest.mock('src/scripts/oboeditor/components/toolbars/file-toolbar')
// jest.mock('src/scripts/oboeditor/components/toolbars/content-toolbar')
//jest.mock('obojobo-document-engine/src/scripts/common/registry')

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
let restoreConsole

describe('PageEditor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()
		restoreConsole = mockConsole('error')
	})

	afterEach(() => {
		restoreConsole()
	})

	test('PageEditor component', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
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
				attributes: { children: [] },
				get: jest.fn()
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
					children: []
				},
				get: jest.fn()
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
		Component.helpers.oboToSlate.mockReturnValue({
			object: 'block',
			type: 'oboeditor.component',
			nodes: []
		})

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
				get: jest.fn()
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
				get: jest.fn()
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
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = shallow(<PageEditor {...props} />)
		//const tree = component.html()

		const change = {
			value: Value.create({}),
			operations: {
				toJSON: () => [
					{
						type: 'set_mark'
					}
				]
			}
		}

		component.find('.obojobo-draft--pages--page').simulate('change', change)

		//expect(tree).toMatchSnapshot()
	})

	test('Ensures the plugins work as expected', () => {
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		APIUtil.getAllDrafts.mockResolvedValue({ value: [] })
		Component.helpers.oboToSlate.mockReturnValueOnce({
			object: 'block',
			type: 'oboeditor.component',
			nodes: []
		})
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
				children: { set: jest.fn() }
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

		// Call the save plugin
		plugins[11].onKeyDown(
			{
				preventDefault: jest.fn(),
				key: 's',
				metaKey: true
			},
			null,
			jest.fn()
		)

		expect(APIUtil.postDraft).toHaveBeenCalled()
	})

	test('sends onChange to the Editor', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title'}
		}

		// render
		const thing = mount(<PageEditor {...props} />)

		// make sure onChange is registered with the Editor
		const EditorProps = thing.find('Editor').props()
		expect(EditorProps).toHaveProperty('onChange', expect.any(Function))
	})

	test('onChange updates state', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title'}
		}

		// render
		const thing = mount(<PageEditor {...props} />)

		// make sure onChange is registered with the Editor
		const EditorProps = thing.find('Editor').props()

		// make sure state.value isnt the value we're changing it to
		expect(thing.state()).not.toHaveProperty('value', 'mockChangeValue')

		// now call onChange to make sure it has the expected effects
		EditorProps.onChange({
			operations: {
				toJSON: () => ({
					some: jest.fn().mockReturnValue(true)
				})
			},
			value: 'mockChangeValue' // this should be placed in the state
		})

		expect(thing.state()).toHaveProperty('value', 'mockChangeValue')
	})

	test('onChange calls ModalHide if nodes changed', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title'}
		}

		// render
		const thing = mount(<PageEditor {...props} />)

		// make sure onChange is registered with the Editor
		const EditorProps = thing.find('Editor').props()

		expect(Common.util.ModalUtil.hide).toHaveBeenCalledTimes(0)
		// now call onChange to make sure it has the expected effects
		EditorProps.onChange({
			operations: {
				toJSON: () => ({
					some: () => true // indicates something changed
				})
			},
			value: 'mockChangeValue'
		})
		expect(Common.util.ModalUtil.hide).toHaveBeenCalledTimes(1)
	})

	test('onChange doesnt call ModalHide if node hasnt changed', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title'}
		}

		// render
		const thing = mount(<PageEditor {...props} />)

		// make sure onChange is registered with the Editor
		const EditorProps = thing.find('Editor').props()

		expect(Common.util.ModalUtil.hide).toHaveBeenCalledTimes(0)
		// now call onChange to make sure it has the expected effects
		EditorProps.onChange({
			operations: {
				toJSON: () => ({
					some: () => false // indicates nothing changed
				})
			},
			value: 'mockChangeValue'
		})
		expect(Common.util.ModalUtil.hide).toHaveBeenCalledTimes(0)
	})

	test('onChange callback tests for changes correctly', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title'}
		}

		const thing = mount(<PageEditor {...props} />)

		// make sure onChange is registered with the Editor
		const EditorProps = thing.find('Editor').props()
		const mockSome = jest.fn()

		// now call onChange to make sure it has the expected effects
		EditorProps.onChange({
			operations: {
				toJSON: () => ({
					some: mockSome
				})
			}
		})

		// some should have been called
		expect(mockSome).toHaveBeenCalledTimes(1)

		// make sure a callback was sent to it
		const someCallback = mockSome.mock.calls[0][0]
		expect(someCallback).toEqual(expect.any(Function))

		// test all the slate operation types
		expect(someCallback({ type: 'set_node' })).toBe(true)
		expect(someCallback({ type: 'insert_node' })).toBe(true)
		expect(someCallback({ type: 'add_mark' })).toBe(true)
		expect(someCallback({ type: 'set_mark' })).toBe(true)

		// test one that doesn't count
		expect(someCallback({ type: 'not_a_change' })).toBe(false)
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
			children: { set: jest.fn() }
		}

		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
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
			children: { set: jest.fn() }
		}

		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}

		const value = {
			document: {
				nodes: ['node-one', 'node-two']
			}
		}

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
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = mount(<PageEditor {...props} />)

		expect(eventMap.beforeunload({})).toEqual(undefined)

		component.setState({ saved: false })

		expect(eventMap.beforeunload({})).toEqual(true)

		component.unmount()
	})
})
