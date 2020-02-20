import Common from 'Common'

import APIUtil from '../util/api-util'
import QuestionUtil from '../util/question-util'
import FocusUtil from '../util/focus-util'

import NavStore from '../stores/nav-store'

const { Store } = Common.flux
const { Dispatcher } = Common.flux
const { OboModel } = Common.models
const { uuid, debounce } = Common.util

const SET_RESPONSE_EVENT_SEND_DELAY_MS = 750

const getNewContextState = () => {
	return {
		viewing: null,
		viewedQuestions: {},
		revealedQuestions: {},
		scores: {},
		responses: {},
		data: {}
	}
}

class QuestionStore extends Store {
	constructor() {
		let model
		super('questionStore')

		Dispatcher.on({
			'question:setResponse': payload => {
				const { context, id, response, targetId, assessmentId, attemptId } = payload.value
				const questionId = id
				const contextState = this.getOrCreateContextState(context)

				contextState.responses[questionId] = response

				this.triggerChange()

				APIUtil.debouncedPostEvent(SET_RESPONSE_EVENT_SEND_DELAY_MS, {
					draftId: OboModel.getRoot().get('draftId'),
					action: 'question:setResponse',
					eventVersion: '2.1.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId,
						response,
						targetId,
						context,
						assessmentId,
						attemptId
					}
				})
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

				if (!this.state.contexts[context]) return

				const contextState = this.getOrCreateContextState(context)

				delete contextState.data[key]
				this.triggerChange()
			},

			'question:hide': payload => {
				const { id, context } = payload.value

				if (!this.state.contexts[context]) return

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

				if (!this.state.contexts[context]) return

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

				if (!this.state.contexts[context]) return

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
				const { id, context, response } = payload.value
				const questionModel = OboModel.models[id]
				const root = questionModel.getRoot()

				// if (!this.clearResponses(id, context)) return

				const contextState = this.getOrCreateContextState(context)

				contextState.responses[id] = response
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

				if (!this.state.contexts[context]) return

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

	clearResponse(questionId, context) {
		if (!this.state.contexts[context]) return false

		const contextState = this.getOrCreateContextState(context)
		delete contextState.responses[questionId]

		return true
	}

	clearResponses(questionId, context) {
		if (!this.state.contexts[context]) return false

		const contextState = this.getOrCreateContextState(context)
		delete contextState.responses[questionId]

		return true
	}

	init() {
		this.state = {
			contexts: {
				practice: getNewContextState()
			}
		}
	}

	getOrCreateContextState(context) {
		if (!this.state.contexts[context]) {
			this.state.contexts[context] = getNewContextState()
		}

		return this.state.contexts[context]
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
