import QuestionComponent from './question-component'
import QuestionFooter from './question-footer'
import React from 'react'
import renderer from 'react-test-renderer'

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
	class MCAnswerClass extends React.Component {
		render() {
			return <div>MCAnswer</div>
		}
	}

	class MCFeedbackClass extends React.Component {
		render() {
			return <div>MCFeedback</div>
		}
	}

	const questionModel = {
		getDomId: () => 'mock-dom-id',
		processTrigger: jest.fn(),
		get: () => 'mock-id',
		modelState: {
			type: questionType,
			solution: {
				getComponentClass: () => MCAnswerClass
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
					getComponentClass: () => MCAnswerClass
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
					getComponentClass: () => MCFeedbackClass
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
	})

	test('Component renders when responses are sending', () => {
		const props = getDefaultProps({
			questionType: 'default',
			mode: 'assessment',
			viewState: 'active',
			response: null,
			shouldShowRevealAnswerButton: false,
			isAnswerRevealed: false,
			isShowingExplanation: false,
			isShowingExplanationButton: false,
			score: null
		})
		props.responseSendState = 'sending'

		const component = renderer.create(<QuestionComponent {...props} />)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Does not render a QuestionFooter in practice mode if the assessment has the appropriate setting', () => {
		const props = getDefaultProps({
			questionType: 'default',
			mode: 'practice',
			viewState: 'active',
			response: null,
			shouldShowRevealAnswerButton: false,
			isAnswerRevealed: false,
			isShowingExplanation: false,
			isShowingExplanationButton: false,
			score: null
		})
		props.questionAssessmentModel.modelState = { noFooter: true }

		const component = renderer.create(<QuestionComponent {...props} />)

		expect(component.root.findAllByType(QuestionFooter).length).toBe(0)
	})

	test('Renders a QuestionFooter in review mode regardles of the noFooter setting', () => {
		const props = getDefaultProps({
			questionType: 'default',
			mode: 'review',
			viewState: 'active',
			response: null,
			shouldShowRevealAnswerButton: false,
			isAnswerRevealed: false,
			isShowingExplanation: false,
			isShowingExplanationButton: false,
			score: null
		})
		props.questionAssessmentModel.modelState = { noFooter: true }

		const component = renderer.create(<QuestionComponent {...props} />)

		expect(component.root.findAllByType(QuestionFooter).length).toBe(1)
	})
})
