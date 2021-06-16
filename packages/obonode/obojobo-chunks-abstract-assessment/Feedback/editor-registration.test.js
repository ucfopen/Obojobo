import { Transforms } from 'slate'
import React from 'react'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')

import Feedback from './editor-registration'
import { CHOICE_NODE, FEEDBACK_NODE } from '../constants'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

jest.mock('obojobo-document-engine/src/scripts/common', () => ({
	Registry: {
		contentTypes: ['ObojoboDraft.Chunks.Text']
	},
	components: {
		// eslint-disable-next-line react/display-name
		Button: props => <button {...props}>{props.children}</button>
	}
}))
jest.mock('./converter', () => ({}))

describe('Feedback editor', () => {
	test('plugins.renderNode renders a node', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: FEEDBACK_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Feedback.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('normalizeNode calls next if the node is not a Feedback node', () => {
		const next = jest.fn()
		Feedback.plugins.normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Feedback calls next if all Feedback children are valid', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: CHOICE_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: FEEDBACK_NODE,
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
		Feedback.plugins.normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Feedback calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: CHOICE_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: FEEDBACK_NODE,
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
		Feedback.plugins.normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Feedback calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: CHOICE_NODE,
					content: {},
					children: [
						{
							id: 'mockKey',
							type: FEEDBACK_NODE,
							content: {},
							children: [{ text: 'mockCode', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		Feedback.plugins.normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Feedback calls Transforms with invalid parent', () => {
		const next = jest.fn()
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: FEEDBACK_NODE,
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
		Feedback.plugins.normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})
})
