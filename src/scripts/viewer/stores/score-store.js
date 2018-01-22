import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'

let { Store } = Common.flux
let { Dispatcher } = Common.flux
let { UUID, FocusUtil } = Common.util
let { OboModel } = Common.models

class ScoreStore extends Store {
	constructor() {
		let model
		super('scoreStore')

		Dispatcher.on({
			'score:set': payload => {
				let scoreId = UUID()

				if (!payload.value[payload.value.context]) this.state.scores[payload.value.context] = {}

				this.state.scores[payload.value.context][payload.value.itemId] = {
					id: scoreId,
					score: payload.value.score,
					itemId: payload.value.itemId,
					context: payload.value.context
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

			'score:populate': payload => {
				let scoreId = UUID()
				payload.forEach(attempt => {
					let context = `assessmentReview:${attempt.attemptId}`
					if (!this.state.scores[context]) this.state.scores[context] = {}
					attempt.questionScores.forEach(questionScore => {
						this.state.scores[context][questionScore.id] = {
							id: scoreId,
							score: questionScore.score,
							itemId: questionScore.id,
							context
						}
					})
				})
			},

			'score:clear': payload => {
				let scoreItem = this.state.scores[payload.value.context][payload.value.itemId]

				model = OboModel.models[scoreItem.itemId]

				delete this.state.scores[payload.value.context][payload.value.itemId]
				this.triggerChange()

				return APIUtil.postEvent(model.getRoot(), 'score:clear', '2.0.0', scoreItem)
			}
		})
	}

	init() {
		this.state = {
			scores: {}
		}
	}

	getState() {
		return this.state
	}

	setState(newState) {
		this.state = newState
	}
}

let scoreStore = new ScoreStore()
export default scoreStore
