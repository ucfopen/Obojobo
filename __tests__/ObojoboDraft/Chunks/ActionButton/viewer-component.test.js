import React from 'react'
import renderer from 'react-test-renderer'

import ActionButton from '../../../../ObojoboDraft/Chunks/ActionButton/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('ActionButton', () => {
	test('ActionButton component with textGroup', () => {
		let moduleData = {
			focusState: {}
		}
		let model = OboModel.create({
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
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ActionButton component with label', () => {
		let moduleData = {
			focusState: {}
		}
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.ActionButton',
			content: {
				label: 'Example Label'
			}
		})

		const component = renderer.create(<ActionButton model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
