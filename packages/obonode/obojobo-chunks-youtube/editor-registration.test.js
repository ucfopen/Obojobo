import YouTube from './editor-registration'
const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

describe('YouTube editor', () => {
	test('plugins.isVoid to call next if not YouTube', () => {
		const next = jest.fn()
		YouTube.plugins.isVoid({}, {}, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.isVoid to return true if the node is an YouTube', () => {
		const node = { type: YOUTUBE_NODE }
		expect(YouTube.plugins.isVoid(node, {}, jest.fn())).toEqual(true)
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
