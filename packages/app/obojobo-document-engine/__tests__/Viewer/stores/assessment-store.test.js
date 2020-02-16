import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import { Registry } from '../../../src/scripts/common/registry'
import AssessmentUtil from '../../../src/scripts/viewer/util/assessment-util'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'
import NavStore from '../../../src/scripts/viewer/stores/nav-store'
import FocusUtil from '../../../src/scripts/viewer/util/focus-util'
import NavUtil from '../../../src/scripts/viewer/util/nav-util'
import APIUtil from '../../../src/scripts/viewer/util/api-util'
import AssessmentAPI from '../../../src/scripts/viewer/util/assessment-api'
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import ModalUtil from '../../../src/scripts/common/util/modal-util'
import ErrorUtil from '../../../src/scripts/common/util/error-util'
import QuestionUtil from '../../../src/scripts/viewer/util/question-util'
import LTIResyncStates from '../../../src/scripts/viewer/stores/assessment-store/lti-resync-states'
import AssessmentScoreReporter from '../../../src/scripts/viewer/assessment/assessment-score-reporter'
import mockConsole from 'jest-mock-console'

jest.mock('../../../src/scripts/common/util/modal-util', () => ({
	show: jest.fn(),
	hide: jest.fn()
}))

jest.mock('../../../src/scripts/common/util/error-util', () => ({
	show: jest.fn(),
	errorResponse: jest.fn()
}))

jest.mock('../../../src/scripts/viewer/assessment/assessment-score-reporter')
jest.mock('../../../src/scripts/viewer/stores/nav-store')
jest.mock('../../../src/scripts/viewer/util/question-util')
jest.mock('../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../src/scripts/viewer/util/api-util')
jest.mock('../../../src/scripts/viewer/util/assessment-api')
jest.mock('../../../src/scripts/viewer/util/assessment-util')
jest.mock('../../../src/scripts/viewer/assessment/assessment-score-reporter')
jest.mock('../../../src/scripts/viewer/util/focus-util')

