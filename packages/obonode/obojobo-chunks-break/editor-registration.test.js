import Break from './editor-registration'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('Break editor', () => {
	test('plugins.renderNode renders a break when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: BREAK_NODE,
				data: {
					get: () => ({})
				}
			}
		}

		expect(Break.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})
})
