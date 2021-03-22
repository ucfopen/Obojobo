jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)
jest.mock('obojobo-document-engine/src/scripts/oboeditor/stores/editor-store')

jest.mock('./materia-settings-dialog', () =>
	global.mockReactComponent(this, 'MockMateriaSettingsDialog')
)

import React from 'react'
import { Transforms } from 'slate'
import { mount } from 'enzyme'
import { ReactEditor } from 'slate-react'
import renderer from 'react-test-renderer'
import EditorStore from 'obojobo-document-engine/src/scripts/oboeditor/stores/editor-store'
import Materia from './editor-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'

describe('Materia Editor Node', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
		EditorStore.getState.mockReturnValue({
			settings: {
				moduleSettings: {
					obojoboChunksMateria: {
						host: 'mock-host-setting'
					}
				}
			}
		})
	})

	test('component renders', () => {
		const props = {
			element: {
				content: {
					icon: 'mock-icon',
					width: 100,
					height: 200
				}
			},
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			}
		}
		const component = renderer.create(<Materia {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders with no icon correctly', () => {
		const props = {
			element: {
				content: {}
			},
			node: {
				data: {
					get: () => ({
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			}
		}
		const component = renderer.create(<Materia {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly when selected', () => {
		const props = {
			selected: true,
			element: {
				content: {}
			},
			node: {
				data: {
					get: () => ({
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			}
		}
		const component = renderer.create(<Materia {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('edits properties', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		OboModel.getRoot.mockReturnValueOnce({
			attributes: { draftId: 'mock-draft-id', contentId: 'mock-content-id' }
		})

		component
			.find('.properties-button')
			.at(0)
			.props()
			.onClick({
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			})

		expect(ModalUtil.show).toHaveBeenCalled()
		expect(ModalUtil.show.mock.calls[0][0]).toMatchInlineSnapshot(`
		<MockMateriaSettingsDialog
		  caption="mock caption"
		  content={Object {}}
		  contentId="mock-content-id"
		  draftId="mock-draft-id"
		  materiaHost="mock-host-setting"
		  onCancel={[Function]}
		  onConfirm={[Function]}
		/>
	`)

		component.unmount()
	})

	test('changeProperties sets the nodes content', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		component.instance().changeProperties({
			icon: 'new icon',
			src: 'new src',
			widgetEngine: 'new engine',
			caption: 'new caption'
		})

		// expect text changes to the caption
		expect(Transforms.delete).toHaveBeenCalled()
		expect(Transforms.insertText).toHaveBeenCalledWith(props.editor, 'new caption', {
			at: undefined
		}) //eslint-disable-line no-undefined

		// expect update to the node
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{
				content: {
					icon: 'new icon',
					src: 'new src',
					widgetEngine: 'new engine',
					width: 800,
					height: 600
				}
			},
			{ at: undefined }
		) //eslint-disable-line no-undefined

		// expect dialog hidden
		expect(ModalUtil.hide).toHaveBeenCalled()
	})

	test('changeProperties sets the width and height to defaults if < 100', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		component.instance().changeProperties({
			icon: 'new icon',
			src: 'new src',
			widgetEngine: 'new engine',
			caption: 'new caption',
			width: 99,
			height: 99
		})

		// expect update to the node
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{
				content: {
					icon: 'new icon',
					src: 'new src',
					widgetEngine: 'new engine',
					width: 800,
					height: 600
				}
			},
			{ at: undefined }
		) //eslint-disable-line no-undefined

		// expect dialog hidden
		expect(ModalUtil.hide).toHaveBeenCalled()
	})

	test('changeProperties sets the width and height to given value if valid', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		component.instance().changeProperties({
			icon: 'new icon',
			src: 'new src',
			widgetEngine: 'new engine',
			caption: 'new caption',
			width: 200,
			height: 300
		})

		// expect update to the node
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{
				content: {
					icon: 'new icon',
					src: 'new src',
					widgetEngine: 'new engine',
					width: 200,
					height: 300
				}
			},
			{ at: undefined }
		) //eslint-disable-line no-undefined

		// expect dialog hidden
		expect(ModalUtil.hide).toHaveBeenCalled()
	})

	test('deleteNode calls removeNodes', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		component.instance().deleteNode()

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('deleteNode calls removeNodes', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		component.instance().deleteNode()

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('returnFocusOnTab calls focus', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		const event = { key: 'Tab', shiftKey: false, preventDefault: jest.fn() }
		component.instance().returnFocusOnTab(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(ReactEditor.focus).toHaveBeenCalledWith(props.editor)
	})

	test('returnFocusOnTab ignores other keys', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		const event = { key: 'f', shiftKey: false, preventDefault: jest.fn() }
		component.instance().returnFocusOnTab(event)

		expect(event.preventDefault).not.toHaveBeenCalled()
		expect(ReactEditor.focus).not.toHaveBeenCalled()
	})

	test('returnFocusOnShiftTab calls focus', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		const event = { key: 'Tab', shiftKey: true, preventDefault: jest.fn() }
		component.instance().returnFocusOnShiftTab(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(ReactEditor.focus).toHaveBeenCalledWith(props.editor)
	})

	test('returnFocusOnShiftTab ignores other keys', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		const event = { key: 'f', shiftKey: true, preventDefault: jest.fn() }
		component.instance().returnFocusOnShiftTab(event)

		expect(event.preventDefault).not.toHaveBeenCalled()
		expect(ReactEditor.focus).not.toHaveBeenCalled()
	})

	test('focusMe calls setSelection', () => {
		const props = {
			// mock slate element
			element: {
				content: {},
				children: [{ text: 'mock caption' }]
			},
			// mock oboNode
			node: {
				data: {
					get: () => ({
						icon: 'mock-icon',
						src: 'mock-src',
						content: {},
						caption: 'mock-caption',
						widgetEngine: 'mock-engine'
					})
				}
			},
			// mock slate editor
			editor: {
				toggleEditable: jest.fn()
			}
		}

		const component = mount(<Materia {...props} />)

		expect(Transforms.setSelection).not.toHaveBeenCalled()
		component.instance().focusMe()

		expect(Transforms.setSelection).toHaveBeenCalled()
	})
})
