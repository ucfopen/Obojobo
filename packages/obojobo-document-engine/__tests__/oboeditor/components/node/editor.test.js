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

		expect(Component.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => ({})
				}
			}
		}

		const next = jest.fn()

		expect(Component.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes unknown children in component', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Component.plugins.schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_unknown',
			node: { key: 'mockKey' },
			child: { object: 'block' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in component', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Component.plugins.schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_type_invalid',
			node: { key: 'mockKey' },
			child: { object: 'text' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in component', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Component.plugins.schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_type_invalid',
			node: { key: 'mockKey' },
			child: { object: 'block' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes required children in component', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Component.plugins.schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_min_invalid',
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
			code: 'child_max_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.splitNodeByKey).toHaveBeenCalled()
	})
})
