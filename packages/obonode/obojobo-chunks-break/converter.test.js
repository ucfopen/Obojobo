import Converter from './converter'

describe('Break Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {}
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { width: 'large', triggers: 'mock-triggers' }
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node and sets a default width', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {} // not sending width here
		}
		const slateNode = Converter.oboToSlate(oboNode)
		expect(slateNode).toHaveProperty('content.width', 'normal')
	})
})
