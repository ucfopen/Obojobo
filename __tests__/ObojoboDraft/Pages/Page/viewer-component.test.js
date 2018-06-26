import React from 'react'
import renderer from 'react-test-renderer'

import { shallow } from 'enzyme'

jest.mock('../../../../src/scripts/viewer/util/nav-util')

import Page from '../../../../ObojoboDraft/Pages/Page/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import NavUtil from '../../../../src/scripts/viewer/util/nav-util'

describe('Page', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Page component', () => {
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Pages.Page',
			children: [
				{
					id: 'child',
					type: 'ObojoboDraft.Chunks.Break'
				}
			]
		})

		let moduleData = {
			focusState: {}
		}

		const component = renderer.create(<Page model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('componentWillRecieveProps does nothing when target ids are the same', () => {
		let moduleData = {
			navState: {
				navTargetId: 'mockId'
			}
		}
		let newModuleData = {
			navState: {
				navTargetId: 'mockId'
			}
		}
		let model = OboModel.create({
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
		let moduleData = {
			navState: {
				navTargetId: 'mockId'
			}
		}
		let newModuleData = {
			navState: {
				navTargetId: 'mockDifferentId'
			}
		}
		let model = OboModel.create({
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
})
