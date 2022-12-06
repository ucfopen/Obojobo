jest.mock('../../../src/scripts/common/flux/dispatcher')

jest.mock('../../../src/scripts/viewer/stores/assessment-store')
jest.mock('../../../src/scripts/viewer/stores/question-store')
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'

import AssessmentUtil from '../../../src/scripts/viewer/util/assessment-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

const TYPE_ASSESSMENT = 'ObojoboDraft.Sections.Assessment'
const GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE = 'ok_no_outcome_service'
const GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT = 'ok_null_score_not_sent'
const GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE = 'ok_gradebook_matches_assessment_score'

describe('AssessmentUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('getAssessmentForModel returns null if given null model', () => {
		expect(AssessmentUtil.getAssessmentForModel()).toBe(null)
	})

	test('getAssessmentForModel returns assesment', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: 'mockAssessment'
			}
		}

		const assessment = AssessmentUtil.getAssessmentForModel(state, model)

		expect(assessment).toEqual('mockAssessment')
	})

	test('getAssessmentForModel returns with no parent assesment', () => {
		const model = {
			get: jest.fn().mockReturnValueOnce('mockType'),
			getParentOfType: jest.fn().mockReturnValueOnce(null)
		}
		const state = {
			assessments: {
				testId: 'mockAssessment'
			}
		}

		const assessment = AssessmentUtil.getAssessmentForModel(state, model)

		expect(assessment).toEqual(null)
	})

	test('getAssessmentForModel returns with no state assessments', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {}
		}

		const assessment = AssessmentUtil.getAssessmentForModel(state, model)

		expect(assessment).toEqual(null)
	})

	test('getLastAttemptForModel returns null when no assessment', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {}
		}

		const attempt = AssessmentUtil.getLastAttemptForModel(state, model)

		expect(attempt).toEqual(null)
	})

	test('getLastAttemptForModel returns 0 when no attempts', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: { attempts: [] }
			}
		}

		const attempt = AssessmentUtil.getLastAttemptForModel(state, model)

		expect(attempt).toEqual(0)
	})

	test('getLastAttemptForModel returns attempt', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: { attempts: ['mockAttempt'] }
			}
		}

		const assessment = AssessmentUtil.getLastAttemptForModel(state, model)

		expect(assessment).toEqual('mockAttempt')
	})

	test('getHighestAttemptsForModelByAssessmentScore returns empty when no assessment', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {}
		}

		const attempt = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(state, model)

		expect(attempt).toEqual([])
	})

	test('getHighestAttemptsForModelByAssessmentScore returns high scores', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: { highestAssessmentScoreAttempts: 'mockHighest' }
			}
		}

		const attempt = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(state, model)

		expect(attempt).toEqual('mockHighest')
	})

	test('getHighestAttemptsForModelByAttemptScore returns empty when no assessment', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel')
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce()

		const attempt = AssessmentUtil.getHighestAttemptsForModelByAttemptScore()

		expect(attempt).toEqual([])

		spy.mockRestore()
	})

	test('getHighestAttemptsForModelByAttemptScore returns high scores', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel')
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			highestAttemptScoreAttempts: 'mockHighest'
		})

		const attempt = AssessmentUtil.getHighestAttemptsForModelByAttemptScore()

		expect(attempt).toEqual('mockHighest')

		spy.mockRestore()
	})

	test('getAssessmentScoreForModel returns null when no attempts', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: {
					id: 'testId'
				}
			},
			assessmentSummaries: {}
		}

		const score = AssessmentUtil.getAssessmentScoreForModel(state, model)

		expect(score).toEqual(null)
	})

	test('getAssessmentScoreForModel returns highest score', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: {
					id: 'testId'
				}
			},
			assessmentSummaries: {
				testId: { scores: [null, 99, 88] }
			}
		}

		const score = AssessmentUtil.getAssessmentScoreForModel(state, model)

		expect(score).toEqual(99)
	})

	test('getAssessmentScoreForModel returns null if the highest score is null', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: {
					id: 'testId'
				}
			},
			assessmentSummaries: {
				testId: { scores: [null, null, null] }
			}
		}

		const score = AssessmentUtil.getAssessmentScoreForModel(state, model)

		expect(score).toEqual(null)
	})

	test('getAssessmentScoreForModel returns null if no scores exist', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: {
					id: 'testId'
				}
			},
			assessmentSummaries: {
				testId: { scores: [] }
			}
		}

		const score = AssessmentUtil.getAssessmentScoreForModel(state, model)

		expect(score).toEqual(null)
	})

	test('getCurrentAttemptForModel returns null with no assessment', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {}
		}

		const attempt = AssessmentUtil.getCurrentAttemptForModel(state, model)

		expect(attempt).toEqual(null)
	})

	test('getCurrentAttemptForModel returns current attempt', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel')
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			current: 'mockCurrent'
		})

		const attempt = AssessmentUtil.getCurrentAttemptForModel()

		expect(attempt).toEqual('mockCurrent')

		spy.mockRestore()
	})

	test('getAllAttempts returns all attempts', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel')
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			attempts: 'mockAttempts'
		})
		const attempts = AssessmentUtil.getAllAttempts()
		expect(attempts).toEqual('mockAttempts')

		spy.mockRestore()
	})

	test('getAttemptsRemaining returns number of attempts available', () => {
		const model = {
			get: key => {
				switch (key) {
					case 'id':
						return 'testId'

					case 'type':
						return TYPE_ASSESSMENT
				}
			},
			modelState: {
				attempts: 12
			}
		}
		const state = {
			assessments: {
				testId: { attempts: [] }
			},
			assessmentSummaries: {
				testId: {
					scores: []
				}
			}
		}

		const attemptsRemaining = AssessmentUtil.getAttemptsRemaining(state, model)

		expect(attemptsRemaining).toEqual(12)
	})

	test('getAttemptsRemaining returns 0 when importHasBeenUsed', () => {
		const model = {
			get: key => {
				switch (key) {
					case 'id':
						return 'testId'

					case 'type':
						return TYPE_ASSESSMENT
				}
			},
			modelState: {
				attempts: 12
			}
		}
		const state = {
			assessments: {
				testId: { id: 'testId' }
			},
			assessmentSummaries: {
				testId: {
					importUsed: true
				}
			}
		}

		const attemptsRemaining = AssessmentUtil.getAttemptsRemaining(state, model)

		expect(attemptsRemaining).toEqual(0)
	})

	test('hasAttemptsRemaining returns if attempts are available', () => {
		const model = {
			get: key => {
				switch (key) {
					case 'id':
						return 'testId'

					case 'type':
						return TYPE_ASSESSMENT
				}
			},
			modelState: {
				attempts: 12
			}
		}
		const state = {
			assessments: {
				testId: { attempts: [] }
			},
			assessmentSummaries: {
				testId: {
					scores: []
				}
			}
		}

		const attemptsRemaining = AssessmentUtil.hasAttemptsRemaining(state, model)

		expect(attemptsRemaining).toEqual(true)
	})

	test('hasAttemptsRemaining returns false if importHasBeenUsed', () => {
		const model = {
			get: key => {
				switch (key) {
					case 'id':
						return 'testId'

					case 'type':
						return TYPE_ASSESSMENT
				}
			},
			modelState: {
				attempts: 12
			}
		}
		const state = {
			assessments: {
				testId: {
					id: 'testId'
				}
			},
			assessmentSummaries: {
				testId: {
					importUsed: true
				}
			}
		}

		const attemptsRemaining = AssessmentUtil.hasAttemptsRemaining(state, model)

		expect(attemptsRemaining).toEqual(false)
	})

	test('getLTIStateForModel returns null with no assessment', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		const state = {
			assessments: {}
		}

		const ltiState = AssessmentUtil.getLTIStateForModel(state, model)

		expect(ltiState).toEqual(null)
	})

	test('getLTIStateForModel returns if attempts are avalible', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel')
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			lti: 'mock-lti',
			ltiNetworkState: 'mock-lti-nw-state',
			ltiResyncState: 'mock-lti-rs-state'
		})

		const model = {}
		const state = {}

		const ltiState = AssessmentUtil.getLTIStateForModel(state, model)

		expect(ltiState).toEqual({
			state: 'mock-lti',
			networkState: 'mock-lti-nw-state',
			resyncState: 'mock-lti-rs-state'
		})

		spy.mockRestore()
	})

	test('isLTIScoreNeedingToBeResynced returns false with no gradebook', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		const state = {
			assessments: {
				testId: {
					lti: {}
				}
			}
		}

		const ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)

		expect(ltiState).toEqual(false)
	})

	test('isLTIScoreNeedingToBeResynced returns false if synced', () => {
		const getAssessmentForModel = jest.spyOn(AssessmentUtil, 'getAssessmentForModel')
		const model = 'mock-model'
		const state = 'mock-state'

		getAssessmentForModel.mockReturnValueOnce({
			lti: { gradebookStatus: GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE }
		})
		let ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)
		expect(ltiState).toEqual(false)

		getAssessmentForModel.mockReturnValueOnce({
			lti: { gradebookStatus: GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT }
		})
		ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)
		expect(ltiState).toEqual(false)

		getAssessmentForModel.mockReturnValueOnce({
			lti: { gradebookStatus: GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE }
		})
		ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)
		expect(ltiState).toEqual(false)

		getAssessmentForModel.mockRestore()
	})

	test('isLTIScoreNeedingToBeResynced returns true if not synced', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel')
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			lti: {
				gradebookStatus: 'mock-not-synced-status'
			}
		})

		const model = {}
		const state = {}

		const ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)

		expect(ltiState).toEqual(true)

		spy.mockRestore()
	})

	test('isInAssessment returns false without a state', () => {
		const inside = AssessmentUtil.isInAssessment()

		expect(inside).toEqual(false)
	})

	test('isInAssessment returns false without assessments', () => {
		const state = {
			assessments: {}
		}
		const inside = AssessmentUtil.isInAssessment(state)

		expect(inside).toEqual(false)
	})

	test('isInAssessment returns true with current assessment', () => {
		const state = {
			assessments: {
				assess1: { current: null },
				assess2: { current: true }
			}
		}
		const inside = AssessmentUtil.isInAssessment(state)

		expect(inside).toEqual(true)
	})

	test('getNumPossibleCorrect returns the number of questions which could be correct', () => {
		const questionScores = [{ score: 100 }, { score: 0 }, { score: 'no-score' }]

		const correct = AssessmentUtil.getNumPossibleCorrect(questionScores)
		expect(correct).toEqual(2)
	})

	test('getNumCorrect returns correct questions', () => {
		const questionScores = [{ score: 100 }, { score: 0 }, { score: 100 }]

		const correct = AssessmentUtil.getNumCorrect(questionScores)
		expect(correct).toEqual(2)
	})

	test('startAttempt calls assessment:startAttempt', () => {
		const model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		AssessmentUtil.startAttempt(model)

		expect(Dispatcher.trigger).toHaveBeenCalled()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:startAttempt', {
			value: { id: 'testId' }
		})
	})

	test('endAttempt calls assessment:endAttempt', () => {
		const model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		AssessmentUtil.endAttempt({
			model,
			context: 'mockContext',
			visitId: 'mockVisitId'
		}),
			expect(Dispatcher.trigger).toHaveBeenCalled()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:endAttempt', {
			value: { id: 'testId', context: 'mockContext', visitId: 'mockVisitId' }
		})
	})

	test('resendLTIScore calls assessment:resendLTIScore', () => {
		const model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		AssessmentUtil.resendLTIScore(model)

		expect(Dispatcher.trigger).toHaveBeenCalled()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:resendLTIScore', {
			value: { id: 'testId' }
		})
	})

	test('getNumberOfAttemptsCompletedForModel returns score length', () => {
		const model = {
			get: key => {
				switch (key) {
					case 'id':
						return 'testId'

					case 'type':
						return TYPE_ASSESSMENT
				}
			}
		}
		const state = {
			assessments: {
				testId: {
					id: 'testId'
				}
			},
			assessmentSummaries: {
				testId: {
					scores: [1, 2, 3]
				}
			}
		}

		const result = AssessmentUtil.getNumberOfAttemptsCompletedForModel(state, model)
		expect(result).toBe(3)
	})

	test('getNumberOfAttemptsCompletedForModel returns 0 if no summary found', () => {
		const model = {
			get: key => {
				switch (key) {
					case 'id':
						return 'testId'

					case 'type':
						return TYPE_ASSESSMENT
				}
			}
		}
		const state = {
			assessments: {
				testId: {
					id: 'testId'
				}
			},
			assessmentSummaries: {}
		}

		const result = AssessmentUtil.getNumberOfAttemptsCompletedForModel(state, model)
		expect(result).toBe(0)
	})

	test('getAssessmentMachineForModel returns null if no assessment found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel').mockReturnValue(null)

		const state = {
			machines: {}
		}
		expect(AssessmentUtil.getAssessmentMachineForModel(state, jest.fn())).toBe(null)

		spy.mockRestore()
	})

	test('getAssessmentMachineForModel returns null if no machine found', () => {
		const spy = jest
			.spyOn(AssessmentUtil, 'getAssessmentForModel')
			.mockReturnValue({ id: 'mockAssessment' })

		const state = {
			machines: {}
		}
		expect(AssessmentUtil.getAssessmentMachineForModel(state, jest.fn())).toBe(null)

		spy.mockRestore()
	})

	test('getAssessmentMachineForModel returns any found machines', () => {
		const spy = jest
			.spyOn(AssessmentUtil, 'getAssessmentForModel')
			.mockReturnValue({ id: 'mockAssessment' })

		const state = {
			machines: {
				mockAssessment: jest.fn()
			}
		}
		expect(AssessmentUtil.getAssessmentMachineForModel(state, jest.fn())).toBe(
			state.machines.mockAssessment
		)

		spy.mockRestore()
	})

	test('getAssessmentMachineStateForModel returns null if no machine found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentMachineForModel').mockReturnValue(null)

		expect(AssessmentUtil.getAssessmentMachineStateForModel()).toBe(null)

		spy.mockRestore()
	})

	test('getAssessmentMachineStateForModel returns machine state if machine found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentMachineForModel').mockReturnValue({
			getCurrentState: () => 'mock-state'
		})

		expect(AssessmentUtil.getAssessmentMachineStateForModel()).toBe('mock-state')

		spy.mockRestore()
	})

	test('getImportableScoreForModel returns null if no importableScore found', () => {
		const state = {
			importableScores: {}
		}
		const model = {
			get: () => 'mockAssessmentId'
		}
		expect(AssessmentUtil.getImportableScoreForModel(state, model)).toBe(null)
	})

	test('getImportableScoreForModel returns score if importableScore found', () => {
		const state = {
			importableScores: {
				mockAssessmentId: { highestScore: 100 }
			}
		}
		const model = {
			get: () => 'mockAssessmentId'
		}
		expect(AssessmentUtil.getImportableScoreForModel(state, model)).toBe(100)
	})

	test('isScoreImported returns null if no assessment found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel').mockReturnValue(null)

		expect(AssessmentUtil.isScoreImported()).toBe(null)

		spy.mockRestore()
	})

	test('isAttemptHistoryLoadedForModel returns false if no assessment found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel').mockReturnValue(null)

		expect(AssessmentUtil.isAttemptHistoryLoadedForModel()).toBe(false)

		spy.mockRestore()
	})

	test('isAttemptHistoryLoadedForModel returns false if attemptHistoryNetworkState !== loaded', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel').mockReturnValue({
			attemptHistoryNetworkState: 'loading'
		})

		expect(AssessmentUtil.isAttemptHistoryLoadedForModel()).toBe(false)

		spy.mockRestore()
	})

	test('isAttemptHistoryLoadedForModel returns true if attemptHistoryNetworkState === loaded', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel').mockReturnValue({
			attemptHistoryNetworkState: 'loaded'
		})

		expect(AssessmentUtil.isAttemptHistoryLoadedForModel()).toBe(true)

		spy.mockRestore()
	})

	test('getCurrentAttemptQuestionsStatus returns null if no attempt found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getCurrentAttemptForModel').mockReturnValue(null)

		expect(AssessmentUtil.getCurrentAttemptQuestionsStatus()).toBe(null)

		spy.mockRestore()
	})

	test('getCurrentAttemptQuestionsStatus returns expected values', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getCurrentAttemptForModel').mockReturnValue({})

		const model = {
			children: {
				at: () => ({
					children: {
						models: [
							{
								// No response
								get: () => 'q1',
								children: {
									at: () => ({
										getComponentClass: () => ({
											isResponseEmpty: () => false
										})
									})
								}
							},
							{
								// Empty response
								get: () => 'q2',
								children: {
									at: () => ({
										getComponentClass: () => ({
											isResponseEmpty: () => true
										})
									})
								}
							},
							{
								// Recorded response
								get: () => 'q3',
								children: {
									at: () => ({
										getComponentClass: () => ({
											isResponseEmpty: () => false
										})
									})
								}
							},
							{
								// Sending response
								get: () => 'q4',
								children: {
									at: () => ({
										getComponentClass: () => ({
											isResponseEmpty: () => false
										})
									})
								}
							},
							{
								// Not sent response
								get: () => 'q5',
								children: {
									at: () => ({
										getComponentClass: () => ({
											isResponseEmpty: () => false
										})
									})
								}
							},
							{
								// Error response
								get: () => 'q6',
								children: {
									at: () => ({
										getComponentClass: () => ({
											isResponseEmpty: () => false
										})
									})
								}
							},
							{
								// Send state unknown response
								get: () => 'q7',
								children: {
									at: () => ({
										getComponentClass: () => ({
											isResponseEmpty: () => false
										})
									})
								}
							}
						]
					}
				})
			}
		}
		const questionState = {
			contexts: {
				mockContext: {
					responses: {
						q2: {},
						q3: {},
						q4: {},
						q5: {},
						q6: {},
						q7: {}
					},
					responseMetadata: {
						q3: { sendState: 'recorded' },
						q4: { sendState: 'sending' },
						q5: { sendState: 'notSent' },
						q6: { sendState: 'error' },
						q7: { sendState: null }
					}
				}
			}
		}

		const statuses = AssessmentUtil.getCurrentAttemptQuestionsStatus(
			{},
			questionState,
			model,
			'mockContext'
		)

		const getId = o => o.get('id')
		expect(statuses.all.map(getId)).toEqual(['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'])
		expect(statuses.unanswered.map(getId)).toEqual(['q1'])
		expect(statuses.empty.map(getId)).toEqual(['q2'])
		expect(statuses.notSent.map(getId)).toEqual(['q5'])
		expect(statuses.recorded.map(getId)).toEqual(['q3'])
		expect(statuses.error.map(getId)).toEqual(['q6'])
		expect(statuses.sending.map(getId)).toEqual(['q4'])
		expect(statuses.unknown.map(getId)).toEqual(['q7'])

		spy.mockRestore()
	})

	test('getCurrentAttemptStatus returns expected values', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getCurrentAttemptQuestionsStatus')

		spy.mockReturnValue(null)
		expect(AssessmentUtil.getCurrentAttemptStatus()).toBe('noAttempt')

		spy.mockRestore()
	})

	test.each`
		all  | unknown | unanswered | empty | notSent | error | sending | recorded | status
		${0} | ${0}    | ${0}       | ${0}  | ${0}    | ${0}  | ${0}    | ${0}     | ${'noQuestions'}
		${1} | ${1}    | ${0}       | ${0}  | ${0}    | ${0}  | ${0}    | ${0}     | ${'hasResponsesWithUnknownSendStates'}
		${1} | ${0}    | ${1}       | ${0}  | ${0}    | ${0}  | ${0}    | ${0}     | ${'hasQuestionsUnanswered'}
		${1} | ${0}    | ${0}       | ${1}  | ${0}    | ${0}  | ${0}    | ${0}     | ${'hasQuestionsEmpty'}
		${1} | ${0}    | ${0}       | ${0}  | ${1}    | ${0}  | ${0}    | ${0}     | ${'hasResponsesUnsent'}
		${1} | ${0}    | ${0}       | ${0}  | ${0}    | ${1}  | ${0}    | ${0}     | ${'hasResponsesWithErrorSendStates'}
		${1} | ${0}    | ${0}       | ${0}  | ${0}    | ${0}  | ${1}    | ${0}     | ${'hasResponsesSending'}
		${1} | ${0}    | ${0}       | ${0}  | ${0}    | ${0}  | ${0}    | ${1}     | ${'readyToSubmit'}
		${1} | ${0}    | ${0}       | ${0}  | ${0}    | ${0}  | ${0}    | ${0}     | ${'unknown'}
		${7} | ${1}    | ${1}       | ${1}  | ${1}    | ${1}  | ${1}    | ${1}     | ${'hasResponsesWithUnknownSendStates'}
		${6} | ${0}    | ${1}       | ${1}  | ${1}    | ${1}  | ${1}    | ${1}     | ${'hasQuestionsUnanswered'}
		${5} | ${0}    | ${0}       | ${1}  | ${1}    | ${1}  | ${1}    | ${1}     | ${'hasQuestionsEmpty'}
		${4} | ${0}    | ${0}       | ${0}  | ${1}    | ${1}  | ${1}    | ${1}     | ${'hasResponsesUnsent'}
		${3} | ${0}    | ${0}       | ${0}  | ${0}    | ${1}  | ${1}    | ${1}     | ${'hasResponsesWithErrorSendStates'}
		${2} | ${0}    | ${0}       | ${0}  | ${0}    | ${0}  | ${1}    | ${1}     | ${'hasResponsesSending'}
	`(
		'getCurrentAttemptStatus() with {all.length=$all,unknown.length=$unknown,unanswered.length=$unanswered,empty.length=$empty,notSent.length=$notSent,error.length=$error,sending.length=$sending,recorded.length=$recorded} = "$status" ',
		({ all, unknown, unanswered, empty, notSent, error, sending, recorded, status }) => {
			const spy = jest.spyOn(AssessmentUtil, 'getCurrentAttemptQuestionsStatus').mockReturnValue({
				all: { length: all },
				unknown: { length: unknown },
				unanswered: { length: unanswered },
				empty: { length: empty },
				notSent: { length: notSent },
				error: { length: error },
				sending: { length: sending },
				recorded: { length: recorded }
			})

			expect(AssessmentUtil.getCurrentAttemptStatus()).toBe(status)

			spy.mockRestore()
		}
	)

	test.each`
		method
		${'continueAttempt'}
		${'resumeAttempt'}
		${'importAttempt'}
		${'abandonImport'}
		${'acknowledgeStartAttemptFailed'}
		${'acknowledgeResumeAttemptFailed'}
		${'acknowledgeEndAttemptSuccessful'}
		${'acknowledgeEndAttemptFailed'}
		${'acknowledgeImportAttemptFailed'}
	`('AssessmentUtil.$method() fires "assessment:$method"', ({ method }) => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		AssessmentUtil[method]({ get: () => 'mock-id' })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:' + method, {
			value: { id: 'mock-id' }
		})
	})

	test('forceSendResponsesForCurrentAttempt fires assessment:forceSendResponses', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		AssessmentUtil.forceSendResponsesForCurrentAttempt({ get: () => 'mock-id' }, 'mock-context')

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:forceSendResponses', {
			value: { id: 'mock-id', context: 'mock-context' }
		})
	})

	test('acknowledgeFetchHistoryFailed fires assessment:acknowledgeFetchHistoryFailed (default retry = false)', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		AssessmentUtil.acknowledgeFetchHistoryFailed({ get: () => 'mock-id' })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:acknowledgeFetchHistoryFailed', {
			value: { id: 'mock-id', retry: false }
		})
	})

	test('acknowledgeFetchHistoryFailed fires assessment:acknowledgeFetchHistoryFailed (retry = false)', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		AssessmentUtil.acknowledgeFetchHistoryFailed({ get: () => 'mock-id' }, false)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:acknowledgeFetchHistoryFailed', {
			value: { id: 'mock-id', retry: false }
		})
	})

	test('acknowledgeFetchHistoryFailed fires assessment:acknowledgeFetchHistoryFailed (retry = false)', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		AssessmentUtil.acknowledgeFetchHistoryFailed({ get: () => 'mock-id' }, true)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:acknowledgeFetchHistoryFailed', {
			value: { id: 'mock-id', retry: true }
		})
	})

	test('isFullReviewAvailableForModel returns null if no assessment found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel').mockReturnValue(null)

		expect(AssessmentUtil.isFullReviewAvailableForModel()).toBe(null)

		spy.mockRestore()
	})

	test.each`
		review                     | hasAttemptsRemaining | result
		${'always'}                | ${false}             | ${true}
		${'always'}                | ${true}              | ${true}
		${'never'}                 | ${false}             | ${false}
		${'never'}                 | ${true}              | ${false}
		${'no-attempts-remaining'} | ${false}             | ${true}
		${'no-attempts-remaining'} | ${true}              | ${false}
	`(
		'isFullReviewAvailableForModel with review="$review", hasAttemptsRemaining="$hasAttemptsRemaining" -> $result',
		({ review, hasAttemptsRemaining, result }) => {
			const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel').mockReturnValue({})

			expect(
				AssessmentUtil.isFullReviewAvailableForModel(
					{
						assessments: {
							testId: {
								id: 'testId',
								isScoreImported: false
							}
						},
						assessmentSummaries: {
							testId: {}
						}
					},
					{ get: () => 'testId', modelState: { review, attempts: hasAttemptsRemaining ? 3 : 0 } }
				)
			).toBe(result)

			spy.mockRestore()
		}
	)

	test('getAssessmentSummaryForModel returns null if no assessment found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentForModel').mockReturnValue(null)

		expect(AssessmentUtil.getAssessmentSummaryForModel()).toBe(null)

		spy.mockRestore()
	})

	test('getUnfinishedAttemptId returns null if no assessment summary found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentSummaryForModel').mockReturnValue(null)

		expect(AssessmentUtil.getUnfinishedAttemptId()).toBe(null)

		spy.mockRestore()
	})

	test('getUnfinishedAttemptId returns null if id is not found in summary', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getAssessmentSummaryForModel').mockReturnValue({})

		expect(AssessmentUtil.getUnfinishedAttemptId()).toBe(null)

		spy.mockRestore()
	})

	test('getUnfinishedAttemptId returns the unfinishedAttemptId from the summary', () => {
		const spy = jest
			.spyOn(AssessmentUtil, 'getAssessmentSummaryForModel')
			.mockReturnValue({ unfinishedAttemptId: 'mock-id' })

		expect(AssessmentUtil.getUnfinishedAttemptId()).toBe('mock-id')

		spy.mockRestore()
	})

	test('hasUnfinishedAttempt returns false if no unfinished attempt found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getUnfinishedAttemptId').mockReturnValue(null)

		expect(AssessmentUtil.hasUnfinishedAttempt()).toBe(false)

		spy.mockRestore()
	})

	test('hasUnfinishedAttempt returns true if unfinished attempt found', () => {
		const spy = jest.spyOn(AssessmentUtil, 'getUnfinishedAttemptId').mockReturnValue('mock-id')

		expect(AssessmentUtil.hasUnfinishedAttempt()).toBe(true)

		spy.mockRestore()
	})

	test('nextQuestion fires assessment:nextQuestion if the current question has been answered', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		AssessmentStore.getState.mockReturnValueOnce({
			assessments: {
				'mock-id': {
					current: {
						state: {
							currentQuestion: 0
						}
					}
				}
			}
		})

		QuestionStore.getContextState.mockReturnValueOnce({
			responses: {
				q1: true
			}
		})

		const model = {
			get: () => 'mock-id',
			children: {
				at: () => ({
					children: {
						models: [{ get: () => 'q1' }]
					}
				})
			}
		}

		AssessmentUtil.nextQuestion(model, 'mock-context')

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:nextQuestion', {
			value: { id: 'mock-id' }
		})
	})

	test('nextQuestion fires assessment:tryNextQuestion if the current question has not been answered', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		AssessmentStore.getState.mockReturnValueOnce({
			assessments: {
				'mock-id': {
					current: {
						state: {
							currentQuestion: 0
						}
					}
				}
			}
		})

		QuestionStore.getContextState.mockReturnValueOnce({ responses: {} })

		const model = {
			get: () => 'mock-id',
			children: {
				at: () => ({
					children: {
						models: [{ get: () => 'q1' }]
					}
				})
			}
		}

		AssessmentUtil.nextQuestion(model, 'mock-context')

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:tryNextQuestion', {
			value: { id: 'mock-id' }
		})
	})

	test('acknowledgeSkipQuestion fires assessment:nextQuestion', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		AssessmentUtil.acknowledgeSkipQuestion({ get: () => 'mock-id' })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:nextQuestion', {
			value: { id: 'mock-id' }
		})
	})
})
