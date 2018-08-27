import React from 'react'
import renderer from 'react-test-renderer'

import MCAnswer from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCAnswer/viewer-component'
import OboModel from '../../../../../__mocks__/_obo-model-with-chunks'

describe('MCAnswer', () => {
	test('MCAnswer component', () => {
		const model = OboModel.create({
			id: 'choice1-answer',
			type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
			children: [
				{
					id: 'choice1-answer-text',
					type: 'ObojoboDraft.Chunks.Text',
					content: {
						textGroup: [
							{
								text: {
									value: 'Example Text'
								}
							}
						]
					}
				}
			]
		})
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<MCAnswer model={model} moduleData={moduleData} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
