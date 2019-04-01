import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')
jest.mock('obojobo-document-engine/src/scripts/common/page/focus')

import Page from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'

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