describe('AssessmentStore', () => {
	let restoreConsole
	const getExampleAssessment = () => ({
		id: 'rootId',
		type: 'ObojoboDraft.Modules.Module',
		children: [
			{
				id: 'assessmentId',
				type: 'ObojoboDraft.Sections.Assessment',
				content: {},
				children: [
					{
						id: 'pageId',
						type: 'ObojoboDraft.Pages.Page'
					},
					{
						id: 'questionBankId',
						type: 'ObojoboDraft.Chunks.QuestionBank'
					}
				]
			}
		]
	})

	const mockStartAttemptResult = () => ({
		status: 'ok',
		value: {
			attemptId: 'attemptId',
			assessmentId: 'assessmentId',
			state: {
				chosen: [
					{
						id: 'q1',
						type: 'ObojoboDraft.Chunks.Question'
					},
					{
						id: 'q2',
						type: 'ObojoboDraft.Chunks.Question'
					},
					{
						id: 'qb',
						type: 'ObojoboDraft.Chunks.QuestionBank'
					}
				]
			},
			questions: [
				{
					id: 'q1',
					type: 'ObojoboDraft.Chunks.Question',
					children: [
						{
							id: 'r1',
							type: 'ObojoboDraft.Chunks.MCAssessment'
						}
					]
				},
				{
					id: 'q2',
					type: 'ObojoboDraft.Chunks.Question',
					children: [
						{
							id: 'r2',
							type: 'ObojoboDraft.Chunks.MCAssessment'
						}
					]
				}
			]
		}
	})

	beforeEach(done => {
		jest.resetModules()
		jest.resetAllMocks()
		jest.restoreAllMocks()
		restoreConsole = mockConsole('error')
		APIUtil.getVisitSessionStatus.mockResolvedValue({ status: 'ok' })
		AssessmentStore.state = {} // reset state
		AssessmentStore.triggerChange = jest.fn()
		QuestionStore.init()
		QuestionStore.triggerChange = jest.fn()

		// Need to make sure all the Obo components are loaded
		Registry.getItems(() => {
			done()
		})
	})

	afterEach(() => {
		restoreConsole()
	})

	test('init builds default state', () => {
		AssessmentStore.init([])

		expect(AssessmentStore.getState()).toMatchInlineSnapshot(`
		Object {
		  "assessmentSummary": Array [],
		  "assessments": Object {},
		  "attemptHistoryLoadState": "none",
		  "importHasBeenUsed": false,
		  "importableScore": null,
		  "isResumingAttempt": false,
		}
	`)
	})

	test('init shows dialog for unfinished attempt', () => {
		const displayUnfinished = jest.spyOn(AssessmentStore, 'displayUnfinishedAttemptNotice')
		const findUnfinished = jest.spyOn(AssessmentStore, 'findUnfinishedAttemptInAssessmentSummary')
		findUnfinished.mockReturnValue({ unfinishedAttemptId: 'mock-attempt-id' })

		AssessmentStore.init([])

		expect(AssessmentStore.getState()).toHaveProperty('isResumingAttempt', true)
		expect(displayUnfinished).toHaveBeenCalledTimes(1)
		expect(displayUnfinished).toHaveBeenCalledWith('mock-attempt-id')
	})

	test('init extracts & combines extensions for importableScore and assessmentSummary', () => {
		jest.spyOn(AssessmentStore, 'displayUnfinishedAttemptNotice')
		const findUnfinished = jest.spyOn(AssessmentStore, 'findUnfinishedAttemptInAssessmentSummary')
		//eslint-disable-next-line no-undefined
		findUnfinished.mockReturnValue(undefined)

		const extensions = [
			{
				name: 'ObojoboDraft.Sections.Assessment',
				importableScore: 'mock-importable-score',
				assessmentSummary: 'mock-summary'
			},
			{ name: 'ObojoboDraft.Sections.NotAssessment' }
		]

		AssessmentStore.init(extensions)

		expect(AssessmentStore.getState()).toHaveProperty('importableScore', 'mock-importable-score')
		expect(AssessmentStore.getState()).toHaveProperty('assessmentSummary', 'mock-summary')
	})

	test('init calls displayScoreImportNotice', () => {
		const displayImport = jest.spyOn(AssessmentStore, 'displayScoreImportNotice')
		const findUnfinished = jest.spyOn(AssessmentStore, 'findUnfinishedAttemptInAssessmentSummary')
		//eslint-disable-next-line no-undefined
		findUnfinished.mockReturnValue(undefined)

		const extensions = [
			{
				name: 'ObojoboDraft.Sections.Assessment',
				importableScore: 'mock-importable-score',
				assessmentSummary: 'mock-summary'
			},
			{ name: 'ObojoboDraft.Sections.NotAssessment' }
		]

		AssessmentStore.init(extensions)

		expect(displayImport).toHaveBeenCalledTimes(1)
		expect(displayImport).toHaveBeenCalledWith('mock-importable-score')
	})

	test('init skips displayScoreImportNotice if theres no importableScore', () => {
		const displayImport = jest.spyOn(AssessmentStore, 'displayScoreImportNotice')
		const findUnfinished = jest.spyOn(AssessmentStore, 'findUnfinishedAttemptInAssessmentSummary')
		//eslint-disable-next-line no-undefined
		findUnfinished.mockReturnValue(undefined)

		const extensions = [
			{
				name: 'ObojoboDraft.Sections.Assessment',
				importableScore: null,
				assessmentSummary: 'mock-summary'
			},
			{ name: 'ObojoboDraft.Sections.NotAssessment' }
		]

		AssessmentStore.init(extensions)

		expect(displayImport).toHaveBeenCalledTimes(0)
	})

	test('findUnfinishedAttemptInAssessmentSummary finds expected attempts', () => {
		// store a ref to the function we're testing simply to reduce
		// the length of the tests here
		const fnToTest = AssessmentStore.findUnfinishedAttemptInAssessmentSummary

		/* eslint-disable no-undefined */
		expect(fnToTest([])).toBe(undefined)
		expect(fnToTest([{ somethingElse: true }])).toBe(undefined)
		expect(fnToTest([{ unfinishedAttemptId: null }])).toBe(undefined)
		expect(fnToTest([{ somethingElse: true }])).toBe(undefined)
		expect(fnToTest([{ unfinishedAttemptId: true }])).toBe(undefined)
		expect(fnToTest([{ unfinishedAttemptId: false }])).toBe(undefined)
		expect(fnToTest([{ unfinishedAttemptId: 44 }])).toBe(undefined)
		expect(fnToTest([{ unfinishedAttemptId: 'str' }])).toEqual({ unfinishedAttemptId: 'str' })
		/* eslint-enable no-undefined */
	})

	test('resuming an unfinished attempt hides the modal, starts the attempt and triggers a change', async () => {
		NavStore.getState.mockReturnValue({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})

		const mockResumeAttemptResponse = {
			status: 'ok',
			value: { mockValue: true }
		}

		AssessmentAPI.resumeAttempt.mockResolvedValueOnce(mockResumeAttemptResponse)
		jest.spyOn(AssessmentStore, 'updateStateAfterStartAttempt')
		AssessmentStore.updateStateAfterStartAttempt.mockReturnValueOnce()

		await AssessmentStore.resumeAttemptWithAPICall('resume-attempt-id')

		expect(ModalUtil.hide).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.updateStateAfterStartAttempt).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.updateStateAfterStartAttempt).toHaveBeenCalledWith(
			mockResumeAttemptResponse.value
		)
		expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)

		AssessmentStore.updateStateAfterStartAttempt.mockRestore()
	})

	test('startAttemptWithAPICall shows an error if no attempts are left and triggers a change', () => {
		OboModel.create(getExampleAssessment())

		AssessmentAPI.startAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Attempt limit reached'
			}
		})

		return AssessmentStore.startAttemptWithAPICall('draftId', 'visitId', 'assessmentId').then(
			() => {
				expect(ErrorUtil.show).toHaveBeenCalledTimes(1)
				expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
			}
		)
	})

	test('startAttemptWithAPICall shows a generic error if an unrecognized error is thrown and triggers a change', () => {
		OboModel.create(getExampleAssessment())

		AssessmentAPI.startAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		return AssessmentStore.startAttemptWithAPICall('draftId', 'visitId', 'assessmentId').then(
			() => {
				expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
				expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
			}
		)
	})

	test('startAttemptWithAPICall rejects with unexpected errors', () => {
		OboModel.create(getExampleAssessment())

		// cause ErrorUtil.show to be called
		AssessmentAPI.startAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'attempt limit reached'
			}
		})

		// use this to throw an unexpected error
		ErrorUtil.show.mockImplementationOnce(() => {
			throw new Error('Unexpected Error')
		})

		return expect(
			AssessmentStore.startAttemptWithAPICall('draftId', 'visitId', 'assessmentId')
		).rejects.toThrow('Unexpected Error')
	})

	test('startAttemptWithAPICall injects question models, creates state, updates the nav and processes the onStartAttempt trigger', async () => {
		AssessmentAPI.startAttempt.mockResolvedValue(mockStartAttemptResult())
		OboModel.create(getExampleAssessment())

		NavUtil.rebuildMenu = jest.fn()
		NavUtil.goto = jest.fn()

		const assessmentModel = OboModel.models.rootId.children.at(0)
		const qBank = assessmentModel.children.at(1)

		assessmentModel.processTrigger = jest.fn()

		AssessmentStore.init([])
		await AssessmentStore.startAttemptWithAPICall('draftId', 'visitId', 'assessmentId')

		expect(assessmentModel.children.length).toBe(2)
		expect(qBank.children.length).toBe(2)
		expect(qBank.children.at(0).id).toBe('q1')
		expect(qBank.children.at(1).id).toBe('q2')
		expect(NavUtil.rebuildMenu).toHaveBeenCalledTimes(1)
		expect(NavUtil.goto).toHaveBeenCalledTimes(1)
		expect(NavUtil.goto).toHaveBeenCalledWith('assessmentId')
		expect(OboModel.models.assessmentId.processTrigger).toHaveBeenCalledWith('onStartAttempt')
		expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('startAttemptWithAPICall builds an attempt if it doesnt exist', () => {
		AssessmentAPI.startAttempt.mockResolvedValue(mockStartAttemptResult())
		OboModel.create(getExampleAssessment())

		AssessmentStore.setState({ assessments: { assessmentId: {} } })

		NavUtil.rebuildMenu = jest.fn()
		NavUtil.goto = jest.fn()

		const assessmentModel = OboModel.models.rootId.children.at(0)
		const qBank = assessmentModel.children.at(1)

		assessmentModel.processTrigger = jest.fn()

		return AssessmentStore.startAttemptWithAPICall('draftId', 'visitId', 'assessmentId').then(
			() => {
				expect(assessmentModel.children.length).toBe(2)
				expect(qBank.children.length).toBe(2)
				expect(qBank.children.at(0).id).toBe('q1')
				expect(qBank.children.at(1).id).toBe('q2')
				expect(NavUtil.rebuildMenu).toHaveBeenCalledTimes(1)
				expect(NavUtil.goto).toHaveBeenCalledTimes(1)
				expect(NavUtil.goto).toHaveBeenCalledWith('assessmentId')
				expect(OboModel.models.assessmentId.processTrigger).toHaveBeenCalledWith('onStartAttempt')
				expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
			}
		)
	})

	test('tryResendLTIScore catches unexpected errors', () => {
		OboModel.create(getExampleAssessment())
		NavStore.getState.mockReturnValueOnce({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({})
		AssessmentStore.setState({ assessments: { assessmentId: {} } })

		AssessmentAPI.resendLTIAssessmentScore.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'attempt limit reached'
			}
		})
		ErrorUtil.errorResponse.mockImplementationOnce(() => {
			throw new Error('Mock Error')
		})

		return AssessmentStore.tryResendLTIScore('assessmentId').then(() => {
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
			// eslint-disable-next-line no-console
			expect(console.error).toHaveBeenCalledWith(expect.any(Error))
		})
	})

	test('tryResendLTIScore returns with error', () => {
		expect.assertions(2)
		NavStore.getState.mockReturnValueOnce({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})
		AssessmentAPI.startAttempt.mockResolvedValue(mockStartAttemptResult())
		OboModel.create(getExampleAssessment())

		AssessmentStore.setState({
			assessments: {
				assessmentId: {}
			}
		})

		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(
			AssessmentStore.getState().assessments.assessmentId
		)
		AssessmentAPI.resendLTIAssessmentScore.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		return AssessmentStore.tryResendLTIScore('assessmentId').then(() => {
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
			expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
		})
	})

	test('tryResendLTIScore updates and triggersChange', () => {
		expect.assertions(2)
		NavStore.getState.mockReturnValueOnce({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})
		AssessmentAPI.startAttempt.mockResolvedValue(mockStartAttemptResult())
		OboModel.create(getExampleAssessment())

		AssessmentStore.setState({
			assessments: {
				assessmentId: {}
			}
		})

		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(
			AssessmentStore.getState().assessments.assessmentId
		)
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(
			AssessmentStore.getState().assessments.assessmentId
		)

		AssessmentAPI.resendLTIAssessmentScore.mockResolvedValueOnce({
			status: 'success',
			value: {}
		})

		return AssessmentStore.tryResendLTIScore('assessmentId').then(() => {
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(0)
			expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(3)
		})
	})

	test('updateLTIScore updates resyncState to failed if resync fails, updates lti object, calls triggerChange', () => {
		AssessmentUtil.isLTIScoreNeedingToBeResynced.mockReturnValueOnce(true)
		const assessment = {}

		AssessmentStore.updateLTIScore(assessment, 'mock-lti-response')

		expect(assessment).toEqual({
			ltiResyncState: LTIResyncStates.RESYNC_FAILED,
			lti: 'mock-lti-response'
		})
		expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('updateLTIScore updates resyncState to success if resync works, updates lti object, calls triggerChange', () => {
		AssessmentUtil.isLTIScoreNeedingToBeResynced.mockReturnValueOnce(false)
		const assessment = {}

		AssessmentStore.updateLTIScore(assessment, 'mock-lti-response')

		expect(assessment).toEqual({
			ltiResyncState: LTIResyncStates.RESYNC_SUCCEEDED,
			lti: 'mock-lti-response'
		})
		expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('endAttemptWithAPICall catches unexpected errors', () => {
		OboModel.create(getExampleAssessment())
		NavStore.getState.mockReturnValueOnce({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})
		AssessmentStore.setState({
			assessments: { assessmentId: { current: { attemptId: 'mockAttemptId' } } }
		})

		AssessmentAPI.endAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'attempt limit reached'
			}
		})
		ErrorUtil.errorResponse.mockImplementationOnce(() => {
			throw new Error('Mock Error')
		})

		return AssessmentStore.endAttemptWithAPICall('assessmentId', 'mock-context').then(() => {
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
			// eslint-disable-next-line no-console
			expect(console.error).toHaveBeenCalledWith(expect.any(Error))
		})
	})

	test('endAttemptWithAPICall shows an error if the endAttempt request fails and triggers a change', async () => {
		expect.hasAssertions()

		NavStore.getState.mockReturnValueOnce({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})

		AssessmentAPI.endAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		AssessmentStore.state = {
			assessments: {
				assessmentId: {
					current: {
						attemptId: 'mock-attempt-id'
					}
				}
			}
		}

		const updateAfter = jest.spyOn(AssessmentStore, 'updateStateAfterEndAttempt')
		updateAfter.mockReturnValueOnce()

		expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(0)
		expect(AssessmentStore.updateStateAfterEndAttempt).toHaveBeenCalledTimes(0)
		expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(0)

		await AssessmentStore.endAttemptWithAPICall('assessmentId', 'mock-context')

		expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.updateStateAfterEndAttempt).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('endAttemptWithAPICall calls endAttempt with correct args', async () => {
		expect.hasAssertions()

		AssessmentStore.setState({
			assessments: {
				['mock-assessment-id']: {
					current: {
						attemptId: 'mock-attempt-id',
						state: {
							chosen: []
						}
					}
				}
			}
		})

		NavStore.getState.mockReturnValueOnce({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})

		// reject so we can skip setup for inner logic
		AssessmentAPI.endAttempt.mockRejectedValueOnce('mock-error')

		await expect(
			AssessmentStore.endAttemptWithAPICall('mock-assessment-id', 'mock-context')
		).resolves.toBe()
		expect(AssessmentAPI.endAttempt).toHaveBeenCalledWith({
			attemptId: 'mock-attempt-id',
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})
	})

	test('endAttemptWithAPICall handles endAttempt error', async () => {
		expect.hasAssertions()

		AssessmentStore.setState({
			assessments: {
				['mock-assessment-id']: {
					current: {
						attemptId: 'mock-attempt-id',
						state: {
							chosen: []
						}
					}
				}
			}
		})

		NavStore.getState.mockReturnValueOnce({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})

		// reject so we can skip setup for inner logic
		AssessmentAPI.endAttempt.mockResolvedValueOnce({
			status: 'error'
		})

		jest.spyOn(AssessmentStore, 'updateStateAfterEndAttempt')
		jest.spyOn(AssessmentStore, 'triggerChange')
		jest.spyOn(AssessmentStore, 'getAttemptHistory')
		AssessmentStore.updateStateAfterEndAttempt.mockReturnValue()
		await expect(
			AssessmentStore.endAttemptWithAPICall('mock-assessment-id', 'mock-context')
		).resolves.toBe()

		expect(AssessmentAPI.endAttempt).toHaveBeenCalledWith({
			attemptId: 'mock-attempt-id',
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})
		expect(AssessmentStore.updateStateAfterEndAttempt).toHaveBeenCalledWith(
			'mock-assessment-id',
			'mock-context'
		)
		expect(AssessmentStore.triggerChange).toHaveBeenCalled()
		expect(AssessmentStore.getAttemptHistory).not.toHaveBeenCalled()
		expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
	})

	test('endAttemptWithAPICall displays score report', async () => {
		expect.hasAssertions()

		// mock out as many internal methods as we can
		// to limit how much internal complexity
		// we have to deal with
		jest.spyOn(AssessmentStore, 'updateStateAfterEndAttempt')
		jest.spyOn(AssessmentStore, 'triggerChange')
		jest.spyOn(AssessmentStore, 'getAttemptHistory')
		jest.spyOn(AssessmentStore, 'displayResultsModal')

		// mock the assessment model parts needed
		OboModel.models['mock-assessment-id'] = {
			modelState: {
				rubric: {
					toObject: () => 'mock-rubric-object'
				},
				attempts: ['mock-attempts']
			}
		}

		// place the assessment into the store's state
		AssessmentStore.state = {
			assessments: {
				['mock-assessment-id']: {
					current: {
						attemptId: 'mock-attempt-id'
					},
					attempts: [
						{
							scoreDetails: 'mock-score-details'
						}
					]
				}
			}
		}

		// mock navstore's state
		NavStore.getState.mockReturnValue({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})

		// mock the label extracted from the model
		NavUtil.getNavLabelForModel.mockReturnValueOnce('mock-nav-label')

		// mock end attempt results
		AssessmentAPI.endAttempt.mockResolvedValueOnce({
			value: {
				attemptNumber: 'mock-attempt-number'
			}
		})

		// mock to skip implementation
		AssessmentStore.updateStateAfterEndAttempt.mockReturnValue()
		AssessmentStore.getAttemptHistory.mockResolvedValueOnce()
		AssessmentStore.triggerChange.mockReturnValue()

		AssessmentScoreReporter.mockImplementation(() => ({
			getReportFor: () => 'mock-score-report'
		}))

		// execute & expect that it resolves
		await expect(
			AssessmentStore.endAttemptWithAPICall('mock-assessment-id', 'mock-context')
		).resolves.toBe()

		// make sure the modal is sent the arguments we expect
		expect(AssessmentStore.displayResultsModal).toHaveBeenCalledWith(
			'mock-nav-label',
			'mock-attempt-number',
			'mock-score-report'
		)
	})

	test('updateStateAfterEndAttempt flips questions, resets responses, informs the model and dispatches attemptEnded', () => {
		expect.hasAssertions()
		// mock the assessment model parts needed
		const model = {
			processTrigger: jest.fn()
		}

		OboModel.models['mock-assessment-id'] = model

		AssessmentStore.state = {
			assessments: {
				['mock-assessment-id']: {
					current: {
						state: {
							chosen: [
								{
									id: 'mock-question-id',
									type: 'ObojoboDraft.Chunks.Question'
								}
							]
						}
					},
					currentResponses: ['mock-question-response-id']
				}
			}
		}

		jest.spyOn(Dispatcher, 'trigger')

		AssessmentStore.updateStateAfterEndAttempt('mock-assessment-id', 'mock-context')

		expect(model.processTrigger).toHaveBeenCalledWith('onEndAttempt')
		expect(QuestionUtil.hideQuestion).toHaveBeenCalledWith('mock-question-id', 'mock-context')
		expect(QuestionUtil.clearResponse).toHaveBeenCalledWith(
			'mock-question-response-id',
			'mock-context'
		)
		expect(AssessmentStore.state.assessments['mock-assessment-id'].current).toBe(null)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:attemptEnded', 'mock-assessment-id')
	})

	test('trySetResponse will not update with no Assessment', () => {
		expect.assertions(1)
		AssessmentAPI.startAttempt.mockResolvedValue(mockStartAttemptResult())
		OboModel.create(getExampleAssessment())

		AssessmentStore.init([])
		return AssessmentStore.startAttemptWithAPICall('draftId', 'visitId', 'assessmentId')
			.then(() => AssessmentStore.trySetResponse('q1', ['some response']))
			.then(() => {
				expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalled()
			})
	})

	test('trySetResponse will update state', () => {
		expect.assertions(2)
		AssessmentAPI.startAttempt.mockResolvedValue(mockStartAttemptResult())
		OboModel.create(getExampleAssessment())

		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			currentResponses: ['q2']
		})

		AssessmentStore.init([])
		return AssessmentStore.startAttemptWithAPICall('draftId', 'visitId', 'assessmentId')
			.then(() => AssessmentStore.trySetResponse('q1', ['some response']))
			.then(() => {
				expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalled()
				expect(AssessmentStore.triggerChange).toHaveBeenCalled()
			})
	})

	test('setState will update state', () => {
		expect.assertions(1)

		AssessmentStore.setState('mockState')

		expect(AssessmentStore.getState()).toEqual('mockState')
	})

	test('assessment:startAttempt calls startAttemptWithImportScoreOption', () => {
		jest.spyOn(AssessmentStore, 'startAttemptWithImportScoreOption')
		AssessmentStore.startAttemptWithImportScoreOption.mockReturnValueOnce('mock')

		Dispatcher.trigger('assessment:startAttempt', { value: {} })

		expect(AssessmentStore.startAttemptWithImportScoreOption).toHaveBeenCalled()
	})

	test('assessment:endAttempt calls endAttemptWithAPICall', () => {
		jest.spyOn(AssessmentStore, 'endAttemptWithAPICall')
		AssessmentStore.endAttemptWithAPICall.mockReturnValueOnce('mock')

		AssessmentStore.setState({
			assessments: {
				assessmentId: {}
			}
		})
		AssessmentAPI.endAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		Dispatcher.trigger('assessment:endAttempt', {
			value: { id: 'assessmentId' }
		})

		expect(AssessmentStore.endAttemptWithAPICall).toHaveBeenCalled()
	})

	test('assessment:resendLTIScore calls tryResendLTIScore', () => {
		jest.spyOn(AssessmentStore, 'tryResendLTIScore')
		AssessmentStore.tryResendLTIScore.mockReturnValueOnce('mock')

		AssessmentStore.setState({
			assessments: {
				assessmentId: {}
			}
		})
		AssessmentAPI.endAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		Dispatcher.trigger('assessment:resendLTIScore', {
			value: { id: 'assessmentId' }
		})

		expect(AssessmentStore.tryResendLTIScore).toHaveBeenCalled()
	})

	test('question:setResponse calls trySetResponse', () => {
		jest.spyOn(AssessmentStore, 'trySetResponse')
		NavStore.getState.mockReturnValueOnce({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		})
		AssessmentStore.trySetResponse.mockReturnValueOnce('mock')

		Dispatcher.trigger('question:setResponse', { value: { id: 'q1' } })

		expect(AssessmentStore.trySetResponse).toHaveBeenCalled()
	})

	test('viewer:closeAttempted calls AssessmentUtil', () => {
		Dispatcher.trigger('viewer:closeAttempted')

		expect(AssessmentUtil.isInAssessment).toHaveBeenCalled()
	})

	test('viewer:closeAttempted calls AssessmentUtil', () => {
		AssessmentUtil.isInAssessment.mockReturnValueOnce(true)
		const mockFunction = jest.fn()

		Dispatcher.trigger('viewer:closeAttempted', mockFunction)

		expect(AssessmentUtil.isInAssessment).toHaveBeenCalled()
		expect(mockFunction).toHaveBeenCalled()
	})

	test('onCloseResultsDialog hides modal and focuses on nav target content', () => {
		AssessmentStore.onCloseResultsDialog()

		expect(ModalUtil.hide).toHaveBeenCalledTimes(1)
		expect(FocusUtil.focusOnNavTarget).toHaveBeenCalledTimes(1)
	})
})
