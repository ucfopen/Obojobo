import Common from 'Common'

import QuestionResponseSendStates from '../stores/question-store/question-response-send-states'

const { Dispatcher } = Common.flux

const QuestionUtil = {
	setResponse(
		id,
		response,
		targetId,
		context,
		assessmentId,
		attemptId,
		sendResponseImmediately = true
	) {
		return Dispatcher.trigger('question:setResponse', {
			value: {
				id,
				response,
				targetId,
				context,
				assessmentId,
				attemptId,
				sendResponseImmediately
			}
		})
	},

	sendResponse(id, context) {
		return Dispatcher.trigger('question:sendResponse', {
			value: {
				id,
				context
			}
		})
	},

	forceSendAllResponsesForContext(context) {
		return Dispatcher.trigger('question:forceSendAllResponses', {
			value: {
				context
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

	revealAnswer(id, context) {
		return Dispatcher.trigger('question:revealAnswer', {
			value: {
				id,
				context
			}
		})
	},

	setScore(itemId, score, details, feedbackText, detailedText, context) {
		return Dispatcher.trigger('question:scoreSet', {
			value: {
				itemId,
				score,
				details,
				feedbackText,
				detailedText,
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

	hasResponse(state, model, context) {
		return QuestionUtil.getResponse(state, model, context) !== null
	},

	isResponseEmpty(state, model, context) {
		const response = QuestionUtil.getResponse(state, model, context)
		if (!response) return false

		// Get the assessment model
		const assessmentModel = model.children.at(model.children.length - 1)

		const componentClass = assessmentModel.getComponentClass()
		if (!componentClass) return false

		return componentClass.isResponseEmpty(response)
	},

	isAnswerRevealed(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return false

		return contextState.revealedQuestions[model.get('id')] || false
	},

	isScored(state, model, context) {
		return QuestionUtil.getScoreForModel(state, model, context) !== null
	},

	hasUnscoredResponse(state, model, context) {
		return (
			QuestionUtil.hasResponse(state, model, context) &&
			!QuestionUtil.isScored(state, model, context)
		)
	},

	getResponseMetadata(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		return contextState.responseMetadata[model.get('id')] || null
	},

	getResponseSendState(state, model, context) {
		const responseMetadata = QuestionUtil.getResponseMetadata(state, model, context)
		if (!responseMetadata) return null

		return responseMetadata.sendState || null
	},

	isResponseRecorded(state, model, context) {
		return (
			QuestionUtil.getResponseSendState(state, model, context) ===
			QuestionResponseSendStates.RECORDED
		)
	},

	getData(state, model, context, key) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		return contextState.data[model.get('id') + ':' + key] || null
	},

	isShowingExplanation(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return false

		return contextState.data[model.get('id') + ':showingExplanation'] || false
	},

	getScoreDataForModel(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		const scoreItem = contextState.scores[model.get('id')] || null

		return scoreItem || null
	},

	getScoreForModel(state, model, context) {
		const scoreData = QuestionUtil.getScoreDataForModel(state, model, context)
		return scoreData ? scoreData.score : null
	},

	getFeedbackTextForModel(state, model, context) {
		const scoreData = QuestionUtil.getScoreDataForModel(state, model, context)
		return scoreData ? scoreData.feedbackText : null
	},

	getDetailedTextForModel(state, model, context) {
		const scoreData = QuestionUtil.getScoreDataForModel(state, model, context)
		return scoreData ? scoreData.detailedText : null
	}
}

export default QuestionUtil
