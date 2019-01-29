import IFrame from './editor'
const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'

describe('IFrame editor', () => {
	test('plugins.renderNode renders a button when passed', () => {
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

		expect(IFrame.plugins.renderNode(props)).toMatchSnapshot()
	})
})
