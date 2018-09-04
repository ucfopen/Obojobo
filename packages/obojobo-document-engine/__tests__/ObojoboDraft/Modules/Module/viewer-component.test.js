import React from 'react'
import renderer from 'react-test-renderer'

import Module from '../../../../ObojoboDraft/Modules/Module/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

// console.log('moduleData be all', moduleData.type)

describe('Module', () => {
	let json = require('../../../../test-object.json')
	let model = OboModel.create(json)

	let moduleData = {
		focusState: {},
		navState: {
			itemsById: {}
		}
	}

	test('Module component', () => {
		const component = renderer.create(<Module model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
