import React from 'react'
import renderer from 'react-test-renderer'
import MCFeedback from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

require('./viewer') // used to register this oboModel
require('../MCChoice/viewer') // used to register the MCChoice chunk as a dep
require('../MCFeedback/viewer') // // dependency on Obojobo.Chunks.MCAssessment.MCFeedback
require('obojobo-chunks-text/viewer') // used to register the Text chunk as a dep

describe('MCFeedback', () => {
	test('MCFeedback component for a correct item', () => {
		const moduleData = {
			focusState: {}
		}
		OboModel.create({
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
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCFeedback component for an incorrect item', () => {
		const moduleData = {
			focusState: {}
		}
		OboModel.create({
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
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
