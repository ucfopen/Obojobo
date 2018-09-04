import React from 'react'
import renderer from 'react-test-renderer'

import Heading from '../../../../ObojoboDraft/Chunks/Heading/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Heading', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.Heading',
		content: {
			headingLevel: 2,
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

	test('Heading component', () => {
		const component = renderer.create(<Heading model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
