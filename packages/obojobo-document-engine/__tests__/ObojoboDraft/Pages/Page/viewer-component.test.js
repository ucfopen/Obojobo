import React from 'react'
import renderer from 'react-test-renderer'

import { shallow } from 'enzyme'

jest.mock('../../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../../src/scripts/viewer/util/focus-util')

import Page from '../../../../ObojoboDraft/Pages/Page/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import NavUtil from '../../../../src/scripts/viewer/util/nav-util'
import FocusUtil from '../../../../src/scripts/viewer/util/focus-util'

describe('Page', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Page component', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Pages.Page',
			children: [
				{
					id: 'child',
					type: 'ObojoboDraft.Chunks.Break'
				}
			]
		})

		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<Page model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('componentWillRecieveProps does nothing when target ids are the same', () => {
		const moduleData = {
			navState: {
				navTargetId: 'mockId'
			}
		}
		const newModuleData = {
			navState: {
				navTargetId: 'mockId'
			}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Pages.Page',
			children: [
				{
					id: 'child',
					type: 'ObojoboDraft.Chunks.Break'
				}
			]
		})

		const component = shallow(<Page model={model} moduleData={moduleData} />)

		// calls componentWillRecieveProps()
		component.setProps({ moduleData: newModuleData })

		expect(NavUtil.setFlag).not.toHaveBeenCalled()
	})

	test('componentWillRecieveProps calls NavUtil when ids are different', () => {
		const moduleData = {
			navState: {
				navTargetId: 'mockId'
			}
		}
		const newModuleData = {
			navState: {
				navTargetId: 'mockDifferentId'
			}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Pages.Page',
			children: [
				{
					id: 'child',
					type: 'ObojoboDraft.Chunks.Break'
				}
			]
		})

		const component = shallow(<Page model={model} moduleData={moduleData} />)

		// calls componentWillRecieveProps()
		component.setProps({ moduleData: newModuleData })

		expect(NavUtil.setFlag).toHaveBeenCalledWith('mockId', 'visited', true)
	})

	test("focusOnContent calls FocusUtil.focusComponent on the first child's model", () => {
		const model = {
			children: {
				at: () => ({
					get: () => 'mock-id'
				})
			}
		}
		const mockOpts = jest.fn()

		expect(FocusUtil.focusComponent).not.toHaveBeenCalled()
		Page.focusOnContent(model, mockOpts)
		expect(FocusUtil.focusComponent).toHaveBeenCalledWith('mock-id', mockOpts)
	})

	test('focusOnContent does nothing if no child models exist', () => {
		const model = { children: { at: () => null } }

		expect(FocusUtil.focusComponent).not.toHaveBeenCalled()
		Page.focusOnContent(model)
		expect(FocusUtil.focusComponent).not.toHaveBeenCalled()
	})
})
