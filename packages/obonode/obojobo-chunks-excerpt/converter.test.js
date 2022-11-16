// import { Transforms } from 'slate'
import Converter from './converter'

import Common from 'obojobo-document-engine/src/scripts/common'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const EXCERPT_NODE = 'ObojoboDraft.Chunks.Excerpt'

describe('Excerpt Converter', () => {
	const mockSlateToObo = jest.fn(() => ({ type: 'OboNode' }))
	const mockOboToSlate = jest.fn(() => ({ type: 'SlateNode' }))

	const mockGetItemForType = jest
		.spyOn(Common.Registry, 'getItemForType')
		.mockImplementation(() => ({
			slateToObo: mockSlateToObo,
			oboToSlate: mockOboToSlate
		}))

	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			id: 'mockKey',
			type: EXCERPT_NODE,
			content: {},
			children: [
				{
					id: 'mockKey',
					type: 'mockType',
					content: {},
					children: [{ text: 'Excerpt text', b: true, type: TEXT_NODE }]
				},
				{
					type: 'mockType',
					content: { hangingIndent: 0, indent: 0 },
					children: [
						{
							type: 'mockType',
							content: { hangingIndent: 0, indent: 0 },
							children: [{ text: 'Citation Line' }]
						}
					]
				}
			]
		}

		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with triggers', () => {
		const slateNode = {
			id: 'mockKey',
			type: EXCERPT_NODE,
			content: { triggers: 'mock-triggers' },
			children: [
				{
					id: 'mockKey',
					type: 'mockType',
					content: {},
					children: [{ text: 'Excerpt text', b: true, type: TEXT_NODE }]
				},
				{
					type: 'mockType',
					content: { hangingIndent: 0, indent: 0 },
					children: [
						{
							type: 'mockType',
							content: { hangingIndent: 0, indent: 0 },
							children: [{ text: 'Citation Line' }]
						}
					]
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()

		expect(mockGetItemForType).toHaveBeenCalled()
		expect(mockGetItemForType).toHaveBeenCalledWith(TEXT_NODE)
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const nodeChild = { type: 'OboNode' }

		const oboNode = {
			id: 'mockKey',
			type: EXCERPT_NODE,
			children: [nodeChild],
			content: {
				font: 'monospace',
				bodyStyle: 'term-green',
				citation: [{}]
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()

		expect(mockOboToSlate).toHaveBeenCalledWith(nodeChild)
	})

	test('oboToSlate converts an OboNode to a Slate node with citation line', () => {
		const oboNode = {
			id: 'mockKey',
			type: EXCERPT_NODE,
			children: [{ type: 'OboNode' }],
			content: {
				font: 'monospace',
				bodyStyle: 'term-green',
				citation: [
					{
						data: { align: 'center', indent: 0, hangingIndent: 0 },
						text: { value: 'Citation Text', styleList: [] }
					}
				]
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
