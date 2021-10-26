import { Transforms } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')

import MCAnswer from './editor-registration'

const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		contentTypes: ['ObojoboDraft.Chunks.Text']
	}
}))

jest.mock('./converter', () => ({}))

describe('MCAnswer editor', () => {
	test('plugins.renderNode renders a node', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MCANSWER_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCAnswer.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('normalizeNode calls next if the node is not a MCAnswer node', () => {
		const next = jest.fn()
		MCAnswer.plugins.normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on MCAnswer calls next if all MCAnswer children are valid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCCHOICE_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCANSWER_NODE,
							content: {},
							children: [
								{
									type: TEXT_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		MCAnswer.plugins.normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on MCAnswer calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCCHOICE_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCANSWER_NODE,
							content: {},
							children: [
								{
									type: 'improperNode',
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		MCAnswer.plugins.normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on MCAnswer calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCCHOICE_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCANSWER_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		MCAnswer.plugins.normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on MCFeedback calls Transforms with invalid parent', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCANSWER_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0])
		})
		MCAnswer.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})
})
