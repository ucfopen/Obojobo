import React from 'react'

import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'
import AssessmentUtil from '../../../src/scripts/viewer/util/assessment-util'
import ModalUtil from '../../../src/scripts/common/util/modal-util'
import OboModel from '../../../src/scripts/common/models/obo-model'
import AssessmentStateMachine from '../../../src/scripts/viewer/stores/assessment-state-machine'
import AssessmentAPI from '../../../src/scripts/viewer/util/assessment-api'
import ErrorUtil from '../../../src/scripts/common/util/error-util'
import PreAttemptImportScoreDialog from 'obojobo-sections-assessment/components/dialogs/pre-attempt-import-score-dialog'
import ResultsDialog from 'obojobo-sections-assessment/components/dialogs/results-dialog'

jest.mock('../../../src/scripts/common/models/obo-model')
jest.mock('../../../src/scripts/viewer/stores/nav-store', () => {
	return {
		getState: () => {
			return {
				visitId: 'mockVisitId'
			}
		}
	}
})
jest.mock('../../../src/scripts/viewer/stores/assessment-state-machine')
jest.mock('../../../src/scripts/viewer/util/question-util')
jest.mock('../../../src/scripts/viewer/util/focus-util')
jest.mock('../../../src/scripts/common/util/error-util')
jest.mock('../../../src/scripts/common/util/modal-util')
jest.mock('../../../src/scripts/viewer/util/assessment-api')
jest.mock('../../../src/scripts/common/util/uuid', () => {
	return () => 'mockUuid'
})

