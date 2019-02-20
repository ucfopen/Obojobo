import React from 'react'
import renderer from 'react-test-renderer'

import ActionButton from '../../../../ObojoboDraft/Chunks/ActionButton/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import focus from '../../../../src/scripts/common/page/focus'

jest.mock('../../../../src/scripts/common/page/focus')

describe('ActionButton', () => {
	test('ActionButton component with textGroup', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.ActionButton',
			content: {
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})

		const component = renderer.create(<ActionButton model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton component with label', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.ActionButton',
			content: {
				label: 'Example Label'
			}
		})

		const component = renderer.create(<ActionButton model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton focusOnContent calls focus on the button element', () => {
		const mockButtonEl = jest.fn()
		const model = {
			getDomEl: () => ({
				querySelector: () => mockButtonEl
			})
		}

		ActionButton.focusOnContent(model)

		expect(focus).toHaveBeenCalledWith(mockButtonEl)
	})
})
