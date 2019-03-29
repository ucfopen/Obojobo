import React from 'react'
import renderer from 'react-test-renderer'

import QuestionBank from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

require('./viewer') // used to register this oboModel

describe('QuestionBank', () => {
	test('QuestionBank component', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.QuestionBank',
			children: [
				{
					id: 'child-id',
					type: 'ObojoboDraft.Chunks.QuestionBank'
				}
			]
		})

		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<QuestionBank model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
