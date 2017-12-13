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

				this.state.scores[payload.value.itemId] = {
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
					score: payload.value.score
				})
			},

			'score:clear': payload => {
				let scoreItem = this.state.scores[payload.value.itemId]

				model = OboModel.models[scoreItem.itemId]

				delete this.state.scores[payload.value.itemId]
				this.triggerChange()

				return APIUtil.postEvent(model.getRoot(), 'score:clear', '2.0.0', scoreItem)
			}
		})
	}

	init() {
		return (this.state = {
			scores: {}
		})
	}

	getState() {
		return this.state
	}

	setState(newState) {
		return (this.state = newState)
	}
}

let scoreStore = new ScoreStore()
export default scoreStore
