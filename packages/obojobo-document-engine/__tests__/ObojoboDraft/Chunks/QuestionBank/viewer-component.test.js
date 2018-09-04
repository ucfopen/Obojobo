import React from 'react'
import renderer from 'react-test-renderer'

import QuestionBank from '../../../../ObojoboDraft/Chunks/QuestionBank/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('QuestionBank', () => {
	test('QuestionBank component', () => {
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.QuestionBank',
			children: [
				{
					id: 'child-id',
					type: 'ObojoboDraft.Chunks.QuestionBank'
				}
			]
		})

		let moduleData = {
			focusState: {}
		}

		const component = renderer.create(<QuestionBank model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
