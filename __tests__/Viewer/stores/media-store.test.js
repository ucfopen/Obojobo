jest.mock('../../../src/scripts/common/flux/dispatcher')
jest.mock('../../../src/scripts/common/models/obo-model')
jest.mock('../../../src/scripts/viewer/util/api-util')

import MediaStore from '../../../src/scripts/viewer/stores/media-store'
import APIUtil from '../../../src/scripts/viewer/util/api-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import OboModel from '../../../src/scripts/common/models/obo-model'

describe('Media Store', () => {
	beforeEach(() => {
		jest.resetAllMocks()

		MediaStore.init()
		OboModel.models = {
			'mocked-id': {
				getRoot: () => 'root-id',
				get: () => 'mocked-id'
			}
		}
	})

	test('init will init state', () => {
		MediaStore.state = {}
		MediaStore.init()

		expect(MediaStore.state).toEqual({
			shown: {},
			zoomById: {}
		})
	})

	test('setState will set state', () => {
		MediaStore.state = {}
		MediaStore.setState({ a: 1 })

		expect(MediaStore.state).toEqual({
			a: 1
		})
	})

	test('getState will get state', () => {
		MediaStore.state = { a: 1 }
		expect(MediaStore.getState()).toEqual({
			a: 1
		})
	})

	test('Dispatcher listening for the right events', () => {
		const newMediaStore = new MediaStore.constructor()
		expect(Dispatcher.on).toHaveBeenCalledWith({
			'media:show': expect.any(Function),
			'media:hide': expect.any(Function),
			'media:setZoom': expect.any(Function),
			'media:resetZoom': expect.any(Function)
		})
	})

	test('show', () => {
		MediaStore.show({
			value: { id: 'mocked-id' }
		})

		expect(MediaStore.state).toEqual({
			shown: { 'mocked-id': true },
			zoomById: {}
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith({
			action: 'media:show',
			eventVersion: '2.0.0',
			payload: { id: 'mocked-id' }
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:shown', { id: 'mocked-id' })
	})

	test('hide', () => {
		MediaStore.state = {
			shown: { 'mocked-id': true, 'other-id': true },
			zoomById: { 'mocked-id': 2, 'other-id': 0.5 }
		}
		MediaStore.hide({
			value: { id: 'mocked-id', actor: 'mocked-actor' }
		})

		expect(MediaStore.state).toEqual({
			shown: { 'other-id': true },
			zoomById: { 'other-id': 0.5 }
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith({
			action: 'media:hide',
			eventVersion: '2.0.0',
			payload: { actor: 'mocked-actor', id: 'mocked-id' }
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:hidden', {
			id: 'mocked-id',
			actor: 'mocked-actor'
		})
	})

	test('hide (no actor)', () => {
		MediaStore.hide({
			value: { id: 'mocked-id' }
		})

		expect(APIUtil.postEvent).toHaveBeenCalledWith({
			action: 'media:hide',
			eventVersion: '2.0.0',
			payload: { actor: 'user', id: 'mocked-id' }
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:hidden', {
			id: 'mocked-id',
			actor: 'user'
		})
	})

	test('setZoom (to a set value)', () => {
		MediaStore.setZoom({
			value: { id: 'mocked-id', zoom: 'mocked-zoom' }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			zoomById: { 'mocked-id': 'mocked-zoom' }
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith({
			action: 'media:setZoom',
			eventVersion: '2.0.0',
			payload: { id: 'mocked-id', previousZoom: 1, zoom: 'mocked-zoom' }
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:zoomChanged', {
			id: 'mocked-id',
			zoom: 'mocked-zoom',
			previousZoom: 1
		})
	})

	test('setZoom (to null)', () => {
		MediaStore.state.zoomById['mocked-id'] = 'other-zoom'
		MediaStore.setZoom({
			value: { id: 'mocked-id', zoom: null }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			zoomById: {}
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith({
			action: 'media:setZoom',
			eventVersion: '2.0.0',
			payload: { id: 'mocked-id', previousZoom: 'other-zoom', zoom: 1 }
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:zoomChanged', {
			id: 'mocked-id',
			zoom: 1,
			previousZoom: 'other-zoom'
		})
	})

	test('setZoom (to value <= 0)', () => {
		MediaStore.setZoom({
			value: { id: 'mocked-id', zoom: 0 }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			zoomById: {}
		})
		expect(APIUtil.postEvent).not.toHaveBeenCalled()
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('resetZoom', () => {
		MediaStore.state.zoomById['mocked-id'] = 'mocked-zoom'
		MediaStore.resetZoom({
			value: { id: 'mocked-id' }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			zoomById: {}
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith({
			action: 'media:resetZoom',
			eventVersion: '2.0.0',
			payload: { id: 'mocked-id', previousZoom: 'mocked-zoom' }
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:zoomReset', {
			id: 'mocked-id',
			previousZoom: 'mocked-zoom'
		})
	})

	test('resetZoom works even if no zoom previously set', () => {
		MediaStore.resetZoom({
			value: { id: 'mocked-id' }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			zoomById: {}
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith({
			action: 'media:resetZoom',
			eventVersion: '2.0.0',
			payload: { id: 'mocked-id', previousZoom: 1 }
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:zoomReset', {
			id: 'mocked-id',
			previousZoom: 1
		})
	})
})
