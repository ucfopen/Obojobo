import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

jest.mock('../../../../../../src/scripts/viewer/util/assessment-util')
jest.mock('../../../../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../../../../src/scripts/viewer/assessment/assessment-score-reporter')
jest.mock('../../../../../../ObojoboDraft/Sections/Assessment/components/full-review/index')

import PostTest from '../../../../../../ObojoboDraft/Sections/Assessment/components/post-test/index'
import AssessmentUtil from '../../../../../../src/scripts/viewer/util/assessment-util'
import OboModel from '../../../../../../__mocks__/_obo-model-with-chunks'

const FULL_REVIEW_ALWAYS = 'always'
const FULL_REVIEW_AFTER_ALL = 'no-attempts-remaining'

const assessmentJSON = {
	id: 'assessment',
	type: 'ObojoboDraft.Sections.Assessment',
	content: {
		attempts: 3
	},
	children: [
		{
			id: 'page',
			type: 'ObojoboDraft.Pages.Page',
			children: [
				{
					id: 'child',
					type: 'ObojoboDraft.Chunks.Text',
					content: {
						textGroup: [
							{
								text: {
									value:
										'You have {{assessment:attemptsRemaining}} attempts remaining out of {{assessment:attemptsAmount}}.'
								}
							}
						]
					}
				}
			]
		},
		{
			id: 'QuestionBank',
			type: 'ObojoboDraft.Chunks.QuestionBank',
			children: [
				{
					id: 'question',
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
							id: 'mcassessment',
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
			]
		}
	]
}
const scoreActionJSON = {
	id: '2692c3fa-2bd9-4f62-a83f-a173b4770017',
	type: 'ObojoboDraft.Pages.Page',
	content: {},
	children: [
		{
			id: '084af3aa-18be-41d5-9938-1b4c311403fa',
			type: 'ObojoboDraft.Chunks.Heading',
			content: {
				headingLevel: 1,
				textGroup: [
					{
						text: {
							value: 'Not quite!',
							styleList: []
						},
						data: {
							align: 'center'
						}
					}
				]
			},
			children: []
		},
		{
			id: '13b82592-8c45-4fe7-9d00-32a66f4d7418',
			type: 'ObojoboDraft.Chunks.ActionButton',
			content: {
				textGroup: [
					{
						text: {
							value: 'Try again ({{assessment:attemptsRemaining}} attempts left)',
							styleList: []
						},
						data: null
					}
				],
				triggers: [
					{
						type: 'onClick',
						actions: [
							{
								type: 'assessment:startAttempt',
								value: {
									id: 'assessment'
								}
							}
						]
					}
				]
			},
			children: []
		}
	]
}

describe('PostTest', () => {
	test('PostTest component', () => {
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			lti: {
				outcomeServiceHostname: 'mockLTIHost'
			},
			focusState: {}
		}
		const model = OboModel.create(assessmentJSON)
		const scoreAction = {
			page: null,
			message: 'mockMessage'
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(null)

		const component = renderer.create(
			<PostTest model={model} moduleData={moduleData} scoreAction={scoreAction} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
	test('PostTest component with scoreAction', () => {
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			lti: {
				outcomeServiceHostname: 'mockLTIHost'
			},
			focusState: {}
		}
		const model = OboModel.create(assessmentJSON)
		const scoreAction = {
			page: scoreActionJSON
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(null)

		const component = renderer.create(
			<PostTest model={model} moduleData={moduleData} scoreAction={scoreAction} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('PostTest component with recorded score', () => {
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			lti: {
				outcomeServiceHostname: 'mockLTIHost'
			},
			focusState: {}
		}
		const model = OboModel.create(assessmentJSON)
		const scoreAction = {
			page: scoreActionJSON
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(100)
		AssessmentUtil.getHighestAttemptsForModelByAssessmentScore.mockReturnValueOnce([
			{
				assessmentScoreDetails: { attemptNumber: 'mockAttemptNumber' }
			}
		])

		const component = renderer.create(
			<PostTest model={model} moduleData={moduleData} scoreAction={scoreAction} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('PostTest component with review', () => {
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			lti: {
				outcomeServiceHostname: 'mockLTIHost'
			},
			focusState: {}
		}
		const model = OboModel.create(assessmentJSON)
		model.modelState.review = FULL_REVIEW_ALWAYS
		const scoreAction = {
			page: scoreActionJSON
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(100)
		AssessmentUtil.getHighestAttemptsForModelByAssessmentScore.mockReturnValueOnce([
			{
				assessmentScoreDetails: { attemptNumber: 'mockAttemptNumber' }
			}
		])

		const component = renderer.create(
			<PostTest model={model} moduleData={moduleData} scoreAction={scoreAction} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('PostTest component with review after all attempts - attempts remaining', () => {
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			lti: {
				outcomeServiceHostname: 'mockLTIHost'
			},
			focusState: {}
		}
		const model = OboModel.create(assessmentJSON)
		model.modelState.review = FULL_REVIEW_AFTER_ALL
		const scoreAction = {
			page: scoreActionJSON
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(100)
		AssessmentUtil.getHighestAttemptsForModelByAssessmentScore.mockReturnValueOnce([
			{
				assessmentScoreDetails: { attemptNumber: 'mockAttemptNumber' }
			}
		])
		AssessmentUtil.hasAttemptsRemaining.mockReturnValueOnce(true)

		const component = renderer.create(
			<PostTest model={model} moduleData={moduleData} scoreAction={scoreAction} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('PostTest component with review after all attempts - no attempts remaining', () => {
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			lti: {
				outcomeServiceHostname: 'mockLTIHost'
			},
			focusState: {}
		}
		const model = OboModel.create(assessmentJSON)
		model.modelState.review = FULL_REVIEW_AFTER_ALL
		const scoreAction = {
			page: scoreActionJSON
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(100)
		AssessmentUtil.getHighestAttemptsForModelByAssessmentScore.mockReturnValueOnce([
			{
				assessmentScoreDetails: { attemptNumber: 'mockAttemptNumber' }
			}
		])
		AssessmentUtil.hasAttemptsRemaining.mockReturnValueOnce(false)

		const component = renderer.create(
			<PostTest model={model} moduleData={moduleData} scoreAction={scoreAction} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	// This button is actually part of the LTIStatus module
	// The function is in PostTest because it needs the assessment model
	test('PostTest component resends LTI when Resend button is clicked', () => {
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			lti: {
				outcomeServiceHostname: 'mockLTIHost'
			},
			focusState: {}
		}
		const model = OboModel.create(assessmentJSON)
		model.modelState.review = FULL_REVIEW_AFTER_ALL
		const scoreAction = {
			page: scoreActionJSON
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(100)
		AssessmentUtil.getHighestAttemptsForModelByAssessmentScore.mockReturnValueOnce([
			{
				assessmentScoreDetails: { attemptNumber: 'mockAttemptNumber' }
			}
		])
		AssessmentUtil.hasAttemptsRemaining.mockReturnValueOnce(false)
		AssessmentUtil.getLTIStateForModel.mockReturnValueOnce({
			state: 'mockState'
		})

		const component = mount(
			<PostTest model={model} moduleData={moduleData} scoreAction={scoreAction} />
		)

		component
			.childAt(0)
			.childAt(0)
			.childAt(2)
			.find('button')
			.simulate('click')

		expect(AssessmentUtil.resendLTIScore).toHaveBeenCalled()
	})
})
