import Common from 'Common'

let { Dispatcher } = Common.flux

let MediaUtil = {
	show(id) {
		return Dispatcher.trigger('media:show', {
			value: {
				id
			}
		})
	},

	hide(id) {
		return Dispatcher.trigger('media:hide', {
			value: {
				id
			}
		})
	},

	isShowingMedia(state, model) {
		// if(!state || !state.shown) return false
		return state.shown[model.get('id')] === true
	}
}

export default MediaUtil
