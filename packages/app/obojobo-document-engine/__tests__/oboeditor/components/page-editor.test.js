import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import APIUtil from 'src/scripts/viewer/util/api-util'
import PageEditor from 'src/scripts/oboeditor/components/page-editor'
import React from 'react'
import mockConsole from 'jest-mock-console'
import Common from 'src/scripts/common'
import Component from 'src/scripts/oboeditor/components/node/editor'

jest.mock('src/scripts/oboeditor/components/toolbar', () => ({
	components: {
		Node: global.mockReactComponent(this, 'MockToolBar')
	}
}))
jest.mock('slate-react')
jest.mock('src/scripts/viewer/util/api-util')
//jest.mock('src/scripts/oboeditor/components/toolbars/file-menu')
jest.mock('src/scripts/common/util/modal-util')
jest.mock('src/scripts/oboeditor/components/node/editor', () => ({
	helpers: {
		slateToObo: jest.fn(),
		oboToSlate: jest.fn()
	}
}))
// Editor Store
jest.mock('src/scripts/oboeditor/stores/editor-store', () => {
	return {
		state: { startingId: null }
	}
})
jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: jest.fn()
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		}
	},
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		},
		// eslint-disable-next-line react/display-name
		Button: props => <button {...props}>{props.children}</button>
	}
}))

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
let restoreConsole

