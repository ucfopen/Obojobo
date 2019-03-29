import React from 'react'
import renderer from 'react-test-renderer'

import MCAnswer from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

require('./viewer') // used to register this oboModel
require('obojobo-chunks-text/viewer') // used to register the Text chunk as a dep

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
