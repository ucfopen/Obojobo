/* eslint-disable no-console */

import AssessmentStateMachine from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-state-machine'
import AssessmentNetworkStates from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store/assessment-network-states'
import AssessmentStateActions from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store/assessment-state-actions'
import OboModel from '../../../src/scripts/common/models/obo-model'
import AssessmentStateHelpers from '../../../src/scripts/viewer/stores/assessment-state-helpers'
import AssessmentAPI from 'obojobo-document-engine/src/scripts/viewer/util/assessment-api'
import NavUtil from 'obojobo-document-engine/src/scripts/viewer/util/nav-util'
import mockConsole from 'jest-mock-console'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/assessment-api')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')
jest.mock('../../../src/scripts/viewer/stores/question-store')
jest.mock('../../../src/scripts/common/flux/dispatcher')

const {
	PROMPTING_FOR_RESUME,
	STARTING_ATTEMPT,
	RESUMING_ATTEMPT,
	IN_ATTEMPT,
	START_ATTEMPT_FAILED,
	RESUME_ATTEMPT_FAILED,
	SENDING_RESPONSES,
	SEND_RESPONSES_SUCCESSFUL,
	SEND_RESPONSES_FAILED,
	NOT_IN_ATTEMPT,
	END_ATTEMPT_FAILED,
	END_ATTEMPT_SUCCESSFUL,
	PROMPTING_FOR_IMPORT,
	IMPORTING_ATTEMPT,
	IMPORT_ATTEMPT_FAILED,
	FETCHING_ATTEMPT_HISTORY,
	FETCH_HISTORY_FAILED
} = AssessmentNetworkStates

const {
	FETCH_ATTEMPT_HISTORY,
	START_ATTEMPT,
	IMPORT_ATTEMPT,
	ABANDON_IMPORT,
	RESUME_ATTEMPT,
	SEND_RESPONSES,
	ACKNOWLEDGE,
	END_ATTEMPT,
	CONTINUE_ATTEMPT
} = AssessmentStateActions

/*
Pathways to test:

[x] INIT -> cond=isAttemptNeedingToBeResumed -> PROMPTING_FOR_RESUME
[x] INIT -> cond=isNotResuming -> NOT_IN_ATTEMPT
[x] NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) -> cond=true -> FETCHING_ATTEMPT_HISTORY -> onDone -> NOT_IN_ATTEMPT
[x] NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) -> cond=true -> FETCHING_ATTEMPT_HISTORY -> onError -> FETCH_HISTORY_FAILED
[x] NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) -> cond=false -> NOT_IN_ATTEMPT
[x] NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isNoImportAvailable -> STARTING_ATTEMPT -> onDone -> IN_ATTEMPT
[x] NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isNoImportAvailable -> STARTING_ATTEMPT -> onError -> START_ATTEMPT_FAILED
[x] NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isImportAvailable -> PROMPTING_FOR_IMPORT
[x] FETCH_HISTORY_FAILED(ACKNOWLEDGE) -> NOT_IN_ATTEMPT
[x] PROMPTING_FOR_IMPORT(ABANDON_IMPORT) -> STARTING_ATTEMPT
[x] PROMPTING_FOR_IMPORT(IMPORT_ATTEMPT) -> IMPORTING_ATTEMPT -> onDone -> END_ATTEMPT_SUCCESSFUL
[x] PROMPTING_FOR_IMPORT(IMPORT_ATTEMPT) -> IMPORTING_ATTEMPT -> onError -> IMPORT_ATTEMPT_FAILED
[x] PROMPTING_FOR_RESUME(RESUME_ATTEMPT) -> RESUMING_ATTEMPT -> onDone -> IN_ATTEMPT
[x] PROMPTING_FOR_RESUME(RESUME_ATTEMPT) -> RESUMING_ATTEMPT -> onError -> RESUME_ATTEMPT_FAILED
[x] IN_ATTEMPT(SEND_RESPONSES) -> SENDING_RESPONSES -> onDone -> SEND_RESPONSES_SUCCESSFUL
[x] IN_ATTEMPT(SEND_RESPONSES) -> SENDING_RESPONSES -> onError -> SEND_RESPONSES_FAILED
[x] START_ATTEMPT_FAILED(ACKNOWLEDGE) -> NOT_IN_ATTEMPT
[x] IMPORT_ATTEMPT_FAILED(ACKNOWLEDGE) -> NOT_IN_ATTEMPT
[x] RESUME_ATTEMPT_FAILED(ACKNOWLEDGE) -> PROMPTING_FOR_RESUME
[x] SEND_RESPONSES_SUCCESSFUL(END_ATTEMPT) -> ENDING_ATTEMPT -> onDone -> END_ATTEMPT_SUCCESSFUL
[x] SEND_RESPONSES_SUCCESSFUL(END_ATTEMPT) -> ENDING_ATTEMPT -> onError -> END_ATTEMPT_FAILED
[x] SEND_RESPONSES_SUCCESSFUL(CONTINUE_ATTEMPT) -> IN_ATTEMPT
[x] SEND_RESPONSES_FAILED(CONTINUE_ATTEMPT) -> IN_ATTEMPT
[x] END_ATTEMPT_SUCCESSFUL(ACKNOWLEDGE) -> NOT_IN_ATTEMPT
[x] END_ATTEMPT_FAILED(ACKNOWLEDGE) -> IN_ATTEMPT
*/

