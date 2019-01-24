import React from 'react'
import TestRenderer from 'react-test-renderer'

jest.mock('../../../../src/scripts/viewer/util/nav-util')

import Module from '../../../../ObojoboDraft/Modules/Module/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import NavUtil from '../../../../src/scripts/viewer/util/nav-util'

const json = require('../../../../test-object.json')

describe('Module', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Module component', () => {
		const model = OboModel.create(json)
		const moduleData = {
			focusState: {},
			navState: {}
		}
		const renderer = TestRenderer.create(<Module model={model} moduleData={moduleData} />)
		const tree = renderer.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Module component with child', () => {
		const model = OboModel.create(json)
		const moduleData = {
			focusState: {},
			navState: {}
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
