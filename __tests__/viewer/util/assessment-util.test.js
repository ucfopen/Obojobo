jest.mock('../../../src/scripts/common/flux/dispatcher')
jest.mock('../../../src/scripts/viewer/util/question-util')

import AssessmentUtil from '../../../src/scripts/viewer/util/assessment-util'

import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import QuestionUtil from '../../../src/scripts/viewer/util/question-util'

const TYPE_ASSESSMENT = 'ObojoboDraft.Sections.Assessment'
const GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE = 'ok_no_outcome_service'
const GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT = 'ok_null_score_not_sent'
const GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE = 'ok_gradebook_matches_assessment_score'

describe('AssessmentUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
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
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {}
		}

		const attempt = AssessmentUtil.getHighestAttemptsForModelByAttemptScore(state, model)

		expect(attempt).toEqual([])
	})

	test('getHighestAttemptsForModelByAttemptScore returns high scores', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: { highestAttemptScoreAttempts: 'mockHighest' }
			}
		}

		const attempt = AssessmentUtil.getHighestAttemptsForModelByAttemptScore(state, model)

		expect(attempt).toEqual('mockHighest')
	})

	test('getAssessmentScoreForModel returns null when no attempts', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {}
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
				testId: { highestAssessmentScoreAttempts: [{ assessmentScore: 'mockScore' }] }
			}
		}

		const score = AssessmentUtil.getAssessmentScoreForModel(state, model)

		expect(score).toEqual('mockScore')
	})

	test('getLastAttemptScoresForModel returns null with no assessment', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {}
		}

		const scores = AssessmentUtil.getLastAttemptScoresForModel(state, model)

		expect(scores).toEqual(null)
	})

	test('getLastAttemptScoresForModel returns empty with no attempts', () => {
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

		const scores = AssessmentUtil.getLastAttemptScoresForModel(state, model)

		expect(scores).toEqual([])
	})

	test('getLastAttemptScoresForModel returns scores of last attempt', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: { attempts: [{ questionScores: 'mockScores' }] }
			}
		}

		const scores = AssessmentUtil.getLastAttemptScoresForModel(state, model)

		expect(scores).toEqual('mockScores')
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
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: { current: 'mockCurrent' }
			}
		}

		const attempt = AssessmentUtil.getCurrentAttemptForModel(state, model)

		expect(attempt).toEqual('mockCurrent')
	})

	test('getAllAttempts returns all attempts', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: { attempts: 'mockAttempts' }
			}
		}

		const attempts = AssessmentUtil.getAllAttempts(state, model)

		expect(attempts).toEqual('mockAttempts')
	})

	test('getAttemptsRemaining returns number of attempts avalible', () => {
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
				testId: { attempts: [] }
			}
		}

		const attemptsRemaining = AssessmentUtil.getAttemptsRemaining(state, model)

		expect(attemptsRemaining).toEqual(12)
	})

	test('hasAttemptsRemaining returns if attempts are avalible', () => {
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
				testId: { attempts: [] }
			}
		}

		const attemptsRemaining = AssessmentUtil.hasAttemptsRemaining(state, model)

		expect(attemptsRemaining).toEqual(true)
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
					lti: 'mockLTI',
					ltiNetworkState: 'mockNetworkState',
					ltiResyncState: 'mockResyncState'
				}
			}
		}

		const ltiState = AssessmentUtil.getLTIStateForModel(state, model)

		expect(ltiState).toEqual({
			state: 'mockLTI',
			networkState: 'mockNetworkState',
			resyncState: 'mockResyncState'
		})
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
					lti: { gradebookStatus: GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT }
				}
			}
		}

		let ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)
		expect(ltiState).toEqual(false)

		model.get.mockReturnValueOnce(TYPE_ASSESSMENT).mockReturnValueOnce('testId')
		state.assessments.testId.lti.gradebookStatus = GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE

		ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)
		expect(ltiState).toEqual(false)

		model.get.mockReturnValueOnce(TYPE_ASSESSMENT).mockReturnValueOnce('testId')
		state.assessments.testId.lti.gradebookStatus = GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE

		ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)
		expect(ltiState).toEqual(false)
	})

	test('isLTIScoreNeedingToBeResynced returns true if not synced', () => {
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
					lti: { gradebookStatus: 'mockStatus' }
				}
			}
		}

		const ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)

		expect(ltiState).toEqual(true)
	})

	test('getResponseCount returns the number of questions with responses', () => {
		const models = [{}, {}]

		QuestionUtil.getResponse.mockReturnValueOnce(false).mockReturnValueOnce(true)

		const count = AssessmentUtil.getResponseCount(models)

		expect(QuestionUtil.getResponse).toHaveBeenCalledTimes(2)
		expect(count).toBe(1)
	})

	test('isCurrentAttemptComplete returns null if no attempt', () => {
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
				testId: {}
			}
		}

		const isComplete = AssessmentUtil.isCurrentAttemptComplete(state, null, model)

		expect(isComplete).toEqual(null)
	})

	test('isCurrentAttemptComplete returns true when every question is answered', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			},
			children: {
				at: jest.fn().mockReturnValueOnce({
					children: {
						models: [{}, {}]
					}
				})
			}
		}
		const state = {
			assessments: {
				testId: { current: 'mockCurrent' }
			}
		}

		QuestionUtil.getResponse.mockReturnValueOnce(true).mockReturnValueOnce(true)

		const isComplete = AssessmentUtil.isCurrentAttemptComplete(state, null, model)

		expect(isComplete).toEqual(true)
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

	test('getNumberOfAttemptsCompletedForModel returns 0 when no attempts', () => {
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

		const completedAttempts = AssessmentUtil.getNumberOfAttemptsCompletedForModel(state, model)

		expect(completedAttempts).toEqual(0)
	})

	test('getNumberOfAttemptsCompletedForModel returns number of attempts', () => {
		const model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		const state = {
			assessments: {
				testId: { attempts: [{}, {}, {}] }
			}
		}

		const completedAttempts = AssessmentUtil.getNumberOfAttemptsCompletedForModel(state, model)

		expect(completedAttempts).toEqual(3)
	})

	test('getNumCorrect returns correct questions', () => {
		const questionScores = [{ score: 100 }, { score: 0 }, { score: 100 }]

		const correct = AssessmentUtil.getNumCorrect(questionScores)
		expect(correct).toEqual(2)
	})

	test('findHighestAttempts returns empty if no attempts', () => {
		const highest = AssessmentUtil.findHighestAttempts([])

		expect(highest).toEqual([])
	})

	test('findHighestAttempts returns highest scores', () => {
		const attempts = [
			{ mockScore: 100 },
			{ mockScore: null },
			{ mockScore: 68 },
			{ mockScore: 100 }
		]
		const highest = AssessmentUtil.findHighestAttempts(attempts, 'mockScore')

		expect(highest).toEqual([{ mockScore: 100 }, { mockScore: 100 }])
	})

	test('startAttempt calls assessment:startAttempt', () => {
		AssessmentUtil.startAttempt('testId')

		expect(Dispatcher.trigger).toHaveBeenCalled()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:startAttempt', {
			value: { id: 'testId' }
		})
	})

	test('endAttempt calls assessment:endAttempt', () => {
		AssessmentUtil.endAttempt({
			attemptId: 'testId',
			context: 'mockContext'
		}),
			expect(Dispatcher.trigger).toHaveBeenCalled()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:endAttempt', {
			value: { attemptId: 'testId', context: 'mockContext' }
		})
	})

	test('resendLTIScore calls assessment:resendLTIScore', () => {
		AssessmentUtil.resendLTIScore('testId')

		expect(Dispatcher.trigger).toHaveBeenCalled()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:resendLTIScore', {
			value: { id: 'testId' }
		})
	})
})
