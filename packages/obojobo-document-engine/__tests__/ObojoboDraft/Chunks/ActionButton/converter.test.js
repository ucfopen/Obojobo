import Converter from 'ObojoboDraft/Chunks/ActionButton/converter'

describe('ActionButton Converter', () => {
	test('slateToObo converts a Slate node', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return {
						actions: [
							{
								type: 'mockType',
								value: ''
							},
							{
								type: 'mockOtherType',
								value: '{"id": "mockId"}'
							}
						]
					}
				}
			}
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { label: 'mockLabel' }
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node using a textGroup', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { textGroup: [{ text: { value: 'mockLabel' } }] }
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with triggers', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				label: 'mockLabel',
				triggers: [
					{
						actions: [{ type: 'mockType' }, { type: 'mockOtherType', value: { id: 'mockId' } }]
					}
				]
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
