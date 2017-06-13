import React from 'react'
import renderer from 'react-test-renderer'

import Assessment from '../../../../ObojoboDraft/Sections/Assessment/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Assessment', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Sections.Assessment',
		content: {
			attempts: 3
		},
		children: [
			{
				id: 'page',
				type: 'ObojoboDraft.Pages.Page',
				children: [
					{
						id: 'child',
						type: 'ObojoboDraft.Chunks.Break'
					}
				]
			},
			{
				id: 'QuestionBank',
				type: 'ObojoboDraft.Chunks.QuestionBank'
			}
		]
	})

	let moduleData = {
		focusState: {},
		navState: {
			itemsById: {}
		},
		assessmentState: {
			assessments: []
		}
	}

	test('Assessment component', () => {
		const component = renderer.create(
			<Assessment model={model} moduleData={moduleData} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})