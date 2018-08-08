import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import { Store } from '../../../src/scripts/common/store'
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'
import AssessmentUtil from '../../../src/scripts/viewer/util/assessment-util'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'
import NavStore from '../../../src/scripts/viewer/stores/nav-store'
import NavUtil from '../../../src/scripts/viewer/util/nav-util'
import APIUtil from '../../../src/scripts/viewer/util/api-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import ModalUtil from '../../../src/scripts/common/util/modal-util'
import ErrorUtil from '../../../src/scripts/common/util/error-util'
import QuestionUtil from '../../../src/scripts/viewer/util/question-util'
import LTINetworkStates from '../../../src/scripts/viewer/stores/assessment-store/lti-network-states'
import LTIResyncStates from '../../../src/scripts/viewer/stores/assessment-store/lti-resync-states'

jest.mock('../../../src/scripts/common/util/modal-util', () => ({ show: jest.fn() }))

jest.mock('../../../src/scripts/common/util/error-util', () => ({
	show: jest.fn(),
	errorResponse: jest.fn()
}))

jest.mock('../../../src/scripts/viewer/util/question-util')
jest.mock('../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../src/scripts/viewer/util/api-util')
jest.mock('../../../src/scripts/viewer/util/assessment-util.js')
jest.mock('../../../src/scripts/viewer/assessment/assessment-score-reporter')

