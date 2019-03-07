import Common from 'Common'

import APIUtil from '../../viewer/util/api-util'
import MediaUtil from '../../viewer/util/media-util'
import NavStore from '../../viewer/stores/nav-store'

import { DEFAULT_ZOOM } from './media-store/media-constants'

const { Store } = Common.flux
const { Dispatcher } = Common.flux
const { OboModel } = Common.models

class MediaStore extends Store {
	constructor() {
		super('mediaStore')

		Dispatcher.on({
			'media:show': this.show.bind(this),
			'media:hide': this.hide.bind(this),
			'media:setDefaultZoom': this.setDefaultZoom.bind(this),
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

		APIUtil.postEvent({
			draftId: model.getRoot().get('draftId'),
			action: 'media:show',
			eventVersion: '1.0.0',
			visitId: NavStore.getState().visitId,
			payload: {
				id
			}
		})

		Dispatcher.trigger('media:shown', { id })
	}

	hide(payload) {
		const id = payload.value.id
		const model = OboModel.models[id]
		const actor = payload.value.actor || 'user'

		delete this.state.shown[id]
		delete this.state.zoomById[id]
		delete this.state.defaultZoomById[id]
		this.triggerChange()

		APIUtil.postEvent({
			draftId: model.getRoot().get('draftId'),
			action: 'media:hide',
			eventVersion: '1.0.0',
			visitId: NavStore.getState().visitId,
			payload: {
				id,
				actor
			}
		})

		Dispatcher.trigger('media:hidden', { id, actor })
	}

	setDefaultZoom(payload) {
		const id = payload.value.id
		let zoom = parseFloat(payload.value.zoom) || 0

		zoom = zoom > 0 ? zoom : DEFAULT_ZOOM

		this.state.defaultZoomById[id] = zoom

		this.triggerChange()

		Dispatcher.trigger('media:defaultZoomSet', { id, zoom })
	}

	setZoom(payload) {
		const id = payload.value.id
		const model = OboModel.models[id]
		const zoom = parseFloat(payload.value.zoom) || 0

		if (zoom <= 0) return

		const previousZoom = MediaUtil.getZoom(this.state, model)

		this.state.zoomById[id] = zoom

		this.triggerChange()

		APIUtil.postEvent({
			draftId: model.getRoot().get('draftId'),
			action: 'media:setZoom',
			eventVersion: '1.0.0',
			visitId: NavStore.getState().visitId,
			payload: {
				id,
				previousZoom,
				zoom
			}
		})

		Dispatcher.trigger('media:zoomChanged', { id, zoom, previousZoom })
	}

	resetZoom(payload) {
		const id = payload.value.id
		const model = OboModel.models[id]
		const previousZoom = MediaUtil.getZoom(this.state, model)
		const defaultZoom = MediaUtil.getDefaultZoom(this.state, model)

		this.state.zoomById[id] = defaultZoom

		this.triggerChange()

		APIUtil.postEvent({
			draftId: model.getRoot().get('draftId'),
			action: 'media:resetZoom',
			eventVersion: '1.0.0',
			visitId: NavStore.getState().visitId,
			payload: {
				id,
				zoom: defaultZoom,
				previousZoom
			}
		})

		Dispatcher.trigger('media:zoomResetted', {
			id,
			previousZoom,
			zoom: defaultZoom
		})
	}

	init() {
		this.state = {
			shown: {},
			zoomById: {},
			defaultZoomById: {}
		}
	}

	getState() {
		return this.state
	}

	setState(newState) {
		this.state = newState
	}
}

const mediaStore = new MediaStore()

mediaStore.DEFAULT_ZOOM = DEFAULT_ZOOM

export default mediaStore
