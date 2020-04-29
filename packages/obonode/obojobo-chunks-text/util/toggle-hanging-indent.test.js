import { Transforms } from 'slate'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

describe('toggleHangingIndet', () => {
	test('inverses hangingIndent on text line nodes', () => {
		// setup
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const editor = {
			children: [
				{
					type: TEXT_NODE,
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 0 },
							children: [{ text: 'mockText' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		const toggleHangingIndent = require('./toggle-hanging-indent').default

		// pre-test-verification
		expect(Transforms.setNodes).not.toHaveBeenCalled()

		// execute
		toggleHangingIndent([{}, [0]], editor)

		// verify
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('inverses hangingIndent on list line nodes', () => {
		// setup
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const editor = {
			children: [
				{
					type: LIST_NODE,
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'ordered', bulletStyle: 'alpha' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: { indent: 0 },
									children: [{ text: 'mockText' }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		const toggleHangingIndent = require('./toggle-hanging-indent').default

		// execute
		toggleHangingIndent([{}, [0]], editor)

		// verify
		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
