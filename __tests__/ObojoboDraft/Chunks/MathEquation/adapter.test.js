import MathEquationAdapter from '../../../../ObojoboDraft/Chunks/MathEquation/adapter'

describe('MathEquation adapter', () => {
	test('construct builds without attributes', () => {
		const model = { modelState: {} }
		MathEquationAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				latex: 'mockEquations',
				align: 'left',
				label: 'mockLabel',
				size: '3'
			}
		}

		MathEquationAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const a = { modelState: {} }
		const b = { modelState: {} }

		MathEquationAdapter.construct(a)
		MathEquationAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	test('toJSON builds a JSON representation', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				latex: 'test',
				align: 'left'
			}
		}
		const json = { content: {} }

		MathEquationAdapter.construct(model, attrs)
		MathEquationAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('can be converted to text', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				latex: 'latex goes here',
				align: 'left'
			}
		}

		MathEquationAdapter.construct(model, attrs)
		expect(MathEquationAdapter.toText(model)).toMatch('latex goes here')
	})
})
