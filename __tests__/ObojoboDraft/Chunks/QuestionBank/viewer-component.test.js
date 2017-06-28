import React from 'react'
import renderer from 'react-test-renderer'

import QuestionBank from '../../../../ObojoboDraft/Chunks/QuestionBank/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('QuestionBank', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.QuestionBank'
	})

	let moduleData = {
		focusState: {}
	}

	test('QuestionBank component', () => {
		const component = renderer.create(<QuestionBank model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
