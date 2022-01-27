import { Transforms, createEditor } from 'slate'

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		insertableItems: ['ObojoboDraft.Chunks.Break']
	},
	models: {
		OboModel: {
			create: jest.fn().mockImplementation(type => {
				if (type) return { setId: jest.fn() }
			})
		}
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common'
const { OboModel } = Common.models

import OboNodePlugin from 'src/scripts/oboeditor/plugins/obonode-plugin'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

describe('ClipboardPlugin', () => {
	beforeAll(() => {
		OboModel.models = {
			mockId1: { type: 'mockNode1' },
			mockId2: { type: 'mockNode2' },
			mockId3: { type: 'mockNode3' }
		}
	})
	test('plugins.normalizeNode calls next if the node is not an Editor', () => {
		const next = jest.fn()
		OboNodePlugin.normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls next if all Editor children are valid', () => {
		const editor = createEditor()
		editor.children = [
			{
				type: ASSESSMENT_NODE,
				children: [{ text: '' }]
			}
		]
		const next = jest.fn()

		OboNodePlugin.normalizeNode([editor, []], editor, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls Transforms if no editor children', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const editor = createEditor()
		editor.children = []
		const next = jest.fn()

		OboNodePlugin.normalizeNode([editor, []], editor, next)
		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls Transforms if children are invalid', () => {
		jest.spyOn(Transforms, 'unwrapNodes').mockReturnValueOnce(true)

		const editor = createEditor()
		editor.children = [
			{
				type: 'invalid node',
				children: [{ text: '' }]
			}
		]
		const next = jest.fn()

		OboNodePlugin.normalizeNode([editor, []], editor, next)
		expect(Transforms.unwrapNodes).toHaveBeenCalled()
	})

	test('plugins.apply calls next if not editing a node', () => {
		const next = jest.fn()
		OboNodePlugin.apply({}, {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.apply calls next if not creating or deleting', () => {
		const next = jest.fn()
		OboNodePlugin.apply(
			{
				path: [0],
				type: 'set_node'
			},
			{},
			next
		)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.apply calls next when inserting non-Obo nodes', () => {
		const next = jest.fn()

		const editor = {
			isInline: () => false
		}

		OboNodePlugin.apply(
			{
				path: [0],
				type: 'insert_node',
				node: {
					subtype: 'mock minor node',
					children: [{ text: '' }]
				}
			},
			editor,
			next
		)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.apply changes id when inserting Obo nodes', () => {
		const next = jest.fn()

		const editor = {
			isInline: () => false
		}

		OboNodePlugin.apply(
			{
				path: [0],
				type: 'insert_node',
				node: {
					type: 'mock obo node',
					id: 'overwritten id',
					children: [
						{
							type: 'not a type',
							children: [{ text: '' }]
						}
					]
				}
			},
			editor,
			next
		)

		expect(OboModel.create).toHaveBeenCalled()
	})

	test('plugins.apply calls next when splitting non-Obo nodes', () => {
		const next = jest.fn()

		const editor = {
			isInline: () => false,
			children: [
				{
					subtype: 'mock minor node',
					children: [{ text: '' }]
				}
			]
		}

		OboNodePlugin.apply(
			{
				path: [0],
				type: 'split_node',
				properties: {
					subtype: 'mock minor node',
					children: [{ text: '' }]
				}
			},
			editor,
			next
		)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.apply changes id when splitting Obo nodes', () => {
		const next = jest.fn()

		const editor = {
			isInline: () => false,
			children: [
				{
					type: 'mock obo node',
					id: 'overwritten id',
					children: [{ text: '' }]
				}
			]
		}

		OboNodePlugin.apply(
			{
				path: [0],
				type: 'split_node',
				properties: {
					type: 'mock obo node',
					id: 'overwritten id',
					children: [{ text: '' }]
				}
			},
			editor,
			next
		)

		expect(OboModel.create).toHaveBeenCalled()
	})

	test('plugins.apply does not delete when merging non-obonodes', () => {
		const next = jest.fn()

		const editor = {
			isInline: () => false,
			children: [
				{
					subtype: 'mock minor node',
					id: 'mockId1',
					children: [{ text: '' }]
				}
			]
		}

		OboNodePlugin.apply(
			{
				path: [0],
				type: 'merge_node'
			},
			editor,
			next
		)

		expect(OboModel.models).toMatchSnapshot()
	})

	test('plugins.apply deletes models when deleting', () => {
		const next = jest.fn()

		const editor = {
			isInline: () => false,
			children: [
				{
					type: 'mock minor node',
					id: 'mockId2',
					children: [{ text: '' }]
				}
			]
		}

		OboNodePlugin.apply(
			{
				path: [0],
				type: 'remove_node'
			},
			editor,
			next
		)

		expect(OboModel.models).toMatchSnapshot()
	})
})
