import { Transforms } from 'slate'

import Converter from './converter'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const LIST_NODE = 'ObojoboDraft.Chunks.List'

describe('Heading Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {},
			children: [{ text: 'mockText', b: true }]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with content', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				triggers: 'mock-triggers',
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

	test('switchType[TEXT_NODE] changes blocks to text nodes', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)
		Converter.switchType[TEXT_NODE]({}, [{ content: {} }, [0]])

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			{},
			{ 
				type: TEXT_NODE, 
				subtype: TEXT_LINE_NODE,
				content: { indent: 0 }
			},
			{ at: [0] }
		)
	})

	test('switchType[HEADING_NODE] changes blocks headinglLevel', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)
		Converter.switchType[HEADING_NODE]({}, [{ content: {} }, [0]], { headingLevel: 2 })

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			{},
			{ 
				content: { headingLevel: 2 }
			},
			{ at: [0] }
		)
	})

	test('switchType[CODE_NODE] changes blocks to code nodes', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)
		Converter.switchType[CODE_NODE]({}, [{ content: {} }, [0]])

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			{},
			{ 
				type: CODE_NODE, 
				subtype: CODE_LINE_NODE,
				content: { indent: 0 }
			},
			{ at: [0] }
		)
	})

	test('switchType[LIST_NODE] changes blocks to list nodes', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValue(true)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValue(true)
		Converter.switchType[LIST_NODE]({}, [{ content: {} }, [0]])

		expect(Transforms.removeNodes).toHaveBeenCalled()
		expect(Transforms.insertNodes).toHaveBeenCalled()
	})
})
