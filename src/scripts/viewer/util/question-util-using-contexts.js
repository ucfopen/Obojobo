import Common from 'Common'

let { Dispatcher } = Common.flux
let { OboModel } = Common.models

let QuestionUtil = {
	//@TODO: Should this have assessmentId, attemptId here?
	setResponse(id, context, response, targetId, assessmentId, attemptId) {
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
				key: id + ':' + key,
				context,
				value
			}
		})
	},

	clearData(id, context, key) {
		return Dispatcher.trigger('question:clearData', {
			value: {
				key: id + ':' + key,
				context
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

	//@TODO: This method is bad and you should feel bad:
	//Views questions but quietly, not triggering APIUtil post event.
	//Doesn't trigger a change!
	setQuestionAsViewed(state, id) {
		state.viewedQuestions[id] = true
	},

	hideQuestion(id, context) {
		return Dispatcher.trigger('question:hide', {
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

	getContextState(state, context) {
		return this.state.contexts[context] || null
	},

	getViewState(state, model, context) {
		let ctxState = this.getContextState(state, context)
		if (!ctxState) return null

		let modelId = model.get('id')

		if (ctxState.viewing === modelId) {
			return 'active'
		}
		if (ctxState.viewedQuestions[modelId]) {
			return 'viewed'
		}
		return 'hidden'
	},

	getResponse(state, model, context) {
		let ctxState = this.getContextState(state, context)
		if (!ctxState) return null

		return ctxState.responses[model.get('id')] || null
	},

	getData(state, model, context, key) {
		let ctxState = this.getContextState(state, context)
		if (!ctxState) return null

		return ctxState.data[model.get('id') + ':' + key] || false
	},

	isShowingExplanation(state, model, context) {
		let ctxState = this.getContextState(state, context)
		if (!ctxState) return null

		return ctxState.data[model.get('id') + ':showingExplanation'] || false
	},

	getScoreForModel(state, model, context) {
		let ctxState = this.getContextState(state, context)
		if (!ctxState) return null

		let scoreItem = ctxState.scores[model.get('id')]

		return scoreItem == null || scoreItem.score == null ? null : scoreItem.score
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