describe('AssessmentStore', () => {
	let AssessmentStoreClass

	beforeEach(() => {
		// Remove any added dispatcher events and create a brand new AssessmentStore instance
		// since the imported AssessmentStore is actually a class instance!
		Dispatcher.off()
		AssessmentStoreClass = AssessmentStore.constructor

		// Mock our assessment OboModel
		OboModel.models = {
			mockAssessmentId: {
				get: prop => {
					switch (prop) {
						case 'type':
							return 'ObojoboDraft.Sections.Assessment'

						case 'id':
							return 'mockAssessmentId'
					}
				},
				getRoot: () => ({ get: () => 'mockDraftId' })
			}
		}
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	test.each`
		event                                           | method
		${'assessment:startAttempt'}                    | ${'startAttempt'}
		${'assessment:importAttempt'}                   | ${'importAttempt'}
		${'assessment:abandonImport'}                   | ${'abandonImport'}
		${'assessment:endAttempt'}                      | ${'endAttempt'}
		${'assessment:forceSendResponses'}              | ${'forceSendResponses'}
		${'assessment:resendLTIScore'}                  | ${'tryResendLTIScore'}
		${'assessment:acknowledgeEndAttemptSuccessful'} | ${'acknowledgeEndAttemptSuccessful'}
		${'assessment:acknowledgeStartAttemptFailed'}   | ${'acknowledgeStartAttemptFailed'}
		${'assessment:acknowledgeEndAttemptFailed'}     | ${'acknowledgeEndAttemptFailed'}
		${'assessment:acknowledgeResumeAttemptFailed'}  | ${'acknowledgeResumeAttemptFailed'}
		${'assessment:acknowledgeImportAttemptFailed'}  | ${'acknowledgeImportAttemptFailed'}
		${'assessment:resumeAttempt'}                   | ${'resumeAttempt'}
		${'assessment:continueAttempt'}                 | ${'continueAttempt'}
	`('Triggering $event calls $method and triggerChange', ({ event, method }) => {
		// Mock triggerChange and the internal method that the dispatcher will call
		const eventSpy = jest
			.spyOn(AssessmentStoreClass.prototype, method)
			.mockImplementation(jest.fn())

		//eslint-disable-next-line no-unused-vars
		const assessmentStore = new AssessmentStoreClass()

		// Fire the event such that the mocked method returns true
		eventSpy.mockReturnValueOnce(true)
		Dispatcher.trigger(event, { value: { id: 'mock-id' } })

		expect(eventSpy).toHaveBeenCalledWith('mock-id')

		eventSpy.mockRestore()
	})

	test('assessment:acknowledgeFetchHistoryFailed calls acknowledgeFetchHistoryFailed', () => {
		//eslint-disable-next-line no-unused-vars
		const assessmentStore = new AssessmentStoreClass()

		const spy = jest
			.spyOn(AssessmentStoreClass.prototype, 'acknowledgeFetchHistoryFailed')
			.mockReturnValue(true)

		expect(spy).not.toHaveBeenCalled()
		Dispatcher.trigger('assessment:acknowledgeFetchHistoryFailed', {
			value: { id: 'mock-id', retry: 'mock-retry' }
		})
		expect(spy).toHaveBeenCalledWith('mock-id', 'mock-retry')

		spy.mockRestore()
	})

	test('nav:targetChanged does nothing if no assessment is found', () => {
		//eslint-disable-next-line no-unused-vars
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init([
			{
				name: 'ObojoboDraft.Sections.Assessment',
				assessmentSummary: [{ assessmentId: 'mockAssessmentId' }],
				importableScore: { assessmentId: 'mockAssessmentId' }
			}
		])
		OboModel.models['someMockId'] = { get: () => null, getParentOfType: () => null }

		const machine = assessmentStore.getState().machines.mockAssessmentId
		machine.getCurrentState = jest.fn().mockReturnValue('inAttempt')
		machine.send = jest.fn()

		Dispatcher.trigger('nav:targetChanged ', {
			value: { to: 'someMockId' }
		})
		expect(machine.getCurrentState).not.toHaveBeenCalled()
		expect(machine.send).not.toHaveBeenCalled()
	})

	test('nav:targetChanged does nothing attempt history is loaded', () => {
		//eslint-disable-next-line no-unused-vars
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init([
			{
				name: 'ObojoboDraft.Sections.Assessment',
				assessmentSummary: [{ assessmentId: 'mockAssessmentId' }],
				importableScore: { assessmentId: 'mockAssessmentId' }
			}
		])
		assessmentStore.state.assessments.mockAssessmentId.attemptHistoryNetworkState = 'loaded'

		const machine = assessmentStore.getState().machines.mockAssessmentId
		machine.getCurrentState = jest.fn().mockReturnValue('inAttempt')
		machine.send = jest.fn()

		Dispatcher.trigger('nav:targetChanged ', {
			value: { to: 'mockAssessmentId' }
		})
		expect(machine.getCurrentState).not.toHaveBeenCalled()
		expect(machine.send).not.toHaveBeenCalled()
	})

	test('nav:targetChanged does nothing if machine is not in the NOT_IN_ATTEMPT state', () => {
		//eslint-disable-next-line no-unused-vars
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init([
			{
				name: 'ObojoboDraft.Sections.Assessment',
				assessmentSummary: [{ assessmentId: 'mockAssessmentId' }],
				importableScore: { assessmentId: 'mockAssessmentId' }
			}
		])

		const machine = assessmentStore.getState().machines.mockAssessmentId
		machine.getCurrentState = jest.fn().mockReturnValue('inAttempt')
		machine.send = jest.fn()

		Dispatcher.trigger('nav:targetChanged ', {
			value: { to: 'mockAssessmentId' }
		})
		expect(machine.getCurrentState).toHaveBeenCalled()
		expect(machine.send).not.toHaveBeenCalled()
	})

	test('nav:targetChanged transitions machine state if not in an attempt to fetch attempt history', () => {
		//eslint-disable-next-line no-unused-vars
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init([
			{
				name: 'ObojoboDraft.Sections.Assessment',
				assessmentSummary: [{ assessmentId: 'mockAssessmentId' }],
				importableScore: { assessmentId: 'mockAssessmentId' }
			}
		])

		const machine = assessmentStore.getState().machines.mockAssessmentId
		machine.getCurrentState = jest.fn().mockReturnValue('notInAttempt')
		machine.send = jest.fn()

		Dispatcher.trigger('nav:targetChanged ', {
			value: { to: 'mockAssessmentId' }
		})
		expect(machine.getCurrentState).toHaveBeenCalled()
		expect(machine.send).toHaveBeenCalledWith('fetchAttemptHistory')
	})

	test('window:closeAttempt calls given method if currently in assessment', () => {
		//eslint-disable-next-line no-unused-vars
		const assessmentStore = new AssessmentStoreClass()

		const mockShouldPrompt = jest.fn()
		const assessUtilSpy = jest.spyOn(AssessmentUtil, 'isInAssessment').mockReturnValueOnce(true)

		Dispatcher.trigger('window:closeAttempt', mockShouldPrompt)

		expect(mockShouldPrompt).toHaveBeenCalled()

		assessUtilSpy.mockRestore()
	})

	test('window:closeAttempt does not call given method if currently not in assessment', () => {
		//eslint-disable-next-line no-unused-vars
		const assessmentStore = new AssessmentStoreClass()

		const mockShouldPrompt = jest.fn()
		const assessUtilSpy = jest.spyOn(AssessmentUtil, 'isInAssessment').mockReturnValueOnce(false)

		Dispatcher.trigger('window:closeAttempt', mockShouldPrompt)

		expect(mockShouldPrompt).not.toHaveBeenCalled()

		assessUtilSpy.mockRestore()
	})

	test('init sets initial state', () => {
		// Create a new assessment store
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		// Ensure state matches expected defaults
		expect(assessmentStore.state).toEqual({
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					current: null,
					attempts: [],
					unfinishedAttempt: null,
					highestAssessmentScoreAttempts: [],
					highestAttemptScoreAttempts: [],
					lti: null,
					ltiNetworkState: 'idle',
					ltiResyncState: 'noResyncAttempted',
					attemptHistoryNetworkState: 'none',
					isScoreImported: false
				}
			},
			machines: {
				mockAssessmentId: expect.any(Object)
			},
			importableScores: {},
			assessmentSummaries: {
				mockAssessmentId: {
					assessmentId: 'mockAssessmentId',
					importUsed: false,
					scores: [],
					unfinishedAttemptId: null
				}
			},
			isResumingAttempt: false
		})

		// Ensure a AssessmentStateMachine was created
		expect(assessmentStore.state.machines.mockAssessmentId).toBeInstanceOf(AssessmentStateMachine)
	})

	test('init sets initial state with passed in extensions', () => {
		// Create a new assessment store and pass in initial values
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init([
			{
				name: 'ObojoboDraft.Sections.Assessment',
				assessmentSummary: [{ assessmentId: 'mockAssessmentId', __assessmentSummary: true }],
				importableScore: { assessmentId: 'mockAssessmentId', __importableScore: true }
			}
		])

		// Ensure state includes the expected data from the passed in init args
		expect(assessmentStore.state).toEqual({
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					current: null,
					attempts: [],
					unfinishedAttempt: null,
					highestAssessmentScoreAttempts: [],
					highestAttemptScoreAttempts: [],
					lti: null,
					ltiNetworkState: 'idle',
					ltiResyncState: 'noResyncAttempted',
					attemptHistoryNetworkState: 'none',
					isScoreImported: false
				}
			},
			machines: {
				mockAssessmentId: expect.any(Object)
			},
			importableScores: {
				mockAssessmentId: {
					assessmentId: 'mockAssessmentId',
					__importableScore: true
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {
					assessmentId: 'mockAssessmentId',
					__assessmentSummary: true
				}
			},
			isResumingAttempt: true
		})

		// Ensure the AssessmentStateMachine was created
		expect(assessmentStore.state.machines.mockAssessmentId).toBeInstanceOf(AssessmentStateMachine)
	})

	test('doMachineAction calls send on an assessment state machine', () => {
		// Mock the AssessmentStateMachine send method
		const mockSend = jest.fn()
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentMachineForModel').mockReturnValueOnce({
			send: mockSend
		})

		// Run the doMachineAction function
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.doMachineAction('mockAssessmentId', 'mock-command')

		// Expect getAssessmentMachineForModel was called correctly
		expect(AssessmentUtil.getAssessmentMachineForModel).toHaveBeenCalledWith(
			assessmentStore.state,
			OboModel.models.mockAssessmentId
		)

		// Expect the AssessmentStateMachine was called with the given command
		expect(mockSend).toHaveBeenCalledWith('mock-command')

		spy.mockRestore()
	})

	test('doMachineAction throws an error if no machine is found', () => {
		// Mock the AssessmentStateMachine send method to not find a state machine
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentMachineForModel').mockReturnValueOnce(null)

		// Run the doMachineAction function
		const assessmentStore = new AssessmentStoreClass()

		// Expect an error to be thrown
		expect(() => assessmentStore.doMachineAction('mockAssessmentId', 'mock-command')).toThrow(
			'No machine exists for this assessment - Unable to run mock-command'
		)

		spy.mockRestore()
	})

	test('tryResendLTIScore calls updateLTIScore, triggers change', async () => {
		// Create a new assessment store
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		// Spy on these methods
		const triggerChangeSpy = jest.spyOn(assessmentStore, 'triggerChange')
		const updateLTIScoreSpy = jest.spyOn(assessmentStore, 'updateLTIScore')
		const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(jest.fn())

		// Mock the API call
		AssessmentAPI.resendLTIAssessmentScore.mockResolvedValueOnce({ value: 'mock-value' })

		// Run tryResendLTIScore
		await assessmentStore.tryResendLTIScore('mockAssessmentId')

		// updateLTIScore should have been called, but not ErrorUtil or console.error
		expect(ErrorUtil.errorResponse).not.toHaveBeenCalled()
		expect(consoleSpy).not.toHaveBeenCalled()
		expect(updateLTIScoreSpy).toHaveBeenCalledWith(
			assessmentStore.state.assessments.mockAssessmentId,
			'mock-value'
		)
		expect(triggerChangeSpy).toHaveBeenCalled()

		triggerChangeSpy.mockRestore()
		updateLTIScoreSpy.mockRestore()
		consoleSpy.mockRestore()
	})

	test('tryResendLTIScore updates ltiNetworkState to "awaitingSendAssessmentScoreResponse" while waiting for api response', async () => {
		// Create a new assessment store
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		//Override the API call, forcing it to reject so any thenable code is not ran
		AssessmentAPI.resendLTIAssessmentScore.mockRejectedValueOnce('mock-rejection')
		const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(jest.fn())

		// Run tryResendLTIScore
		await assessmentStore.tryResendLTIScore('mockAssessmentId')

		// state should have set network state to awaitingSendAssessmentScoreResponse
		expect(assessmentStore.state.assessments.mockAssessmentId.ltiNetworkState).toBe(
			'awaitingSendAssessmentScoreResponse'
		)

		consoleSpy.mockRestore()
	})

	test('tryResendLTIScore calls updateLTIScore, triggers change', async () => {
		// Create a new assessment store
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		// Spy on these methods
		const triggerChangeSpy = jest.spyOn(assessmentStore, 'triggerChange')
		const updateLTIScoreSpy = jest.spyOn(assessmentStore, 'updateLTIScore')
		const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(jest.fn())

		// Mock the API call
		AssessmentAPI.resendLTIAssessmentScore.mockResolvedValueOnce({ value: 'mock-value' })

		// Run tryResendLTIScore
		await assessmentStore.tryResendLTIScore('mockAssessmentId')

		// updateLTIScore should have been called, but not ErrorUtil or console.error
		expect(ErrorUtil.errorResponse).not.toHaveBeenCalled()
		expect(consoleSpy).not.toHaveBeenCalled()
		expect(updateLTIScoreSpy).toHaveBeenCalledWith(
			assessmentStore.state.assessments.mockAssessmentId,
			'mock-value'
		)
		expect(triggerChangeSpy).toHaveBeenCalled()

		// state should have set network state to idle
		expect(assessmentStore.state.assessments.mockAssessmentId.ltiNetworkState).toBe('idle')

		triggerChangeSpy.mockRestore()
		updateLTIScoreSpy.mockRestore()
		consoleSpy.mockRestore()
	})

	test('tryResendLTIScore does not updateLTIScore if API returns an error', async () => {
		// Create a new assessment store
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		// Spy on these methods
		const triggerChangeSpy = jest.spyOn(assessmentStore, 'triggerChange')
		const updateLTIScoreSpy = jest.spyOn(assessmentStore, 'updateLTIScore')
		const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(jest.fn())

		// Mock the API call
		AssessmentAPI.resendLTIAssessmentScore.mockResolvedValueOnce({ status: 'error' })

		// Run tryResendLTIScore
		await assessmentStore.tryResendLTIScore('mockAssessmentId')

		// updateLTIScore should not have been called but ErrorUtil should
		expect(ErrorUtil.errorResponse).toHaveBeenCalledWith({ status: 'error' })
		expect(consoleSpy).not.toHaveBeenCalled()
		expect(updateLTIScoreSpy).not.toHaveBeenCalled()
		expect(triggerChangeSpy).toHaveBeenCalled()

		// state should have set network state to idle
		expect(assessmentStore.state.assessments.mockAssessmentId.ltiNetworkState).toBe('idle')

		triggerChangeSpy.mockRestore()
		updateLTIScoreSpy.mockRestore()
		consoleSpy.mockRestore()
	})

	test('tryResendLTIScore logs error only if API fails', async () => {
		// Create a new assessment store
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		// Spy on these methods
		const triggerChangeSpy = jest.spyOn(assessmentStore, 'triggerChange')
		const updateLTIScoreSpy = jest.spyOn(assessmentStore, 'updateLTIScore')
		const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(jest.fn())

		// Mock the API call
		AssessmentAPI.resendLTIAssessmentScore.mockRejectedValueOnce('mock-rejection')

		// Run tryResendLTIScore
		await assessmentStore.tryResendLTIScore('mockAssessmentId')

		// Only console.error should have been called
		expect(ErrorUtil.errorResponse).not.toHaveBeenCalled()
		expect(consoleSpy).toHaveBeenCalledWith('mock-rejection')
		expect(updateLTIScoreSpy).not.toHaveBeenCalled()
		expect(triggerChangeSpy).toHaveBeenCalled()

		// state should have set network state to awaitingSendAssessmentScoreResponse
		expect(assessmentStore.state.assessments.mockAssessmentId.ltiNetworkState).toBe(
			'awaitingSendAssessmentScoreResponse'
		)

		triggerChangeSpy.mockRestore()
		updateLTIScoreSpy.mockRestore()
		consoleSpy.mockRestore()
	})

	test('updateLTIScore updates state correctly (and resync fails)', async () => {
		// Create a new assessment store
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		// Spy on these methods
		const triggerChangeSpy = jest.spyOn(assessmentStore, 'triggerChange')
		const assessUtilSpy = jest
			.spyOn(AssessmentUtil, 'isLTIScoreNeedingToBeResynced')
			.mockReturnValueOnce(true)

		// Run updateLTIScore
		await assessmentStore.updateLTIScore(assessmentStore.state.assessments.mockAssessmentId, {
			__lti: 'mock-lti-data'
		})

		// Expect isLTIScoreNeedingToBeResynced to have been called correctly and triggerChange called
		expect(assessUtilSpy).toHaveBeenCalledWith(
			assessmentStore.state,
			OboModel.models.mockAssessmentId
		)
		expect(triggerChangeSpy).toHaveBeenCalled()

		// state should have set ltiResyncState
		expect(assessmentStore.state.assessments.mockAssessmentId.ltiResyncState).toBe('resyncFailed')

		triggerChangeSpy.mockRestore()
		assessUtilSpy.mockRestore()
	})

	test('updateLTIScore updates state correctly (and resync succeeds)', async () => {
		// Create a new assessment store
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		// Spy on these methods
		const triggerChangeSpy = jest.spyOn(assessmentStore, 'triggerChange')
		const assessUtilSpy = jest
			.spyOn(AssessmentUtil, 'isLTIScoreNeedingToBeResynced')
			.mockReturnValueOnce(false)

		// Run updateLTIScore
		await assessmentStore.updateLTIScore(assessmentStore.state.assessments.mockAssessmentId, {
			__lti: 'mock-lti-data'
		})

		// Expect isLTIScoreNeedingToBeResynced to have been called correctly and triggerChange called
		expect(assessUtilSpy).toHaveBeenCalledWith(
			assessmentStore.state,
			OboModel.models.mockAssessmentId
		)
		expect(triggerChangeSpy).toHaveBeenCalled()

		// state should have set ltiResyncState
		expect(assessmentStore.state.assessments.mockAssessmentId.ltiResyncState).toBe(
			'resyncSucceeded'
		)

		triggerChangeSpy.mockRestore()
		assessUtilSpy.mockRestore()
	})

	test('displayScoreImportNotice fires expected event', () => {
		const spy = jest.spyOn(Dispatcher, 'trigger')

		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		assessmentStore.displayScoreImportNotice()

		expect(spy.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('displayImportAlreadyUsed fires expected event', () => {
		const spy = jest.spyOn(Dispatcher, 'trigger')

		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		assessmentStore.displayImportAlreadyUsed()

		expect(spy.mock.calls[0]).toMatchSnapshot()

		spy.mockRestore()
	})

	test('displayPreAttemptImportScoreNotice calls ModalUtil.show', done => {
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		assessmentStore.displayPreAttemptImportScoreNotice('mock-highest-score').then(result => {
			expect(result).toBe('mock-choice')
			done()
		})

		expect(ModalUtil.show).toHaveBeenCalledWith(
			<PreAttemptImportScoreDialog
				highestScore={'mock-highest-score'}
				onChoice={expect.any(Function)}
			/>
		)

		const Dialog = ModalUtil.show.mock.calls[0][0]

		Dialog.props.onChoice('mock-choice')
	})

	test.each`
		method                               | action
		${'startAttempt'}                    | ${'startAttempt'}
		${'importAttempt'}                   | ${'importAttempt'}
		${'abandonImport'}                   | ${'abandonImport'}
		${'endAttempt'}                      | ${'endAttempt'}
		${'forceSendResponses'}              | ${'sendResponses'}
		${'acknowledgeEndAttemptSuccessful'} | ${'acknowledge'}
		${'acknowledgeResumeAttemptFailed'}  | ${'acknowledge'}
		${'acknowledgeImportAttemptFailed'}  | ${'acknowledge'}
		${'resumeAttempt'}                   | ${'resumeAttempt'}
		${'continueAttempt'}                 | ${'continueAttempt'}
	`('Calling $method calls doMachineAction(id, $action)', ({ method, action }) => {
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		const spy = jest.spyOn(assessmentStore, 'doMachineAction').mockImplementation(jest.fn())

		assessmentStore[method]('mock-id')

		expect(spy).toHaveBeenCalledWith('mock-id', action)

		spy.mockRestore()
	})

	test('acknowledgeStartAttemptFailed updates state and runs a machine action', () => {
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		const spy = jest.spyOn(assessmentStore, 'doMachineAction').mockImplementation(jest.fn())

		assessmentStore.state.assessments.mockAssessmentId.current = 'not-null'
		assessmentStore.acknowledgeStartAttemptFailed('mockAssessmentId')

		expect(spy).toHaveBeenCalledWith('mockAssessmentId', 'acknowledge')
		expect(assessmentStore.state.assessments.mockAssessmentId.current).toBe(null)

		spy.mockRestore()
	})

	test('acknowledgeEndAttemptFailed updates state and runs a machine action', () => {
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		const spy = jest.spyOn(assessmentStore, 'doMachineAction').mockImplementation(jest.fn())

		assessmentStore.state.assessments.mockAssessmentId.current = { error: 'mock-error' }
		assessmentStore.acknowledgeEndAttemptFailed('mockAssessmentId')

		expect(spy).toHaveBeenCalledWith('mockAssessmentId', 'acknowledge')
		expect(assessmentStore.state.assessments.mockAssessmentId.current.error).not.toBeDefined()

		spy.mockRestore()
	})

	test('acknowledgeFetchHistoryFailed runs fetchAttemptHistory action if retry=true', () => {
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		const spy = jest.spyOn(assessmentStore, 'doMachineAction').mockImplementation(jest.fn())

		assessmentStore.acknowledgeFetchHistoryFailed('mockAssessmentId', true)

		expect(spy).toHaveBeenCalledWith('mockAssessmentId', 'fetchAttemptHistory')

		spy.mockRestore()
	})

	test('acknowledgeFetchHistoryFailed runs acknowledge action if retry=false', () => {
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		const spy = jest.spyOn(assessmentStore, 'doMachineAction').mockImplementation(jest.fn())

		assessmentStore.acknowledgeFetchHistoryFailed('mockAssessmentId', false)

		expect(spy).toHaveBeenCalledWith('mockAssessmentId', 'acknowledge')

		spy.mockRestore()
	})

	test('acknowledgeFetchHistoryFailed runs acknowledge action if retry is not set', () => {
		const assessmentStore = new AssessmentStoreClass()
		assessmentStore.init()

		const spy = jest.spyOn(assessmentStore, 'doMachineAction').mockImplementation(jest.fn())

		assessmentStore.acknowledgeFetchHistoryFailed('mockAssessmentId')

		expect(spy).toHaveBeenCalledWith('mockAssessmentId', 'acknowledge')

		spy.mockRestore()
	})

	test('getState returns state', () => {
		const mockState = {}
		AssessmentStore.state = mockState
		expect(AssessmentStore.getState()).toBe(mockState)
	})

	test('setStates sets the state', () => {
		const mockState = {}
		AssessmentStore.setState(mockState)
		expect(AssessmentStore.state).toBe(mockState)
	})
})
