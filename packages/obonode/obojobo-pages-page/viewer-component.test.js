import React from 'react'
import renderer from 'react-test-renderer'

import { shallow } from 'enzyme'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')
jest.mock('obojobo-document-engine/src/scripts/common/page/focus')

import Page from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import focus from 'obojobo-document-engine/src/scripts/common/page/focus'

require('./viewer') // used to register this oboModel
require('obojobo-chunks-break/viewer') // // dependency on Obojobo.Chunks.Break

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

	test('Page focusOnContent calls focus with the first childs DOM element', () => {
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

		shallow(<Page model={model} moduleData={moduleData} />)

		// mock the first child's method for getDomEl
		model.children.at(0).getDomEl = jest.fn().mockReturnValue('mock-dom-element')

		expect(Page.focusOnContent(model)).toBeUndefined() // there's no return
		expect(focus).toHaveBeenCalledWith('mock-dom-element') // but it should have called focus with the return of our mocked getDomEl
	})

	test('Page focusOnContent handles no children', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Pages.Page',
			children: []
		})
		const moduleData = {
			focusState: {}
		}

		shallow(<Page model={model} moduleData={moduleData} />)
		expect(Page.focusOnContent(model)).toBeUndefined() // there's no return
		expect(focus).not.toHaveBeenCalled()
	})
})