describe('PageEditor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetModules()
		restoreConsole = mockConsole('error')
	})

	afterEach(() => {
		restoreConsole()
	})

	test('EditorNav component', () => {
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

	test('EditorNav component with no page', () => {
		const props = {
			page: null
		}

		const component = renderer.create(<PageEditor {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('updating a component with no page doesnt update state', () => {
		const props = {
			page: null
		}
		const thing = renderer.create(<PageEditor {...props} />)

		const instance = thing.getInstance()
		const spyImport = jest.spyOn(instance, 'importFromJSON')
		const spyExport = jest.spyOn(instance, 'exportToJSON')
		instance.componentDidUpdate()
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

	test('EditorNav component changes pages', () => {
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

	test('EditorNav component with page updating to another page', () => {
		const props = {
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

	test('EditorNav component with content', () => {
		Common.Registry.getItemForType.mockReturnValueOnce({
			ignore: false
		})

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
							content: {}
						}
					]
				},
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}

		const component = renderer.create(<PageEditor {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('EditorNav component alters value majorly', () => {
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

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

		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with content exports to database', () => {
		Common.Registry.getItemForType.mockReturnValueOnce({
			oboToSlate: jest.fn().mockReturnValue({
				object: 'block',
				type: 'oboeditor.component',
				nodes: []
			})
		})

		APIUtil.postDraft.mockResolvedValueOnce({ status: 'ok' })
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
				get: jest
					.fn()
					.mockReturnValueOnce(ASSESSMENT_NODE) // get('type') in import
					.mockReturnValueOnce({
						scoreActions: [
							{
								for: '100',
								page: {
									type: PAGE_NODE,
									children: [
										{
											type: BREAK_NODE,
											content: {}
										}
									]
								}
							}
						]
					})
					.mockReturnValueOnce(ASSESSMENT_NODE) // get('type') in export
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
				flatJSON: () => ({ content: {}, children: [] })
			}
		}

		const component = mount(<PageEditor {...props} />)

		const saveButton = component.find('button').at(0)
		const saveButtonProps = saveButton.props()
		expect(saveButtonProps).toHaveProperty('children', 'Save Document')
		expect(saveButtonProps).toHaveProperty('onClick', expect.any(Function))

		saveButtonProps.onClick()

		expect(APIUtil.postDraft).toHaveBeenCalled()
	})

	test('EditorNav component with content fails to export to database', () => {
		Component.helpers.oboToSlate.mockReturnValueOnce({
			object: 'block',
			type: 'oboeditor.component',
			nodes: []
		})

		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'not ok',
			value: { message: 'mock error message' }
		})

		// remove startingId for test coverage
		EditorStore.state = {}

		const props = {
			page: {
				attributes: { children: [] },
				id: 2,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: 'ObojoboDraft.Chunks.Break',
							content: {}
						}
					]
				},
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
			model: {
				children: [],
				flatJSON: () => {
					return { content: {}, children: [] }
				}
			}
		}

		const component = mount(<PageEditor {...props} />)

		const saveButton = component.find('button').at(0)
		const saveButtonProps = saveButton.props()
		expect(saveButtonProps).toHaveProperty('children', 'Save Document')
		expect(saveButtonProps).toHaveProperty('onClick', expect.any(Function))
		expect(Common.util.ModalUtil.show).toHaveBeenCalledTimes(0)
		saveButton.simulate('click')

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			// eslint-disable-next-line no-console
			expect(console.error).not.toHaveBeenCalled()
			expect(APIUtil.postDraft).toHaveBeenCalled()
			expect(Common.util.ModalUtil.show).toHaveBeenCalledTimes(1)
			expect(Common.util.ModalUtil.show.mock.calls[0][0]).toMatchSnapshot()
			// restore startingId
			EditorStore.state = { startingId: null }
		})
	})

	test('EditorNav component stores reference', () => {
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

		const instance = component.instance()

		instance.ref('mockEditor')

		expect(instance.getEditor()).toEqual('mockEditor')

		component.unmount()
	})

	test('EditorNav component console errors on invalid postDraft response', () => {
		APIUtil.postDraft.mockResolvedValueOnce({ status: 'not ok', throwsError: 'you bet!' })
		Component.helpers.oboToSlate.mockReturnValueOnce({
			object: 'block',
			type: 'oboeditor.component',
			nodes: []
		})
		// remove startingId for test coverage
		EditorStore.state = {}

		const props = {
			page: {
				id: 2,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: 'ObojoboDraft.Chunks.Break',
							content: {}
						}
					]
				},
				get: jest.fn()
			},
			model: {
				children: [],
				flatJSON: () => {
					return { content: {}, children: [] }
				}
			}
		}
		const component = mount(<PageEditor {...props} />)
		const saveButton = component.find('button').at(0)
		expect(saveButton.props().children).toBe('Save Document')
		saveButton.simulate('click')

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(APIUtil.postDraft).toHaveBeenCalled()
			// eslint-disable-next-line no-console
			expect(console.error).toHaveBeenCalledTimes(1)
			// restore startingId
			EditorStore.state = { startingId: null }
		})
	})

	test('Ensures the plugins work as expected', () => {
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
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
				get: jest
					.fn()
					.mockReturnValueOnce(ASSESSMENT_NODE) // get('type') in import
					.mockReturnValueOnce({
						scoreActions: [
							{
								for: '100',
								page: {
									type: PAGE_NODE,
									children: [
										{
											type: BREAK_NODE,
											content: {}
										}
									]
								}
							}
						]
					})
					.mockReturnValueOnce(ASSESSMENT_NODE) // get('type') in export
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
		plugins[16].onKeyDown(
			{
				preventDefault: jest.fn(),
				key: 's',
				metaKey: true
			},
			null,
			jest.fn())

		expect(APIUtil.postDraft).toHaveBeenCalled()
	})

	test('EditorNav component stores reference', () => {
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			}
		}
		const component = mount(<PageEditor {...props} />)

		const instance = component.instance()

		instance.ref('mockEditor')

		expect(instance.getEditor()).toEqual('mockEditor')
	})

	test('sends onChange to the Editor', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			}
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
			}
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
			}
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
			}
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
			}
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

	test('exportToJSON returns expected json for assesment node', () => {
		Common.Registry.getItemForType.mockReturnValueOnce({
			slateToObo: jest.fn().mockReturnValue({
				children: 'mock-children',
				content: 'mock-content'
			})
		})

		const page = {
			get: () => 'ObojoboDraft.Sections.Assessment',
			set: jest.fn()
		}

		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			}
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
						  "children": "mock-children",
						  "content": "mock-content",
						}
			`)

		expect(page.set).toHaveBeenCalledWith('children', 'mock-children')
		expect(page.set).toHaveBeenCalledWith('content', 'mock-content')
	})

	test('exportToJSON returns expected json for assesment node', () => {
		Common.Registry.getItemForType.mockReturnValueOnce({
			slateToObo: jest.fn().mockReturnValue({
				children: 'mock-children',
				content: 'mock-content'
			})
		})

		Component.helpers.slateToObo.mockReturnValue('mock-converted-node-value')

		const page = {
			get: () => 'will-result-in-else-path-taken',
			set: jest.fn()
		}

		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			}
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
		const eventMap = {};
		window.addEventListener = jest.fn((event, cb) => {
			eventMap[event] = cb;
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
