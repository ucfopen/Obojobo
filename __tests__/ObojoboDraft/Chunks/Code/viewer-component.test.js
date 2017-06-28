import React from 'react'
import renderer from 'react-test-renderer'

import Code from '../../../../ObojoboDraft/Chunks/Code/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Code', () => {
	let model = OboModel.create({
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
	})

	let moduleData = {
		focusState: {}
	}

	test('Code component', () => {
		const component = renderer.create(<Code model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