const originalError = describe('AssessmentStore', () => {
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

	const mockValidStartAttempt = () => {
		APIUtil.startAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				attemptId: 'attemptId',
				assessmentId: 'assessmentId',
				state: {
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
			}
		})
	}

	beforeEach(done => {
		jest.resetAllMocks()

		AssessmentStore.init()
		AssessmentStore.triggerChange = jest.fn()
		QuestionStore.init()
		QuestionStore.triggerChange = jest.fn()
		NavStore.init()

		// Need to make sure all the Obo components are loaded
		Store.getItems(items => {
			done()
		})
	})

	test('init builds state with a specific structure and return it', () => {
		AssessmentStore.init()

		expect(AssessmentStore.getState()).toEqual({
			assessments: {}
		})
	})

	test('init builds with history (populates models and state, shows dialog for unfinished attempt', () => {
		const q1 = OboModel.create({
			id: 'question1',
			type: 'ObojoboDraft.Chunks.Question'
		})
		const q2 = OboModel.create({
			id: 'question2',
			type: 'ObojoboDraft.Chunks.Question'
		})
		const history = [
			{
				assessmentId: 'assessmentId',
				attempts: [
					{
						assessmentId: 'assessmentId',
						startTime: '1/1/2017 00:05:00',
						endTime: '1/1/2017 0:05:20',
						state: {
							questions: [
								{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' },
								{ id: 'question2', type: 'ObojoboDraft.Chunks.Question' }
							]
						},
						result: {
							assessmentScore: 100
						},
						questionScores: [{ id: 'question1' }, { id: 'question2' }],
						isFinished: true
					},
					{
						assessmentId: 'assessmentId',
						startTime: '1/2/2017 00:05:00',
						endTime: '1/2/2017 0:05:20',
						state: {
							questions: [
								{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' },
								{ id: 'question2', type: 'ObojoboDraft.Chunks.Question' }
							]
						},
						result: {
							assessmentScore: 100
						},
						questionScores: [{ id: 'question1' }, { id: 'question2' }],
						isFinished: false
					}
				]
			}
		]

		AssessmentStore.init(history)

		expect(AssessmentStore.getState()).toEqual({
			assessments: {
				assessmentId: {
					attempts: [
						{
							assessmentId: 'assessmentId',
							endTime: '1/1/2017 0:05:20',
							isFinished: true,
							questionScores: [{ id: 'question1' }, { id: 'question2' }],
							result: { assessmentScore: 100 },
							startTime: '1/1/2017 00:05:00',
							state: {
								questions: [
									{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' },
									{ id: 'question2', type: 'ObojoboDraft.Chunks.Question' }
								]
							}
						}
					],
					current: null,
					currentResponses: [],
					highestAssessmentScoreAttempts: undefined,
					highestAttemptScoreAttempts: undefined,
					id: 'assessmentId',
					isShowingAttemptHistory: false,
					lti: undefined,
					ltiResyncState: LTIResyncStates.NO_RESYNC_ATTEMPTED,
					ltiNetworkState: LTINetworkStates.IDLE
				}
			}
		})

		expect(Object.keys(OboModel.models).length).toEqual(2)
		expect(ModalUtil.show).toHaveBeenCalledTimes(1)
	})

	test('resuming an unfinished attempt hides the modal, starts the attempt and triggers a change', () => {
		const originalStartAttempt = AssessmentStore.startAttempt
		const unfinishedAttempt = { a: 1 }

		AssessmentStore.startAttempt = jest.fn()
		ModalUtil.hide = jest.fn()

		AssessmentStore.onResumeAttemptConfirm(unfinishedAttempt)

		expect(ModalUtil.hide).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.startAttempt).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.startAttempt).toHaveBeenCalledWith(unfinishedAttempt)
		expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)

		AssessmentStore.startAttempt = originalStartAttempt
	})

	test('tryStartAttempt shows an error if no attempts are left and triggers a change', () => {
		OboModel.create(getExampleAssessment())

		APIUtil.startAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Attempt limit reached'
			}
		})

		return AssessmentStore.tryStartAttempt('assessmentId').then(res => {
			expect(ErrorUtil.show).toHaveBeenCalledTimes(1)
			expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
		})
	})

	test('tryStartAttempt shows a generic error if an unrecognized error is thrown and triggers a change', () => {
		OboModel.create(getExampleAssessment())

		APIUtil.startAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		return AssessmentStore.tryStartAttempt('assessmentId').then(res => {
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
			expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
		})
	})

	test('tryStartAttempt catches unexpected errors', () => {
		OboModel.create(getExampleAssessment())

		APIUtil.startAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'attempt limit reached'
			}
		})
		ErrorUtil.show.mockImplementationOnce(() => {
			throw new Error('Mock Error')
		})
		const originalError = console.error
		console.error = jest.fn()

		return AssessmentStore.tryStartAttempt('assessmentId').then(res => {
			const errorMock = console.error
			console.error = originalError
			expect(ErrorUtil.show).toHaveBeenCalledTimes(1)
			expect(errorMock).toHaveBeenCalledWith(expect.any(Error))
		})
	})

	test('startAttempt injects question models, creates state, updates the nav and processes the onStartAttempt trigger', () => {
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		NavUtil.rebuildMenu = jest.fn()
		NavUtil.goto = jest.fn()

		const assessmentModel = OboModel.models.rootId.children.at(0)
		const qBank = assessmentModel.children.at(1)

		assessmentModel.processTrigger = jest.fn()

		return AssessmentStore.tryStartAttempt('assessmentId').then(res => {
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
	})

	test('startAttempt builds an attempt if it doesnt exist', () => {
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		AssessmentStore.setState({ assessments: { assessmentId: {} } })

		NavUtil.rebuildMenu = jest.fn()
		NavUtil.goto = jest.fn()

		const assessmentModel = OboModel.models.rootId.children.at(0)
		const qBank = assessmentModel.children.at(1)

		assessmentModel.processTrigger = jest.fn()

		return AssessmentStore.tryStartAttempt('assessmentId').then(res => {
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
	})

	test('tryResendLTIScore catches unexpected errors', () => {
		OboModel.create(getExampleAssessment())

		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({})
		AssessmentStore.setState({ assessments: { assessmentId: {} } })

		APIUtil.resendLTIAssessmentScore.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'attempt limit reached'
			}
		})
		ErrorUtil.errorResponse.mockImplementationOnce(() => {
			throw new Error('Mock Error')
		})
		const originalError = console.error
		console.error = jest.fn()

		return AssessmentStore.tryResendLTIScore('assessmentId').then(res => {
			const errorMock = console.error
			console.error = originalError
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
			expect(errorMock).toHaveBeenCalledWith(expect.any(Error))
		})
	})

	test('tryResendLTIScore returns with error', () => {
		expect.assertions(2)
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		AssessmentStore.setState({
			assessments: {
				assessmentId: {}
			}
		})

		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(
			AssessmentStore.getState().assessments.assessmentId
		)
		APIUtil.resendLTIAssessmentScore.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		return AssessmentStore.tryResendLTIScore('assessmentId').then(res => {
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
			expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
		})
	})

	test('tryResendLTIScore updates and triggersChange', () => {
		expect.assertions(2)
		mockValidStartAttempt()
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

		APIUtil.resendLTIAssessmentScore.mockResolvedValueOnce({
			status: 'success',
			value: {}
		})

		return AssessmentStore.tryResendLTIScore('assessmentId').then(res => {
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

	test('tryEndAttempt catches unexpected errors', () => {
		OboModel.create(getExampleAssessment())

		AssessmentStore.setState({
			assessments: { assessmentId: { current: { attemptId: 'mockAttemptId' } } }
		})

		APIUtil.endAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'attempt limit reached'
			}
		})
		ErrorUtil.errorResponse.mockImplementationOnce(() => {
			throw new Error('Mock Error')
		})
		const originalError = console.error
		console.error = jest.fn()

		return AssessmentStore.tryEndAttempt('assessmentId').then(res => {
			const errorMock = console.error
			console.error = originalError
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
			expect(errorMock).toHaveBeenCalledWith(expect.any(Error))
		})
	})

	test('endAttempt shows an error if the endAttempt request fails and triggers a change', () => {
		expect.assertions(2)
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		APIUtil.endAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		return AssessmentStore.tryStartAttempt('assessmentId')
			.then(() => AssessmentStore.tryEndAttempt('assessmentId'))
			.then(res => {
				expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
				expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
			})
	})

	test('endAttempt hides questions, resets responses, updates state, processes onEndAttempt trigger and triggers a change', () => {
		expect.assertions(4)
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		AssessmentStore.setState({
			assessments: {
				assessmentId: {
					currentResponses: ['question1', 'question2']
				}
			}
		})

		APIUtil.endAttempt = jest.fn()
		APIUtil.endAttempt.mockResolvedValueOnce({
			status: 'mockStatus',
			value: {
				assessmentId: 'assessmentId',
				attempts: [
					{
						assessmentId: 'assessmentId',
						endTime: '1/1/2017 0:05:20',
						isFinished: true,
						questionScores: [{ id: 'question1' }, { id: 'question2' }],
						result: { assessmentScore: 100 },
						startTime: '1/1/2017 00:05:00',
						state: {
							questions: [
								{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' },
								{ id: 'question2', type: 'ObojoboDraft.Chunks.Question' }
							]
						}
					}
				]
			}
		})

		AssessmentUtil.getLastAttemptForModel.mockReturnValueOnce({ attemptNumber: 1 })

		return AssessmentStore.tryStartAttempt('assessmentId')
			.then(() => AssessmentStore.trySetResponse('q1', { responseForR1: 'someValue' }))
			.then(res => AssessmentStore.tryEndAttempt('assessmentId'))
			.then(res => {
				expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(0)
				expect(QuestionUtil.hideQuestion).toHaveBeenCalledTimes(2)
				expect(QuestionUtil.hideQuestion).toHaveBeenCalledWith('q1')
				expect(QuestionUtil.hideQuestion).toHaveBeenCalledWith('q2')
			})
	})

	test('trySetResponse will not update with no Assessment', () => {
		expect.assertions(1)
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		return AssessmentStore.tryStartAttempt('assessmentId')
			.then(() => AssessmentStore.trySetResponse('q1', ['some response']))
			.then(res => {
				expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalled()
			})
	})

	test('trySetResponse will update state', () => {
		expect.assertions(2)
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			currentResponses: ['q2']
		})

		return AssessmentStore.tryStartAttempt('assessmentId')
			.then(() => AssessmentStore.trySetResponse('q1', ['some response']))
			.then(res => {
				expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalled()
				expect(AssessmentStore.triggerChange).toHaveBeenCalled()
			})
	})

	test('setState will update state', () => {
		expect.assertions(1)

		AssessmentStore.setState('mockState')

		expect(AssessmentStore.getState()).toEqual('mockState')
	})

	test('assessment:startAttempt calls tryStartAttempt', () => {
		jest.spyOn(AssessmentStore, 'tryStartAttempt')
		AssessmentStore.tryStartAttempt.mockReturnValueOnce('mock')

		Dispatcher.trigger('assessment:startAttempt', { value: {} })

		expect(AssessmentStore.tryStartAttempt).toHaveBeenCalled()
	})

	test('assessment:endAttempt calls tryEndAttempt', () => {
		jest.spyOn(AssessmentStore, 'tryEndAttempt')
		AssessmentStore.tryEndAttempt.mockReturnValueOnce('mock')

		AssessmentStore.setState({
			assessments: {
				assessmentId: {}
			}
		})
		APIUtil.endAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		Dispatcher.trigger('assessment:endAttempt', { value: { id: 'assessmentId' } })

		expect(AssessmentStore.tryEndAttempt).toHaveBeenCalled()
	})

	test('assessment:resendLTIScore calls tryResendLTIScore', () => {
		jest.spyOn(AssessmentStore, 'tryResendLTIScore')
		AssessmentStore.tryResendLTIScore.mockReturnValueOnce('mock')

		AssessmentStore.setState({
			assessments: {
				assessmentId: {}
			}
		})
		APIUtil.endAttempt.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'Some unexpected error that was not accounted for'
			}
		})

		Dispatcher.trigger('assessment:resendLTIScore', { value: { id: 'assessmentId' } })

		expect(AssessmentStore.tryResendLTIScore).toHaveBeenCalled()
	})

	test('question:setResponse calls trySetResponse', () => {
		jest.spyOn(AssessmentStore, 'trySetResponse')
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
})
