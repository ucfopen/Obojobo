import YouTube from 'ObojoboDraft/Chunks/YouTube/editor'
const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

describe('YouTube editor', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			text: 'mockText'
		}
		const oboNode = YouTube.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { width: 'large' }
		}
		const slateNode = YouTube.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with a caption', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {}
		}
		const slateNode = YouTube.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: YOUTUBE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(YouTube.plugins.renderNode(props)).toMatchSnapshot()
	})
})
