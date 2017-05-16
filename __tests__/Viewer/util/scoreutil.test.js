

//@TODO: Is this valid?


// OboModel.models.test = {
// 	getRoot: () => {}
// }


// Stop the NavStore from listening to score:set since we're
// not interested in testing NavStore here.



describe('ScoreUtil', () => {
	let originalOboModel = window.ObojoboDraft.Common.models.OboModel;
	let originalNavStore = window.Viewer.stores.NavStore;
	let originalDispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	let ScoreStore = window.Viewer.stores.ScoreStore;
	// let ScoreUtil = window.Viewer.util.ScoreUtil;
	let Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;
	let APIUtil = window.Viewer.util.APIUtil;

	beforeAll(() => {
		window.ObojoboDraft.Common.models.OboModel = {
			models: {
				test: {
					getRoot: () => {}
				}
			}
		}

		window.Viewer.stores.NavStore = {};


		Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher
	})

	afterAll(() => {
		window.ObojoboDraft.Common.models.OboModel = originalOboModel
		window.Viewer.stores.NavStore = originalNavStore;
		window.ObojoboDraft.Common.flux.Dispatcher = originalDispatcher;
	})

	beforeEach(() => {
		// window.ObojoboDraft.Common.flux.Dispatcher = {
		// 	trigger: jest.fn()
		// }

		ScoreStore.init()

		APIUtil.postEvent = jest.fn()
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

	it.only('should set scores', () => {
		window.ObojoboDraft.Common.flux.Dispatcher = {
			trigger: jest.fn()
		}

		// let ScoreUtil = window.Viewer.util.ScoreUtil
		let ScoreUtil = require('../../../src/scripts/node_modules/Viewer/util/scoreutil.coffee')
		ScoreUtil.setScore('test', 50)

		console.log(Dispatcher.trigger)

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