import Break from './editor-registration'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('Break editor', () => {
	test('plugins.isVoid to call next if not Break', () => {
		const next = jest.fn()
		Break.plugins.isVoid({}, {}, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.isVoid to return true if the node is a Break', () => {
		const node = { type: BREAK_NODE }
		expect(Break.plugins.isVoid(node, {}, jest.fn())).toEqual(true)
	})

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
