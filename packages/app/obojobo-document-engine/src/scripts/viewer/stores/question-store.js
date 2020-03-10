import Common from 'Common'

import APIUtil from '../util/api-util'
import QuestionUtil from '../util/question-util'
import FocusUtil from '../util/focus-util'

import NavStore from '../stores/nav-store'

import QuestionResponseSendStates from './question-store/question-response-send-states'

const { Store } = Common.flux
const { Dispatcher } = Common.flux
const { OboModel } = Common.models
const { uuid, timeoutPromise } = Common.util

// const SET_RESPONSE_EVENT_SEND_DELAY_MS = 4750
const SEND_RESPONSE_TIMEOUT_MS = 6000

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
		let model
		super('questionStore')

		Dispatcher.on({
			'question:forceSendAllResponses': payload => {
				const { context } = payload.value

				const contextState = this.getContextState(context)
				if (!contextState) return

				const sendingResponsePromises = Object.values(contextState.sendingResponsePromises)

				const sendErrorResponsesPromises = Object.values(contextState.responseMetadata)
					.filter(responseMetadata => {
						return responseMetadata.sendState === QuestionResponseSendStates.ERROR
					})
					.map(responseMetadata => {
						return this.sendResponse(responseMetadata.details.questionId, context)
					})

				const promises = sendingResponsePromises.concat(sendErrorResponsesPromises)

				timeoutPromise(
					SEND_RESPONSE_TIMEOUT_MS,
					Promise.all(promises)
						.then(() => {
							Dispatcher.trigger('question:forceSentAllResponses', {
								value: { context, success: true }
							})
						})
						.catch(() => {
							Dispatcher.trigger('question:forceSentAllResponses', {
								value: { context, success: false }
							})
						})
				)
			},
			'question:sendResponse': payload => {
				const { context, id } = payload.value

				const contextState = this.getContextState(context)
				if (!contextState) return

				const responseMetadata = contextState.responseMetadata[id]
				if (!responseMetadata) return

				// // If force is false then we only want to re-sendResponse if the response
				// // is in an error state.
				// if (!force && responseMetadata.sendState !== QuestionResponseSendStates.ERROR) {
				// 	return
				// }

				const sendResponsePromise = this.sendResponse(id, context)

				responseMetadata.sendState = QuestionResponseSendStates.SENDING
				contextState.sendingResponsePromises[id] = sendResponsePromise

				timeoutPromise(SEND_RESPONSE_TIMEOUT_MS, sendResponsePromise)

				// APIUtil.postEvent({
				// 	draftId: OboModel.getRoot().get('draftId'),
				// 	action: 'question:setResponse',
				// 	eventVersion: '2.2.0',
				// 	visitId: NavStore.getState().visitId,
				// 	payload: responseMetadata.details,
				// 	actorTime: responseMetadata.time
				// }).then(result => {
				// 	if (result.response.status === 'ok') {
				// 		Dispatcher.trigger('question:responseSet', result.sent.event.payload)

				// 		const contextState = this.getOrCreateContextState(context)

				// 		contextState.responseMetadata[id].sendState = QuestionResponseSendStates.RECORDED
				// 	} else {
				// 		contextState.responseMetadata[id].sendState = QuestionResponseSendStates.ERROR
				// 	}

				// 	this.triggerChange()
				// })

				this.triggerChange()
			},

			'question:setResponse': payload => {
				console.log('q:sR', payload)
				const {
					context,
					id,
					response,
					targetId,
					assessmentId,
					attemptId,
					sendResponseImmediately
				} = payload.value
				const questionId = id
				// const contextState = this.getOrCreateContextState(context)

				this.setResponse({
					questionId,
					response,
					targetId,
					context,
					assessmentId,
					attemptId,
					sendResponseImmediately
				})

				if (sendResponseImmediately) {
					QuestionUtil.sendResponse(id, context)
				}

				// contextState.responses[questionId] = response
				// contextState.responseTimes[questionId] = new Date()
				// contextState.responseSendState[questionId] = QuestionResponseSendStates.NOT_SENT

				// console.log('SR', payload)

				// if (debounce) {
				// 	APIUtil.debouncedPostEvent(
				// 		SET_RESPONSE_EVENT_SEND_DELAY_MS,
				// 		() => {
				// 			contextState.responseSendState[questionId] = QuestionResponseSendStates.SENDING
				// 			this.triggerChange()
				// 		},
				// 		{
				// 			draftId: OboModel.getRoot().get('draftId'),
				// 			action: 'question:setResponse',
				// 			eventVersion: '2.2.0',
				// 			visitId: NavStore.getState().visitId,
				// 			payload: {
				// 				questionId,
				// 				response,
				// 				targetId,
				// 				context,
				// 				assessmentId,
				// 				attemptId,
				// 				debounce
				// 			}
				// 		},
				// 		result => {
				// 			if (result.response.status === 'ok') {
				// 				Dispatcher.trigger('question:responseSet', result.sent.event.payload)

				// 				const contextState = this.getOrCreateContextState(context)

				// 				contextState.responseSendState[questionId] = QuestionResponseSendStates.RECORDED
				// 			} else {
				// 				contextState.responseSendState[questionId] = QuestionResponseSendStates.ERROR
				// 			}

				// 			this.triggerChange()
				// 		}
				// 	)
				// } else {
				// 	APIUtil.postEvent({
				// 		draftId: OboModel.getRoot().get('draftId'),
				// 		action: 'question:setResponse',
				// 		eventVersion: '2.2.0',
				// 		visitId: NavStore.getState().visitId,
				// 		payload: {
				// 			questionId,
				// 			response,
				// 			targetId,
				// 			context,
				// 			assessmentId,
				// 			attemptId,
				// 			debounce
				// 		}
				// 	}).then(result => {
				// 		if (result.response.status === 'ok') {
				// 			Dispatcher.trigger('question:responseSet', result.sent.event.payload)

				// 			const contextState = this.getOrCreateContextState(context)

				// 			contextState.responseSendState[questionId] = QuestionResponseSendStates.RECORDED
				// 		} else {
				// 			contextState.responseSendState[questionId] = QuestionResponseSendStates.ERROR
				// 		}

				// 		this.triggerChange()
				// 	})
				// }

				this.triggerChange()
			},

			'question:clearResponse': payload => {
				if (!this.clearResponse(payload.value.id, payload.value.context)) return
				this.triggerChange()
			},

			'assessment:endAttempt': payload => {
				if (!this.clearResponse(payload.value.id, payload.value.context)) return
				this.triggerChange()
			},

			'question:setData': payload => {
				const { context, key, value } = payload.value
				const contextState = this.getOrCreateContextState(context)

				contextState.data[key] = value
				this.triggerChange()
			},

			'question:showExplanation': payload => {
				const { id, context } = payload.value
				const root = OboModel.getRoot()
				APIUtil.postEvent({
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
			},

			'question:hideExplanation': payload => {
				const { id, context, actor } = payload.value
				const root = OboModel.getRoot()

				APIUtil.postEvent({
					draftId: root.get('draftId'),
					action: 'question:hideExplanation',
					eventVersion: '1.1.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId: id,
						actor
					}
				})

				QuestionUtil.clearData(id, context, 'showingExplanation')
			},

			'question:clearData': payload => {
				const { context, key } = payload.value

				if (!this.hasContextState(context)) return

				const contextState = this.getOrCreateContextState(context)

				delete contextState.data[key]
				this.triggerChange()
			},

			'question:hide': payload => {
				const { id, context } = payload.value

				if (!this.hasContextState(context)) return

				const contextState = this.getOrCreateContextState(context)

				APIUtil.postEvent({
					draftId: OboModel.models[id].getRoot().get('draftId'),
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

				this.triggerChange()
			},

			'question:view': payload => {
				const { id, context } = payload.value
				const contextState = this.getOrCreateContextState(context)
				const root = OboModel.models[id].getRoot()

				APIUtil.postEvent({
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

				this.triggerChange()
			},

			'question:checkAnswer': payload => {
				const { id, context } = payload.value
				const questionModel = OboModel.models[id]
				const root = questionModel.getRoot()

				if (!this.hasContextState(context)) return

				const contextState = this.getOrCreateContextState(context)
				const scoreInfo = contextState.scores[id]

				APIUtil.postEvent({
					draftId: root.get('draftId'),
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
			},

			'question:submitResponse': payload => {
				const { id, context } = payload.value
				const questionModel = OboModel.models[id]
				const root = questionModel.getRoot()

				if (!this.hasContextState(context)) return

				const contextState = this.getOrCreateContextState(context)

				APIUtil.postEvent({
					draftId: root.get('draftId'),
					action: 'question:submitResponse',
					eventVersion: '1.0.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId: id,
						context,
						response: contextState.responses[id]
					}
				})
			},

			'question:retry': payload => {
				const { id, context } = payload.value
				const questionModel = OboModel.models[id]
				const root = questionModel.getRoot()

				// if (!this.clearResponses(id, context)) return

				const contextState = this.getOrCreateContextState(context)

				// contextState.responses[id] = response
				this.clearResponse(id, context)
				delete contextState.revealedQuestions[id]

				this.triggerChange()

				APIUtil.postEvent({
					draftId: root.get('draftId'),
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
			},

			'question:revealAnswer': payload => {
				const { context, id } = payload.value
				const questionId = id
				const contextState = this.getOrCreateContextState(context)

				contextState.revealedQuestions[id] = true

				// contextState.responses[questionId] = response

				// QuestionUtil.setScore(questionId, 100, 'Answer Revealed', null, context)

				this.triggerChange()

				APIUtil.postEvent({
					draftId: OboModel.getRoot().get('draftId'),
					action: 'question:revealAnswer',
					eventVersion: '1.0.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId,
						context
					}
				})
			},

			'question:scoreSet': payload => {
				const scoreId = uuid()
				const { itemId, context, score, details, feedbackText, detailedText } = payload.value

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

				this.triggerChange()

				// Skip sending an event if this is an explicit non-scored result
				if (score === 'no-score') {
					return
				}

				model = OboModel.models[itemId]
				APIUtil.postEvent({
					draftId: model.getRoot().get('draftId'),
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
			},

			'question:scoreClear': payload => {
				const { itemId, context } = payload.value

				if (!this.hasContextState(context)) return

				const contextState = this.getOrCreateContextState(context)

				const scoreItem = contextState.scores[itemId]

				model = OboModel.models[scoreItem.itemId]

				delete contextState.scores[payload.value.itemId]
				this.triggerChange()

				// Skip sending an event if this is an explicit non-scored result
				if (scoreItem.score === 'no-score') {
					return
				}

				APIUtil.postEvent({
					draftId: model.getRoot().get('draftId'),
					action: 'question:scoreClear',
					eventVersion: '1.0.0',
					visitId: NavStore.getState().visitId,
					payload: scoreItem
				})
			},

			'nav:setContext': payload => {
				// When a new context is created by the nav go ahead and start
				// a new context in our store (if it doesn't exist already)
				this.getOrCreateContextState(payload.value.context)
			}
		})
	}

	sendResponse(id, context) {
		const contextState = this.getContextState(context)
		const responseMetadata = contextState.responseMetadata[id]

		return APIUtil.postEvent({
			draftId: OboModel.getRoot().get('draftId'),
			action: 'question:setResponse',
			eventVersion: '2.2.0',
			visitId: NavStore.getState().visitId,
			payload: responseMetadata.details,
			actorTime: responseMetadata.time
		})
			.then(result => {
				// if (result.response.status === 'ok') {
				// 	contextState.responseMetadata[id].sendState = QuestionResponseSendStates.RECORDED
				// } else {
				// 	contextState.responseMetadata[id].sendState = QuestionResponseSendStates.ERROR
				// }

				const successful = result.response.status === 'ok'
				// const successful = Math.random() > 0.5

				contextState.responseMetadata[id].sendState = successful
					? QuestionResponseSendStates.RECORDED
					: QuestionResponseSendStates.ERROR

				delete contextState.sendingResponsePromises[id]

				Dispatcher.trigger('question:responseSent', {
					successful,
					id
				})

				this.triggerChange()
			})
			.catch(e => {
				console.error('ERROR', e)

				delete contextState.sendingResponsePromises[id]
				contextState.responseMetadata[id].sendState = QuestionResponseSendStates.ERROR
				// delete contextState.responses[id]

				Dispatcher.trigger('question:responseSent', {
					successful: false,
					id
				})

				this.triggerChange()
			})
	}

	setResponse({
		questionId,
		response,
		targetId,
		context,
		assessmentId,
		attemptId,
		sendResponseImmediately
	}) {
		if (!this.hasContextState(context)) return false

		const contextState = this.getOrCreateContextState(context)
		contextState.responses[questionId] = response
		contextState.responseMetadata[questionId] = {
			time: new Date(),
			sendState: QuestionResponseSendStates.NOT_SENT,
			details: {
				questionId,
				response,
				targetId,
				context,
				assessmentId,
				attemptId,
				sendResponseImmediately
			}
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
