import React from 'react'
import renderer from 'react-test-renderer'

import HTML from '../../../../ObojoboDraft/Chunks/HTML/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('HTML', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.HTML',
		content: {
			html: '<marquee>Example text</marquee>'
		}
	})

	let moduleData = {
		focusState: {}
	}

	test('HTML component', () => {
		const component = renderer.create(<HTML model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
