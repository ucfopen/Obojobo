import { mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import APIUtil from 'src/scripts/viewer/util/api-util'
import EditorStore from '../../../src/scripts/oboeditor/stores/editor-store'
import PageEditor from 'src/scripts/oboeditor/components/page-editor'
import React from 'react'
import { Value } from 'slate'
import mockConsole from 'jest-mock-console'
import Common from 'src/scripts/common'
import Component from 'src/scripts/oboeditor/components/node/editor'

jest.mock('src/scripts/oboeditor/components/toolbar', () => ({
	components: {
		Node: mockReactComponent(this, 'MockToolBar')
	}
}))
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
			}
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

	test('EditorNav component with no page updating to a page', () => {
		const propsWithoutPage = {
			page: null
		}

		const propsWithPage = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			}
		}

		let thing
		renderer.act(() => {
			thing = renderer.create(<PageEditor {...propsWithoutPage} />)
		})

		expect(thing.toJSON()).toMatchSnapshot()

		renderer.act(() => {
			thing.update(<PageEditor {...propsWithPage} />)
		})

		expect(thing.toJSON()).toMatchSnapshot()
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
			}
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

	test('EditorNav component saves chagnes when changes pages', () => {
		Common.Registry.getItemForType.mockReturnValueOnce({
			oboToSlate: jest.fn().mockReturnValue({})
		})

		const prevProps = {
			page: {
				id: 122,
				set: jest.fn(),
				attributes: {
					children: []
				},
				get: jest.fn()
			}
		}

		const newProps = {
			page: {
				id: 123,
				set: jest.fn(),
				attributes: {
					children: []
				},
				get: jest.fn()
			}
		}

		const spy = jest.spyOn(PageEditor.prototype, 'exportToJSON')
		spy.mockReturnValue() // override the default method

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
			}
		}

		const component = renderer.create(<PageEditor {...props} />)
		const tree = component.toJSON()
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
		const tree = component.html()

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
		const tree = component.html()

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
})
