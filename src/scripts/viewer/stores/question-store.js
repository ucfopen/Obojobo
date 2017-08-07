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

				APIUtil.postEvent(model.getRoot(), 'question:setResponse', {
					questionId: id,
					response: payload.value.response
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

				APIUtil.postEvent(root, 'question:showExplanation', {
					questionId: payload.value.id
				})

				QuestionUtil.setData(payload.value.id, 'showingExplanation', true)
			},

			'question:hideExplanation': payload => {
				let root = OboModel.models[payload.value.id].getRoot()

				APIUtil.postEvent(root, 'question:hideExplanation', {
					questionId: payload.value.id
				})

				this.hideExplanation(payload.value.id)
			},

			'question:clearData': payload => {
				delete this.state.data[payload.value.key]
				return this.triggerChange()
			},

			'question:hide': payload => {
				APIUtil.postEvent(OboModel.models[payload.value.id].getRoot(), 'question:hide', {
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

				APIUtil.postEvent(root, 'question:view', {
					questionId: payload.value.id
				})

				this.state.viewedQuestions[payload.value.id] = true
				this.state.viewing = payload.value.id

				return this.triggerChange()
			},

			'question:retry': payload => {
				let questionId = payload.value.id
				let root = OboModel.models[questionId].getRoot()

				this.clearResponses(questionId)
				this.hideExplanation(questionId) // should trigger change
				ScoreUtil.clearScore(questionId) // should trigger change
			}
		})
	}

	clearResponses(questionId) {
		delete this.state.responses[questionId]
	}

	hideExplanation(questionId) {
		QuestionUtil.clearData(questionId, 'showingExplanation')
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
