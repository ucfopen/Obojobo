import React from 'react'
import renderer from 'react-test-renderer'

import MathEquation from '../../../../ObojoboDraft/Chunks/MathEquation/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('MathEquation', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.MathEquation',
		content: {
			latex: 'y=\\frac{1}{x}'
		}
	})

	let moduleData = {
		focusState: {}
	}

	test('MathEquation component', () => {
		const component = renderer.create(<MathEquation model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
