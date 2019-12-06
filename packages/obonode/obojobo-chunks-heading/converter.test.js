jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')

import Converter from './converter'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const LIST_NODE = 'ObojoboDraft.Chunks.List'

describe('Heading Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => ({})
			},
			text: 'mockText',
			nodes: [
				{
					leaves: [
						{
							text: 'mockText',
							marks: [
								{
									type: 'b',
									data: {}
								}
							]
						}
					]
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with a caption', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				textGroup: [
					{
						text: { value: 'mockText' }
					},
					{
						text: { value: 'mockText' },
						data: { align: 'left' }
					}
				]
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('switchType to text calls editor.setNodeByKey', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}
		Converter.switchType[TEXT_NODE](editor, { key: 'mockKey' })

		expect(editor.setNodeByKey).toHaveBeenCalled
	})

	test('switchType to Heading calls editor.setNodeByKey', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}
		const node = {
			key: 'mockKey',
			data: { get: () => ({}) }
		}

		Converter.switchType[HEADING_NODE](editor, node, { level: 1 })

		expect(editor.setNodeByKey).toHaveBeenCalled
	})

	test('switchType to code calls editor.setNodeByKey', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}
		Converter.switchType[CODE_NODE](editor, { key: 'mockKey' })

		expect(editor.setNodeByKey).toHaveBeenCalled
	})

	test('switchType[LIST_NODE] changes leaf blocks to code nodes', () => {
		const editor = {
			focus: jest.fn(),
			removeNodeByKey: jest.fn(),
			value: {}
		}

		editor.replaceNodeByKey = jest.fn().mockReturnValue(editor)
		editor.moveToRangeOfNode = jest.fn().mockReturnValue(editor)
		const node = {
			key: 'mockKey',
			data: { get: () => ({}) },
			toJSON: () => ({
				nodes: []
			})
		}

		Converter.switchType[LIST_NODE](editor, node)

		expect(editor.replaceNodeByKey).toHaveBeenCalled()
	})
})
