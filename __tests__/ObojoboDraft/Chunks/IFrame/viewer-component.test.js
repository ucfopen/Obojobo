import React from 'react'
import renderer from 'react-test-renderer'

import IFrame from '../../../../ObojoboDraft/Chunks/IFrame/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('IFrame', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.IFrame',
		content: {
			src: 'http://www.example.com'
		}
	})

	let moduleData = {
		focusState: {}
	}

	test('IFrame component', () => {
		const component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
