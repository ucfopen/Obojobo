import React from 'react'
import renderer from 'react-test-renderer'
import NumericFeedback from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

require('./viewer') // used to register this oboModel
require('../NumericChoice/viewer') // used to register the MCChoice chunk as a dep
require('../NumericFeedback/viewer') // // dependency on Obojobo.Chunks.MCAssessment.NumericFeedback
require('obojobo-chunks-text/viewer')

describe('NumericFeedback', () => {
	test('NumericFeedback component for a correct item', () => {
		const moduleData = {
			focusState: {}
		}
		OboModel.create({
			id: 'parent',
			type: 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice',
			content: {
				score: 100
			},
			children: [
				{
					id: 'feedback',
					type: 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback',
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
			<NumericFeedback moduleData={moduleData} model={OboModel.models.feedback} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericFeedback component for an incorrect item', () => {
		const moduleData = {
			focusState: {}
		}
		OboModel.create({
			id: 'parent',
			type: 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice',
			content: {
				score: 0
			},
			children: [
				{
					id: 'feedback',
					type: 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback',
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
			<NumericFeedback moduleData={moduleData} model={OboModel.models.feedback} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
