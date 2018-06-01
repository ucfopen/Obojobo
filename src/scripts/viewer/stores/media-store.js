import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'
// import  from '../../viewer/util/question-util'

let { Store } = Common.flux
let { Dispatcher } = Common.flux
let { OboModel } = Common.models
// let { FocusUtil } = Common.util
// let { UUID } = Common.util

class MediaStore extends Store {
	constructor() {
		let id
		let model

		super('mediaStore')

		Dispatcher.on({
			'media:show': payload => {
				let id = payload.value.id
				let model = OboModel.models[id]

				this.state.shown[id] = true
				this.triggerChange()

				APIUtil.postEvent(model.getRoot(), 'media:show', '1.0.0', {
					id
				})
			},
			'media:hide': payload => {
				let id = payload.value.id
				let model = OboModel.models[id]

				delete this.state.shown[id]
				this.triggerChange()

				APIUtil.postEvent(model.getRoot(), 'media:hide', '1.0.0', {
					id
				})
			},
			// 'media:showFullSize': payload => {

			// }
		})
	}

	init() {
		this.state = {
			shown: {}
		}
	}

	getState() {
		return this.state
	}

	setState(newState) {
		this.state = newState
	}
}

let mediaStore = new MediaStore()
export default mediaStore
