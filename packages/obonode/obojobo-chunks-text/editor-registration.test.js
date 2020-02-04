import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

import SlateReact from 'slate-react'
jest.mock('slate-react')

jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')

import Text from './editor-registration'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('Text editor', () => {
	test('onPaste calls next if not pasting text into a TEXT_NODE', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				}
			}
		}

		const next = jest.fn()

		SlateReact.getEventTransfer.mockReturnValueOnce({ type: 'text' })

		Text.plugins.onPaste(null, editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('onPaste calls createTextLinesFromText', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						text: ''
					},
					{
						key: 'mockBlockKey',
						text: 'mock text'
					}
				],
				document: {
					getClosest: () => true
				}
			},
			createTextLinesFromText: jest.fn().mockReturnValueOnce([
				{
					key: 'mockBlockKey'
				}
			]),
			insertBlock: jest.fn(),
			removeNodeByKey: jest.fn()
		}

		const next = jest.fn()

		SlateReact.getEventTransfer.mockReturnValueOnce({
			type: 'text',
			text: 'mock text'
		})

		Text.plugins.onPaste(null, editor, next)

		expect(editor.createTextLinesFromText).toHaveBeenCalled()
	})

	test('renderNode renders text when passed', () => {
		const props = {
			node: {
				type: TEXT_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Text.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('renderNode calls next', () => {
		const props = {
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(Text.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.renderNode renders a line when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: TEXT_LINE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Text.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			Text.plugins.renderPlaceholder(
				{
					node: {
						object: 'text'
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			Text.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: 'mockType'
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			Text.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: TEXT_LINE_NODE,
						text: 'Some text'
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder renders a placeholder', () => {
		expect(
			Text.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: TEXT_LINE_NODE,
						text: '',
						data: { get: () => 'left' }
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no text', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				},
				endBlock: {
					key: 'mockKey',
					text: 'mockText'
				}
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete]', () => {
		const editor = {
			value: {
				blocks: {
					get: () => ({ key: 'mockBlockKey' }),
					some: () => true
				},
				document: {
					getClosest: (num, funct) => {
						funct({ key: 'mockKey' })
						return {
							key: 'mockParent',
							nodes: { size: 1 }
						}
					}
				},
				endBlock: {
					key: 'mockKey',
					text: 'mockText'
				}
			}
		}
		editor.removeNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Backspace',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.removeNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] deletes empty text node', () => {
		const editor = {
			value: {
				blocks: {
					get: () => ({ key: 'mockBlockKey', text: '' }),
					some: () => true
				},
				document: {
					getClosest: (num, funct) => {
						funct({ key: 'mockKey' })
						return {
							key: 'mockParent',
							nodes: { size: 1 }
						}
					}
				}
			}
		}
		editor.removeNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with first [Enter]', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => true
				},
				endBlock: {
					key: 'mockKey',
					text: 'mockText'
				}
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.insertBlock).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with second [Enter]', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => true
				},
				endBlock: {
					key: 'mockKey',
					text: ''
				}
			}
		}
		editor.removeNodeByKey = jest.fn().mockReturnValueOnce(editor)
		editor.splitBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab]', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 0 }
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		editor.setNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab] with indented text', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 6 }
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		editor.setNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Alt]+[Tab]', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 0 }
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		editor.setNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			altKey: true,
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).toHaveBeenCalledWith('mockBlockKey', {
			data: { indent: 1 }
		})
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Alt]+[Tab] with 20 indents', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 20 }
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		editor.setNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			altKey: true,
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).toHaveBeenCalledWith('mockBlockKey', {
			data: { indent: 20 }
		})
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 0 }
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		editor.insertText = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.insertText).toHaveBeenCalledWith('\t')
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random keys', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 0 }
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return true
					}
				}
			}
		}
		editor.setNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'e',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in text', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 5 }, data: { get: () => false } },
			child: { key: 'mockKey' },
			index: null
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in text', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid oboeditor.component block in text', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey', type: 'oboeditor.component' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes required children in text', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in text line', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_LINE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 5 } },
			child: { key: 'mockKey' },
			index: null
		})

		expect(editor.unwrapNodeByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in text line', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_LINE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('queries.createTextLinesFromText builds text lines', () => {
		const editor = {}

		const blocks = Text.plugins.queries.createTextLinesFromText(editor, ['mock text'])

		expect(blocks).toMatchSnapshot()
	})
})
