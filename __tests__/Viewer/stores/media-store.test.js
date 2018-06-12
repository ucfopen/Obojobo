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
		OboModel.models = {}
	})

	test('init will init state', () => {
		MediaStore.state = {}
		MediaStore.init()

		expect(MediaStore.state).toEqual({
			shown: {},
			sizeById: {},
			zoomById: {}
		})
	})

	test('Dispatcher listening for the right events', () => {
		let newMediaStore = new MediaStore.constructor()
		expect(Dispatcher.on).toHaveBeenCalledWith({
			'media:show': expect.any(Function),
			'media:hide': expect.any(Function),
			'media:setSize': expect.any(Function),
			'media:setZoom': expect.any(Function),
			'media:resetZoom': expect.any(Function)
		})
	})

	test('show', () => {
		OboModel.models['mocked-id'] = {
			getRoot: () => 'root-id'
		}
		MediaStore.show({
			value: { id: 'mocked-id' }
		})

		expect(MediaStore.state).toEqual({
			shown: { 'mocked-id': true },
			sizeById: {},
			zoomById: {}
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith('root-id', 'media:show', '1.0.0', {
			id: 'mocked-id'
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:shown', { id: 'mocked-id' })
	})

	test('hide', () => {
		OboModel.models['mocked-id'] = {
			getRoot: () => 'root-id'
		}
		MediaStore.state = {
			shown: { 'mocked-id': true, 'other-id': true },
			sizeById: { 'mocked-id': 'size', 'other-id': 'other-size' },
			zoomById: { 'mocked-id': 2, 'other-id': 0.5 }
		}
		MediaStore.hide({
			value: { id: 'mocked-id', actor: 'mocked-actor' }
		})

		expect(MediaStore.state).toEqual({
			shown: { 'other-id': true },
			sizeById: { 'other-id': 'other-size' },
			zoomById: { 'other-id': 0.5 }
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith('root-id', 'media:hide', '1.0.0', {
			id: 'mocked-id',
			actor: 'mocked-actor'
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:hidden', {
			id: 'mocked-id',
			actor: 'mocked-actor'
		})
	})

	test('hide (no actor)', () => {
		OboModel.models['mocked-id'] = {
			getRoot: () => 'root-id'
		}
		MediaStore.hide({
			value: { id: 'mocked-id' }
		})

		expect(APIUtil.postEvent).toHaveBeenCalledWith('root-id', 'media:hide', '1.0.0', {
			id: 'mocked-id',
			actor: 'user'
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:hidden', {
			id: 'mocked-id',
			actor: 'user'
		})
	})

	test('setSize (to a set value)', () => {
		OboModel.models['mocked-id'] = {
			getRoot: () => 'root-id'
		}
		MediaStore.setSize({
			value: { id: 'mocked-id', size: 'mocked-size' }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			sizeById: { 'mocked-id': 'mocked-size' },
			zoomById: {}
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith('root-id', 'media:setSize', '1.0.0', {
			id: 'mocked-id',
			size: 'mocked-size'
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:sizeChanged', {
			id: 'mocked-id',
			size: 'mocked-size'
		})
	})

	test('setSize (to null)', () => {
		OboModel.models['mocked-id'] = {
			getRoot: () => 'root-id'
		}
		MediaStore.state.sizeById['mocked-id'] = 'other-size'
		MediaStore.setSize({
			value: { id: 'mocked-id', size: null }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			sizeById: {},
			zoomById: {}
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith('root-id', 'media:setSize', '1.0.0', {
			id: 'mocked-id',
			size: 'default'
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:sizeChanged', {
			id: 'mocked-id',
			size: 'default'
		})
	})

	test('setZoom (to a set value)', () => {
		OboModel.models['mocked-id'] = {
			getRoot: () => 'root-id'
		}
		MediaStore.setZoom({
			value: { id: 'mocked-id', zoom: 'mocked-zoom' }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			sizeById: {},
			zoomById: { 'mocked-id': 'mocked-zoom' }
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith('root-id', 'media:setZoom', '1.0.0', {
			id: 'mocked-id',
			zoom: 'mocked-zoom'
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:zoomChanged', {
			id: 'mocked-id',
			zoom: 'mocked-zoom'
		})
	})

	test('setZoom (to null)', () => {
		OboModel.models['mocked-id'] = {
			getRoot: () => 'root-id'
		}
		MediaStore.state.zoomById['mocked-id'] = 'other-zoom'
		MediaStore.setZoom({
			value: { id: 'mocked-id', zoom: null }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			sizeById: {},
			zoomById: {}
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith('root-id', 'media:setZoom', '1.0.0', {
			id: 'mocked-id',
			zoom: 1
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:zoomChanged', {
			id: 'mocked-id',
			zoom: 1
		})
	})

	test('setZoom (to value <= 0)', () => {
		OboModel.models['mocked-id'] = {
			getRoot: () => 'root-id'
		}
		MediaStore.setZoom({
			value: { id: 'mocked-id', zoom: 0 }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			sizeById: {},
			zoomById: {}
		})
		expect(APIUtil.postEvent).not.toHaveBeenCalled()
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('resetZoom', () => {
		OboModel.models['mocked-id'] = {
			getRoot: () => 'root-id'
		}
		MediaStore.state.zoomById['mocked-id'] = 'mocked-zoom'
		MediaStore.resetZoom({
			value: { id: 'mocked-id' }
		})

		expect(MediaStore.state).toEqual({
			shown: {},
			sizeById: {},
			zoomById: {}
		})
		expect(APIUtil.postEvent).toHaveBeenCalledWith('root-id', 'media:resetZoom', '1.0.0', {
			id: 'mocked-id'
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:zoomReset', {
			id: 'mocked-id'
		})
	})
})
