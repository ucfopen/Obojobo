import ScoreStore from '../../../src/scripts/viewer/stores/score-store'
import APIUtil from '../../../src/scripts/viewer/util/api-util'
import FocusUtil from '../../../src/scripts/common/util/focus-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import OboModel from '../../../src/scripts/common/models/obo-model'

jest.mock('../../../src/scripts/viewer/util/api-util', () => {
	return {
		postEvent: jest.fn()
	}
})

jest.mock('../../../src/scripts/common/util/focus-util', () => {
	return {
		unfocus: jest.fn()
	}
})

jest.mock('../../../src/scripts/common/models/obo-model', () => {
	return {
		models: {
			test: {
				getRoot: jest.fn()
			}
		}
	}
})

describe('ScoreStore', () => {
	beforeEach(() => {
		ScoreStore.init()

		ScoreStore.triggerChange = jest.fn()
		jest.resetAllMocks()
	})

	it('should init state with an empty scores object and return it', () => {
		ScoreStore.init()

		expect(true).toBe(true)

		expect(ScoreStore.getState()).toEqual({
			scores: {}
		})
	})

	it('should set state', () => {
		ScoreStore.setState({ x: 1 })

		expect(ScoreStore.getState()).toEqual({ x: 1 })
	})

	it('should set a score, trigger a change and post a score:set event with a < 100 score', () => {
		Dispatcher.trigger('score:set', {
			value: {
				itemId: 'test',
				score: 25
			}
		})

		let testState = ScoreStore.getState().scores.test

		expect(ScoreStore.triggerChange).toHaveBeenCalled()
		expect(APIUtil.postEvent).toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('score:set')
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual('2.0.0')
		expect(APIUtil.postEvent.mock.calls[0][3]).toEqual({
			itemId: 'test',
			score: 25,
			id: testState.id
		})
		expect(FocusUtil.unfocus).not.toHaveBeenCalled()

		let scores = ScoreStore.getState().scores
		expect(scores.test).toBeDefined()
		expect(Object.keys(scores.test).sort()).toEqual(['id', 'itemId', 'score'])
		expect(scores.test.itemId).toEqual('test')
		expect(scores.test.score).toEqual(25)
	})

	it('should set a score, trigger a change, post a score:set event AND unfocus with a 100 score', () => {
		Dispatcher.trigger('score:set', {
			value: {
				itemId: 'test',
				score: 100
			}
		})

		let testState = ScoreStore.getState().scores.test

		expect(ScoreStore.triggerChange).toHaveBeenCalled()
		expect(APIUtil.postEvent).toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('score:set')
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual('2.0.0')
		expect(APIUtil.postEvent.mock.calls[0][3]).toEqual({
			itemId: 'test',
			score: 100,
			id: testState.id
		})
		expect(FocusUtil.unfocus).toHaveBeenCalled()

		let scores = ScoreStore.getState().scores
		expect(scores.test).toBeDefined()
		expect(Object.keys(scores.test).sort()).toEqual(['id', 'itemId', 'score'])
		expect(scores.test.itemId).toEqual('test')
		expect(scores.test.score).toEqual(100)
	})

	it('should clear scores, trigger a change and post a score:clear event', () => {
		// Set a score for 'test' and 'test2'
		ScoreStore.setState({
			scores: {
				test: {
					id: 'uuid1',
					itemId: 'test',
					score: 10
				},
				test2: {
					id: 'uuid2',
					itemId: 'test2',
					score: 20
				}
			}
		})

		// Now clear the score for 'test' only and expect test2 to still exist
		Dispatcher.trigger('score:clear', {
			value: {
				itemId: 'test'
			}
		})

		expect(ScoreStore.triggerChange).toHaveBeenCalled()
		expect(ScoreStore.getState()).toEqual({
			scores: {
				test2: {
					id: 'uuid2',
					itemId: 'test2',
					score: 20
				}
			}
		})
		expect(APIUtil.postEvent).toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('score:clear')
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual('2.0.0')
		expect(APIUtil.postEvent.mock.calls[0][3]).toEqual({ itemId: 'test', id: 'uuid1', score: 10 })
	})
})
