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
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: 'mockAssessment'
			}
		}

		let assessment = AssessmentUtil.getAssessmentForModel(state, model)

		expect(assessment).toEqual('mockAssessment')
	})

	test('getAssessmentForModel returns with no parent assesment', () => {
		let model = {
			get: jest.fn().mockReturnValueOnce('mockType'),
			getParentOfType: jest.fn().mockReturnValueOnce(null)
		}
		let state = {
			assessments: {
				testId: 'mockAssessment'
			}
		}

		let assessment = AssessmentUtil.getAssessmentForModel(state, model)

		expect(assessment).toEqual(null)
	})

	test('getAssessmentForModel returns with no state assessments', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {}
		}

		let assessment = AssessmentUtil.getAssessmentForModel(state, model)

		expect(assessment).toEqual(null)
	})

	test('getLastAttemptForModel returns null when no assessment', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {}
		}

		let attempt = AssessmentUtil.getLastAttemptForModel(state, model)

		expect(attempt).toEqual(null)
	})

	test('getLastAttemptForModel returns 0 when no attempts', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { attempts: [] }
			}
		}

		let attempt = AssessmentUtil.getLastAttemptForModel(state, model)

		expect(attempt).toEqual(0)
	})

	test('getLastAttemptForModel returns attempt', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { attempts: ['mockAttempt'] }
			}
		}

		let assessment = AssessmentUtil.getLastAttemptForModel(state, model)

		expect(assessment).toEqual('mockAttempt')
	})

	test('getHighestAttemptsForModelByAssessmentScore returns empty when no assessment', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {}
		}

		let attempt = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(state, model)

		expect(attempt).toEqual([])
	})

	test('getHighestAttemptsForModelByAssessmentScore returns high scores', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { highestAssessmentScoreAttempts: 'mockHighest' }
			}
		}

		let attempt = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(state, model)

		expect(attempt).toEqual('mockHighest')
	})

	test('getHighestAttemptsForModelByAttemptScore returns empty when no assessment', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {}
		}

		let attempt = AssessmentUtil.getHighestAttemptsForModelByAttemptScore(state, model)

		expect(attempt).toEqual([])
	})

	test('getHighestAttemptsForModelByAttemptScore returns high scores', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { highestAttemptScoreAttempts: 'mockHighest' }
			}
		}

		let attempt = AssessmentUtil.getHighestAttemptsForModelByAttemptScore(state, model)

		expect(attempt).toEqual('mockHighest')
	})

	test('getAssessmentScoreForModel returns null when no attempts', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {}
		}

		let score = AssessmentUtil.getAssessmentScoreForModel(state, model)

		expect(score).toEqual(null)
	})

	test('getAssessmentScoreForModel returns highest score', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { highestAssessmentScoreAttempts: [{ assessmentScore: 'mockScore' }] }
			}
		}

		let score = AssessmentUtil.getAssessmentScoreForModel(state, model)

		expect(score).toEqual('mockScore')
	})

	test('getLastAttemptScoresForModel returns null with no assessment', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {}
		}

		let scores = AssessmentUtil.getLastAttemptScoresForModel(state, model)

		expect(scores).toEqual(null)
	})

	test('getLastAttemptScoresForModel returns empty with no attempts', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { attempts: [] }
			}
		}

		let scores = AssessmentUtil.getLastAttemptScoresForModel(state, model)

		expect(scores).toEqual([])
	})

	test('getLastAttemptScoresForModel returns scores of last attempt', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { attempts: [{ questionScores: 'mockScores' }] }
			}
		}

		let scores = AssessmentUtil.getLastAttemptScoresForModel(state, model)

		expect(scores).toEqual('mockScores')
	})

	test('getCurrentAttemptForModel returns null with no assessment', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {}
		}

		let attempt = AssessmentUtil.getCurrentAttemptForModel(state, model)

		expect(attempt).toEqual(null)
	})

	test('getCurrentAttemptForModel returns current attempt', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { current: 'mockCurrent' }
			}
		}

		let attempt = AssessmentUtil.getCurrentAttemptForModel(state, model)

		expect(attempt).toEqual('mockCurrent')
	})

	test('getAllAttempts returns all attempts', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { attempts: 'mockAttempts' }
			}
		}

		let attempts = AssessmentUtil.getAllAttempts(state, model)

		expect(attempts).toEqual('mockAttempts')
	})

	test('getAttemptsRemaining returns number of attempts avalible', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		let state = {
			assessments: {
				testId: { attempts: [] }
			}
		}

		let attemptsRemaining = AssessmentUtil.getAttemptsRemaining(state, model)

		expect(attemptsRemaining).toEqual(12)
	})

	test('hasAttemptsRemaining returns if attempts are avalible', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		let state = {
			assessments: {
				testId: { attempts: [] }
			}
		}

		let attemptsRemaining = AssessmentUtil.hasAttemptsRemaining(state, model)

		expect(attemptsRemaining).toEqual(true)
	})

	test('getLTIStateForModel returns null with no assessment', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		let state = {
			assessments: {}
		}

		let ltiState = AssessmentUtil.getLTIStateForModel(state, model)

		expect(ltiState).toEqual(null)
	})

	test('getLTIStateForModel returns if attempts are avalible', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		let state = {
			assessments: {
				testId: {
					lti: 'mockLTI',
					ltiNetworkState: 'mockNetworkState',
					ltiErrorCount: 'mockErrors'
				}
			}
		}

		let ltiState = AssessmentUtil.getLTIStateForModel(state, model)

		expect(ltiState).toEqual({
			state: 'mockLTI',
			networkState: 'mockNetworkState',
			errorCount: 'mockErrors'
		})
	})

	test('isLTIScoreNeedingToBeResynced returns false with no gradebook', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		let state = {
			assessments: {
				testId: {
					lti: {}
				}
			}
		}

		let ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)

		expect(ltiState).toEqual(false)
	})

	test('isLTIScoreNeedingToBeResynced returns false if synced', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		let state = {
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
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		let state = {
			assessments: {
				testId: {
					lti: { gradebookStatus: 'mockStatus' }
				}
			}
		}

		let ltiState = AssessmentUtil.isLTIScoreNeedingToBeResynced(state, model)

		expect(ltiState).toEqual(true)
	})

	test('getResponseCount returns the number of questions with responses', () => {
		let models = [{}, {}]

		QuestionUtil.getResponse.mockReturnValueOnce(false).mockReturnValueOnce(true)

		let count = AssessmentUtil.getResponseCount(models)

		expect(QuestionUtil.getResponse).toHaveBeenCalledTimes(2)
		expect(count).toBe(1)
	})

	test('isCurrentAttemptComplete returns null if no attempt', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId'),
			modelState: {
				attempts: 12
			}
		}
		let state = {
			assessments: {
				testId: {}
			}
		}

		let isComplete = AssessmentUtil.isCurrentAttemptComplete(state, null, model)

		expect(isComplete).toEqual(null)
	})

	test('isCurrentAttemptComplete returns true when every question is answered', () => {
		let model = {
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
		let state = {
			assessments: {
				testId: { current: 'mockCurrent' }
			}
		}

		QuestionUtil.getResponse.mockReturnValueOnce(true).mockReturnValueOnce(true)

		let isComplete = AssessmentUtil.isCurrentAttemptComplete(state, null, model)

		expect(isComplete).toEqual(true)
	})

	test('isInAssessment returns false without a state', () => {
		let inside = AssessmentUtil.isInAssessment()

		expect(inside).toEqual(false)
	})

	test('isInAssessment returns false without assessments', () => {
		let state = {
			assessments: {}
		}
		let inside = AssessmentUtil.isInAssessment(state)

		expect(inside).toEqual(false)
	})

	test('isInAssessment returns true with current assessment', () => {
		let state = {
			assessments: {
				assess1: { current: null },
				assess2: { current: true }
			}
		}
		let inside = AssessmentUtil.isInAssessment(state)

		expect(inside).toEqual(true)
	})

	test('getNumberOfAttemptsCompletedForModel returns 0 when no attempts', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { attempts: [] }
			}
		}

		let completedAttempts = AssessmentUtil.getNumberOfAttemptsCompletedForModel(state, model)

		expect(completedAttempts).toEqual(0)
	})

	test('getNumberOfAttemptsCompletedForModel returns number of attempts', () => {
		let model = {
			get: jest
				.fn()
				.mockReturnValueOnce(TYPE_ASSESSMENT)
				.mockReturnValueOnce('testId')
		}
		let state = {
			assessments: {
				testId: { attempts: [{}, {}, {}] }
			}
		}

		let completedAttempts = AssessmentUtil.getNumberOfAttemptsCompletedForModel(state, model)

		expect(completedAttempts).toEqual(3)
	})

	test('getNumCorrect returns correct questions', () => {
		let questionScores = [{ score: 100 }, { score: 0 }, { score: 100 }]

		let correct = AssessmentUtil.getNumCorrect(questionScores)
		expect(correct).toEqual(2)
	})

	test('findHighestAttempts returns empty if no attempts', () => {
		let highest = AssessmentUtil.findHighestAttempts([])

		expect(highest).toEqual([])
	})

	test('findHighestAttempts returns highest scores', () => {
		let attempts = [{ mockScore: 100 }, { mockScore: null }, { mockScore: 68 }, { mockScore: 100 }]
		let highest = AssessmentUtil.findHighestAttempts(attempts, 'mockScore')

		expect(highest).toEqual([{ mockScore: 100 }, { mockScore: 100 }])
	})

	test('startAttempt calls assessment:startAttempt', () => {
		let model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		AssessmentUtil.startAttempt(model)

		expect(Dispatcher.trigger).toHaveBeenCalled()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:startAttempt', {
			value: { id: 'testId' }
		})
	})

	test('endAttempt calls assessment:endAttempt', () => {
		let model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		AssessmentUtil.endAttempt(model, 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalled()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:endAttempt', {
			value: { id: 'testId', context: 'mockContext' }
		})
	})

	test('resendLTIScore calls assessment:resendLTIScore', () => {
		let model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		AssessmentUtil.resendLTIScore(model)

		expect(Dispatcher.trigger).toHaveBeenCalled()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('assessment:resendLTIScore', {
			value: { id: 'testId' }
		})
	})
})
