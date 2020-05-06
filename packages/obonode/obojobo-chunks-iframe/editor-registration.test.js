import IFrame from './editor-registration'

const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'

describe('IFrame editor', () => {
	test('plugins.isVoid to call next if not IFrame', () => {
		const next = jest.fn()
		IFrame.plugins.isVoid({}, {}, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.isVoid to return true if the node is an IFrame', () => {
		const node = { type: IFRAME_NODE }
		expect(IFrame.plugins.isVoid(node, {}, jest.fn())).toEqual(true)
	})

	test('plugins.renderNode renders an IFrame when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: IFRAME_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(IFrame.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})
})
