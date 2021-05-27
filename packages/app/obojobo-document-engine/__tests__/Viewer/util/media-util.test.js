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

describe('MediaUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('mediaPlayed', () => {
		MediaUtil.mediaPlayed('user', 0)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:played', {
			value: {
				actor: 'user',
				playHeadPosition: 0
			}
		})
	})

	test('mediaPaused', () => {
		MediaUtil.mediaPaused('user', 0)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:pause', {
			value: {
				actor: 'user',
				playHeadPosition: 0
			}
		})
	})

	test('mediaEnded', () => {
		MediaUtil.mediaEnded('youtube', 0)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:ended', {
			value: {
				actor: 'youtube',
				playHeadPosition: 0
			}
		})
	})

	test('mediaSeekTo', () => {
		MediaUtil.mediaSeekTo('user', 100, 0)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:seekTo', {
			value: {
				actor: 'user',
				playHeadPosition: 100,
				previousPlayHeadPosition: 0
			}
		})
	})

	test('mediaBuffering', () => {
		MediaUtil.mediaBuffering('youtube', 50)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:buffering', {
			value: {
				actor: 'youtube',
				playHeadPosition: 50
			}
		})
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

	test('setDefaultZoom', () => {
		MediaUtil.setDefaultZoom('mocked-id', 2)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('media:setDefaultZoom', {
			value: {
				id: 'mocked-id',
				zoom: 2
			}
		})
	})

	test('isZoomAtDefault', () => {
		const state = {
			defaultZoomById: { 'mocked-id': 1 },
			zoomById: { 'mocked-id': 2 }
		}
		// is not at default
		expect(MediaUtil.isZoomAtDefault(state, testModel)).toBe(false)

		// is at default
		state.zoomById['mocked-id'] = 1
		expect(MediaUtil.isZoomAtDefault(state, testModel)).toBe(true)
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

	test('getZoom', () => {
		expect(MediaUtil.getZoom({ zoomById: {}, defaultZoomById: {} }, testModel)).toBe(1)
		expect(
			MediaUtil.getZoom(
				{ zoomById: { 'mocked-id': 'mocked-zoom' }, defaultZoomById: {} },
				testModel
			)
		).toBe('mocked-zoom')
		expect(
			MediaUtil.getZoom(
				{
					zoomById: { 'mocked-id': 'mocked-zoom' },
					defaultZoomById: { 'mocked-id': 'mock-default' }
				},
				testModel
			)
		).toBe('mocked-zoom')
		expect(
			MediaUtil.getZoom(
				{ zoomById: {}, defaultZoomById: { 'mocked-id': 'mock-default' } },
				testModel
			)
		).toBe('mock-default')
	})

	test('isShowingMedia', () => {
		expect(MediaUtil.isShowingMedia({ shown: {} }, testModel)).toBe(false)
		expect(MediaUtil.isShowingMedia({ shown: { 'mocked-id': true } }, testModel)).toBe(true)
	})
})
