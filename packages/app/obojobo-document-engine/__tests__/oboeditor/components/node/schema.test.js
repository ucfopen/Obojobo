import Schema from 'src/scripts/oboeditor/components/node/schema'
const COMPONENT_NODE = 'oboeditor.component'

describe('Component schema', () => {
	test('normalize fixes unknown children in component', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_unknown',
			node: { key: 'mockKey' },
			child: { object: 'block' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid text children in component', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		Schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_type_invalid',
			node: { key: 'mockKey' },
			child: { object: 'text' },
			index: 0
		})

		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid oboeditor.component block in component', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_type_invalid',
			node: { key: 'mockKey' },
			child: { object: 'block', type: 'oboeditor.component'},
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid page block in component', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}
		editor.withoutNormalizing = jest.fn().mockImplementationOnce(funct => {
			funct(editor)
		})

		Schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_type_invalid',
			node: { key: 'mockKey' },
			child: { object: 'block', type: 'mockPage', nodes:[{ key: 'mockGrandChild'}] },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes required children in component', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes extra children in component', () => {
		const editor = {
			splitNodeByKey: jest.fn()
		}

		Schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: 'child_max_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.splitNodeByKey).toHaveBeenCalled()
	})
})
