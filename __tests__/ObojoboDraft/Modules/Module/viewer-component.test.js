import React from 'react'
import TestRenderer from 'react-test-renderer'
import { shallow } from 'enzyme'

jest.mock('../../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../../src/scripts/common/flux/dispatcher', () => ({
	trigger: jest.fn(),
	on: jest.fn()
}))

import Module from '../../../../ObojoboDraft/Modules/Module/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import NavUtil from '../../../../src/scripts/viewer/util/nav-util'
import Dispatcher from '../../../../src/scripts/common/flux/dispatcher'

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

	test('Updated navTargetId causes viewer:focusOnContent to fire', () => {
		const model = OboModel.create(json)
		const moduleData = {
			focusState: {},
			navState: {
				navTargetId: 'mock-nav-target-id'
			}
		}
		const component = shallow(<Module model={model} moduleData={moduleData} />)

		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		component.setProps({
			moduleData: {
				focusState: {},
				navState: {
					navTargetId: 'mock-nav-target-id'
				}
			}
		})
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		component.setProps({
			moduleData: {
				focusState: {},
				navState: {
					navTargetId: 'new-nav-target-id'
				}
			}
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('viewer:focusOnContent')
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
	})
})
