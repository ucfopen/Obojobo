import MathEquationAdapter from '../../../../ObojoboDraft/Chunks/MathEquation/adapter'

describe('MathEquation adapter', () => {
	it('construct builds without attributes', () => {
		let model = { modelState: {} }
		MathEquationAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('construct builds with attributes', () => {
		let model = { modelState: {} }
		let attrs = {
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

	it('clone creates a copy', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		MathEquationAdapter.construct(a)
		MathEquationAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	it('toJSON builds a JSON representation', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				latex: 'test',
				align: 'left'
			}
		}
		let json = { content: {} }

		MathEquationAdapter.construct(model, attrs)
		MathEquationAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	it('can be converted to text', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				latex: 'latex goes here',
				align: 'left'
			}
		}

		MathEquationAdapter.construct(model, attrs)
		expect(MathEquationAdapter.toText(model)).toMatch('latex goes here')
	})
})
