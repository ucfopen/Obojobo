jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

import MathEquationAdapter from '../../../../ObojoboDraft/Chunks/MathEquation/adapter'

describe('MathEquation adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		MathEquationAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const attrs = {
			content: {
				latex: 'mockEquations',
				align: 'left',
				label: 'mockLabel',
				size: '3'
			}
		}
		const model = new OboModel(attrs)

		MathEquationAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct sets size to 1 if given invalid value', () => {
		const attrs = {
			content: {
				size: 'tiny'
			}
		}
		const model = new OboModel(attrs)

		MathEquationAdapter.construct(model, attrs)
		expect(model.modelState.size).toBe('1em')
	})

	test('clone creates a copy', () => {
		const a = new OboModel({})
		const b = new OboModel({})

		MathEquationAdapter.construct(a)
		MathEquationAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	test('toJSON builds a JSON representation', () => {
		const attrs = {
			content: {
				latex: 'test',
				align: 'left'
			}
		}
		const model = new OboModel(attrs)
		const json = { content: {} }

		MathEquationAdapter.construct(model, attrs)
		MathEquationAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('can be converted to text', () => {
		const attrs = {
			content: {
				latex: 'latex goes here',
				align: 'left'
			}
		}
		const model = new OboModel(attrs)

		MathEquationAdapter.construct(model, attrs)
		expect(MathEquationAdapter.toText(model)).toMatch('latex goes here')
	})
})
