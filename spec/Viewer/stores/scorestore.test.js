let OboModel = window.ObojoboDraft.Common.models.OboModel;
let ScoreStore = window.Viewer.stores.ScoreStore;
let Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;
let APIUtil = window.Viewer.util.APIUtil;
let FocusUtil = window.ObojoboDraft.Common.util.FocusUtil;
let NavStore = window.Viewer.stores.NavStore;

//@TODO: Is this valid?
OboModel.models.test = {
	getRoot: () => {}
}

// Stop the NavStore from listening to score:set since we're
// not interested in testing NavStore here.
Dispatcher.off('score:set', null, NavStore)

describe('ScoreStore', () => {
	beforeEach(() => {
		ScoreStore.init()

		ScoreStore.triggerChange = jest.fn()
		APIUtil.postEvent = jest.fn()
		FocusUtil.unfocus = jest.fn()
	})

	it('should init state with an empty scores object and return it', () => {
		ScoreStore.init();

		expect(ScoreStore.getState()).toEqual({
			scores: {}
		})
	})

	it('should set state', () => {
		ScoreStore.setState({ x:1 })

		expect(ScoreStore.getState()).toEqual({ x:1 })
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
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({ id:'test', score:25 })
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
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({ id:'test', score:100 })
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
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({ id:'test' })
	})
})