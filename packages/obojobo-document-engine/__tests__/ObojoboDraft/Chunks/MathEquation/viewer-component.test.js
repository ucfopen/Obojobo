import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('katex')

import MathEquation from '../../../../ObojoboDraft/Chunks/MathEquation/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import Katex from 'katex'

describe('MathEquation', () => {
	test('MathEquation component', () => {
		let moduleData = {
			focusState: {}
		}
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.MathEquation',
			content: {
				latex: 'y=\\frac{1}{x}'
			}
		})

		Katex.renderToString.mockReturnValueOnce('mockLatexEquation')

		const component = renderer.create(<MathEquation model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MathEquation component with label', () => {
		let moduleData = {
			focusState: {}
		}
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.MathEquation',
			content: {
				label: 'mockLabel',
				latex: 'y=\\frac{1}{x}'
			}
		})

		Katex.renderToString.mockReturnValueOnce('mockLatexEquation')

		const component = renderer.create(<MathEquation model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
	test('MathEquation component with error', () => {
		let moduleData = {
			focusState: {}
		}
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.MathEquation',
			label: 'mockLabel',
			content: {
				latex: '\\\\'
			}
		})

		Katex.renderToString.mockImplementationOnce(() => {
			throw new Error('mockKatexError')
		})

		const component = renderer.create(<MathEquation model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
