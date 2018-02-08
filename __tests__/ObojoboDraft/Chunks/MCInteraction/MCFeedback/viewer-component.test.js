import React from 'react'
import renderer from 'react-test-renderer'
import MCFeedback from '../../../../../ObojoboDraft/Chunks/MCInteraction/MCFeedback/viewer-component'
import OboModel from '../../../../../__mocks__/_obo-model-with-chunks'

describe('MCFeedback', () => {
	let moduleData = {
		focusState: {}
	}

	test('MCFeedback for a correct item', () => {
		let model = OboModel.create({
			id: 'parent',
			type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
			content: {
				score: 100
			},
			children: [
				{
					id: 'self',
					type: 'ObojoboDraft.Chunks.MCInteraction.MCFeedback'
				}
			]
		})
		const component = renderer.create(
			<MCFeedback moduleData={moduleData} model={OboModel.models.self} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCFeedback for an incorrect item', () => {
		let model = OboModel.create({
			id: 'parent',
			type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
			content: {
				score: 0
			},
			children: [
				{
					id: 'self',
					type: 'ObojoboDraft.Chunks.MCInteraction.MCFeedback'
				}
			]
		})
		const component = renderer.create(
			<MCFeedback moduleData={moduleData} model={OboModel.models.self} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
