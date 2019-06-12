import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'
import QuestionUtil from '../../viewer/util/question-util'
import FocusUtil from '../../viewer/util/focus-util'

import NavStore from '../../viewer/stores/nav-store'

const { Store } = Common.flux
const { Dispatcher } = Common.flux
const { OboModel } = Common.models
const { uuid } = Common.util

const getNewContextState = () => {
	return {
		viewing: null,
		viewedQuestions: {},
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
				const { context, id } = payload.value
				const contextState = this.getOrCreateContextState(context)

				contextState.responses[id] = payload.value.response

				this.triggerChange()

				APIUtil.postEvent({
					draftId: OboModel.getRoot().get('draftId'),
					action: 'question:setResponse',
					eventVersion: '2.1.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId: id,
						response: payload.value.response,
						targetId: payload.value.targetId,
						context,
						assessmentId: payload.value.assessmentId,
						attemptId: payload.value.attemptId
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
				console.log('sd2', context)
				const contextState = this.getOrCreateContextState(context)

				contextState.data[key] = value
				this.triggerChange()
			},

			'question:showExplanation': payload => {
				const { id, context } = payload.value
				const root = OboModel.models[id].getRoot()

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
				const root = OboModel.models[id].getRoot()

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
				const { id, context } = payload.value
				const questionModel = OboModel.models[id]
				const root = questionModel.getRoot()

				if (!this.clearResponses(id, context)) return

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

			'question:scoreSet': payload => {
				const scoreId = uuid()
				const { itemId, context, score } = payload.value

				const contextState = this.getOrCreateContextState(context)

				contextState.scores[itemId] = {
					id: scoreId,
					score,
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
					eventVersion: '1.0.0',
					visitId: NavStore.getState().visitId,
					payload: {
						id: scoreId,
						itemId: itemId,
						score: score,
						context: context
					}
				})
			},

			'question:scoreClear': payload => {
				const { itemId, context } = payload.value
				// const questionModel = OboModel.models[id]
				// const root = questionModel.getRoot()

				if (!this.state.contexts[context]) return
				////////
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
