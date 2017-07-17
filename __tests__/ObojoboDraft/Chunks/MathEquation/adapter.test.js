import MathEquationAdapter from '../../../../ObojoboDraft/Chunks/MathEquation/adapter'

describe('MathEquation adapter', () => {
	it('can be created WITHOUT attributes', () => {
		let model = { modelState: {} }
		MathEquationAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				latex: 'test',
				align: 'left'
			}
		}

		MathEquationAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		MathEquationAdapter.construct(a)
		MathEquationAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	it('can be converted to JSON', () => {
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
