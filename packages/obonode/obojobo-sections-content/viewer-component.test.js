import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')

import Content from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import NavUtil from 'obojobo-document-engine/src/scripts/viewer/util/nav-util'

require('./viewer') // used to register this oboModel

describe('Content', () => {
	test('Content component', () => {
		const model = OboModel.create({
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

		const moduleData = {
			focusState: {},
			navState: {
				itemsById: {}
			}
		}

		const component = renderer.create(<Content model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Content component with nav model', () => {
		const model = OboModel.create({
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

		const moduleData = {
			focusState: {},
			navState: {
				itemsById: {}
			}
		}

		NavUtil.getNavTargetModel.mockReturnValueOnce({
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		})

		const component = renderer.create(<Content model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
