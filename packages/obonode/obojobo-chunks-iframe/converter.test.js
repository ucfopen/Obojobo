import Converter from './converter'
import IFrameSizingTypes from './iframe-sizing-types'

describe('IFrame Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {},
			text: 'mockText'
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with content sizing set to text width', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { sizing: IFrameSizingTypes.TEXT_WIDTH },
			text: 'mockText'
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with content sizing set to max width', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { sizing: IFrameSizingTypes.MAX_WIDTH },
			text: 'mockText'
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with media defaults', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { type: 'media' }
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with webpage defaults', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { type: 'webpage' }
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with triggers', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { triggers: 'mock-triggers' }
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with content size set to text width', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { sizing: IFrameSizingTypes.TEXT_WIDTH }
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
