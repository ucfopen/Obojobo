import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'
import QuestionUtil from '../../viewer/util/question-util'

import UUID from '../../common/util/uuid'

let { Store } = Common.flux
let { Dispatcher } = Common.flux
let { OboModel } = Common.models
let { FocusUtil } = Common.util

let getNewContextObject = () => {
	return {
		viewedQuestions: {},
		scores: {},
		responses: {},
		data: {}
	}
}

class QuestionStore extends Store {
	constructor() {
		let id
		let model
		super('questionStore')

		Dispatcher.on({
			'question:setResponse': payload => {
				let id = payload.value.id
				let context = payload.value.context
				let model = OboModel.models[id]

				let ctxState = this.getOrCreateNewContextState(context)

				ctxState.responses[id] = payload.value.response

				this.triggerChange()

				APIUtil.postEvent(model.getRoot(), 'question:setResponse', '2.0.0', {
					questionId: id,
					response: payload.value.response,
					targetId: payload.value.targetId,
					context,
					assessmentId: payload.value.assessmentId,
					attemptId: payload.value.attemptId
				})
			},

			'question:clearResponse': payload => {
				// delete this.state.responses[payload.value.context][payload.value.id]
				this.clearResponses(payload.value.id, payload.value.context)

				return this.triggerChange()
			},

			'assessment:endAttempt': payload => {
				let ctxState = QuestionUtil.getContextState(this.state)
				if (!ctxState) return

				delete ctxState.responses[payload.value.id]

				return this.triggerChange()
			},

			'question:setData': payload => {
				let ctxState = this.getOrCreateNewContextState(payload.value.context)

				ctxState.data[payload.value.key] = payload.value.value

				return this.triggerChange()
			},

			'question:showExplanation': payload => {
				let root = OboModel.models[payload.value.id].getRoot()

				APIUtil.postEvent(root, 'question:showExplanation', '1.0.0', {
					questionId: payload.value.id
				})

				QuestionUtil.setData(payload.value.id, payload.value.context, 'showingExplanation', true)
			},

			'question:hideExplanation': payload => {
				let root = OboModel.models[payload.value.id].getRoot()

				APIUtil.postEvent(root, 'question:hideExplanation', '1.1.0', {
					questionId: payload.value.id,
					actor: payload.value.actor
				})

				QuestionUtil.clearData(payload.value.id, payload.value.context, 'showingExplanation')
			},

			'question:clearData': payload => {
				let ctxState = QuestionUtil.getContextState(payload.value.context)
				if (!ctxState) return

				delete ctxState.data[payload.value.key]

				return this.triggerChange()
			},

			'question:hide': payload => {
				let ctxState = QuestionUtil.getContextState(payload.value.context)
				if (!ctxState) return

				APIUtil.postEvent(OboModel.models[payload.value.id].getRoot(), 'question:hide', '1.0.0', {
					questionId: payload.value.id
				})

				delete ctxState.viewedQuestions[payload.value.id]
				if (this.state.viewing === payload.value.id) {
					this.state.viewing = null
				}

				return this.triggerChange()
			},

			'question:view': payload => {
				let ctxState = this.getOrCreateNewContextState(payload.value.context)
				let root = OboModel.models[payload.value.id].getRoot()

				APIUtil.postEvent(root, 'question:view', '1.0.0', {
					questionId: payload.value.id
				})

				ctxState.viewedQuestions[payload.value.id] = true
				this.state.viewing = payload.value.id

				return this.triggerChange()
			},

			'question:checkAnswer': payload => {
				let questionId = payload.value.id
				let questionModel = OboModel.models[questionId]
				let root = questionModel.getRoot()

				//@TODO - Up version docs
				APIUtil.postEvent(root, 'question:checkAnswer', '1.1.0', {
					questionId: payload.value.id,
					context: payload.value.context
				})
			},

			'question:retry': payload => {
				let questionId = payload.value.id
				let questionModel = OboModel.models[questionId]
				let root = questionModel.getRoot()

				this.clearResponses(questionId, payload.value.context)

				APIUtil.postEvent(root, 'question:retry', '1.0.0', {
					questionId: payload.value.id,
					context: payload.value.context
				})

				if (QuestionUtil.isShowingExplanation(this.state, questionModel, this.payload.context)) {
					QuestionUtil.hideExplanation(questionId, this.payload.context, 'viewerClient')
				}

				QuestionUtil.clearScore(questionId, payload.value.context)
			},

			'question:scoreSet': payload => {
				let scoreId = UUID()
				let ctxState = this.getOrCreateNewContextState(payload.value.context)

				ctxState.scores[payload.value.itemId] = {
					id: scoreId,
					score: payload.value.score,
					itemId: payload.value.itemId
				}

				if (payload.value.score === 100) {
					FocusUtil.unfocus()
				}

				this.triggerChange()

				model = OboModel.models[payload.value.itemId]
				return APIUtil.postEvent(model.getRoot(), 'score:set', '2.0.0', {
					id: scoreId,
					itemId: payload.value.itemId,
					score: payload.value.score,
					context: payload.value.context
				})
			},

			'question:scoreClear': payload => {
				let ctxState = QuestionUtil.getContextState(payload.value.context)
				if (!ctxState) return

				let scoreItem = ctxState.scores[payload.value.itemId]
				let model = OboModel.models[scoreItem.itemId]

				delete ctxState.scores[payload.value.itemId]

				this.triggerChange()

				//@TODO: send context
				APIUtil.postEvent(model.getRoot(), 'score:clear', '2.0.0', scoreItem)
			}
		})
	}

	getOrCreateNewContextState(context) {
		return QuestionUtil.getContextState(this.state, context) || getNewContextObject()
	}

	clearResponses(questionId, context) {
		let ctxState = QuestionUtil.getContextState(this.state, context)
		if (!ctxState) return false

		delete ctxState.responses[questionId]

		return true
	}

	init() {
		this.state = {
			viewing: null,
			contexts: {}
		}
	}

	getState() {
		return this.state
	}

	setState(newState) {
		this.state = newState
	}
}

let questionStore = new QuestionStore()
export default questionStore
