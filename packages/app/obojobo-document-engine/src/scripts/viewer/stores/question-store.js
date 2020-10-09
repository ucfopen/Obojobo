import Common from 'Common'

import ViewerAPI from '../util/viewer-api'
import QuestionUtil from '../util/question-util'
import FocusUtil from '../util/focus-util'

import NavStore from '../stores/nav-store'

import QuestionResponseSendStates from './question-store/question-response-send-states'

const { Store } = Common.flux
const { Dispatcher } = Common.flux
const { OboModel } = Common.models
const { uuid, timeoutPromise } = Common.util

const SEND_RESPONSE_TIMEOUT_MS = 15000

const getNewContextState = () => {
	return {
		viewing: null,
		viewedQuestions: {},
		revealedQuestions: {},
		scores: {},
		responses: {},
		responseMetadata: {},
		sendingResponsePromises: {},
		data: {}
	}
}

class QuestionStore extends Store {
	constructor() {
		super('questionStore')

		Dispatcher.on({
			'question:forceSendAllResponses': payload => {
				this.forceSendAllResponses(payload.value)
			},

			'question:sendResponse': payload => {
				this.sendResponse(payload.value).then(() => {
					this.triggerChange()
				})
			},

			'question:setResponse': payload => {
				if (!this.setResponse(payload.value)) return
				this.triggerChange()
			},

			'question:clearResponse': payload => {
				if (!this.clearResponse(payload.value.id, payload.value.context)) return
				this.triggerChange()
			},

			'question:setData': payload => {
				this.setData(payload.value)
				this.triggerChange()
			},

			'question:showExplanation': payload => {
				this.showExplanation(payload.value)
				this.triggerChange()
			},

			'question:hideExplanation': payload => {
				this.hideExplanation(payload.value)
				this.triggerChange()
			},

			'question:clearData': payload => {
				if (!this.clearData(payload.value)) return
				this.triggerChange()
			},

			'question:hide': payload => {
				if (!this.hide(payload.value)) return
				this.triggerChange()
			},

			'question:view': payload => {
				this.view(payload.value)
				this.triggerChange()
			},

			'question:checkAnswer': payload => {
				if (!this.checkAnswer(payload.value)) return
				this.triggerChange()
			},

			'question:submitResponse': payload => {
				if (!this.submitResponse(payload.value)) return
				this.triggerChange()
			},

			'question:retry': payload => {
				if (!this.retry(payload.value)) return
				this.triggerChange()
			},

			'question:revealAnswer': payload => {
				if (!this.revealAnswer(payload.value)) return
				this.triggerChange()
			},

			'question:scoreSet': payload => {
				if (!this.scoreSet(payload.value)) return
				this.triggerChange()
			},

			'question:scoreClear': payload => {
				if (!this.scoreClear(payload.value)) return
				this.triggerChange()
			},

			'assessment:endAttempt': payload => {
				if (!this.clearResponse(payload.value.id, payload.value.context)) return
				this.triggerChange()
			},

			'nav:setContext': payload => {
				// When a new context is created by the nav go ahead and start
				// a new context in our store (if it doesn't exist already)
				this.getOrCreateContextState(payload.value.context)
			}
		})
	}

	onPostResponseSuccess(responseStatus, contextState, id) {
		// If the sendState isn't 'sending' then we may have already timed out. In this case
		// we ignore the result
		if (contextState.responseMetadata[id].sendState !== QuestionResponseSendStates.SENDING) {
			return false
		}

		const isResponseOk = responseStatus === 'ok'

		contextState.responseMetadata[id].sendState = isResponseOk
			? QuestionResponseSendStates.RECORDED
			: QuestionResponseSendStates.ERROR

		delete contextState.sendingResponsePromises[id]

		Dispatcher.trigger('question:responseSent', {
			success: isResponseOk,
			id
		})

		this.triggerChange()

		return isResponseOk
	}

	onPostResponseError(contextState, id) {
		console.log('onPostResponseError', contextState, id)
		delete contextState.sendingResponsePromises[id]
		contextState.responseMetadata[id].sendState = QuestionResponseSendStates.ERROR

		Dispatcher.trigger('question:responseSent', {
			successful: false,
			id
		})

		this.triggerChange()

		return false
	}

	getPostResponsePromises(context) {
		const contextState = this.getContextState(context)
		if (!contextState) return null

		const sendingResponsePromises = Object.values(contextState.sendingResponsePromises)
		const sendErrorResponsesPromises = Object.values(contextState.responseMetadata)
			.filter(responseMetadata => {
				return (
					responseMetadata.sendState === QuestionResponseSendStates.ERROR ||
					responseMetadata.sendState === QuestionResponseSendStates.NOT_SENT
				)
			})
			.map(responseMetadata => {
				return this.postResponse(responseMetadata.details.questionId, context)
			})

		return [...sendingResponsePromises, ...sendErrorResponsesPromises]
	}

