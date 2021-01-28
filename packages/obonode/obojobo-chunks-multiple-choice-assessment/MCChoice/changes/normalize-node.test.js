import { Transforms } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')

import normalizeNode from './normalize-node'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

describe('MCChoice normalization', () => {
	test('normalizeNode calls next if the node is not a MCChoice node', () => {
		const next = jest.fn()
		normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on MCChoice calls next if all MCChoice children are valid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCCHOICE_NODE,
							content: {},
							children: [
								{
									type: MCANSWER_NODE,
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
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on MCChoice calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCCHOICE_NODE,
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
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on MCChoice calls Transforms on invalid MCFeedback children', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCCHOICE_NODE,
							content: {},
							children: [
								{
									type: MCFEEDBACK_NODE,
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
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on MCChoice calls Transforms on invalid second children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCCHOICE_NODE,
							content: {},
							children: [
								{
									type: MCANSWER_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								},
								{
									type: MCANSWER_NODE,
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
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on MCChoice calls Transforms on invalid extra children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCCHOICE_NODE,
							content: {},
							children: [
								{
									type: MCANSWER_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								},
								{
									type: MCFEEDBACK_NODE,
									content: { indent: 1 },
									children: [{ text: 'mockCode', b: true }]
								},
								{
									type: MCFEEDBACK_NODE,
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
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on MCChoice calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCASSESSMENT_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: MCCHOICE_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on MCChoice calls Transforms with invalid parent', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: MCCHOICE_NODE,
					content: {},
					children: [
						{
							type: MCANSWER_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0])
		})
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})
})
