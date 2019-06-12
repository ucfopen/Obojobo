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

	setData(id, context, key, value) {
		return Dispatcher.trigger('question:setData', {
			value: {
				context,
				key: id + ':' + key,
				value
			}
		})
	},

	clearData(id, context, key) {
		return Dispatcher.trigger('question:clearData', {
			value: {
				context,
				key: id + ':' + key
			}
		})
	},

	showExplanation(id, context) {
		return Dispatcher.trigger('question:showExplanation', {
			value: { id, context }
		})
	},

	hideExplanation(id, context, actor) {
		return Dispatcher.trigger('question:hideExplanation', {
			value: { id, context, actor }
		})
	},

	viewQuestion(id, context) {
		return Dispatcher.trigger('question:view', {
			value: {
				id,
				context
			}
		})
	},

	hideQuestion(id, context) {
		return Dispatcher.trigger('question:hide', {
			value: {
				id,
				context
			}
		})
	},

	submitResponse(id, context) {
		return Dispatcher.trigger('question:submitResponse', {
			value: {
				id,
				context
			}
		})
	},

	checkAnswer(id, context) {
		return Dispatcher.trigger('question:checkAnswer', {
			value: {
				id,
				context
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
	},

	getStateForContext(state, context) {
		return state.contexts[context] || null
	},

	getViewState(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		const id = model.get('id')

		if (contextState.viewing === id) {
			return 'active'
		}
		if (contextState.viewedQuestions[id]) {
			return 'viewed'
		}
		return 'hidden'
	},

	getResponse(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		return contextState.responses[model.get('id')] || null
	},

	getData(state, model, context, key) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		return contextState.data[model.get('id') + ':' + key] || false
	},

	isShowingExplanation(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return false

		return contextState.data[model.get('id') + ':showingExplanation'] || false
	},

	getScoreForModel(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		const scoreItem = contextState.scores[model.get('id')] || null

		return scoreItem === null ? null : scoreItem.score
	}
}

export default QuestionUtil
