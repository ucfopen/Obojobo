import Common from 'Common'

let { Dispatcher } = Common.flux
let { OboModel } = Common.models

let QuestionUtil = {
	setResponse(id, response, targetId) {
		return Dispatcher.trigger('question:setResponse', {
			value: {
				id,
				response,
				targetId
			}
		})
	},

	clearResponse(id) {
		return Dispatcher.trigger('question:clearResponse', {
			value: {
				id
			}
		})
	},

	setData(id, key, value) {
		return Dispatcher.trigger('question:setData', {
			value: {
				key: id + ':' + key,
				value
			}
		})
	},

	clearData(id, key) {
		return Dispatcher.trigger('question:clearData', {
			value: {
				key: id + ':' + key
			}
		})
	},

	showExplanation(id) {
		return Dispatcher.trigger('question:showExplanation', {
			value: { id }
		})
	},

	hideExplanation(id, asSystem) {
		return Dispatcher.trigger('question:hideExplanation', {
			value: { id }
		})
	},

	viewQuestion(id) {
		return Dispatcher.trigger('question:view', {
			value: {
				id
			}
		})
	},

	hideQuestion(id) {
		return Dispatcher.trigger('question:hide', {
			value: {
				id
			}
		})
	},

	checkAnswer(id) {
		return Dispatcher.trigger('question:checkAnswer', {
			value: {
				id
			}
		})
	},

	retryQuestion(id) {
		return Dispatcher.trigger('question:retry', {
			value: {
				id
			}
		})
	},

	getViewState(state, model) {
		let modelId = model.get('id')

		if (state.viewing === modelId) {
			return 'active'
		}
		if (state.viewedQuestions[modelId]) {
			return 'viewed'
		}
		return 'hidden'
	},

	getResponse(state, model) {
		return state.responses[model.get('id')] || null
	},

	getData(state, model, key) {
		return state.data[model.get('id') + ':' + key] || false
	},

	isShowingExplanation(state, model) {
		return state.data[model.get('id') + ':showingExplanation'] || false
	}
}

export default QuestionUtil
