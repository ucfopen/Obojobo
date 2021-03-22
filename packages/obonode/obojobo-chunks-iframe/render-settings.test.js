import {
	getIsShowing,
	getControlsOptions,
	getDisplayedTitle,
	getAriaRegionLabel,
	getSetDimensions,
	getScaleAmount,
	getScaleDimensions,
	getIFrameStyle,
	getAfterStyle,
	getZoomValues,
	getRenderSettings
} from './render-settings'

import MediaUtil from 'obojobo-document-engine/src/scripts/viewer/util/media-util'

describe('render-settings', () => {
	test('getIsShowing', () => {
		expect(
			getIsShowing(
				{
					shown: {}
				},
				{
					get: () => 'id',
					modelState: {
						autoload: true,
						src: 'mocked-src'
					}
				}
			)
		).toBe(true)

		expect(
			getIsShowing(
				{
					shown: {}
				},
				{
					get: () => 'id',
					modelState: {
						autoload: true,
						src: null
					}
				}
			)
		).toBe(false)

		expect(
			getIsShowing(
				{
					shown: {}
				},
				{
					get: () => 'id',
					modelState: {
						autoload: false,
						src: 'mocked-src'
					}
				}
			)
		).toBe(false)

		expect(
			getIsShowing(
				{
					shown: {}
				},
				{
					get: () => 'id',
					modelState: {
						autoload: false,
						src: null
					}
				}
			)
		).toBe(false)

		expect(
			getIsShowing(
				{
					shown: {
						id: true
					}
				},
				{
					get: () => 'id',
					modelState: {
						autoload: true,
						src: 'mocked-src'
					}
				}
			)
		).toBe(true)

		expect(
			getIsShowing(
				{
					shown: {
						id: true
					}
				},
				{
					get: () => 'id',
					modelState: {
						autoload: true,
						src: null
					}
				}
			)
		).toBe(false)

		expect(
			getIsShowing(
				{
					shown: {
						id: true
					}
				},
				{
					get: () => 'id',
					modelState: {
						autoload: false,
						src: 'mocked-src'
					}
				}
			)
		).toBe(true)

		expect(
			getIsShowing(
				{
					shown: {
						id: true
					}
				},
				{
					get: () => 'id',
					modelState: {
						autoload: false,
						src: null
					}
				}
			)
		).toBe(false)
	})

	test('getControlsOptions', () => {
		const c = controlsArr => getControlsOptions({ controls: controlsArr })

		const z = 'zoom'
		const r = 'reload'
		const w = 'new-window'
		const u = 'unrecognized-option'

		expect(c([])).toEqual({
			zoom: false,
			reload: false,
			newWindow: false,
			isControlsEnabled: false
		})

		expect(c([r])).toEqual({
			zoom: false,
			reload: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c([z])).toEqual({
			zoom: true,
			reload: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c([w])).toEqual({
			zoom: false,
			reload: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c([r, z])).toEqual({
			zoom: true,
			reload: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c([r, w])).toEqual({
			zoom: false,
			reload: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c([w, z])).toEqual({
			zoom: true,
			reload: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c([r, w, z])).toEqual({
			zoom: true,
			reload: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c([r, u])).toEqual({
			zoom: false,
			reload: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c([z, u])).toEqual({
			zoom: true,
			reload: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c([w, u])).toEqual({
			zoom: false,
			reload: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c([r, z, u])).toEqual({
			zoom: true,
			reload: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c([r, w, u])).toEqual({
			zoom: false,
			reload: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c([w, z, u])).toEqual({
			zoom: true,
			reload: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c([r, w, z, u])).toEqual({
			zoom: true,
			reload: true,
			newWindow: true,
			isControlsEnabled: true
		})
	})

	test('getDisplayedTitle', () => {
		const t = getDisplayedTitle

		expect(t({ src: null, title: null })).toBe('IFrame missing src attribute')
		expect(t({ src: null, title: 'title' })).toBe('IFrame missing src attribute')
		expect(t({ src: 'src', title: null })).toBe('src')
		expect(t({ src: 'src', title: 'title' })).toBe('title')
		expect(t({ src: false, title: null })).toBe('')
	})

	test('getAriaRegionLabel', () => {
		const t = getAriaRegionLabel

		expect(t({ src: 'mock-src', title: 'mock-title' }, 'displayed-title')).toBe(
			'External content "displayed-title" from mock-src.'
		)
		expect(t({ src: 'mock-src' }, 'displayed-title')).toBe('External content from mock-src.')
	})

	test('getSetDimensions', () => {
		const d = getSetDimensions

		expect(d({ width: 'w', height: 'h' })).toEqual({ w: 'w', h: 'h' })
		expect(d({ height: 'h' })).toEqual({ w: 640, h: 'h' })
		expect(d({ width: 'w' })).toEqual({ w: 'w', h: 480 })
		expect(d({})).toEqual({ w: 640, h: 480 })

		expect(d({ width: 'w', height: 'h', sizing: 'text-width' })).toEqual({ w: 722, h: 'h' })
		expect(d({ height: 'h', sizing: 'text-width' })).toEqual({ w: 722, h: 'h' })
		expect(d({ width: 'w', sizing: 'text-width' })).toEqual({ w: 722, h: 480 })
		expect(d({ sizing: 'text-width' })).toEqual({ w: 722, h: 480 })

		expect(d({ width: 'w', height: 'h', sizing: 'max-width' })).toEqual({ w: 835, h: 'h' })
		expect(d({ height: 'h', sizing: 'max-width' })).toEqual({ w: 835, h: 'h' })
		expect(d({ width: 'w', sizing: 'max-width' })).toEqual({ w: 835, h: 480 })
		expect(d({ sizing: 'max-width' })).toEqual({ w: 835, h: 480 })
	})

	test('getScaleAmount', () => {
		const s = getScaleAmount

		expect(s(1, 2, 3)).toBe(-1 / 3)
		expect(s(3, 2, 1)).toBe(1)
		expect(s(100, 0, 1)).toBe(1)
		expect(s(200, 20, 400)).toBe(180 / 400)
	})

	test('getScaleDimensions (fit="scale")', () => {
		const d = getScaleDimensions
		const ms = { fit: 'scale' }

		expect(d(ms, 123, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123 * 0.5,
			containerStyle: {
				width: 'w'
			}
		})
		expect(d(ms, 123, 0.5, 200, { w: 'w', h: 'h' })).toEqual({
			scale: 200,
			containerStyle: {
				width: 'w'
			}
		})
	})

	test('getScaleDimensions (fit="scroll")', () => {
		const d = getScaleDimensions
		const ms = { fit: 'scroll' }

		expect(d(ms, 123, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123,
			containerStyle: {
				width: 'w',
				height: 'h'
			}
		})
		expect(d(ms, 123, 0.5, 200, { w: 'w', h: 'h' })).toEqual({
			scale: 200,
			containerStyle: {
				width: 'w',
				height: 'h'
			}
		})
	})

	test('getIFrameStyle', () => {
		const i = getIFrameStyle

		expect(i(721)).toEqual({
			transform: 'scale(721)',
			width: (1 / 721) * 100 + '%',
			height: (1 / 721) * 100 + '%'
		})
	})

	test('getAfterStyle', () => {
		const a = getAfterStyle

		expect(a(123, 456, 'scale')).toEqual({
			paddingTop: (456 / 123) * 100 + '%'
		})
		expect(a(123, 456, 'scroll')).toEqual({
			height: 456
		})
	})

	test('getZoomValues', () => {
		const getZoomSpy = jest.spyOn(MediaUtil, 'getZoom').mockReturnValueOnce('mock-zoom')
		const getDefaultZoomSpy = jest
			.spyOn(MediaUtil, 'getDefaultZoom')
			.mockReturnValueOnce('mock-default-zoom')
		const isZoomAtDefaultSpy = jest
			.spyOn(MediaUtil, 'isZoomAtDefault')
			.mockReturnValueOnce('mock-is-zoom-at-default')

		const mediaState = jest.fn()
		const model = jest.fn()

		expect(getZoomValues(mediaState, model)).toEqual({
			currentZoom: 'mock-zoom',
			defaultZoom: 'mock-default-zoom',
			isZoomAtDefault: 'mock-is-zoom-at-default'
		})

		expect(getZoomSpy).toHaveBeenCalledWith(mediaState, model)
		expect(getDefaultZoomSpy).toHaveBeenCalledWith(mediaState, model)
		expect(isZoomAtDefaultSpy).toHaveBeenCalledWith(mediaState, model)

		getZoomSpy.mockRestore()
		getDefaultZoomSpy.mockRestore()
		isZoomAtDefaultSpy.mockRestore()
	})

	test('getRenderSettings', () => {
		const mediaState = {
			zoomById: {},
			defaultZoomById: {},
			shown: {}
		}
		const model = {
			get: () => 'id',
			modelState: {
				initialZoom: 1,
				src: 'src',
				controls: ''
			}
		}
		expect(getRenderSettings(model, 500, 10, 0.1, 20, mediaState)).toMatchSnapshot()
	})
})
