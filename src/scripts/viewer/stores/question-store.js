import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'
import QuestionUtil from '../../viewer/util/question-util'

import UUID from '../../common/util/uuid'

let { Store } = Common.flux
let { Dispatcher } = Common.flux
let { OboModel } = Common.models
let { FocusUtil } = Common.util

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
				if (!this.state.responses[context]) this.state.responses[context] = {}
				this.state.responses[context][id] = payload.value.response
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
				delete this.state.responses[payload.value.context][payload.value.id]
				return this.triggerChange()
			},

			'assessment:endAttempt': payload => {
				if (this.state.responses[payload.value.context]) {
					delete this.state.responses[payload.value.context][payload.value.id]
					return this.triggerChange()
				}
			},

			'question:setData': payload => {
				this.state.data[payload.value.key] = payload.value.value
				return this.triggerChange()
			},

			'question:showExplanation': payload => {
				let root = OboModel.models[payload.value.id].getRoot()

				APIUtil.postEvent(root, 'question:showExplanation', '1.0.0', {
					questionId: payload.value.id
				})

				QuestionUtil.setData(payload.value.id, 'showingExplanation', true)
			},

			'question:hideExplanation': payload => {
				let root = OboModel.models[payload.value.id].getRoot()

				APIUtil.postEvent(root, 'question:hideExplanation', '1.1.0', {
					questionId: payload.value.id,
					actor: payload.value.actor
				})

				QuestionUtil.clearData(payload.value.id, 'showingExplanation')
			},

			'question:clearData': payload => {
				delete this.state.data[payload.value.key]
				return this.triggerChange()
			},

			'question:hide': payload => {
				APIUtil.postEvent(OboModel.models[payload.value.id].getRoot(), 'question:hide', '1.0.0', {
					questionId: payload.value.id
				})

				delete this.state.viewedQuestions[payload.value.id]

				if (this.state.viewing === payload.value.id) {
					this.state.viewing = null
				}

				return this.triggerChange()
			},

			'question:view': payload => {
				let root = OboModel.models[payload.value.id].getRoot()

				APIUtil.postEvent(root, 'question:view', '1.0.0', {
					questionId: payload.value.id
				})

				this.state.viewedQuestions[payload.value.id] = true
				this.state.viewing = payload.value.id

				return this.triggerChange()
			},

			'question:checkAnswer': payload => {
				let questionId = payload.value.id
				let questionModel = OboModel.models[questionId]
				let root = questionModel.getRoot()

				APIUtil.postEvent(root, 'question:checkAnswer', '1.0.0', {
					questionId: payload.value.id
				})
			},

			'question:retry': payload => {
				let questionId = payload.value.id
				let questionModel = OboModel.models[questionId]
				let root = questionModel.getRoot()

				this.clearResponses(questionId, payload.value.context)

				APIUtil.postEvent(root, 'question:retry', '1.0.0', {
					questionId: payload.value.id
				})

				if (QuestionUtil.isShowingExplanation(this.state, questionModel)) {
					QuestionUtil.hideExplanation(questionId, 'viewerClient')
				}

				QuestionUtil.clearScore(questionId, payload.value.context)
			},

			'question:scoreSet': payload => {
				let scoreId = UUID()

				if (!payload.value[payload.value.context]) this.state.scores[payload.value.context] = {}

				this.state.scores[payload.value.context][payload.value.itemId] = {
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
				let scoreItem = this.state.scores[payload.value.context][payload.value.itemId]

				model = OboModel.models[scoreItem.itemId]

				delete this.state.scores[payload.value.context][payload.value.itemId]
				this.triggerChange()

				return APIUtil.postEvent(model.getRoot(), 'score:clear', '2.0.0', scoreItem)
			}
		})
	}

	clearResponses(questionId, context) {
		delete this.state.responses[context][questionId]
	}

	init() {
		return (this.state = {
			viewing: null,
			viewedQuestions: {},
			scores: {},
			responses: {},
			data: {}
		})
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
