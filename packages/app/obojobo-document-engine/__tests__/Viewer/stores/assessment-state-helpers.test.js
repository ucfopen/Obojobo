jest.mock('obojobo-document-engine/src/scripts/viewer/stores/nav-store')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/assessment-api')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/stores/question-store')
jest.mock('../../../src/scripts/viewer/util/question-util')

import Common from 'Common'
import AssessmentStateHelpers from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-state-helpers'
import NavStore from 'obojobo-document-engine/src/scripts/viewer/stores/nav-store'
import QuestionStore from 'obojobo-document-engine/src/scripts/viewer/stores/question-store'
import AssessmentAPI from 'obojobo-document-engine/src/scripts/viewer/util/assessment-api'
import QuestionUtil from '../../../src/scripts/viewer/util/question-util'
import NavUtil from 'obojobo-document-engine/src/scripts/viewer/util/nav-util'

const { OboModel } = Common.models
// const { ErrorUtil, ModalUtil } = Common.util
const { Dispatcher } = Common.flux

describe('AssessmentStateHelpers', () => {
	beforeEach(() => {
		jest.clearAllMocks()

		const add = jest.fn()
		const reset = jest.fn()
		OboModel.models.mockAssessmentId = {
			get: () => 'mockAssessmentId',
			getRoot: () => ({
				get: () => 'mockDraftId'
			}),
			children: {
				at: () => ({
					id: 'questionBank',
					children: {
						reset,
						add
					}
				})
			},
			processTrigger: jest.fn()
		}

		NavStore.getState.mockReturnValue({
			visitId: 'mockVisitId'
		})
	})

	test('startAttempt calls AssessmentStateHelpers.onAttemptStarted when good response returned', async () => {
		AssessmentAPI.startAttempt.mockResolvedValue({ status: 'ok' })
		const spy = jest.spyOn(AssessmentStateHelpers, 'onAttemptStarted').mockReturnValue(true)

		expect(spy).not.toHaveBeenCalled()
		await AssessmentStateHelpers.startAttempt('mockAssessmentId')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('startAttempt throws an error when bad response returned', async () => {
		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'error',
			value: { message: 'mockErrorMessage' }
		})
		const spy = jest.spyOn(AssessmentStateHelpers, 'onAttemptStarted').mockReturnValue(true)

		expect(spy).not.toHaveBeenCalled()

		try {
			await AssessmentStateHelpers.startAttempt('mockAssessmentId')
		} catch (e) {
			expect(e).toEqual(Error('mockErrorMessage'))
		}

		expect(spy).not.toHaveBeenCalled()
		expect.assertions(3)

		spy.mockRestore()
	})

	test('resumeAttempt calls AssessmentStateHelpers.onAttemptStarted when good response returned', async () => {
		AssessmentAPI.resumeAttempt.mockResolvedValue({ status: 'ok' })
		const spy = jest.spyOn(AssessmentStateHelpers, 'onAttemptStarted').mockReturnValue(true)

		expect(spy).not.toHaveBeenCalled()
		await AssessmentStateHelpers.resumeAttempt('mockAssessmentId', 'mockAttemptId')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('resumeAttempt throws an error when bad response returned', async () => {
		AssessmentAPI.resumeAttempt.mockResolvedValue({
			status: 'error',
			value: { message: 'mockErrorMessage' }
		})
		const spy = jest.spyOn(AssessmentStateHelpers, 'onAttemptStarted').mockReturnValue(true)

		expect(spy).not.toHaveBeenCalled()

		try {
			await AssessmentStateHelpers.resumeAttempt('mockAssessmentId', 'mockAttemptId')
		} catch (e) {
			expect(e).toEqual(Error('mockErrorMessage'))
		}

		expect(spy).not.toHaveBeenCalled()
		expect.assertions(3)

		spy.mockRestore()
	})

	test('endAttempt calls AssessmentStateHelpers.signalAttemptEnded when good response returned', async () => {
		AssessmentAPI.endAttempt.mockResolvedValue({ status: 'ok' })
		const getAttemptHistorySpy = jest
			.spyOn(AssessmentStateHelpers, 'getAttemptHistoryWithReviewData')
			.mockResolvedValue(true)
		const signalAttemptEndedSpy = jest
			.spyOn(AssessmentStateHelpers, 'signalAttemptEnded')
			.mockReturnValue(true)

		expect(getAttemptHistorySpy).not.toHaveBeenCalled()
		expect(signalAttemptEndedSpy).not.toHaveBeenCalled()

		await AssessmentStateHelpers.endAttempt('mockAssessmentId', 'mockAttemptId')

		expect(getAttemptHistorySpy).toHaveBeenCalled()
		expect(signalAttemptEndedSpy).toHaveBeenCalled()

		getAttemptHistorySpy.mockRestore()
		signalAttemptEndedSpy.mockRestore()
	})

	test('endAttempt throws an error when bad response returned', async () => {
		AssessmentAPI.endAttempt.mockResolvedValue({
			status: 'error',
			value: { message: 'mockErrorMessage' }
		})
		const getAttemptHistorySpy = jest
			.spyOn(AssessmentStateHelpers, 'getAttemptHistoryWithReviewData')
			.mockResolvedValue(true)
		const signalAttemptEndedSpy = jest
			.spyOn(AssessmentStateHelpers, 'signalAttemptEnded')
			.mockReturnValue(true)

		expect(getAttemptHistorySpy).not.toHaveBeenCalled()
		expect(signalAttemptEndedSpy).not.toHaveBeenCalled()

		try {
			await AssessmentStateHelpers.endAttempt('mockAssessmentId', 'mockAttemptId')
		} catch (e) {
			expect(e).toEqual(Error('mockErrorMessage'))
		}

		expect(getAttemptHistorySpy).not.toHaveBeenCalled()
		expect(signalAttemptEndedSpy).not.toHaveBeenCalled()
		expect.assertions(5)

		getAttemptHistorySpy.mockRestore()
		signalAttemptEndedSpy.mockRestore()
	})

	test('importAttempt calls AssessmentStateHelpers.signalAttemptEnded when good response returned', async () => {
		AssessmentAPI.importScore.mockResolvedValue({ status: 'ok' })
		const getAttemptHistorySpy = jest
			.spyOn(AssessmentStateHelpers, 'getAttemptHistoryWithReviewData')
			.mockResolvedValue(true)
		const signalAttemptEndedSpy = jest
			.spyOn(AssessmentStateHelpers, 'signalAttemptEnded')
			.mockReturnValue(true)

		expect(getAttemptHistorySpy).not.toHaveBeenCalled()
		expect(signalAttemptEndedSpy).not.toHaveBeenCalled()

		await AssessmentStateHelpers.importAttempt('mockAssessmentId', 'mockAttemptId')

		expect(getAttemptHistorySpy).toHaveBeenCalled()
		expect(signalAttemptEndedSpy).toHaveBeenCalled()

		getAttemptHistorySpy.mockRestore()
		signalAttemptEndedSpy.mockRestore()
	})

	test('importAttempt throws an error when bad response returned', async () => {
		AssessmentAPI.importScore.mockResolvedValue({
			status: 'error',
			value: { message: 'mockErrorMessage' }
		})
		const getAttemptHistorySpy = jest
			.spyOn(AssessmentStateHelpers, 'getAttemptHistoryWithReviewData')
			.mockResolvedValue(true)
		const signalAttemptEndedSpy = jest
			.spyOn(AssessmentStateHelpers, 'signalAttemptEnded')
			.mockReturnValue(true)

		expect(getAttemptHistorySpy).not.toHaveBeenCalled()
		expect(signalAttemptEndedSpy).not.toHaveBeenCalled()

		try {
			await AssessmentStateHelpers.importAttempt('mockAssessmentId', 'mockAttemptId')
		} catch (e) {
			expect(e).toEqual(Error('mockErrorMessage'))
		}

		expect(getAttemptHistorySpy).not.toHaveBeenCalled()
		expect(signalAttemptEndedSpy).not.toHaveBeenCalled()
		expect.assertions(5)

		getAttemptHistorySpy.mockRestore()
		signalAttemptEndedSpy.mockRestore()
	})

	test('getAttemptHistoryWithReviewData returns history data with review data included', async () => {
		AssessmentAPI.getAttemptHistory.mockResolvedValue({
			status: 'ok',
			value: [
				{ assessmentId: 'someAssessment' },
				{
					assessmentId: 'mockAssessmentId',
					attempts: [
						{
							id: 'attempt2Id',
							state: {}
						}
					]
				}
			]
		})
		AssessmentAPI.reviewAttempt.mockResolvedValue({
			attempt1Id: { attempt1Review: true },
			attempt2Id: { attempt2Review: true }
		})

		expect(
			await AssessmentStateHelpers.getAttemptHistoryWithReviewData('mockAssessmentId')
		).toEqual({
			status: 'ok',
			value: [
				{ assessmentId: 'someAssessment' },
				{
					assessmentId: 'mockAssessmentId',
					attempts: [
						{
							id: 'attempt2Id',
							state: {
								questionModels: { attempt2Review: true }
							}
						}
					]
				}
			]
		})
	})

	test('getAttemptHistoryWithReviewData throws error with bad response', async () => {
		AssessmentAPI.getAttemptHistory.mockResolvedValue({
			status: 'error',
			value: { message: 'mockErrorMessage' }
		})

		try {
			await AssessmentStateHelpers.getAttemptHistoryWithReviewData('mockAssessmentId')
		} catch (e) {
			expect(e).toEqual(Error('mockErrorMessage'))
		}

		expect.assertions(1)
	})

	test('sendResponses does not throw when successful', async () => {
		QuestionUtil.forceSendAllResponsesForContext.mockImplementation(() => {
			Dispatcher.trigger('question:forceSentAllResponses', { value: { success: true } })
		})

		try {
			await AssessmentStateHelpers.sendResponses('mockAssessmentId', 'mockAttemptId')
		} catch (e) {
			expect(e).toEqual(Error('Sending all responses failed'))
		}

		expect.assertions(0)
	})

	test('sendResponses throws when not successful', async () => {
		QuestionUtil.forceSendAllResponsesForContext.mockImplementation(() => {
			Dispatcher.trigger('question:forceSentAllResponses', { value: { success: false } })
		})

		try {
			await AssessmentStateHelpers.sendResponses('mockAssessmentId', 'mockAttemptId')
		} catch (e) {
			expect(e).toEqual(Error('Sending all responses failed'))
		}

		expect.assertions(1)
	})

	test('onAttemptStarted creates OboModels, updates nav context, rebuilds the nav menu, navigates to the assessment, runs the onStartAttempt trigger and fires the assessment:attemptStarted event', () => {
		const res = {
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				questions: [{ id: 'question1' }, { id: 'question2' }]
			}
		}

		const navUtilSetContextSpy = jest.spyOn(NavUtil, 'setContext')
		const navUtilRebuildMenuSpy = jest.spyOn(NavUtil, 'rebuildMenu')
		const navUtilGoToSpy = jest.spyOn(NavUtil, 'goto')
		const dispatcherTriggerSpy = jest.spyOn(Dispatcher, 'trigger')

		AssessmentStateHelpers.onAttemptStarted(res)

		const assessmentModel = OboModel.models.mockAssessmentId
		expect(assessmentModel.children.at(1).children.reset).toHaveBeenCalled()
		expect(assessmentModel.children.at(1).children.add).toHaveBeenCalledTimes(2)
		expect(navUtilSetContextSpy).toHaveBeenCalledWith('assessment:mockAssessmentId:mockAttemptId')
		expect(navUtilRebuildMenuSpy).toHaveBeenCalled()
		expect(navUtilGoToSpy).toHaveBeenCalledWith('mockAssessmentId')

		navUtilSetContextSpy.mockRestore()
		navUtilRebuildMenuSpy.mockRestore()
		navUtilGoToSpy.mockRestore()
		dispatcherTriggerSpy.mockRestore()
	})

	test('getUpdatedAssessmentData returns the expected object', () => {
		expect(
			AssessmentStateHelpers.getUpdatedAssessmentData({
				assessmentId: 'mockAssessmentId',
				ltiState: 'mockLTIState',
				attempts: [
					{
						isFinished: true,
						isImported: true,
						assessmentScore: 100,
						result: {
							attemptScore: 0
						}
					},
					{
						isFinished: false,
						isImported: false,
						assessmentScore: 0,
						result: { attemptScore: 100 }
					}
				]
			})
		).toEqual({
			id: 'mockAssessmentId',
			attempts: [
				{
					isFinished: true,
					isImported: true,
					assessmentScore: 100,
					result: {
						attemptScore: 0
					}
				},
				{ isFinished: false, isImported: false, assessmentScore: 0, result: { attemptScore: 100 } }
			],
			current: null,
			unfinishedAttempt: {
				isFinished: false,
				isImported: false,
				assessmentScore: 0,
				result: { attemptScore: 100 }
			},
			lti: 'mockLTIState',
			ltiNetworkState: 'idle',
			ltiResyncState: 'noResyncAttempted',
			attemptHistoryNetworkState: 'loaded',
			highestAssessmentScoreAttempts: [
				{
					isFinished: true,
					isImported: true,
					assessmentScore: 100,
					result: {
						attemptScore: 0
					}
				}
			],
			highestAttemptScoreAttempts: [
				{
					isFinished: false,
					isImported: false,
					assessmentScore: 0,
					result: { attemptScore: 100 }
				}
			],
			isScoreImported: true
		})
	})

	test('getStateSummaryFromAssessmentState returns expected values', () => {
		expect(
			AssessmentStateHelpers.getStateSummaryFromAssessmentState({
				id: 'mockAssessmentId',
				isScoreImported: true,
				attempts: [
					{
						id: 'attempt1Id',
						isFinished: true,
						assessmentScore: 100
					},
					{
						id: 'attempt2Id',
						isFinished: true,
						assessmentScore: 99
					},
					{ id: 'attempt3Id', isFinished: false }
				]
			})
		).toEqual({
			assessmentId: 'mockAssessmentId',
			importUsed: true,
			unfinishedAttemptId: 'attempt3Id',
			scores: [100, 99]
		})
	})

	test('updateQuestionStore calls QuestionStore.updateStateByContext', () => {
		expect(QuestionStore.updateStateByContext).not.toBeCalled()

		AssessmentStateHelpers.updateQuestionStore({
			attempts: [
				{
					id: 'mockAttemptId',
					result: {
						questionScores: [
							{
								id: 'scoreId1'
							},
							{
								id: 'scoreId2'
							}
						]
					},
					questionResponses: [
						{
							questionId: 'questionId1',
							response: 'A'
						},
						{
							questionId: 'questionId2',
							response: 'B'
						}
					]
				}
			]
		})

		expect(QuestionStore.updateStateByContext).toHaveBeenCalledWith(
			{
				scores: {
					scoreId1: { id: 'scoreId1' },
					scoreId2: { id: 'scoreId2' }
				},
				responses: {
					questionId1: 'A',
					questionId2: 'B'
				}
			},
			'assessmentReview:mockAttemptId'
		)
	})

	test('signalAttemptEnded runs processTrigger and Dispatcher.trigger', () => {
		const processTriggerSpy = jest.spyOn(OboModel.models.mockAssessmentId, 'processTrigger')
		const dispatchTriggerSpy = jest.spyOn(Dispatcher, 'trigger')

		expect(processTriggerSpy).not.toHaveBeenCalled()
		expect(dispatchTriggerSpy).not.toHaveBeenCalled()

		AssessmentStateHelpers.signalAttemptEnded(OboModel.models.mockAssessmentId)

		expect(processTriggerSpy).toHaveBeenCalledWith('onEndAttempt')
		expect(dispatchTriggerSpy).toHaveBeenCalledWith('assessment:attemptEnded', 'mockAssessmentId')

		processTriggerSpy.mockRestore()
		dispatchTriggerSpy.mockRestore()
	})

	test('static onError throws expected values', () => {
		expect(() => {
			AssessmentStateHelpers.onError()
		}).toThrow('Request Failed')

		expect(() => {
			AssessmentStateHelpers.onError({
				value: {
					message: 'mock-error-message'
				}
			})
		}).toThrow('mock-error-message')
	})
})
