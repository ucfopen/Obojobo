import React from 'react'
import renderer from 'react-test-renderer'

import Content from '../../../../ObojoboDraft/Sections/Content/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Content', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Sections.Content',
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
			}
		]
	})

	let moduleData = {
		focusState: {},
		navState: {
			itemsById: {}
		}
	}

	test('Content component', () => {
		const component = renderer.create(<Content model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
