import React from 'react'
import renderer from 'react-test-renderer'

import YouTube from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

jest.mock('obojobo-document-engine/src/scripts/common/util/uuid', () => {
	return () => 'mockId'
})

require('./viewer') // used to register this oboModel

describe('YouTube', () => {
	test('YouTube component', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.YouTube',
			content: {
				videoId: 'dQw4w9WgXcQ',
				startTime: 4,
				endTime: 20
			}
		})
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<YouTube model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
