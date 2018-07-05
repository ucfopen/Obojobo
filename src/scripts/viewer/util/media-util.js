import Common from 'Common'

const { Dispatcher } = Common.flux

const MediaUtil = {
	show(id) {
		return Dispatcher.trigger('media:show', {
			value: {
				id
			}
		})
	},

	hide(id, actor = null) {
		return Dispatcher.trigger('media:hide', {
			value: {
				id,
				actor
			}
		})
	},

	setZoom(id, zoom) {
		return Dispatcher.trigger('media:setZoom', {
			value: {
				id,
				zoom
			}
		})
	},

	resetZoom(id) {
		return Dispatcher.trigger('media:resetZoom', {
			value: {
				id
			}
		})
	},

	getZoom(state, model) {
		if (typeof state.zoomById[model.get('id')] === 'undefined') return null
		return state.zoomById[model.get('id')]
	},

	isShowingMedia(state, model) {
		return state.shown[model.get('id')] === true
	}
}

export default MediaUtil
