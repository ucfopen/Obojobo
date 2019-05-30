import SlateReact from 'slate-react'
jest.mock('slate-react')

import Code from './editor'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

describe('Code editor', () => {
	test('onPaste calls next if not pasting text into a CODE_NODE', () => {
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

		Code.plugins.onPaste(null, editor, next)

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
			createCodeLinesFromText: jest.fn().mockReturnValueOnce([
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

		Code.plugins.onPaste(null, editor, next)

		expect(editor.createCodeLinesFromText).toHaveBeenCalled()
	})

	test('plugins.renderNode renders code when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: CODE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Code.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
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

		expect(Code.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.renderNode renders a line when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: CODE_LINE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Code.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			Code.plugins.renderPlaceholder(
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
			Code.plugins.renderPlaceholder(
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
			Code.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: CODE_LINE_NODE,
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
			Code.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: CODE_LINE_NODE,
						text: ''
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no code', () => {
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

		Code.plugins.onKeyDown(event, editor, jest.fn())

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

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, editor, jest.fn())
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] on empty code', () => {
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
			key: 'Backspace',
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.insertBlock).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab]', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 0 }
							}
						}
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

		Code.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab] with indented code', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 6 }
							}
						}
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

		Code.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 0 }
							}
						}
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
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab] in fully indented nodes', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 20 }
							}
						}
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
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random keys', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 0 }
							}
						}
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

		Code.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('queries.createCodeLinesFromText builds text lines', () => {
		const editor = {}

		const blocks = Code.plugins.queries.createCodeLinesFromText(editor, ['mock text'])

		expect(blocks).toMatchSnapshot()
	})
})
