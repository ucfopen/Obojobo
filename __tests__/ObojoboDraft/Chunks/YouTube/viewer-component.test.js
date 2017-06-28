import React from 'react'
import renderer from 'react-test-renderer'

import YouTube from '../../../../ObojoboDraft/Chunks/YouTube/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('YouTube', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.YouTube',
		content: {
			videoId: 'dQw4w9WgXcQ'
		}
	})

	let moduleData = {
		focusState: {}
	}

	test('YouTube component', () => {
		const component = renderer.create(<YouTube model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
