import { Transforms } from 'slate'
jest.mock('slate-react')
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')

import normalizeNode from './normalize-node'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

describe('Normalize List', () => {
	test('normalizeNode calls next if the node is not a List node', () => {
		const next = jest.fn()
		normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on List calls next if all List children are valid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on List calls Transforms on consecutive ListLevels', () => {
		jest.spyOn(Transforms, 'mergeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						},
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.mergeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on ordered List calls Transforms to wrap loose ListLines', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: { listStyles: { type: 'ordered' } },
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LINE_NODE,
							content: {},
							children: [{ text: 'mockList', b: true }]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on unordered List calls Transforms to wrap loose ListLines', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: { listStyles: { type: 'unordered' } },
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LINE_NODE,
							content: {},
							children: [{ text: 'mockList', b: true }]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on List calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: 'improperNode',
							content: { indent: 1 },
							children: [{ text: 'mockList', b: true }]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('normalizeNode on List calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [{ text: 'mockList', b: true }]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on ListLevel calls next if all ListLevel children are valid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: { listStyles: { type: 'ordered' } },
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'ordered', bulletStyle: 'decimal' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on ListLevel merges consecutive ListLines', () => {
		jest.spyOn(Transforms, 'mergeNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: {},
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LINE_NODE,
											content: {},
											children: [{ text: 'mockList', b: true }]
										}
									]
								},
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: {},
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LINE_NODE,
											content: {},
											children: [{ text: 'mockList', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.mergeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on ListLevel handles invalid child type ordered', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: { 
						listStyles: { 
							indents: {
								0: { bulletStyle: 'circle' }
							}
						} 
					},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'ordered', bulletStyle: 'alpha' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: { type: 'unordered' },
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LINE_NODE,
											content: {},
											children: [{ text: 'mockList', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('normalizeNode on ListLevel handles invalid child type unordered', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: { listStyles: { type: 'ordered' } },
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'unordered', bulletStyle: 'disc' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: { type: 'ordered' },
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LINE_NODE,
											content: {},
											children: [{ text: 'mockList', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('normalizeNode on ListLevel calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { indent: 1 },
							children: [
								{
									type: 'invalidNode',
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('normalizeNode on ListLevel calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockList', b: true }]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on ListLevel calls NormalizeUtil if parent is invalid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: 'invalidNode',
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0])
		})

		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})

	test('normalizeNode on ListLine calls next if all ListLine children are valid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0].children[0], [0, 0, 0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on ListLine calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { indent: 1 },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [
										{
											type: 'invalidNode',
											children: [{ text: 'mockList', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		normalizeNode([editor.children[0].children[0].children[0], [0, 0, 0]], editor, next)

		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('normalizeNode on ListLine calls NormalizeUtil if parent is invalid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: 'invalidNode',
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false,
			isVoid: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0].children[0])
		})

		normalizeNode([editor.children[0].children[0].children[0], [0, 0, 0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})
})
