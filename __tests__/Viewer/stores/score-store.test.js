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
				id: 'test',
				score: 25
			}
		})

		expect(ScoreStore.triggerChange).toHaveBeenCalled()
		expect(APIUtil.postEvent).toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('score:set')
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({ id: 'test', score: 25 })
		expect(FocusUtil.unfocus).not.toHaveBeenCalled()
		expect(ScoreStore.getState()).toEqual({
			scores: {
				test: 25
			}
		})
	})

	it('should set a score, trigger a change, post a score:set event AND unfocus with a 100 score', () => {
		Dispatcher.trigger('score:set', {
			value: {
				id: 'test',
				score: 100
			}
		})

		expect(ScoreStore.triggerChange).toHaveBeenCalled()
		expect(APIUtil.postEvent).toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('score:set')
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({ id: 'test', score: 100 })
		expect(FocusUtil.unfocus).toHaveBeenCalled()
		expect(ScoreStore.getState()).toEqual({
			scores: {
				test: 100
			}
		})
	})

	it('should clear scores, trigger a change and post a score:clear event', () => {
		// Set a score for 'test' and 'test2'
		ScoreStore.setState({
			scores: {
				test: 10,
				test2: 20
			}
		})
		expect(ScoreStore.getState()).toEqual({
			scores: {
				test: 10,
				test2: 20
			}
		})

		// Now clear the score for 'test' only and expect test2 to still exist
		Dispatcher.trigger('score:clear', {
			value: {
				id: 'test'
			}
		})

		expect(ScoreStore.triggerChange).toHaveBeenCalled()
		expect(ScoreStore.getState()).toEqual({
			scores: {
				test2: 20
			}
		})
		expect(APIUtil.postEvent).toHaveBeenCalled()
		expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('score:clear')
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({ id: 'test' })
	})
})
