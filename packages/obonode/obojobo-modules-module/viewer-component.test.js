import React from 'react'
import TestRenderer from 'react-test-renderer'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')

import Module from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import NavUtil from 'obojobo-document-engine/src/scripts/viewer/util/nav-util'

const json = require('obojobo-document-engine/test-object.json')

require('./viewer') // used to register this oboModel

describe('Module', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Module component', () => {
		const model = OboModel.create(json)
		const moduleData = {
			focusState: {},
			navState: {},
		}
		const renderer = TestRenderer.create(<Module model={model} moduleData={moduleData} />)
		const tree = renderer.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Module component with child', () => {
		const model = OboModel.create(json)
		const moduleData = {
			focusState: {},
			navState: {},
		}
		const mockGetComponentClass = jest.fn().mockReturnValueOnce('MockComponent')

		NavUtil.getNavTargetModel.mockReturnValueOnce({
			getComponentClass: mockGetComponentClass
		})

		const renderer = TestRenderer.create(<Module model={model} moduleData={moduleData} />)
		const tree = renderer.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
