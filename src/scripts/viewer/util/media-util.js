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

	hide(id, actor = null) {
		return Dispatcher.trigger('media:hide', {
			value: {
				id,
				actor
			}
		})
	},

	setSize(id, size) {
		return Dispatcher.trigger('media:setSize', {
			value: {
				id,
				size
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

	getSize(state, model) {
		if (typeof state.sizeById[model.get('id')] === 'undefined') return null
		return state.sizeById[model.get('id')]
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
