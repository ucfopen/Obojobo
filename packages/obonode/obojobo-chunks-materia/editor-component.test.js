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
				content: {}
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

	test('Materia renders with no size correctly', () => {
		const props = {
			element: {
				content: {}
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
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('Materia component edits properties', () => {
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
		expect(Transforms.insertText).toHaveBeenCalledWith(props.editor, 'new caption', {at: undefined}) //eslint-disable-line no-undefined

		// expect update to the node
		expect(Transforms.setNodes).toHaveBeenCalledWith(props.editor, {content:{icon: 'new icon', src: 'new src', widgetEngine: 'new engine'}}, {at: undefined}) //eslint-disable-line no-undefined

		// expect dialog hidden
		expect(ModalUtil.hide).toHaveBeenCalled()

	})
})
