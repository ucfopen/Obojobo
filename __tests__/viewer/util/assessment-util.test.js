import { Store } from '../../../src/scripts/common/store'
import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import AssessmentUtil from '../../../src/scripts/viewer/util/assessment-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})

describe.skip('QuestionUtil', () => {
	let exampleDocument = {
		id: 'rootId',
		type: 'ObojoboDraft.Modules.Module',
		children: [
			{
				id: 'assessmentId',
				type: 'ObojoboDraft.Sections.Assessment',
				children: [
					{
						id: 'pageId',
						type: 'ObojoboDraft.Pages.Page'
					},
					{
						id: 'questionBankId',
						type: 'ObojoboDraft.Chunks.QuestionBank',
						children: [
							{
								id: 'q1',
								type: 'ObojoboDraft.Chunks.Question'
							},
							{
								id: 'q2',
								type: 'ObojoboDraft.Chunks.Question'
							}
						]
					}
				]
			}
		]
	}

	let exampleAssessment = {
		assessments: {
			assessmentId: {
				attempts: [
					{
						result: {
							attemptScore: 100,
							assessmentScore: 100,
							questionScores: [{ attemptOneScores: 'goHere' }]
						}
					},
					{
						result: {
							attemptScore: 50,
							assessmentScore: 100,
							questionScores: [{ attemptTwoScores: 'goHere' }]
						}
					}
				],
				current: {
					attemptData: 'goesHere'
				},
				score: 100
			}
		}
	}

	let exampleAssessmentNoAttempts = {
		assessments: {
			assessmentId: {
				attempts: [],
				current: null,
				score: null
			}
		}
	}

	beforeEach(done => {
		jest.resetAllMocks()

		AssessmentStore.init()
		QuestionStore.init()

		Store.getItems(() => {
			done()
		})
	})

	test('get an assessment from a model', () => {
		AssessmentStore.setState({
			assessments: {
				assessmentId: {
					hereIs: 'someAssessmentData'
				}
			}
		})
		OboModel.create(exampleDocument)

		let assessment = AssessmentUtil.getAssessmentForModel(
			AssessmentStore.getState(),
			OboModel.models.pageId
		)

		expect(assessment).toEqual({
			hereIs: 'someAssessmentData'
		})
	})

	test.skip('gets the last attempt score for a model', () => {
		AssessmentStore.setState(exampleAssessment)
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getLastAttemptScoreForModel(AssessmentStore.getState(), OboModel.models.pageId)
		).toBe(50)
	})

	test('returns null for the last attempt score for a model if no assessment', () => {
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getLastAttemptScoreForModel(AssessmentStore.getState(), OboModel.models.pageId)
		).toBe(null)
	})

	test('returns 0 for the last attempt score for a model if no attempts', () => {
		AssessmentStore.setState(exampleAssessmentNoAttempts)
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getLastAttemptScoreForModel(AssessmentStore.getState(), OboModel.models.pageId)
		).toBe(0)
	})

	test('gets the assessment score for a model', () => {
		AssessmentStore.setState(exampleAssessment)
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getAssessmentScoreForModel(AssessmentStore.getState(), OboModel.models.pageId)
		).toBe(100)
	})

	test('returns null for the assessment score for a model if no assessment', () => {
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getAssessmentScoreForModel(AssessmentStore.getState(), OboModel.models.pageId)
		).toBe(null)
	})

	test('returns null for the assessment score for a model if no attempts', () => {
		AssessmentStore.setState(exampleAssessmentNoAttempts)
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getAssessmentScoreForModel(AssessmentStore.getState(), OboModel.models.pageId)
		).toBe(null)
	})

	test.skip('gets the last attempt scores for a model', () => {
		AssessmentStore.setState(exampleAssessment)
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getLastAttemptScoresForModel(
				AssessmentStore.getState(),
				OboModel.models.pageId
			)
		).toEqual([{ attemptTwoScores: 'goHere' }])
	})

	test('returns null for the last attempt scores for a model if no assessment', () => {
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getLastAttemptScoresForModel(
				AssessmentStore.getState(),
				OboModel.models.pageId
			)
		).toEqual(null)
	})

	test('returns [] for the last attempt scores for a model if no attempts', () => {
		AssessmentStore.setState(exampleAssessmentNoAttempts)
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getLastAttemptScoresForModel(
				AssessmentStore.getState(),
				OboModel.models.pageId
			)
		).toEqual([])
	})

	test('gets the current attempt for a model', () => {
		AssessmentStore.setState(exampleAssessment)
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getCurrentAttemptForModel(AssessmentStore.getState(), OboModel.models.pageId)
		).toEqual({
			attemptData: 'goesHere'
		})
	})

	test('returns null for the current attempt for a model if no assessment', () => {
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getCurrentAttemptForModel(AssessmentStore.getState(), OboModel.models.pageId)
		).toEqual(null)
	})

	test('knows if incomplete current attempt is incomplete', () => {
		AssessmentStore.setState(exampleAssessment)
		QuestionStore.setState({
			responses: {
				q1: { set: true }
			}
		})
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.isCurrentAttemptComplete(
				AssessmentStore.getState(),
				QuestionStore.getState(),
				OboModel.models.assessmentId
			)
		).toBe(false)
	})

	test('knows if completed current attempt is completed', () => {
		AssessmentStore.setState(exampleAssessment)
		QuestionStore.setState({
			responses: {
				q1: { set: true },
				q2: { set: true }
			}
		})
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.isCurrentAttemptComplete(
				AssessmentStore.getState(),
				QuestionStore.getState(),
				OboModel.models.assessmentId
			)
		).toBe(true)
	})

	test('returns null for isCurrentAttemptCompleted if no assessment', () => {
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.isCurrentAttemptComplete(
				AssessmentStore.getState(),
				QuestionStore.getState(),
				OboModel.models.assessmentId
			)
		).toBe(null)
	})

	test('gets number of copmleted attempts per model', () => {
		AssessmentStore.setState(exampleAssessment)
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getNumberOfAttemptsCompletedForModel(
				AssessmentStore.getState(),
				OboModel.models.assessmentId
			)
		).toBe(2)
	})

	test('returns 0 fro getNumberOfAttemptsCompletedForModel if no assessment', () => {
		OboModel.create(exampleDocument)

		expect(
			AssessmentUtil.getNumberOfAttemptsCompletedForModel(
				AssessmentStore.getState(),
				OboModel.models.assessmentId
			)
		).toBe(0)
	})

	test('dispatches start attempt', () => {
		OboModel.create(exampleDocument)

		AssessmentUtil.startAttempt(OboModel.models.assessmentId)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:startAttempt', {
			value: {
				id: 'assessmentId'
			}
		})
	})

	test('dispatches end attempt', () => {
		OboModel.create(exampleDocument)

		AssessmentUtil.endAttempt(OboModel.models.assessmentId)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:endAttempt', {
			value: {
				id: 'assessmentId'
			}
		})
	})
})
