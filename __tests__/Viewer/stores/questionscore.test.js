let OboModel = window.ObojoboDraft.Common.models.OboModel;
let QuestionStore = window.Viewer.stores.QuestionStore;
let APIUtil = window.Viewer.util.APIUtil;
let Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

//@TODO: Is this valid?
// OboModel.models.test = {
// 	getRoot: () => {}
// }

describe('QuestionStore', () => {
	beforeEach(() => {
		QuestionStore.init()

		QuestionStore.triggerChange = jest.fn()
		APIUtil.postEvent = jest.fn()
	})

	it('should init state with a specific structure and return it', () => {
		QuestionStore.init();

		expect(QuestionStore.getState()).toEqual({
			viewing: null,
			viewedQuestions: {},
			responses: {},
			data: {}
		})
	})

	it('should set state', () => {
		QuestionStore.setState({ x:1 })

		expect(QuestionStore.getState()).toEqual({ x:1 })
	})

	it('should record responses, trigger a change and post an event', () => {
		let questionModel = OboModel.create()

		// Dispatcher.trigger('question:recordResponse', {
		// 	value: {
		// 		id: 'test',
		// 		response: { customResponse:'responseValue' }
		// 	}
		// })

		// expect(QuestionStore.triggerChange).toHaveBeenCalled()
		// expect(APIUtil.postEvent).toHaveBeenCalled()
		// expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('question:recordResponse')
		// expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({
		// 	questionId: ,
		// 	responderId: 'test',
		// 	response: { customResponse:'responseValue' }
		// })
	})

	// it('should set a score, trigger a change and post a score:set event with a < 100 score', () => {
	// 	Dispatcher.trigger('score:set', {
	// 		value: {
	// 			id: 'test',
	// 			score: 25
	// 		}
	// 	})

	// 	expect(ScoreStore.triggerChange).toHaveBeenCalled()
	// 	expect(APIUtil.postEvent).toHaveBeenCalled()
	// 	expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('score:set')
	// 	expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({ id:'test', score:25 })
	// 	expect(FocusUtil.unfocus).not.toHaveBeenCalled()
	// 	expect(ScoreStore.getState()).toEqual({
	// 		scores: {
	// 			test: 25
	// 		}
	// 	})
	// })

	// it('should set a score, trigger a change, post a score:set event AND unfocus with a 100 score', () => {
	// 	Dispatcher.trigger('score:set', {
	// 		value: {
	// 			id: 'test',
	// 			score: 100
	// 		}
	// 	})

	// 	expect(ScoreStore.triggerChange).toHaveBeenCalled()
	// 	expect(APIUtil.postEvent).toHaveBeenCalled()
	// 	expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('score:set')
	// 	expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({ id:'test', score:100 })
	// 	expect(FocusUtil.unfocus).toHaveBeenCalled()
	// 	expect(ScoreStore.getState()).toEqual({
	// 		scores: {
	// 			test: 100
	// 		}
	// 	})
	// })

	// it('should clear scores, trigger a change and post a score:clear event', () => {
	// 	// Set a score for 'test' and 'test2'
	// 	ScoreStore.setState({
	// 		scores: {
	// 			test: 10,
	// 			test2: 20
	// 		}
	// 	})
	// 	expect(ScoreStore.getState()).toEqual({
	// 		scores: {
	// 			test: 10,
	// 			test2: 20
	// 		}
	// 	})

	// 	// Now clear the score for 'test' only and expect test2 to still exist
	// 	Dispatcher.trigger('score:clear', {
	// 		value: {
	// 			id: 'test'
	// 		}
	// 	})

	// 	expect(ScoreStore.triggerChange).toHaveBeenCalled()
	// 	expect(ScoreStore.getState()).toEqual({
	// 		scores: {
	// 			test2: 20
	// 		}
	// 	})
	// 	expect(APIUtil.postEvent).toHaveBeenCalled()
	// 	expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('score:clear')
	// 	expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({ id:'test' })
	// })
})