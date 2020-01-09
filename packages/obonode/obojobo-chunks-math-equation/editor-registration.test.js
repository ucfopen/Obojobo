import MathEquation from './editor-registration'

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

		expect(MathEquation.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(MathEquation.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})
})
