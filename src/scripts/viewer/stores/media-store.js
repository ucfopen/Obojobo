import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'
import MediaUtil from '../../viewer/util/media-util'

let { Store } = Common.flux
let { Dispatcher } = Common.flux
let { OboModel } = Common.models

class MediaStore extends Store {
	constructor() {
		let id
		let model

		super('mediaStore')

		Dispatcher.on({
			'media:show': this.show.bind(this),
			'media:hide': this.hide.bind(this),
			'media:setSize': this.setSize.bind(this),
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
		let id = payload.value.id
		let model = OboModel.models[id]

		this.state.shown[id] = true
		this.triggerChange()

		APIUtil.postEvent(model.getRoot(), 'media:show', '1.0.0', {
			id
		})

		Dispatcher.trigger('media:shown', { id })
	}

	hide(payload) {
		let id = payload.value.id
		let model = OboModel.models[id]
		let actor = payload.value.actor || 'user'

		delete this.state.shown[id]
		delete this.state.sizeById[id]
		delete this.state.zoomById[id]
		this.triggerChange()

		APIUtil.postEvent(model.getRoot(), 'media:hide', '1.0.0', {
			id,
			actor
		})

		Dispatcher.trigger('media:hidden', { id, actor })
	}

	setSize(payload) {
		let id = payload.value.id
		let size = payload.value.size
		let model = OboModel.models[id]

		let previousSize = MediaUtil.getSize(this.state, model)
		if (previousSize === null) previousSize = MediaStore.SIZE_DEFAULT

		if (size === null) {
			delete this.state.sizeById[id]
		} else {
			this.state.sizeById[id] = size
		}

		this.triggerChange()

		let newSize = size === null ? MediaStore.SIZE_DEFAULT : size

		APIUtil.postEvent(model.getRoot(), 'media:setSize', '1.0.0', {
			id,
			previousSize,
			size: newSize
		})

		Dispatcher.trigger('media:sizeChanged', { id, size: newSize, previousSize })
	}

	setZoom(payload) {
		let id = payload.value.id
		let zoom = payload.value.zoom
		let model = OboModel.models[id]

		let previousZoom = MediaUtil.getZoom(this.state, model)
		if (previousZoom === null) previousZoom = MediaStore.ZOOM_DEFAULT

		if (zoom !== null && zoom <= 0) return

		if (zoom === null) {
			delete this.state.zoomById[id]
		} else {
			this.state.zoomById[id] = zoom
		}

		this.triggerChange()

		let newZoom = zoom === null ? MediaStore.ZOOM_DEFAULT : zoom

		APIUtil.postEvent(model.getRoot(), 'media:setZoom', '1.0.0', {
			id,
			previousZoom,
			zoom: newZoom
		})

		Dispatcher.trigger('media:zoomChanged', { id, zoom: newZoom, previousZoom })
	}

	resetZoom(payload) {
		let id = payload.value.id
		let model = OboModel.models[id]

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
			sizeById: {},
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

MediaStore.SIZE_DEFAULT = 'default'
MediaStore.ZOOM_DEFAULT = 1

let mediaStore = new MediaStore()
export default mediaStore
