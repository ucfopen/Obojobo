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
		let model = OboModel.create(chunkJSON)
		let moduleData = {
			focusState: {}
		}
		const component = renderer.create(<Code model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
