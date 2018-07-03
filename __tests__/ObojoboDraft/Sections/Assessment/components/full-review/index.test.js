import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

jest.mock('../../../../../../src/scripts/viewer/util/assessment-util')
jest.mock('../../../../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../../../../src/scripts/viewer/assessment/assessment-score-reporter')

import FullReview from '../../../../../../ObojoboDraft/Sections/Assessment/components/full-review/index'
import AssessmentUtil from '../../../../../../src/scripts/viewer/util/assessment-util'
import NavUtil from '../../../../../../src/scripts/viewer/util/nav-util'
import OboModel from '../../../../../../__mocks__/_obo-model-with-chunks'

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

describe('FullReview', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('FullReview component', () => {
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		let model = OboModel.create(assessmentJSON)

		// mock last attempt taken
		AssessmentUtil.getLastAttemptForModel.mockReturnValueOnce({ attemptId: 'mockAttempt' })
		// mock attempts taken
		AssessmentUtil.getAllAttempts.mockReturnValueOnce([])

		let component = renderer.create(<FullReview model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('FullReview component with attempt', () => {
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		let model = OboModel.create(assessmentJSON)

		// mock last attempt taken
		AssessmentUtil.getLastAttemptForModel.mockReturnValueOnce({ attemptId: 'mockAttemptId' })
		// mock highest attempt
		AssessmentUtil.getHighestAttemptsForModelByAttemptScore.mockReturnValueOnce([])
		// mock attempt taken
		AssessmentUtil.getAllAttempts.mockReturnValueOnce([
			{
				attemptId: 'mockAttemptId',
				assessmentScore: 80,
				attemptScore: 80.34,
				finishTime: '2018-06-05 20:28:11.228294+00',
				questionScores: [
					{
						id: 'question'
					}
				]
			}
		])

		let component = renderer.create(<FullReview model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('FullReview component with last taken attempt', () => {
		let moduleData = {
			assessmentState: 'assessmentReview:mockAssessmentState',
			navState: {
				context: 'assessmentReview:mockAttemptId'
			},
			questionState: { scores: [] },
			focusState: {}
		}
		let model = OboModel.create(assessmentJSON)

		// mock last attempt taken
		AssessmentUtil.getLastAttemptForModel.mockReturnValueOnce({ attemptId: 'mockAttemptId' })
		// mock highest attempt
		AssessmentUtil.getHighestAttemptsForModelByAttemptScore.mockReturnValueOnce([])
		// mock attempt taken
		AssessmentUtil.getAllAttempts.mockReturnValueOnce([
			{
				attemptId: 'mockAttemptId',
				assessmentScore: 80,
				attemptScore: 80.34,
				finishTime: '2018-06-05 20:28:11.228294+00',
				questionScores: [
					{
						id: 'question'
					}
				]
			}
		])

		let component = renderer.create(<FullReview model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('FullReview component with fully displayed attempt', () => {
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		let model = OboModel.create(assessmentJSON)

		// mock last attempt taken
		AssessmentUtil.getLastAttemptForModel.mockReturnValueOnce({ attemptId: 'mockAttemptId' })
		// mock highest attempt
		AssessmentUtil.getHighestAttemptsForModelByAttemptScore.mockReturnValueOnce([])
		// mock attempt taken
		AssessmentUtil.getAllAttempts.mockReturnValueOnce([
			{
				attemptId: 'mockAttemptId',
				assessmentScore: 80,
				attemptScore: 80.34,
				finishTime: '2018-06-05 20:28:11.228294+00',
				questionScores: [
					{
						id: 'question'
					}
				]
			}
		])

		let component = renderer.create(
			<FullReview model={model} moduleData={moduleData} showFullReview={true} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('FullReview component with non-passing attempt', () => {
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		let model = OboModel.create(assessmentJSON)

		// mock last attempt taken
		AssessmentUtil.getLastAttemptForModel.mockReturnValueOnce({ attemptId: 'mockAttemptId' })
		// mock highest attempt
		AssessmentUtil.getHighestAttemptsForModelByAttemptScore.mockReturnValueOnce([])
		// mock attempt taken
		AssessmentUtil.getAllAttempts.mockReturnValueOnce([
			{
				attemptId: 'mockAttemptId',
				assessmentScore: null, // student did not pass
				attemptScore: 80.34,
				finishTime: '2018-06-05 20:28:11.228294+00',
				questionScores: []
			}
		])

		let component = renderer.create(<FullReview model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('FullReview component with highest attempt', () => {
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		let model = OboModel.create(assessmentJSON)
		let mockAttempt = {
			attemptId: 'mockAttemptId',
			assessmentScore: 80.34,
			attemptScore: 80.34,
			finishTime: '2018-06-05 20:28:11.228294+00',
			questionScores: []
		}

		// mock last attempt taken
		AssessmentUtil.getLastAttemptForModel.mockReturnValueOnce({ attemptId: 'mockAttemptId' })
		// mock highest attempt
		AssessmentUtil.getHighestAttemptsForModelByAttemptScore.mockReturnValueOnce([mockAttempt])
		// mock attempt taken
		AssessmentUtil.getAllAttempts.mockReturnValueOnce([mockAttempt])

		let component = renderer.create(<FullReview model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('FullReview component with two attempts', () => {
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'mockContext'
			},
			questionState: { scores: {} },
			focusState: {}
		}
		let model = OboModel.create(assessmentJSON)

		// mock last attempt taken
		AssessmentUtil.getLastAttemptForModel.mockReturnValueOnce({ attemptId: 'mockAttemptId' })
		// mock highest attempt
		AssessmentUtil.getHighestAttemptsForModelByAttemptScore.mockReturnValueOnce([])
		// mock attempt taken
		AssessmentUtil.getAllAttempts.mockReturnValueOnce([
			{
				attemptId: 'mockAttemptId',
				assessmentScore: 80,
				attemptScore: 80.34,
				finishTime: '2018-06-05 20:28:11.228294+00',
				questionScores: [
					{
						id: 'question'
					}
				]
			},
			{
				attemptId: 'mockSecondAttemptId',
				assessmentScore: 80.34,
				attemptScore: 80.34,
				finishTime: '2018-06-05 20:28:11.228294+00',
				questionScores: [
					{
						id: 'question'
					}
				]
			}
		])

		let component = renderer.create(<FullReview model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('FullReview component with two attempts swaps view when clicked', () => {
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			navState: {
				context: 'assessmentReview:mockAttemptId'
			},
			questionState: { scores: {} },
			focusState: {}
		}
		let model = OboModel.create(assessmentJSON)

		// mock last attempt taken
		AssessmentUtil.getLastAttemptForModel.mockReturnValueOnce({ attemptId: 'mockAttemptId' })
		// mock highest attempt
		AssessmentUtil.getHighestAttemptsForModelByAttemptScore.mockReturnValueOnce([])
		// mock attempt taken
		AssessmentUtil.getAllAttempts.mockReturnValueOnce([
			{
				attemptId: 'mockAttemptId',
				attemptNumber: 1,
				assessmentScore: 80,
				attemptScore: 80.34,
				finishTime: '2018-06-05 20:28:11.228294+00',
				questionScores: [
					{
						id: 'question'
					}
				]
			},
			{
				attemptId: 'mockSecondAttemptId',
				attemptNumber: 2,
				assessmentScore: 100,
				attemptScore: 100,
				finishTime: '2018-06-05 20:28:11.228294+00',
				questionScores: [
					{
						id: 'question'
					}
				]
			}
		])

		let component = mount(<FullReview model={model} moduleData={moduleData} />)
		expect(NavUtil.setContext).toHaveBeenCalledTimes(1)
		expect(NavUtil.setContext).toHaveBeenCalledWith('assessmentReview:mockAttemptId')

		// simulate clicking the button for the second attempt
		let thing = component
			.find('.attempt-button-container')
			.childAt(0)
			.childAt(0)
			.childAt(1)
			.find('button')
			.simulate('click')

		expect(NavUtil.setContext).toHaveBeenCalledTimes(2)
		expect(NavUtil.setContext).toHaveBeenCalledWith('assessmentReview:mockSecondAttemptId')
	})
})
