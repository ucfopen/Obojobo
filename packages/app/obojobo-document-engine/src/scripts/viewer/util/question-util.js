import Common from 'Common'

const { Dispatcher } = Common.flux

const QuestionUtil = {
	setResponse(id, response, targetId, context, assessmentId, attemptId) {
		return Dispatcher.trigger('question:setResponse', {
			value: {
				id,
				response,
				targetId,
				context,
				assessmentId,
				attemptId
			}
		})
	},

	clearResponse(id, context) {
		return Dispatcher.trigger('question:clearResponse', {
			value: {
				id,
				context
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

	hideExplanation(id, actor) {
		return Dispatcher.trigger('question:hideExplanation', {
			value: { id, actor }
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

	retryQuestion(id, context) {
		return Dispatcher.trigger('question:retry', {
			value: {
				id,
				context
			}
		})
	},

	getViewState(state, model) {
		const modelId = model.get('id')

		if (state.viewing === modelId) {
			return 'active'
		}
		if (state.viewedQuestions[modelId]) {
			return 'viewed'
		}
		return 'hidden'
	},

	getResponse(state, model, context) {
		if (!state.responses[context]) return null
		return state.responses[context][model.get('id')] || null
	},

	getData(state, model, key) {
		return state.data[model.get('id') + ':' + key] || false
	},

	isShowingExplanation(state, model) {
		return state.data[model.get('id') + ':showingExplanation'] || false
	},

	getScoreForModel(state, model, context) {
		let scoreItem
		if (state.scores[context] !== null && typeof state.scores[context] !== 'undefined') {
			scoreItem = state.scores[context][model.get('id')]
		}

		return scoreItem === null ||
			typeof scoreItem === 'undefined' ||
			scoreItem.score === null ||
			typeof scoreItem.score === 'undefined'
			? null
			: scoreItem.score
	},

	setScore(itemId, score, context) {
		return Dispatcher.trigger('question:scoreSet', {
			value: {
				itemId,
				score,
				context
			}
		})
	},

	clearScore(itemId, context) {
		return Dispatcher.trigger('question:scoreClear', {
			value: {
				itemId,
				context
			}
		})
	}
}

export default QuestionUtil
