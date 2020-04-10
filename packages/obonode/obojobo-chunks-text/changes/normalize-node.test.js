import { Transforms } from 'slate'
jest.mock('slate-react')
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')

import normalizeNode from './normalize-node'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('Normalize Text', () => {
	test('normalizeNode calls next if the node is not a Text node', () => {
		const next = jest.fn()
		normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Text calls next if all Text children are valid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockText', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Text calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: 'improperNode',
							content: { indent: 1 },
							children: [{ text: 'mockText', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Text calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TEXT_NODE,
					content: {},
					children: [{ text: 'mockText', b: true }]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on TextLine calls next if all TextLine children are valid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockText', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on TextLine calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 1 },
							children: [
								{
									type: 'invalidNode',
									children: [{ text: 'mockText', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('normalizeNode on TextLine calls NormalizeUtil if parent is invalid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: 'invalidNode',
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockText', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0])
		})
		
		normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})
})