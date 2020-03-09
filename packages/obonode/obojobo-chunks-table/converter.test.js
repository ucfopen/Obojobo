import Converter from './converter'

describe('Table Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: {
				get: () => ({
					data: {
						get: () => ({ header: true })
					}
				}),
				size: 2,
				forEach: funct => {
					funct({
						nodes: [
							{
								text: 'MockText',
								nodes: [
									{
										leaves: [
											{
												text: 'MockText',
												marks: [
													{
														type: 'b',
														data: {
															toJSON: () => true
														}
													}
												]
											}
										]
									}
								]
							}
						]
					})
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
			content: {
				header: true,
				textGroup: {
					numCols: 2,
					caption: {
						text: {
							value: 'caption',
							styleList: []
						}
					},
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
})
