import React from 'react'
import renderer from 'react-test-renderer'

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
		let model = OboModel.create(json)
		let moduleData = {
			focusState: {},
			navState: {}
		}
		const component = renderer.create(<Module model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Module component with child', () => {
		let model = OboModel.create(json)
		let moduleData = {
			focusState: {},
			navState: {}
		}
		let mockGetComponentClass = jest.fn().mockReturnValueOnce('MockComponent')

		NavUtil.getNavTargetModel.mockReturnValueOnce({
			getComponentClass: mockGetComponentClass
		})

		const component = renderer.create(<Module model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
