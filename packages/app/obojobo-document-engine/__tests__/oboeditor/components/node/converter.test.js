jest.mock('Common', () => ({
	Registry: {
		getItemForType: node => {
			if (node === 'ignoreMe') {
				return {
					slateToObo: jest.fn().mockReturnValue({ type: 'mockSlateNode' }),
					oboToSlate: jest.fn().mockReturnValue({ type: 'mockOboNode' }),
					ignore: true
				}
			}
			return {
				slateToObo: jest.fn().mockReturnValue({ type: 'mockSlateNode' }),
				oboToSlate: jest.fn().mockReturnValue({ type: 'mockOboNode' })
			}
		}
	}
}))

import Converter from 'src/scripts/oboeditor/components/node/converter'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('Component converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			nodes: [
				{
					type: BREAK_NODE,
					data: { get: () => ({ width: 'large' }) }
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType'
		}
		const slateNode = Converter.oboToSlate(oboNode)
		expect(slateNode).toMatchSnapshot()

		const ignoreMeNode = {
			type: 'ignoreMe'
		}
		const ignoredSlateNode = Converter.oboToSlate(ignoreMeNode)
		expect(ignoredSlateNode).toMatchSnapshot()
	})
})
