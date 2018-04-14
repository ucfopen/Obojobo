// Dispatcher
jest.mock('../../../src/scripts/common/flux/dispatcher', () => ({
	trigger: jest.fn(),
	on: jest.fn()
}))

const Dispatcher = require('../../../src/scripts/common/flux/dispatcher')
const ScoreUtil = require('../../../src/scripts/viewer/util/score-util').default

describe('ScoreUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test("should return a null score for a model that doesn't have a score associated with it", () => {
		let fakeModel = {
			get: () => 'test'
		}

		let scoreState = {
			scores: {}
		}

		let score = ScoreUtil.getScoreForModel(scoreState, fakeModel)
		expect(score).toBe(null)
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('should return a score for a model that has a score associated with it', () => {
		let fakeModel = {
			get: () => 'test'
		}

		let state = {
			scores: {
				test: {
					id: 'uuid',
					itemId: 'test',
					score: 50
				}
			}
		}

		let score = ScoreUtil.getScoreForModel(state, fakeModel)
		expect(score).toBe(50)
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('setScore should dispatch expected event', () => {
		ScoreUtil.setScore('test', 50)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('score:set', {
			value: {
				itemId: 'test',
				score: 50
			}
		})
	})

	test('clearScore should dispatch expected event', () => {
		ScoreUtil.clearScore(50)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('score:clear', {
			value: {
				itemId: 50
			}
		})
	})
})
