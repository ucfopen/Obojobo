import React from 'react'
import renderer from 'react-test-renderer'

import Break from '../../../../ObojoboDraft/Chunks/Break/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Break', () => {
	let moduleData = {
		focusState: {}
	}

	test('Break component with textGroup', () => {
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Break'
		})

		const component = renderer.create(<Break model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
