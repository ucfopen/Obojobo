import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('../../../../src/scripts/viewer/util/nav-util')

import Content from '../../../../ObojoboDraft/Sections/Content/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import NavUtil from '../../../../src/scripts/viewer/util/nav-util'

describe('Content', () => {
	test('Content component', () => {
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Sections.Content',
			children: [
				{
					id: 'page',
					type: 'ObojoboDraft.Pages.Page',
					children: [
						{
							id: 'child',
							type: 'ObojoboDraft.Chunks.Break'
						}
					]
				}
			]
		})

		let moduleData = {
			focusState: {},
			navState: {
				itemsById: {}
			}
		}

		const component = renderer.create(<Content model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Content component with nav model', () => {
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Sections.Content',
			children: [
				{
					id: 'page',
					type: 'ObojoboDraft.Pages.Page',
					children: [
						{
							id: 'child',
							type: 'ObojoboDraft.Chunks.Break'
						}
					]
				}
			]
		})

		let moduleData = {
			focusState: {},
			navState: {
				itemsById: {}
			}
		}

		NavUtil.getNavTargetModel.mockReturnValueOnce({
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		})

		const component = renderer.create(<Content model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
