import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Code from './editor'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

describe('Code editor', () => {
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

		expect(Code.plugins.renderNode(props)).toMatchSnapshot()
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

		expect(Code.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			Code.plugins.renderPlaceholder({
				node: {
					object: 'text'
				}
			})
		).toMatchSnapshot()

		expect(
			Code.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: 'mockType'
				}
			})
		).toMatchSnapshot()

		expect(
			Code.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: CODE_LINE_NODE,
					text: 'Some text'
				}
			})
		).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder renders a placeholder', () => {
		expect(
			Code.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: CODE_LINE_NODE,
					text: ''
				}
			})
		).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no code', () => {
		const change = {
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
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete]', () => {
		const change = {
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

		Code.plugins.onKeyDown(event, change)
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] on empty code', () => {
		const change = {
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
					text: ''
				}
			}
		}
		change.removeNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Backspace',
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, change)

		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		const change = {
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
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, change)

		expect(change.insertBlock).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab]', () => {
		const change = {
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
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab] with indented code', () => {
		const change = {
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
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const change = {
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
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab] in fully indented nodes', () => {
		const change = {
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
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random keys', () => {
		const change = {
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
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'e',
			preventDefault: jest.fn()
		}

		Code.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in code', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Code.plugins.schema.blocks[CODE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 5 } },
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid last block in code', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		Code.plugins.schema.blocks[CODE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(change.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes required children in code', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Code.plugins.schema.blocks[CODE_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize does nothing to invalid children in code line', () => {
		const change = {
			unwrapBlockByKey: jest.fn()
		}

		Code.plugins.schema.blocks[CODE_LINE_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: { nodes: { size: 5 } },
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.unwrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid last block in code line', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		Code.plugins.schema.blocks[CODE_LINE_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(change.unwrapNodeByKey).toHaveBeenCalled()
	})
})
