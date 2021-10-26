import { Transforms } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')

import MCAssessment from './editor-registration'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const MCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

jest.mock('./converter', () => ({}))

describe('MCAssessment editor', () => {
	test('plugins.renderNode renders a MCAssessment when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MCASSESSMENT_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCAssessment.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('normalizeNode calls next if the node is not a MCAssessment node', () => {
		const next = jest.fn()
		MCAssessment.plugins.normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on MCAssessment calls next if all MCAssessment children are valid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCASSESSMENT_NODE,
							content: {},
							children: [
								{
									type: MCHOICE_NODE,
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
		MCAssessment.plugins.normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on MCAssessment calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCASSESSMENT_NODE,
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
		MCAssessment.plugins.normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on MCAssessment calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: QUESTION_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCASSESSMENT_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		MCAssessment.plugins.normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on MCAssessment calls Transforms with invalid parent', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCASSESSMENT_NODE,
					content: {},
					children: [
						{
							type: MCHOICE_NODE,
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
		MCAssessment.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})
})
