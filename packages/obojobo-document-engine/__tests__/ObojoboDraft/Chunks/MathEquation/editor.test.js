import MathEquation from '../../../../ObojoboDraft/Chunks/MathEquation/editor'
const MATHEQUATION_NODE = 'ObojoboDraft.Chunks.MathEquation'

describe('MathEquation editor', () => {
	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MATHEQUATION_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MathEquation.plugins.renderNode(props)).toMatchSnapshot()
	})
})