	// Sends all un-recorded responses for a given context
	forceSendAllResponses({ context }) {
		const promises = this.getPostResponsePromises(context)
		if (!promises) return false

		return timeoutPromise(SEND_RESPONSE_TIMEOUT_MS, Promise.all(promises))
			.then(values => {
				Dispatcher.trigger('question:forceSentAllResponses', {
					value: { context, success: values.length === 0 || values.every(v => v), error: null }
				})

				return true
			})
			.catch(e => {
				console.error('Unable to send all responses', e)
				Dispatcher.trigger('question:forceSentAllResponses', {
					value: { context, success: false, error: e.message }
				})

				return true
			})
	}

	sendResponse({ context, id }) {
		const contextState = this.getContextState(context)
		if (!contextState) return false

		const responseMetadata = contextState.responseMetadata[id]
		if (!responseMetadata) return false

		console.log('send response', id, context)

		const postResponsePromise = this.postResponse(id, context)

		contextState.sendingResponsePromises[id] = postResponsePromise

		// return timeoutPromise(SEND_RESPONSE_TIMEOUT_MS, postResponsePromise).catch(e => {
		// 	// eslint-disable-next-line no-console
		// 	console.error(e)

		// 	return this.onPostResponseError(contextState, id)
		// })
		return postResponsePromise
	}

	postResponse(id, context) {
		const contextState = this.getContextState(context)
		const responseMetadata = contextState.responseMetadata[id]

		contextState.responseMetadata[id].sendState = QuestionResponseSendStates.SENDING

		return ViewerAPI.postEvent({
			draftId: OboModel.getRoot().get('draftId'),
			action: 'question:setResponse',
			eventVersion: '2.2.0',
			visitId: NavStore.getState().visitId,
			payload: responseMetadata.details,
			actorTime: responseMetadata.time
		})
			.then(result => {
				return this.onPostResponseSuccess(result.status, contextState, id)
			})
			.catch(e => {
				return this.onPostResponseError(e, contextState, id)
			})
	}

	setResponse({
		id,
		response,
		targetId,
		context,
		assessmentId,
		attemptId,
		sendResponseImmediately
	}) {
		if (!this.hasContextState(context)) return false

		const contextState = this.getOrCreateContextState(context)
		contextState.responses[id] = response
		contextState.responseMetadata[id] = {
			time: new Date(),
			sendState: QuestionResponseSendStates.NOT_SENT,
			details: {
				questionId: id,
				response,
				targetId,
				context,
				assessmentId,
				attemptId,
				sendResponseImmediately
			}
		}

		if (sendResponseImmediately) {
			QuestionUtil.sendResponse(id, context)
		}

		return true
	}

	clearResponse(questionId, context) {
		if (!this.hasContextState(context)) return false

		const contextState = this.getOrCreateContextState(context)
		delete contextState.responses[questionId]
		delete contextState.responseMetadata[questionId]

		return true
	}

	setData({ context, key, value }) {
		const contextState = this.getOrCreateContextState(context)
		contextState.data[key] = value
	}

	showExplanation({ id, context }) {
		const root = OboModel.getRoot()
		ViewerAPI.postEvent({
			draftId: root.get('draftId'),
			action: 'question:showExplanation',
			eventVersion: '1.1.0',
			visitId: NavStore.getState().visitId,
			payload: {
				questionId: id,
				context
			}
		})

		QuestionUtil.setData(id, context, 'showingExplanation', true)
	}

	hideExplanation({ id, context, actor }) {
		const root = OboModel.getRoot()

		ViewerAPI.postEvent({
			draftId: root.get('draftId'),
			action: 'question:hideExplanation',
			eventVersion: '1.2.0',
			visitId: NavStore.getState().visitId,
			payload: {
				questionId: id,
				context,
				actor
			}
		})

		QuestionUtil.clearData(id, context, 'showingExplanation')
	}

	clearData({ context, key }) {
		if (!this.hasContextState(context)) return false

		delete this.getOrCreateContextState(context).data[key]

		return true
	}

	hide({ id, context }) {
		if (!this.hasContextState(context)) return false

		const contextState = this.getOrCreateContextState(context)

		ViewerAPI.postEvent({
			draftId: OboModel.getRoot().get('draftId'),
			action: 'question:hide',
			eventVersion: '1.1.0',
			visitId: NavStore.getState().visitId,
			payload: {
				questionId: id,
				context
			}
		})

		delete contextState.viewedQuestions[id]
		delete contextState.revealedQuestions[id]
		if (contextState.viewing === id) {
			contextState.viewing = null
		}

		return true
	}

	view({ id, context }) {
		const contextState = this.getOrCreateContextState(context)
		const root = OboModel.getRoot()

		ViewerAPI.postEvent({
			draftId: root.get('draftId'),
			action: 'question:view',
			eventVersion: '1.1.0',
			visitId: NavStore.getState().visitId,
			payload: {
				questionId: id,
				context
			}
		})

		contextState.viewedQuestions[id] = true
		contextState.viewing = id
	}

