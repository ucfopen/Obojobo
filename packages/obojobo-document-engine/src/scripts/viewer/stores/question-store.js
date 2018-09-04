import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'
import QuestionUtil from '../../viewer/util/question-util'
import ScoreUtil from '../../viewer/util/score-util'

let { Store } = Common.flux
let { Dispatcher } = Common.flux
let { OboModel } = Common.models

class QuestionStore extends Store {
	constructor() {
		let id
		super('questionStore')

		Dispatcher.on({
			'question:setResponse': payload => {
				let id = payload.value.id
				let model = OboModel.models[id]

				this.state.responses[id] = payload.value.response
				this.triggerChange()

				APIUtil.postEvent(model.getRoot(), 'question:setResponse', '2.0.0', {
					questionId: id,
					response: payload.value.response,
					targetId: payload.value.targetId
				})
			},

			'question:clearResponse': payload => {
				delete this.state.responses[payload.value.id]
				return this.triggerChange()
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

				this.clearResponses(questionId)

				APIUtil.postEvent(root, 'question:retry', '1.0.0', {
					questionId: payload.value.id
				})

				if (QuestionUtil.isShowingExplanation(this.state, questionModel)) {
					QuestionUtil.hideExplanation(questionId, 'viewerClient')
				}

				ScoreUtil.clearScore(questionId) // should trigger change
			}
		})
	}

	clearResponses(questionId) {
		delete this.state.responses[questionId]
	}

	init() {
		return (this.state = {
			viewing: null,
			viewedQuestions: {},
			responses: {},
			data: {}
		})
	}

	getState() {
		return this.state
	}

	setState(newState) {
		return (this.state = newState)
	}
}

let questionStore = new QuestionStore()
export default questionStore
