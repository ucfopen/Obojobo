jest.mock('../../../src/scripts/common/flux/dispatcher', () => ({
	trigger: jest.fn(),
	on: jest.fn(),
	off: jest.fn()
}))

const MediaUtil = require('../../../src/scripts/viewer/util/media-util').default
const Dispatcher = require('../../../src/scripts/common/flux/dispatcher')

const testModel = {
	get: () => 'mocked-id'
}

describe('QuestionUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('show', () => {
		MediaUtil.show('mocked-id')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:show', {
			value: {
				id: 'mocked-id'
			}
		})
	})

	test('hide', () => {
		MediaUtil.hide('mocked-id', 'mocked-actor')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:hide', {
			value: {
				id: 'mocked-id',
				actor: 'mocked-actor'
			}
		})
	})

	test('hide (No actor)', () => {
		MediaUtil.hide('mocked-id')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:hide', {
			value: {
				id: 'mocked-id',
				actor: null
			}
		})
	})

	test('setSize', () => {
		MediaUtil.setSize('mocked-id', 'mock-size')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:setSize', {
			value: {
				id: 'mocked-id',
				size: 'mock-size'
			}
		})
	})

	test('setZoom', () => {
		MediaUtil.setZoom('mocked-id', 'mock-zoom')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:setZoom', {
			value: {
				id: 'mocked-id',
				zoom: 'mock-zoom'
			}
		})
	})

	test('resetZoom', () => {
		MediaUtil.resetZoom('mocked-id')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:resetZoom', {
			value: {
				id: 'mocked-id'
			}
		})
	})

	test('getSize', () => {
		expect(MediaUtil.getSize({ sizeById: {} }, testModel)).toBe(null)
		expect(MediaUtil.getSize({ sizeById: { 'mocked-id': 'mocked-size' } }, testModel)).toBe(
			'mocked-size'
		)
	})

	test('getZoom', () => {
		expect(MediaUtil.getZoom({ zoomById: {} }, testModel)).toBe(null)
		expect(MediaUtil.getZoom({ zoomById: { 'mocked-id': 'mocked-zoom' } }, testModel)).toBe(
			'mocked-zoom'
		)
	})

	test('isShowingMedia', () => {
		expect(MediaUtil.isShowingMedia({ shown: {} }, testModel)).toBe(false)
		expect(MediaUtil.isShowingMedia({ shown: { 'mocked-id': true } }, testModel)).toBe(true)
	})
})
