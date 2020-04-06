import MathEquation from './editor-registration'

const MATHEQUATION_NODE = 'ObojoboDraft.Chunks.MathEquation'

describe('MathEquation editor', () => {
	test('plugins.isVoid to call next if not MathEquation', () => {
		const next = jest.fn()
		MathEquation.plugins.isVoid({}, {}, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.isVoid to return true if the node is an MathEquation', () => {
		const node = { type: MATHEQUATION_NODE }
		expect(MathEquation.plugins.isVoid(node, {}, jest.fn())).toEqual(true)
	})
	
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
