import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'
import MediaUtil from '../../viewer/util/media-util'

const { Store } = Common.flux
const { Dispatcher } = Common.flux
const { OboModel } = Common.models

class MediaStore extends Store {
	constructor() {
		super('mediaStore')

		Dispatcher.on({
			'media:show': this.show.bind(this),
			'media:hide': this.hide.bind(this),
			'media:setZoom': this.setZoom.bind(this),
			'media:resetZoom': this.resetZoom.bind(this)
			//@TODO: Add these for video
			// 'media:play': payload => {},
			// 'media:stop': payload => {},
			// 'media:pause': payload => {},
			// 'media:seekTo': payload => {},
			// 'media:setVolume': payload => {},
		})
	}

	show(payload) {
		const id = payload.value.id
		const model = OboModel.models[id]

		this.state.shown[id] = true
		this.triggerChange()

		APIUtil.postEvent(model.getRoot(), 'media:show', '1.0.0', {
			id
		})

		Dispatcher.trigger('media:shown', { id })
	}

	hide(payload) {
		const id = payload.value.id
		const model = OboModel.models[id]
		const actor = payload.value.actor || 'user'

		delete this.state.shown[id]
		delete this.state.zoomById[id]
		this.triggerChange()

		APIUtil.postEvent(model.getRoot(), 'media:hide', '1.0.0', {
			id,
			actor
		})

		Dispatcher.trigger('media:hidden', { id, actor })
	}

	setZoom(payload) {
		const id = payload.value.id
		const zoom = payload.value.zoom
		const model = OboModel.models[id]

		let previousZoom = MediaUtil.getZoom(this.state, model)
		if (previousZoom === null) previousZoom = MediaStore.ZOOM_DEFAULT

		if (zoom !== null && zoom <= 0) return

		if (zoom === null) {
			delete this.state.zoomById[id]
		} else {
			this.state.zoomById[id] = zoom
		}

		this.triggerChange()

		const newZoom = zoom === null ? MediaStore.ZOOM_DEFAULT : zoom

		APIUtil.postEvent(model.getRoot(), 'media:setZoom', '1.0.0', {
			id,
			previousZoom,
			zoom: newZoom
		})

		Dispatcher.trigger('media:zoomChanged', { id, zoom: newZoom, previousZoom })
	}

	resetZoom(payload) {
		const id = payload.value.id
		const model = OboModel.models[id]

		let previousZoom = MediaUtil.getZoom(this.state, model)
		if (previousZoom === null) previousZoom = MediaStore.ZOOM_DEFAULT

		delete this.state.zoomById[id]

		this.triggerChange()

		APIUtil.postEvent(model.getRoot(), 'media:resetZoom', '1.0.0', {
			id,
			previousZoom
		})

		Dispatcher.trigger('media:zoomReset', { id, previousZoom })
	}

	init() {
		this.state = {
			shown: {},
			zoomById: {}
		}
	}

	getState() {
		return this.state
	}

	setState(newState) {
		this.state = newState
	}
}

MediaStore.ZOOM_DEFAULT = 1

const mediaStore = new MediaStore()
export default mediaStore
