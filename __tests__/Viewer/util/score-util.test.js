import ScoreStore from 'Viewer/stores/score-store'
import ScoreUtil from 'Viewer/util/score-util'
import OboModel from 'ObojoboDraft/Common/models/obo-model'
import Dispatcher from 'ObojoboDraft/Common/flux/dispatcher'

jest.mock('Viewer/util/api-util', () => {
	return {
		postEvent: jest.fn()
	}
})

jest.mock('ObojoboDraft/Common/models/obo-model', () => {
	return {
		models: {
			test: {
				getRoot: jest.fn()
			}
		}
	}
})

jest.mock('ObojoboDraft/Common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn()
	}
})

describe('ScoreUtil', () => {
	beforeEach(() => {
		ScoreStore.init()
	})

	it("should return a null score for a model that doesn't have a score associated with it", () => {
		let fakeModel = {
			get: () => 'test'
		}

		let score = ScoreUtil.getScoreForModel(ScoreStore.getState(), fakeModel)

		expect(score).toBe(null)
	})

	it("should return a score for a model that has a score associated with it", () => {
		let fakeModel = {
			get: () => 'test'
		}

		ScoreStore.setState({
			scores: {
				test: 50
			}
		})

		let score = ScoreUtil.getScoreForModel(ScoreStore.getState(), fakeModel)

		expect(score).toBe(50)
	})

	it('should set scores', () => {
		ScoreUtil.setScore('test', 50)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('score:set', expect.objectContaining({
			value: {
				id: 'test',
				score: 50
			}
		}));
	})

	it('should clear scores', () => {
		ScoreUtil.setScore('test', 50)
		ScoreUtil.clearScore('test')

		expect(ScoreStore.getState()).toEqual({ scores:{} })
	})
})