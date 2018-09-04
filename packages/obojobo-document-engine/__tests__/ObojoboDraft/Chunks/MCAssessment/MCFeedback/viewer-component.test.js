import React from 'react'
import renderer from 'react-test-renderer'
import MCFeedback from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCFeedback/viewer-component'
import OboModel from '../../../../../__mocks__/_obo-model-with-chunks'

describe('MCFeedback', () => {
	test('MCFeedback component for a correct item', () => {
		let moduleData = {
			focusState: {}
		}
		let model = OboModel.create({
			id: 'parent',
			type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
			content: {
				score: 100
			},
			children: [
				{
					id: 'feedback',
					type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
					children: [
						{
							id: 'choice1-feedback-text',
							type: 'ObojoboDraft.Chunks.Text',
							content: {
								textGroup: [
									{
										text: {
											value: 'Example Text 2'
										}
									}
								]
							}
						}
					]
				}
			]
		})
		const component = renderer.create(
			<MCFeedback moduleData={moduleData} model={OboModel.models.feedback} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCFeedback component for an incorrect item', () => {
		let moduleData = {
			focusState: {}
		}
		let model = OboModel.create({
			id: 'parent',
			type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
			content: {
				score: 0
			},
			children: [
				{
					id: 'feedback',
					type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
					children: [
						{
							id: 'choice1-feedback-text',
							type: 'ObojoboDraft.Chunks.Text',
							content: {
								textGroup: [
									{
										text: {
											value: 'Example Text 2'
										}
									}
								]
							}
						}
					]
				}
			]
		})
		const component = renderer.create(
			<MCFeedback moduleData={moduleData} model={OboModel.models.feedback} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
