import MCChoice from './editor-registration'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

describe('MCChoice editor', () => {
	test('plugins.renderNode renders a choice', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MCCHOICE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCChoice.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})
})
