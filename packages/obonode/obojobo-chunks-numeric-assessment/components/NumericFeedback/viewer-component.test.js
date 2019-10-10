import React from 'react'
import renderer from 'react-test-renderer'
import NumericFeedback from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

import { NUMERIC_FEEDBACK_NODE, SCORE_RULE_NODE } from '../../constant'

describe('NumericFeedback', () => {
	test('NumericFeedback component for a correct item', () => {
		const moduleData = {
			focusState: {}
		}
		OboModel.create({
			id: 'parent',
			type: SCORE_RULE_NODE,
			content: {
			},
			children: [
				{
					id: 'feedback',
					type: NUMERIC_FEEDBACK_NODE,
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

	test('MCFeedback component for an incorrect item', () => {
		const moduleData = {
			focusState: {}
		}
		OboModel.create({
			id: 'parent',
			type: SCORE_RULE_NODE,
			content: {
				score: 0
			},
			children: [
				{
					id: 'feedback',
					type: NUMERIC_FEEDBACK_NODE,
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
