import React from 'react'
import renderer from 'react-test-renderer'

import Page from '../../../../ObojoboDraft/Pages/Page/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Page', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Pages.Page',
		children: [
			{
				id: 'child',
				type: 'ObojoboDraft.Chunks.Break'
			}
		]
	})

	let moduleData = {
		focusState: {}
	}

	test('Page component', () => {
		const component = renderer.create(<Page model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
