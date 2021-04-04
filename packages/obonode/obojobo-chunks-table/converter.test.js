import Converter from './converter'

describe('Table Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { header: true },
			children: [
				{
					type: 'mockRow',
					children: [
						{
							type: 'mockCell',
							children: [{ text: 'MockText', b: true }]
						}
					]
				}
			]
		}
		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				header: true,
				display: 'auto',
				textGroup: {
					numCols: 2,
					textGroup: [
						{
							text: { value: 'Mock1' }
						},
						{
							text: { value: 'Mock2' }
						},
						{
							text: { value: 'Mock3' }
						},
						{
							text: { value: 'Mock4' }
						}
					]
				},
				triggers: 'mock-triggers'
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate handles defaults for the display property', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				header: true,
				textGroup: {
					numCols: 2,
					textGroup: [
						{
							text: { value: 'Mock1' }
						},
						{
							text: { value: 'Mock2' }
						},
						{
							text: { value: 'Mock3' }
						},
						{
							text: { value: 'Mock4' }
						}
					]
				},
				triggers: 'mock-triggers'
			}
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test.each`
		input                                               | output
		${''}                                               | ${'fixed'}
		${'fixed'}                                          | ${'fixed'}
		${'auto'}                                           | ${'auto'}
		${'invalid-value'}                                  | ${'fixed'}
		${'  FIxEd  '}                                      | ${'fixed'}
		${'  aUTO  '}                                       | ${'auto'}
		${true}                                             | ${'fixed'}
		${false}                                            | ${'fixed'}
		${'true'}                                           | ${'fixed'}
		${'false'}                                          | ${'fixed'}
		${null}                                             | ${'fixed'}
		${'null'}                                           | ${'fixed'}
		${undefined /* eslint-disable-line no-undefined */} | ${'fixed'}
		${'undefined'}                                      | ${'fixed'}
	`('display property "$input" = "$output"', ({ input, output }) => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				display: input,
				textGroup: {
					numCols: 2,
					textGroup: [
						{
							text: { value: 'Mock1' }
						},
						{
							text: { value: 'Mock2' }
						},
						{
							text: { value: 'Mock3' }
						},
						{
							text: { value: 'Mock4' }
						}
					]
				}
			}
		}

		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode.content.display).toBe(output)
	})
})
