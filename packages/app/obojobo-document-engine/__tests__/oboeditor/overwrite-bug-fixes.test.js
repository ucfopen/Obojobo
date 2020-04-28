import { Transforms, createEditor, Editor, Text } from 'slate'

import 'src/scripts/oboeditor/overwrite-bug-fixes'

jest.mock('src/scripts/common/util/modal-util')

describe('Clipboard Util', () => {
	beforeAll(() => {
		document.execCommand = jest.fn()
		document.createElement = jest.fn()
		document.body.appendChild = jest.fn()
		document.body.removeChild = jest.fn()
	})

	test('merge returns with no selection', () => {
		const editor = {
			apply: jest.fn()
		}
		Transforms.mergeNodes(editor, {})
		expect(editor.apply).not.toHaveBeenCalled()
	})

	test('merge combines with empty block', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: '' }]
			},
			{
				type: 'block',
				children: [{ text: 'one' }]
			}
		]

		editor.selection = {
			anchor: { path: [1, 0], offset: 0 },
			focus: { path: [1, 0], offset: 1 }
		}

		Transforms.mergeNodes(editor, { match: n => Editor.isBlock(editor, n) })
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [{ text: 'ne' }]
			}
		])
	})

	test('merge cannot combine with non-existant node', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: 'one' }]
			}
		]

		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 0 }
		}

		Transforms.mergeNodes(editor, { match: n => Editor.isBlock(editor, n) })
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [{ text: 'one' }]
			}
		])
	})

	test('merge combines two blocks', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: 'one' }]
			},
			{
				type: 'block',
				children: [{ text: 'two' }]
			}
		]

		editor.selection = {
			anchor: { path: [1, 0], offset: 0 },
			focus: { path: [1, 0], offset: 0 }
		}

		Transforms.mergeNodes(editor, { match: n => Editor.isBlock(editor, n) })
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [{ text: 'onetwo' }]
			}
		])
	})

	test('merge combines two blocks', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: 'one' }]
			},
			{
				type: 'block',
				children: [{ text: 'two' }]
			}
		]

		Transforms.mergeNodes(editor, { at: [1] })
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [{ text: 'onetwo' }]
			}
		])
	})

	test('merge combines two nested blocks', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [
					{
						type: 'block',
						children: [{ text: 'one' }]
					}
				]
			},
			{
				type: 'block',
				children: [
					{
						type: 'block',
						children: [{ text: 'two' }]
					}
				]
			}
		]

		Transforms.mergeNodes(editor, { at: [1] })
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [
					{
						type: 'block',
						children: [{ text: 'one' }]
					},
					{
						type: 'block',
						children: [{ text: 'two' }]
					}
				]
			}
		])
	})

	test('merge combines two deeply nested blocks', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: 'one' }]
			},
			{
				type: 'block',
				children: [
					{
						type: 'block',
						children: [
							{
								type: 'block',
								children: [{ text: 'two' }]
							},
							{
								type: 'block',
								children: [{ text: 'three' }]
							}
						]
					}
				]
			}
		]

		editor.selection = {
			anchor: { path: [1, 0, 0, 0], offset: 0 },
			focus: { path: [1, 0, 0, 0], offset: 0 }
		}

		Transforms.mergeNodes(editor, {})
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [{ text: 'onetwo' }]
			},
			{
				type: 'block',
				children: [
					{
						type: 'block',
						children: [
							{
								type: 'block',
								children: [{ text: 'three' }]
							}
						]
					}
				]
			}
		])
	})

	test('merge combines text across blocks', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: 'one' }]
			},
			{
				type: 'block',
				children: [{ text: 'two' }]
			}
		]

		Transforms.mergeNodes(editor, { at: [1, 0], match: Text.isText })
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [{ text: 'onetwo' }]
			}
		])
	})

	test('merge combines text across voids', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: 'one' }, { text: 'two' }]
			}
		]
		editor.isVoid = () => true

		Transforms.mergeNodes(editor, { at: [0, 1], voids: true })
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [{ text: 'onetwo' }]
			}
		])
	})

	test('merge delete with specified at', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: '' }]
			},
			{
				type: 'block',
				children: [{ text: 'one' }]
			}
		]

		editor.selection = {
			anchor: { path: [1, 0], offset: 0 },
			focus: { path: [1, 0], offset: 1 }
		}

		Transforms.mergeNodes(editor, { at: editor.selection })
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [{ text: 'ne' }]
			}
		])
	})

	test('merge edge-case: merging with editor', () => {
		jest.spyOn(Editor, 'previous').mockReturnValueOnce([{}, []])

		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: '' }]
			},
			{
				type: 'block',
				children: [{ text: 'one' }]
			}
		]

		editor.selection = {
			anchor: { path: [1, 0], offset: 0 },
			focus: { path: [1, 0], offset: 1 }
		}

		Transforms.mergeNodes(editor, { match: n => Editor.isBlock(editor, n) })
		expect(editor.children).toEqual([
			{
				type: 'block',
				children: [{ text: '' }]
			},
			{
				type: 'block',
				children: [{ text: 'ne' }]
			}
		])
	})

	test('merge edge-case: merging incompatable nodes', () => {
		jest.spyOn(Editor, 'previous').mockReturnValueOnce([{ text: 'one' }, [0]])

		const editor = createEditor()
		editor.children = [
			{
				type: 'block',
				children: [{ text: 'one' }]
			},
			{
				type: 'block',
				children: [{ text: 'two' }]
			}
		]

		editor.selection = {
			anchor: { path: [1, 0], offset: 0 },
			focus: { path: [1, 0], offset: 0 }
		}

		expect(() => Transforms.mergeNodes(editor, {})).toThrow()
	})
})
