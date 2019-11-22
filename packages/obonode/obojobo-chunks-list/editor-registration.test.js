import SlateReact from 'slate-react'
jest.mock('slate-react')

import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

import List from './editor-registration'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

describe('List editor', () => {
	test('onPaste calls next if not pasting text into a LIST_NODE', () => {
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

		List.plugins.onPaste(null, editor, next)

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
			createListLinesFromText: jest.fn().mockReturnValueOnce([
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

		List.plugins.onPaste(null, editor, next)

		expect(editor.createListLinesFromText).toHaveBeenCalled()
	})

	test('plugins.renderNode renders List', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: LIST_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(List.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode renders a List level', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: LIST_LEVEL_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(List.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode renders a list line', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: LIST_LINE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(List.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			List.plugins.renderPlaceholder(
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
			List.plugins.renderPlaceholder(
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
			List.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: LIST_LINE_NODE,
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
			List.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: LIST_LINE_NODE,
						text: '',
						data: { get: () => 'left' }
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
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

		expect(List.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with no list', () => {
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

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] with normal delete', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
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
				},
				selection: {
					isCollapsed: true
				}
			}
		}

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, editor, jest.fn())
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] on lists with more than one node', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (num, funct) => {
						funct({ key: 'mockKey' })
						return {
							key: 'mockParent',
							nodes: { size: 3 }
						}
					}
				},
				endBlock: {
					key: 'mockKey',
					text: ''
				},
				selection: {
					isCollapsed: true
				}
			}
		}
		editor.removeNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Backspace',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] on lists with one node', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
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
					key: 'mockLastKey',
					text: ''
				},
				selection: {
					isCollapsed: true
				}
			}
		}
		editor.unwrapNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).toHaveBeenCalled()
		expect(editor.unwrapNodeByKey).toHaveBeenCalledWith('mockLastKey')
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] on lists with one top level node', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: jest
						.fn()
						.mockReturnValueOnce({}) // isType call
						.mockReturnValueOnce({
							key: 'mockLevel',
							nodes: { size: 1 }
						}) // listLevel
						.mockReturnValueOnce() // oneLevel
						.mockImplementationOnce((key, funct) => {
							funct({ key: 'mockKey' })
							return {
								key: 'mockParent',
								nodes: { size: 1 }
							}
						}) // parent
				},
				endBlock: {
					key: 'mockLastKey',
					text: ''
				},
				selection: {
					isCollapsed: true
				}
			}
		}
		editor.removeNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).toHaveBeenCalled()
		expect(editor.removeNodeByKey).toHaveBeenCalledWith('mockParent')
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
					text: ''
				},
				selection: {
					isCollapsed: false
				}
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.insertBlock).not.toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with double [Enter] on last node', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (num, funct) => {
						funct({ key: 'mockKey' })
						return {
							key: 'mockParent',
							nodes: {
								size: 1,
								last: () => ({ key: 'mockKey' })
							}
						}
					}
				},
				endBlock: {
					key: 'mockKey',
					text: ''
				},
				selection: {
					isCollapsed: true
				}
			}
		}
		editor.setNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
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
		editor.unwrapBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.unwrapBlock).toHaveBeenCalled()
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
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return {
							data: {
								get: () => {
									return {
										bulletStyle: 'square',
										type: 'unordered'
									}
								}
							}
						}
					}
				}
			}
		}
		editor.wrapBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.wrapBlock).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab] on ordered lists', () => {
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
						return {
							data: {
								get: () => {
									return {
										bulletStyle: 'square',
										type: 'ordered'
									}
								}
							}
						}
					}
				}
			}
		}
		editor.wrapBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.wrapBlock).toHaveBeenCalled()
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

		List.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.normalizeNode exits if not applicable', () => {
		const editor = {
			mergeNodeByKey: jest.fn()
		}
		editor.withoutNormalizing = jest.fn().mockImplementationOnce(funct => funct(editor))

		List.plugins.normalizeNode(
			{
				object: 'text'
			},
			editor,
			jest.fn()
		)

		expect(editor.mergeNodeByKey).not.toHaveBeenCalled()

		List.plugins.normalizeNode(
			{
				object: 'block',
				type: 'mockNode'
			},
			editor,
			jest.fn()
		)

		expect(editor.mergeNodeByKey).not.toHaveBeenCalled()

		List.plugins.normalizeNode(
			{
				object: 'block',
				type: LIST_NODE,
				nodes: { size: 1 }
			},
			editor,
			jest.fn()
		)

		expect(editor.mergeNodeByKey).not.toHaveBeenCalled()
	})

	test('plugins.normalizeNode exits if not invalid', () => {
		const node = {
			object: 'block',
			type: LIST_NODE,
			nodes: {
				map: funct => {
					funct({ type: LIST_LEVEL_NODE }, 0)
					funct({ type: LIST_LEVEL_NODE }, 1)
					funct({ type: 'notALevel' }, 0)

					return {
						filter: () => {
							return {
								size: 0
							}
						}
					}
				},
				get: i => {
					return i === 2 ? { type: 'notALevel' } : { type: LIST_LEVEL_NODE }
				}
			}
		}

		const editor = {
			mergeNodeByKey: jest.fn()
		}
		editor.withoutNormalizing = jest.fn().mockImplementationOnce(funct => funct(editor))

		List.plugins.normalizeNode(node, editor, jest.fn())

		expect(editor.mergeNodeByKey).not.toHaveBeenCalled()
	})

	test('plugins.normalizeNode nomalizes levels next to each other', () => {
		const node = {
			object: 'block',
			type: LIST_NODE,
			nodes: {
				map: funct => {
					funct({ type: LIST_LEVEL_NODE }, 0)
					funct({ type: LIST_LEVEL_NODE }, 1)
					funct({ type: 'notALevel' }, 0)

					return {
						filter: () => {
							return {
								size: 10,
								forEach: funct => {
									funct({ key: 'mockKey1' })
								}
							}
						}
					}
				},
				get: i => {
					return i === 2 ? { type: 'notALevel' } : { type: LIST_LEVEL_NODE }
				}
			}
		}

		const editor = {
			mergeNodeByKey: jest.fn()
		}
		editor.withoutNormalizing = jest.fn().mockImplementationOnce(funct => funct(editor))

		const call = List.plugins.normalizeNode(node, editor, jest.fn())
		call(editor)

		expect(editor.mergeNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in list', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return {
							listStyles: {
								type: 'unordered'
							}
						}
					}
				},
				nodes: { size: 5 }
			},
			child: { key: 'mockKey' },
			index: null
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in list', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return {
							listStyles: {
								type: 'ordered'
							}
						}
					}
				},
				nodes: { size: 10 }
			},
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid oboeditor.component block in list', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return {
							listStyles: {
								type: 'ordered'
							}
						}
					}
				},
				nodes: { size: 10 }
			},
			child: { object: 'block', key: 'mockKey', type: 'oboeditor.component' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing child in list', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {
				data: {
					get: () => {
						return {
							listStyles: {
								type: 'ordered'
							}
						}
					}
				},
				nodes: { size: 10 }
			},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in Level', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid oboeditor.component block in Level', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey', type: 'oboeditor.component' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid text children in Level', () => {
		const editor = {
			moveToStartOfNextText: jest.fn()
		}
		editor.wrapBlockByKey = jest.fn().mockReturnValueOnce(editor)

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 5 } },
			child: { object: 'text', key: 'mockKey' },
			index: 0
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes required children in Level', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			wrapBlockByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {},
			child: { object: 'block' },
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes block children in Line', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LINE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { object: 'block' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes non-block children in Line', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LINE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { object: 'mark' },
			index: 0
		})

		expect(editor.unwrapNodeByKey).not.toHaveBeenCalled()
	})

	test('queries.createCodeLinesFromText builds text lines', () => {
		const editor = {}

		const blocks = List.plugins.queries.createListLinesFromText(editor, ['mock text'])

		expect(blocks).toMatchSnapshot()
	})
})
