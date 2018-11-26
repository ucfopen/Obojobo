import HTML from '../../../../ObojoboDraft/Chunks/HTML/editor'
const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

describe('HTML editor', () => {
	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: HTML_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(HTML.plugins.renderNode(props)).toMatchSnapshot()
	})
})
