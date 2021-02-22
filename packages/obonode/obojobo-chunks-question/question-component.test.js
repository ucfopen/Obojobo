import QuestionComponent from './question-component'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import focus from 'obojobo-document-engine/src/scripts/common/page/focus'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/question-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/focus-util')
jest.mock('obojobo-document-engine/src/scripts/common/page/focus')
jest.mock('obojobo-document-engine/src/scripts/common/util/shuffle', () => a => a)

require('./viewer') // used to register this oboModel
require('obojobo-pages-page/viewer') // dependency on Obojobo.Pages.Page
require('obojobo-chunks-text/viewer') // // dependency on Obojobo.Chunks.Text
require('obojobo-chunks-multiple-choice-assessment/viewer') // // dependency on Obojobo.Chunks.MCAssessment

const getDefaultProps = ({
	questionType, // 'default' or 'survey'
	mode, // 'practice', 'assessment' or 'review'
	viewState, // 'active', 'viewed' or 'hidden'
	response, // object
	shouldShowRevealAnswerButton, // bool
	isAnswerRevealed, // bool
	isShowingExplanation, // bool
	isShowingExplanationButton, // bool
	score // null (not answered), 'no-score' (survey question), 0, or 100
}) => {
	// const json = getQuestionJSON(questionType)
	// const questionModel = OboModel.create(json)
	const questionModel = {
		getDomId: () => 'mock-dom-id',
		processTrigger: jest.fn(),
		get: () => 'mock-id',
		modelState: {
			type: questionType,
			solution: {
				getComponentClass: () =>
					function C() {
						return <div>MCAnswer</div>
					}
			}
		},
		children: {
			models: [
				{
					get: key => {
						switch (key) {
							case 'id':
								return 'mock-id-mc-answer'

							case 'type':
								return 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
						}
					},
					getComponentClass: () =>
						function C() {
							return <div>MCAnswer</div>
						}
				},
				{
					get: key => {
						switch (key) {
							case 'id':
								return 'mock-id-mc-feedback'

							case 'type':
								return 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
						}
					},
					getComponentClass: () =>
						function C() {
							return <div>MCFeedback</div>
						}
				}
			]
		}
	}

	const moduleData = {
		questionState: 'mockQuestionState',
		navState: {
			context: 'mock-context'
		},
		focusState: 'mockFocus'
	}

	return {
		questionModel,
		questionAssessmentModel: questionModel.children.models[1],
		moduleData,
		resultsRef: jest.fn(),
		assessmentComponentRef: jest.fn(),
		updateExplanationRef: jest.fn(),
		startQuestionAriaLabel: 'mock-label',
		type: questionType,
		mode,
		isFlipping: false,
		viewState,
		response,
		shouldShowRevealAnswerButton,
		isAnswerRevealed,
		isShowingExplanation,
		isShowingExplanationButton,
		instructions: 'mock-instructions',
		score,
		scoreClass: 'mock-score-class',
		feedbackText: 'mock-feedback-text',
		detailedText: 'mock-detailed-text',
		responseSendState: 'recorded',
		onFormChange: jest.fn(),
		onFormSubmit: jest.fn(),
		onClickReset: jest.fn(),
		onClickReveal: jest.fn(),
		onClickShowExplanation: jest.fn(),
		onClickHideExplanation: jest.fn(),
		onClickBlocker: jest.fn()
	}
}

const getQuestionJSON = questionType => ({
	id: 'question-id',
	type: 'ObojoboDraft.Chunks.Question',
	content: {
		title: 'Title',
		type: questionType,
		solution: {
			id: 'solution-id',
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
			id: 'question-content',
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
		},
		{
			id: 'mc-assessment-id',
			type: 'ObojoboDraft.Chunks.MCAssessment',
			content: {
				correctLabels: 'mock-correct-labels'
			},
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
						score: 100
					},
					children: [
						{
							id: 'choice2-answer',
							type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
							children: [
								{
									id: 'choice2-answer-text',
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
							id: 'choice2-feedback',
							type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
							children: [
								{
									id: 'choice2-feedback-text',
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
				}
			]
		}
	]
})

describe('Question', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Component matches all snapshots', () => {
		const questionTypes = ['default', 'survey']
		const modes = ['practice', 'assessment', 'review']
		const viewStates = ['active', 'viewed', 'hidden']
		const responses = [null, { ids: ['choice1'] }, { ids: ['choice2'] }]
		const shouldShowRevealAnswerButtons = [true, false]
		const isAnswerRevealeds = [true, false]
		const isShowingExplanations = [true, false]
		const isShowingExplanationButtons = [true, false]
		const scores = [null, 'no-score', 0, 100]

		const args = []
		questionTypes.forEach(questionType => {
			modes.forEach(mode => {
				viewStates.forEach(viewState => {
					responses.forEach(response => {
						shouldShowRevealAnswerButtons.forEach(shouldShowRevealAnswerButton => {
							isAnswerRevealeds.forEach(isAnswerRevealed => {
								isShowingExplanations.forEach(isShowingExplanation => {
									isShowingExplanationButtons.forEach(isShowingExplanationButton => {
										scores.forEach(score => {
											args.push({
												questionType,
												mode,
												viewState,
												response,
												shouldShowRevealAnswerButton,
												isAnswerRevealed,
												isShowingExplanation,
												isShowingExplanationButton,
												score
											})
										})
									})
								})
							})
						})
					})
				})
			})
		})

		for (const arg of args) {
			const props = getDefaultProps(arg)
			const component = renderer.create(<QuestionComponent {...props} />)

			const tree = component.toJSON()

			expect(tree).toMatchSnapshot()
		}

		// const props = getDefaultProps({
		// 	questionType,
		// 	mode,
		// 	isFlipping,
		// 	viewState,
		// 	response,
		// 	shouldShowRevealAnswerButton,
		// 	isAnswerRevealed,
		// 	isShowingExplanation,
		// 	isShowingExplanationButton,
		// 	score,
		// 	responseSendState
		// })

		// const component = renderer.create(<QuestionComponent {...props} />)

		// const tree = component.toJSON()

		// expect(tree).toMatchSnapshot()
	})
})
