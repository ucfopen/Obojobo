import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'
import QuestionUtil from '../../viewer/util/question-util'
import NavStore from '../../viewer/stores/nav-store'

const { Store } = Common.flux
const { Dispatcher } = Common.flux
const { OboModel } = Common.models
const { FocusUtil } = Common.util
const { UUID } = Common.util

class QuestionStore extends Store {
	constructor() {
		let model
		super('questionStore')

		Dispatcher.on({
			'question:setResponse': payload => {
				const id = payload.value.id
				const context = payload.value.context
				if (!this.state.responses[context]) this.state.responses[context] = {}
				this.state.responses[context][id] = payload.value.response
				this.triggerChange()
				APIUtil.postEvent({
					action: 'question:setResponse',
					eventVersion: '3.1.0',
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
				if (this.state.responses[payload.value.context]) {
					delete this.state.responses[payload.value.context][payload.value.id]
					this.triggerChange()
				}
			},

			'assessment:endAttempt': payload => {
				if (this.state.responses[payload.value.context]) {
					delete this.state.responses[payload.value.context][payload.value.id]
					this.triggerChange()
				}
			},

			'question:setData': payload => {
				this.state.data[payload.value.key] = payload.value.value
				this.triggerChange()
			},

			'question:showExplanation': payload => {
				APIUtil.postEvent({
					action: 'question:showExplanation',
					eventVersion: '2.0.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId: payload.value.id
					}
				})

				QuestionUtil.setData(payload.value.id, 'showingExplanation', true)
			},

			'question:hideExplanation': payload => {
				APIUtil.postEvent({
					action: 'question:hideExplanation',
					eventVersion: '2.1.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId: payload.value.id,
						actor: payload.value.actor
					}
				})

				QuestionUtil.clearData(payload.value.id, 'showingExplanation')
			},

			'question:clearData': payload => {
				delete this.state.data[payload.value.key]
				this.triggerChange()
			},

			'question:hide': payload => {
				APIUtil.postEvent({
					action: 'question:hide',
					eventVersion: '2.0.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId: payload.value.id
					}
				})

				delete this.state.viewedQuestions[payload.value.id]

				if (this.state.viewing === payload.value.id) {
					this.state.viewing = null
				}

				this.triggerChange()
			},

			'question:view': payload => {
				APIUtil.postEvent({
					action: 'question:view',
					eventVersion: '2.0.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId: payload.value.id
					}
				})

				this.state.viewedQuestions[payload.value.id] = true
				this.state.viewing = payload.value.id

				this.triggerChange()
			},

			'question:checkAnswer': payload => {
				APIUtil.postEvent({
					action: 'question:checkAnswer',
					eventVersion: '2.0.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId: payload.value.id
					}
				})
			},

			'question:retry': payload => {
				const questionId = payload.value.id
				const questionModel = OboModel.models[questionId]

				this.clearResponses(questionId, payload.value.context)

				APIUtil.postEvent({
					action: 'question:retry',
					eventVersion: '2.0.0',
					visitId: NavStore.getState().visitId,
					payload: {
						questionId: questionId
					}
				})

				if (QuestionUtil.isShowingExplanation(this.state, questionModel)) {
					QuestionUtil.hideExplanation(questionId, 'viewerClient')
				}

				QuestionUtil.clearScore(questionId, payload.value.context)
			},

			'question:scoreSet': payload => {
				const scoreId = UUID()

				if (!this.state.scores[payload.value.context]) this.state.scores[payload.value.context] = {}

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
				APIUtil.postEvent({
					action: 'question:scoreSet',
					eventVersion: '2.0.0',
					visitId: NavStore.getState().visitId,
					payload: {
						id: scoreId,
						itemId: payload.value.itemId,
						score: payload.value.score,
						context: payload.value.context
					}
				})
			},

			'question:scoreClear': payload => {
				const scoreItem = this.state.scores[payload.value.context][payload.value.itemId]

				model = OboModel.models[scoreItem.itemId]

				delete this.state.scores[payload.value.context][payload.value.itemId]
				this.triggerChange()

				APIUtil.postEvent({
					action: 'question:scoreClear',
					eventVersion: '2.0.0',
					visitId: NavStore.getState().visitId,
					payload: scoreItem
				})
			}
		})
	}

	clearResponses(questionId, context) {
		delete this.state.responses[context][questionId]
	}

	init() {
		this.state = {
			viewing: null,
			viewedQuestions: {},
			scores: {},
			responses: {},
			data: {}
		}
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
