import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'
const { CHILD_MAX_INVALID, CHILD_MIN_INVALID, CHILD_UNKNOWN, CHILD_TYPE_INVALID } = SchemaViolations

import Schema from 'obojobo-document-engine/src/scripts/oboeditor/components/node/schema'
const COMPONENT_NODE = 'oboeditor.component'

describe('Component schema', () => {
	test('normalize fixes unknown children in component', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: CHILD_UNKNOWN,
			node: { key: 'mockKey' },
			child: { object: 'block', type: 'oboeditor.component' },
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
			code: CHILD_UNKNOWN,
			node: { key: 'mockKey' },
			child: { object: 'block', type: 'mockPage', nodes: [{ key: 'mockGrandChild' }] },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid text children in component', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		Schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
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
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { object: 'block', type: 'oboeditor.component' },
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
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { object: 'block', type: 'mockPage', nodes: [{ key: 'mockGrandChild' }] },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes required children in component', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[COMPONENT_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
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
			code: CHILD_MAX_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.splitNodeByKey).toHaveBeenCalled()
	})
})