describe('AssessmentStateMachine', () => {
	let restoreConsole

	beforeEach(() => {
		jest.resetAllMocks()

		restoreConsole = mockConsole('error')

		const reset = jest.fn()
		const add = jest.fn()

		OboModel.models.mockAssessmentId = {
			get: key => {
				switch (key) {
					case 'id':
						return 'mockAssessmentId'

					case 'type':
						return 'ObojoboDraft.Sections.Assessment'
				}
			},
			getParentOfType: () => OboModel.models.mockAssessmentId,
			getRoot: () => ({
				get: () => 'mockDraftId'
			}),
			children: {
				at: () => ({
					children: {
						reset,
						add
					}
				})
			},
			processTrigger: jest.fn()
		}
	})

	afterEach(() => {
		restoreConsole()
	})

	test('State machine does not start if already started', () => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {},
			assessmentSummaries: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		const spy = jest.spyOn(m.service, 'start')

		expect(spy).not.toHaveBeenCalled()
		m.start(jest.fn())
		expect(spy).toHaveBeenCalledTimes(1)
		m.start(jest.fn())
		expect(spy).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('Stop calls service.stop', () => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {},
			assessmentSummaries: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		const spy = jest.spyOn(m.service, 'stop')

		expect(spy).not.toHaveBeenCalled()
		m.stop(jest.fn())
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('State machine defaults to NOT_IN_ATTEMPT when there is no attempt data', done => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {},
			assessmentSummaries: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
			done()
		})
	})

	test('State machine defaults to NOT_IN_ATTEMPT when there is no attempt to resume', done => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {
				mockAssessmentId: {}
			},
			assessmentSummaries: {
				mockAssessmentId: {
					unfinishedAttemptId: null
				}
			}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
			done()
		})
	})

	test('State machine defaults to PROMPTING_FOR_RESUME when there is an attempt to resume', done => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {
					unfinishedAttemptId: 'mockAttemptId'
				}
			}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(PROMPTING_FOR_RESUME)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(PROMPTING_FOR_RESUME)
			done()
		})
	})

	test('NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) -> cond=true -> FETCHING_ATTEMPT_HISTORY -> onDone -> NOT_IN_ATTEMPT', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.getAttemptHistory.mockResolvedValue({
			status: 'ok',
			value: [
				{
					assessmentId: 'mockAssessmentId',
					ltiState: 'mockLtiState',
					attempts: [
						{
							id: 'attempt1',
							isImported: false,
							isFinished: true,
							assessmentScore: 90,
							result: {
								attemptScore: 100,
								questionScores: []
							},
							questionResponses: [],
							state: {}
						},
						{
							id: 'attempt2',
							isImported: false,
							isFinished: false,
							assessmentScore: 100,
							result: {
								attemptScore: 90,
								questionScores: []
							},
							questionResponses: [],
							state: {}
						}
					]
				}
			]
		})
		AssessmentAPI.reviewAttempt.mockResolvedValue({
			status: 'ok',
			value: []
		})

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(FETCH_ATTEMPT_HISTORY)
		expect(m.getCurrentState()).toBe(FETCHING_ATTEMPT_HISTORY)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
			expect(m.machine.context.assessmentStoreState).toEqual({
				assessments: {
					mockAssessmentId: {
						id: 'mockAssessmentId',
						attemptHistoryNetworkState: 'loaded',
						attempts: expect.any(Array),
						current: null,
						highestAssessmentScoreAttempts: expect.any(Array),
						highestAttemptScoreAttempts: expect.any(Array),
						isScoreImported: false,
						lti: 'mockLtiState',
						ltiNetworkState: 'idle',
						ltiResyncState: 'noResyncAttempted',
						unfinishedAttempt: expect.any(Object)
					}
				},
				assessmentSummaries: {
					mockAssessmentId: {
						assessmentId: 'mockAssessmentId',
						importUsed: false,
						scores: [90],
						unfinishedAttemptId: 'attempt2'
					}
				},
				importableScores: {}
			})

			done()
		})
	})

	test('NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) -> cond=true -> FETCHING_ATTEMPT_HISTORY -> onError -> FETCH_ATTEMPT_HISTORY_FAILED', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.getAttemptHistory.mockResolvedValue({
			status: 'error',
			value: {
				message: 'mockErrorMessage'
			}
		})

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(FETCH_ATTEMPT_HISTORY)
		expect(m.getCurrentState()).toBe(FETCHING_ATTEMPT_HISTORY)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(FETCH_HISTORY_FAILED)
			expect(m.machine.context.assessmentStoreState).toEqual({
				assessments: {
					mockAssessmentId: {
						id: 'mockAssessmentId',
						attemptHistoryNetworkState: 'none'
					}
				},
				assessmentSummaries: {
					mockAssessmentId: {}
				},
				importableScores: {}
			})

			done()
		})
	})

	test('NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) does nothing if attempt history is loaded', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'loaded'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(FETCH_ATTEMPT_HISTORY)
		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
			done()
		})
	})

	test('NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isNoImportAvailable -> STARTING_ATTEMPT -> onDone -> IN_ATTEMPT, updates question bank, nav util, runs start attempt trigger', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				endTime: null,
				questions: [
					{
						id: 'question1',
						type: 'ObojoboDraft.Chunks.Question',
						children: [
							{
								id: 'mcAssessment',
								type: 'ObojoboDraft.Chunks.MCAssessment',
								children: []
							}
						]
					}
				],
				result: null,
				startTime: 'mock-start-time',
				state: {
					chosen: [{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' }]
				}
			}
		})

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)
		expect(m.getCurrentState()).toBe(STARTING_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(IN_ATTEMPT)
			expect(OboModel.models.mockAssessmentId.processTrigger).toHaveBeenCalledWith('onStartAttempt')
			expect(OboModel.models.mockAssessmentId.children.at(1).children.reset).toHaveBeenCalled()
			expect(OboModel.models.mockAssessmentId.children.at(1).children.add).toHaveBeenCalledTimes(1)
			expect(NavUtil.setContext).toHaveBeenCalledWith('assessment:mockAssessmentId:mockAttemptId')
			expect(NavUtil.rebuildMenu).toHaveBeenCalled()
			expect(NavUtil.goto).toHaveBeenCalledWith('mockAssessmentId')
			expect(console.error).not.toHaveBeenCalled()
			expect(m.machine.context.assessmentStoreState).toEqual({
				assessments: {
					mockAssessmentId: {
						id: 'mockAssessmentId',
						attemptHistoryNetworkState: 'none',
						current: {
							assessmentId: 'mockAssessmentId',
							attemptId: 'mockAttemptId',
							endTime: null,
							questions: expect.any(Array),
							result: null,
							startTime: 'mock-start-time',
							state: expect.any(Object)
						}
					}
				},
				assessmentSummaries: {
					mockAssessmentId: {}
				},
				importableScores: {}
			})

			done()
		})
	})

	test('NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isNoImportAvailable -> STARTING_ATTEMPT -> onError -> START_ATTEMPT_FAILED', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'error',
			value: {
				message: 'mockErrorMessage'
			}
		})

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)
		expect(m.getCurrentState()).toBe(STARTING_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(START_ATTEMPT_FAILED)
			expect(OboModel.models.mockAssessmentId.processTrigger).not.toHaveBeenCalled()
			expect(OboModel.models.mockAssessmentId.children.at(1).children.reset).not.toHaveBeenCalled()
			expect(OboModel.models.mockAssessmentId.children.at(1).children.add).not.toHaveBeenCalled()
			expect(NavUtil.setContext).not.toHaveBeenCalled()
			expect(NavUtil.rebuildMenu).not.toHaveBeenCalled()
			expect(NavUtil.goto).not.toHaveBeenCalled()
			expect(console.error).toHaveBeenCalled()
			expect(m.machine.context.assessmentStoreState).toEqual({
				assessments: {
					mockAssessmentId: {
						id: 'mockAssessmentId',
						attemptHistoryNetworkState: 'none',
						current: {
							error: 'mockErrorMessage'
						}
					}
				},
				assessmentSummaries: {
					mockAssessmentId: {}
				},
				importableScores: {}
			})

			done()
		})
	})

	test('NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isImportAvailable -> PROMPTING_FOR_IMPORT', () => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {
				mockAssessmentId: 42
			}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)
		expect(m.getCurrentState()).toBe(PROMPTING_FOR_IMPORT)
	})

	test('FETCH_HISTORY_FAILED(ACKNOWLEDGE) -> NOT_IN_ATTEMPT', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.getAttemptHistory.mockResolvedValue({
			status: 'error',
			value: {
				message: 'mockErrorMessage'
			}
		})

		m.send(FETCH_ATTEMPT_HISTORY)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(FETCH_HISTORY_FAILED)
			m.send(ACKNOWLEDGE)

			setTimeout(() => {
				expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)

				done()
			})
		})
	})

	test('PROMPTING_FOR_IMPORT(ABANDON_IMPORT) -> STARTING_ATTEMPT', () => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {
				mockAssessmentId: 42
			}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)
		expect(m.getCurrentState()).toBe(PROMPTING_FOR_IMPORT)
		m.send(ABANDON_IMPORT)
		expect(m.getCurrentState()).toBe(STARTING_ATTEMPT)
	})

	test('PROMPTING_FOR_IMPORT(IMPORT_ATTEMPT) -> IMPORTING_ATTEMPT -> onDone -> END_ATTEMPT_SUCCESSFUL', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {
				mockAssessmentId: 42
			}
		}

		AssessmentAPI.importScore.mockResolvedValue({
			status: 'ok',
			value: {}
		})
		AssessmentAPI.getAttemptHistory.mockResolvedValue({
			status: 'ok',
			value: []
		})

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)
		expect(m.getCurrentState()).toBe(PROMPTING_FOR_IMPORT)
		m.send(IMPORT_ATTEMPT)
		expect(m.getCurrentState()).toBe(IMPORTING_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(END_ATTEMPT_SUCCESSFUL)

			done()
		})
	})

	test('PROMPTING_FOR_IMPORT(IMPORT_ATTEMPT) -> IMPORTING_ATTEMPT -> onError -> END_ATTEMPT_SUCCESSFUL', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {
				mockAssessmentId: 42
			}
		}

		AssessmentAPI.importScore.mockResolvedValue({
			status: 'error',
			value: {
				message: 'mockErrorMessage'
			}
		})

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)
		expect(m.getCurrentState()).toBe(PROMPTING_FOR_IMPORT)
		m.send(IMPORT_ATTEMPT)
		expect(m.getCurrentState()).toBe(IMPORTING_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(IMPORT_ATTEMPT_FAILED)
			expect(console.error).toHaveBeenCalled()

			done()
		})
	})

	test('PROMPTING_FOR_RESUME(RESUME_ATTEMPT) -> RESUMING_ATTEMPT -> onDone -> IN_ATTEMPT', done => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {
					unfinishedAttemptId: 'mockAttemptId'
				}
			}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		AssessmentAPI.resumeAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				endTime: null,
				questions: [
					{
						id: 'question1',
						type: 'ObojoboDraft.Chunks.Question',
						children: [
							{
								id: 'mcAssessment',
								type: 'ObojoboDraft.Chunks.MCAssessment',
								children: []
							}
						]
					}
				],
				result: null,
				startTime: 'mock-start-time',
				state: {
					chosen: [{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' }]
				}
			}
		})
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(PROMPTING_FOR_RESUME)
		m.send(RESUME_ATTEMPT)
		expect(m.getCurrentState()).toBe(RESUMING_ATTEMPT)

		setTimeout(() => {
			expect(console.error).not.toHaveBeenCalled()
			expect(m.getCurrentState()).toBe(IN_ATTEMPT)

			done()
		})
	})

	test('PROMPTING_FOR_RESUME(RESUME_ATTEMPT) -> RESUMING_ATTEMPT -> onError -> RESUME_ATTEMPT_FAILED', done => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {
					unfinishedAttemptId: 'mockAttemptId'
				}
			}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		AssessmentAPI.resumeAttempt.mockResolvedValue({
			status: 'error',
			value: {
				message: 'mockErrorMessage'
			}
		})
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(PROMPTING_FOR_RESUME)
		m.send(RESUME_ATTEMPT)
		expect(m.getCurrentState()).toBe(RESUMING_ATTEMPT)

		setTimeout(() => {
			expect(console.error).toHaveBeenCalled()
			expect(m.getCurrentState()).toBe(RESUME_ATTEMPT_FAILED)

			done()
		})
	})

	test('IN_ATTEMPT(SEND_RESPONSES) -> SENDING_RESPONSES -> onDone -> SEND_RESPONSES_SUCCESSFUL', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				endTime: null,
				questions: [
					{
						id: 'question1',
						type: 'ObojoboDraft.Chunks.Question',
						children: [
							{
								id: 'mcAssessment',
								type: 'ObojoboDraft.Chunks.MCAssessment',
								children: []
							}
						]
					}
				],
				result: null,
				startTime: 'mock-start-time',
				state: {
					chosen: [{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' }]
				}
			}
		})
		const spy = jest.spyOn(AssessmentStateHelpers, 'sendResponses').mockResolvedValue(true)

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)
		expect(m.getCurrentState()).toBe(STARTING_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(IN_ATTEMPT)
			m.send(SEND_RESPONSES)
			expect(m.getCurrentState()).toBe(SENDING_RESPONSES)

			setTimeout(() => {
				expect(m.getCurrentState()).toBe(SEND_RESPONSES_SUCCESSFUL)

				spy.mockRestore()
				done()
			})
		})
	})

	test('IN_ATTEMPT(SEND_RESPONSES) -> SENDING_RESPONSES -> onError -> SEND_RESPONSES_FAILED', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				endTime: null,
				questions: [
					{
						id: 'question1',
						type: 'ObojoboDraft.Chunks.Question',
						children: [
							{
								id: 'mcAssessment',
								type: 'ObojoboDraft.Chunks.MCAssessment',
								children: []
							}
						]
					}
				],
				result: null,
				startTime: 'mock-start-time',
				state: {
					chosen: [{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' }]
				}
			}
		})
		const spy = jest.spyOn(AssessmentStateHelpers, 'sendResponses').mockRejectedValue(false)

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)
		expect(m.getCurrentState()).toBe(STARTING_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(IN_ATTEMPT)
			m.send(SEND_RESPONSES)
			expect(m.getCurrentState()).toBe(SENDING_RESPONSES)

			setTimeout(() => {
				expect(m.getCurrentState()).toBe(SEND_RESPONSES_FAILED)

				spy.mockRestore()
				done()
			})
		})
	})

	test('START_ATTEMPT_FAILED(ACKNOWLEDGE) -> NOT_IN_ATTEMPT', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'error',
			value: {
				message: 'mockErrorMessage'
			}
		})

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)
		expect(m.getCurrentState()).toBe(STARTING_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(START_ATTEMPT_FAILED)
			m.send(ACKNOWLEDGE)

			setTimeout(() => {
				expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
				done()
			})
		})
	})

	test('IMPORT_ATTEMPT_FAILED(ACKNOWLEDGE) -> NOT_IN_ATTEMPT', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {
				mockAssessmentId: 42
			}
		}

		AssessmentAPI.importScore.mockResolvedValue({
			status: 'error',
			value: {
				message: 'mockErrorMessage'
			}
		})

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		m.send(START_ATTEMPT)
		m.send(IMPORT_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(IMPORT_ATTEMPT_FAILED)

			setTimeout(() => {
				m.send(ACKNOWLEDGE)
				expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)

				done()
			})
		})
	})

	test('RESUME_ATTEMPT_FAILED(ACKNOWLEDGE) -> PROMPTING_FOR_RESUME', done => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {
					unfinishedAttemptId: 'mockAttemptId'
				}
			}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		AssessmentAPI.resumeAttempt.mockResolvedValue({
			status: 'error',
			value: {
				message: 'mockErrorMessage'
			}
		})
		m.start(jest.fn())

		m.send(RESUME_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(RESUME_ATTEMPT_FAILED)
			m.send(ACKNOWLEDGE)
			expect(m.getCurrentState()).toBe(PROMPTING_FOR_RESUME)

			done()
		})
	})

	test('SEND_RESPONSES_SUCCESSFUL(END_ATTEMPT) -> ENDING_ATTEMPT -> onDone -> END_ATTEMPT_SUCCESSFUL', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				endTime: null,
				questions: [
					{
						id: 'question1',
						type: 'ObojoboDraft.Chunks.Question',
						children: [
							{
								id: 'mcAssessment',
								type: 'ObojoboDraft.Chunks.MCAssessment',
								children: []
							}
						]
					}
				],
				result: null,
				startTime: 'mock-start-time',
				state: {
					chosen: [{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' }]
				}
			}
		})
		AssessmentAPI.endAttempt.mockResolvedValue({
			status: 'ok'
		})
		AssessmentAPI.getAttemptHistory.mockResolvedValue({
			status: 'ok',
			value: [
				{
					assessmentId: 'mockAssessmentId',
					ltiState: 'mockLtiState',
					attempts: [
						{
							id: 'attempt1',
							isImported: false,
							isFinished: true,
							assessmentScore: 90,
							result: {
								attemptScore: 100,
								questionScores: []
							},
							questionResponses: [],
							state: {}
						},
						{
							id: 'attempt2',
							isImported: false,
							isFinished: false,
							assessmentScore: 100,
							result: {
								attemptScore: 90,
								questionScores: []
							},
							questionResponses: [],
							state: {}
						}
					]
				}
			]
		})
		AssessmentAPI.reviewAttempt.mockResolvedValue({
			status: 'ok',
			value: []
		})
		const spy = jest.spyOn(AssessmentStateHelpers, 'sendResponses').mockResolvedValue(true)

		m.send(START_ATTEMPT)

		setTimeout(() => {
			m.send(SEND_RESPONSES)

			setTimeout(() => {
				expect(m.getCurrentState()).toBe(SEND_RESPONSES_SUCCESSFUL)

				m.send(END_ATTEMPT)

				setTimeout(() => {
					expect(m.getCurrentState()).toBe(END_ATTEMPT_SUCCESSFUL)
					expect(OboModel.models.mockAssessmentId.processTrigger).toHaveBeenCalledWith(
						'onEndAttempt'
					)
					expect(Dispatcher.trigger).toHaveBeenCalledWith(
						'assessment:attemptEnded',
						'mockAssessmentId'
					)
					expect(console.error).not.toHaveBeenCalled()

					spy.mockRestore()
					done()
				})
			})
		})
	})

	test('SEND_RESPONSES_SUCCESSFUL(END_ATTEMPT) -> ENDING_ATTEMPT -> onError -> END_ATTEMPT_FAILED', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				endTime: null,
				questions: [
					{
						id: 'question1',
						type: 'ObojoboDraft.Chunks.Question',
						children: [
							{
								id: 'mcAssessment',
								type: 'ObojoboDraft.Chunks.MCAssessment',
								children: []
							}
						]
					}
				],
				result: null,
				startTime: 'mock-start-time',
				state: {
					chosen: [{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' }]
				}
			}
		})
		AssessmentAPI.endAttempt.mockResolvedValue({
			status: 'error'
		})
		const spy = jest.spyOn(AssessmentStateHelpers, 'sendResponses').mockResolvedValue(true)

		m.send(START_ATTEMPT)

		setTimeout(() => {
			m.send(SEND_RESPONSES)

			setTimeout(() => {
				expect(m.getCurrentState()).toBe(SEND_RESPONSES_SUCCESSFUL)

				m.send(END_ATTEMPT)

				setTimeout(() => {
					expect(m.getCurrentState()).toBe(END_ATTEMPT_FAILED)
					expect(OboModel.models.mockAssessmentId.processTrigger).not.toHaveBeenCalledWith(
						'onEndAttempt'
					)
					expect(Dispatcher.trigger).not.toHaveBeenCalledWith(
						'assessment:attemptEnded',
						'mockAssessmentId'
					)
					expect(console.error).toHaveBeenCalled()

					spy.mockRestore()
					done()
				})
			})
		})
	})

	test('SEND_RESPONSES_SUCCESSFUL(CONTINUE_ATTEMPT) -> IN_ATTEMPT', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				endTime: null,
				questions: [
					{
						id: 'question1',
						type: 'ObojoboDraft.Chunks.Question',
						children: [
							{
								id: 'mcAssessment',
								type: 'ObojoboDraft.Chunks.MCAssessment',
								children: []
							}
						]
					}
				],
				result: null,
				startTime: 'mock-start-time',
				state: {
					chosen: [{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' }]
				}
			}
		})
		const spy = jest.spyOn(AssessmentStateHelpers, 'sendResponses').mockResolvedValue(true)

		m.send(START_ATTEMPT)

		setTimeout(() => {
			m.send(SEND_RESPONSES)

			setTimeout(() => {
				expect(m.getCurrentState()).toBe(SEND_RESPONSES_SUCCESSFUL)
				m.send(CONTINUE_ATTEMPT)
				expect(m.getCurrentState()).toBe(IN_ATTEMPT)

				spy.mockRestore()
				done()
			})
		})
	})

	test('SEND_RESPONSES_FAILED(CONTINUE_ATTEMPT) -> IN_ATTEMPT', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				endTime: null,
				questions: [
					{
						id: 'question1',
						type: 'ObojoboDraft.Chunks.Question',
						children: [
							{
								id: 'mcAssessment',
								type: 'ObojoboDraft.Chunks.MCAssessment',
								children: []
							}
						]
					}
				],
				result: null,
				startTime: 'mock-start-time',
				state: {
					chosen: [{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' }]
				}
			}
		})
		const spy = jest.spyOn(AssessmentStateHelpers, 'sendResponses').mockRejectedValue(false)

		m.send(START_ATTEMPT)

		setTimeout(() => {
			m.send(SEND_RESPONSES)

			setTimeout(() => {
				expect(m.getCurrentState()).toBe(SEND_RESPONSES_FAILED)
				m.send(CONTINUE_ATTEMPT)
				expect(m.getCurrentState()).toBe(IN_ATTEMPT)

				spy.mockRestore()
				done()
			})
		})
	})

	test('END_ATTEMPT_SUCCESSFUL(ACKNOWLEDGE) -> NOT_IN_ATTEMPT', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {
				mockAssessmentId: 42
			}
		}

		AssessmentAPI.importScore.mockResolvedValue({
			status: 'ok',
			value: {}
		})
		AssessmentAPI.getAttemptHistory.mockResolvedValue({
			status: 'ok',
			value: []
		})

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		m.send(START_ATTEMPT)
		m.send(IMPORT_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(END_ATTEMPT_SUCCESSFUL)
			m.send(ACKNOWLEDGE)
			expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)

			done()
		})
	})

	test('END_ATTEMPT_FAILED(ACKNOWLEDGE) -> IN_ATTEMPT', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}

		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentAPI.startAttempt.mockResolvedValue({
			status: 'ok',
			value: {
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				endTime: null,
				questions: [
					{
						id: 'question1',
						type: 'ObojoboDraft.Chunks.Question',
						children: [
							{
								id: 'mcAssessment',
								type: 'ObojoboDraft.Chunks.MCAssessment',
								children: []
							}
						]
					}
				],
				result: null,
				startTime: 'mock-start-time',
				state: {
					chosen: [{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' }]
				}
			}
		})
		AssessmentAPI.endAttempt.mockResolvedValue({
			status: 'error'
		})
		const spy = jest.spyOn(AssessmentStateHelpers, 'sendResponses').mockResolvedValue(true)

		m.send(START_ATTEMPT)

		setTimeout(() => {
			m.send(SEND_RESPONSES)

			setTimeout(() => {
				m.send(END_ATTEMPT)

				setTimeout(() => {
					expect(m.getCurrentState()).toBe(END_ATTEMPT_FAILED)
					m.send(ACKNOWLEDGE)
					expect(m.getCurrentState()).toBe(IN_ATTEMPT)

					spy.mockRestore()
					done()
				})
			})
		})
	})
})
