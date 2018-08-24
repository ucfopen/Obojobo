import React from 'react'
import renderer from 'react-test-renderer'

import Code from '../../../../ObojoboDraft/Chunks/Code/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

const chunkJSON = {
	id: 'id',
	type: 'ObojoboDraft.Chunks.Code',
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

describe('Code', () => {
	test('Code component', () => {
		const model = OboModel.create(chunkJSON)
		const moduleData = {
			focusState: {}
		}
		const component = renderer.create(<Code model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
