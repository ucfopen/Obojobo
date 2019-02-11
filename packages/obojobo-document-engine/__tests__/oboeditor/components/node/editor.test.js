import { CHILD_REQUIRED, CHILD_UNKNOWN } from 'slate-schema-violations'

import Component from 'src/scripts/oboeditor/components/node/editor'
const COMPONENT_NODE = 'oboeditor.component'

describe('Component editor', () => {
	test('plugins.renderNode renders a component when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: COMPONENT_NODE,
				data: {
					get: () => ({})
				}
			}
		}

		expect(Component.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes required children in component', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Component.plugins.schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes extra children in component', () => {
		const editor = {
			splitNodeByKey: jest.fn()
		}

		Component.plugins.schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: CHILD_UNKNOWN,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.splitNodeByKey).toHaveBeenCalled()
	})
})