	checkAnswer({ id, context }) {
		if (!this.hasContextState(context)) return false

		const contextState = this.getOrCreateContextState(context)
		const scoreInfo = contextState.scores[id]

		ViewerAPI.postEvent({
			draftId: OboModel.getRoot().get('draftId'),
			action: 'question:checkAnswer',
			eventVersion: '1.1.0',
			visitId: NavStore.getState().visitId,
			payload: {
				questionId: id,
				context,
				response: contextState.responses[id],
				scoreId: scoreInfo.id,
				score: scoreInfo.score
			}
		})

		return true
	}

	submitResponse({ id, context }) {
		if (!this.hasContextState(context)) return false

		const contextState = this.getOrCreateContextState(context)

		ViewerAPI.postEvent({
			draftId: OboModel.getRoot().get('draftId'),
			action: 'question:submitResponse',
			eventVersion: '1.0.0',
			visitId: NavStore.getState().visitId,
			payload: {
				questionId: id,
				context,
				response: contextState.responses[id]
			}
		})

		return true
	}

	retry({ id, context }) {
		if (!this.hasContextState(context)) return false

		const questionModel = OboModel.models[id]
		const contextState = this.getOrCreateContextState(context)

		this.clearResponse(id, context)
		delete contextState.revealedQuestions[id]

		this.triggerChange()

		ViewerAPI.postEvent({
			draftId: OboModel.getRoot().get('draftId'),
			action: 'question:retry',
			eventVersion: '1.1.0',
			visitId: NavStore.getState().visitId,
			payload: {
				questionId: id,
				context
			}
		})

		if (QuestionUtil.isShowingExplanation(this.state, questionModel, context)) {
			QuestionUtil.hideExplanation(id, context, 'viewerClient')
		}

		QuestionUtil.clearScore(id, context)

		return true
	}

	revealAnswer({ context, id }) {
		if (!this.hasContextState(context)) return false

		const questionId = id
		const contextState = this.getOrCreateContextState(context)

		contextState.revealedQuestions[id] = true

		ViewerAPI.postEvent({
			draftId: OboModel.getRoot().get('draftId'),
			action: 'question:revealAnswer',
			eventVersion: '1.0.0',
			visitId: NavStore.getState().visitId,
			payload: {
				questionId,
				context
			}
		})

		return true
	}

	scoreSet({ itemId, context, score, details, feedbackText, detailedText }) {
		if (!this.hasContextState(context)) return false

		const scoreId = uuid()
		const contextState = this.getOrCreateContextState(context)

		contextState.scores[itemId] = {
			id: scoreId,
			score,
			details,
			feedbackText,
			detailedText,
			itemId
		}

		if (score === 100 || score === 'no-score') {
			FocusUtil.clearFadeEffect()
		}

		// Skip sending an event if this is an explicit non-scored result
		if (score !== 'no-score') {
			ViewerAPI.postEvent({
				draftId: OboModel.getRoot().get('draftId'),
				action: 'question:scoreSet',
				eventVersion: '1.1.0',
				visitId: NavStore.getState().visitId,
				payload: {
					id: scoreId,
					itemId: itemId,
					score: score,
					details: details,
					context: context
				}
			})
		}

		return true
	}

	scoreClear({ itemId, context }) {
		if (!this.hasContextState(context)) return false

		const contextState = this.getOrCreateContextState(context)
		const scoreItem = contextState.scores[itemId]

		delete contextState.scores[itemId]
		this.triggerChange()

		// Skip sending an event if this is an explicit non-scored result
		if (scoreItem.score !== 'no-score') {
			ViewerAPI.postEvent({
				draftId: OboModel.getRoot().get('draftId'),
				action: 'question:scoreClear',
				eventVersion: '1.0.0',
				visitId: NavStore.getState().visitId,
				payload: scoreItem
			})
		}

		return true
	}

	init() {
		this.state = {
			contexts: {
				practice: getNewContextState()
			}
		}
	}

	getContextState(context) {
		return this.state.contexts[context] || null
	}

	hasContextState(context) {
		return this.getContextState(context) !== null
	}

	getOrCreateContextState(context) {
		let contextState = this.getContextState(context)

		if (!contextState) {
			contextState = getNewContextState()
			this.state.contexts[context] = contextState
		}

		return contextState
	}

	updateStateByContext(stateToUpdate, context) {
		const contextState = this.getOrCreateContextState(context)
		Object.keys(stateToUpdate).forEach(k => {
			contextState[k] = stateToUpdate[k]
		})
	}

	getState() {
		return this.state
	}

	setState(newState) {
		this.state = newState
	}
}

const questionStore = new QuestionStore()

export default questionStore
