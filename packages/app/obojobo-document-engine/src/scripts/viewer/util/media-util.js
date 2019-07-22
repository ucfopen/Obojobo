import Common from 'Common'
import { DEFAULT_ZOOM } from '../stores/media-store/media-constants'

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

	setDefaultZoom(id, zoom) {
		return Dispatcher.trigger('media:setDefaultZoom', {
			value: {
				id,
				zoom
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

	isZoomAtDefault(state, model) {
		return MediaUtil.getDefaultZoom(state, model) === MediaUtil.getZoom(state, model)
	},

	getDefaultZoom(state, model) {
		if (typeof state.defaultZoomById[model.attributes.id] === 'undefined') return DEFAULT_ZOOM
		return state.defaultZoomById[model.attributes.id]
	},

	getZoom(state, model) {
		if (typeof state.zoomById[model.attributes.id] === 'undefined') {
			return MediaUtil.getDefaultZoom(state, model)
		}

		return state.zoomById[model.attributes.id]
	},

	isShowingMedia(state, model) {
		return state.shown[model.attributes.id] === true
	}
}

export default MediaUtil
