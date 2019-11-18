import basicReview from './basic-review'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

require('obojobo-chunks-question/viewer')
require('obojobo-pages-page/viewer')
require('obojobo-chunks-text/viewer')
require('obojobo-chunks-multiple-choice-assessment/viewer')
require('obojobo-chunks-question/viewer')

describe('BasicReview', () => {
	let questionJSON

	beforeEach(() => {
		jest.resetAllMocks()
		questionJSON = {
			id: 'parent',
			type: 'ObojoboDraft.Chunks.Question',
			content: {
				title: 'Title',
				solution: {
					id: 'page-id',
					type: 'ObojoboDraft.Pages.Page',
					children: [
						{
							id: 'text-id',
							type: 'ObojoboDraft.Chunks.Text',
							content: {
								textGroup: [
									{
										text: {
											value: 'Example text'
										}
									}
								]
							}
						}
					]
				}
			},
			children: [
				{
					id: 'id',
					type: 'ObojoboDraft.Chunks.MCAssessment',
					children: [
						{
							id: 'choice1',
							type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
							content: {
								score: 100
							},
							children: [
								{
									id: 'choice1-answer',
									type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
									children: [
										{
											id: 'choice1-answer-text',
											type: 'ObojoboDraft.Chunks.Text',
											content: {
												textGroup: [
													{
														text: {
															value: 'Example Text'
														}
													}
												]
											}
										}
									]
								},
								{
									id: 'choice1-feedback',
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
						},
						{
							id: 'choice2',
							type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
							content: {
								score: 0
							},
							children: [
								{
									id: 'choice2-answer',
									type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
									children: [
										{
											id: 'choice1-answer-text',
											type: 'ObojoboDraft.Chunks.Text',
											content: {
												textGroup: [
													{
														text: {
															value: 'Example Text 3'
														}
													}
												]
											}
										}
									]
								},
								{
									id: 'choice2-feedback',
									type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
									children: [
										{
											id: 'choice1-feedback-text',
											type: 'ObojoboDraft.Chunks.Text',
											content: {
												textGroup: [
													{
														text: {
															value: 'Example Text 4'
														}
													}
												]
											}
										}
									]
								}
							]
						}
					]
				}
			]
		}
	})

	test('Basic component correct', () => {
		const model = OboModel.create(questionJSON)
		const moduleData = {
			focusState: {}
		}
		const questionScore = {
			id: 'parent',
			score: 100 // Question was answered correctly
		}
		const component = basicReview(model, moduleData, questionScore, 0)

		expect(component).toMatchSnapshot()
	})

	test('Basic component incorrect', () => {
		const model = OboModel.create(questionJSON)
		const moduleData = {
			focusState: {}
		}
		const questionScore = {
			id: 'parent',
			score: 0 // Question was answered incorrectly
		}
		const component = basicReview(model, moduleData, questionScore, 0)

		expect(component).toMatchSnapshot()
	})

	test('Basic component survey', () => {
		questionJSON.content.type = 'survey'
		const model = OboModel.create(questionJSON)
		const moduleData = {
			focusState: {}
		}
		const questionScore = {
			id: 'parent',
			score: 0
		}
		const component = basicReview(model, moduleData, questionScore, 0)

		expect(component).toMatchSnapshot()
	})
})
