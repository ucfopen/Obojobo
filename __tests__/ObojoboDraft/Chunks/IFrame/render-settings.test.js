import {
	getIsShowing,
	getControlsOptions,
	getSizeState,
	getMediaSize,
	getDisplayedTitle,
	getSetDimensions,
	getScaleAmount,
	getScaleDimensions,
	getIFrameStyle,
	getAfterStyle,
	getZoomValues,
	getRenderSettings
} from '../../../../ObojoboDraft/Chunks/IFrame/render-settings'

describe('render-settings', () => {
	let model

	const testGetControlsOptions = (controls, newWindow, sizeState) => {
		return getControlsOptions(
			{
				controls,
				newWindow
			},
			sizeState
		)
	}

	beforeEach(() => {
		model = {
			modelState: {}
		}
	})

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

	test('getControlsOptions (newWindow=null, sizeState="expanded")', () => {
		const c = testGetControlsOptions

		expect(c([], null, 'expanded')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['reload'], null, 'expanded')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['zoom'], null, 'expanded')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['expand'], null, 'expanded')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['reload', 'zoom'], null, 'expanded')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand'], null, 'expanded')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['zoom', 'expand'], null, 'expanded')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: true,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand', 'zoom'], null, 'expanded')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: true,
			newWindow: false,
			isControlsEnabled: true
		})
	})

	test('getControlsOptions (newWindow=null, sizeState="ableToExpand")', () => {
		const c = testGetControlsOptions

		expect(c([], null, 'ableToExpand')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: false
		})

		expect(c(['reload'], null, 'ableToExpand')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['zoom'], null, 'ableToExpand')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['expand'], null, 'ableToExpand')).toEqual({
			zoom: false,
			reload: false,
			expand: true,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['reload', 'zoom'], null, 'ableToExpand')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand'], null, 'ableToExpand')).toEqual({
			zoom: false,
			reload: true,
			expand: true,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['zoom', 'expand'], null, 'ableToExpand')).toEqual({
			zoom: true,
			reload: false,
			expand: true,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand', 'zoom'], null, 'ableToExpand')).toEqual({
			zoom: true,
			reload: true,
			expand: true,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})
	})

	test('getControlsOptions (newWindow=null, sizeState="unableToExpand")', () => {
		const c = testGetControlsOptions

		expect(c([], null, 'unableToExpand')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: false
		})

		expect(c(['reload'], null, 'unableToExpand')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['zoom'], null, 'unableToExpand')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['expand'], null, 'unableToExpand')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: false
		})

		expect(c(['reload', 'zoom'], null, 'unableToExpand')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand'], null, 'unableToExpand')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['zoom', 'expand'], null, 'unableToExpand')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand', 'zoom'], null, 'unableToExpand')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: false,
			isControlsEnabled: true
		})
	})

	//here

	test('getControlsOptions (newWindow=defined, sizeState="expanded")', () => {
		const c = testGetControlsOptions

		expect(c([], 'nw', 'expanded')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload'], 'nw', 'expanded')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['zoom'], 'nw', 'expanded')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['expand'], 'nw', 'expanded')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload', 'zoom'], 'nw', 'expanded')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand'], 'nw', 'expanded')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['zoom', 'expand'], 'nw', 'expanded')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: true,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand', 'zoom'], 'nw', 'expanded')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: true,
			newWindow: true,
			isControlsEnabled: true
		})
	})

	test('getControlsOptions (newWindow=defined, sizeState="ableToExpand")', () => {
		const c = testGetControlsOptions

		expect(c([], 'nw', 'ableToExpand')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload'], 'nw', 'ableToExpand')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['zoom'], 'nw', 'ableToExpand')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['expand'], 'nw', 'ableToExpand')).toEqual({
			zoom: false,
			reload: false,
			expand: true,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload', 'zoom'], 'nw', 'ableToExpand')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand'], 'nw', 'ableToExpand')).toEqual({
			zoom: false,
			reload: true,
			expand: true,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['zoom', 'expand'], 'nw', 'ableToExpand')).toEqual({
			zoom: true,
			reload: false,
			expand: true,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand', 'zoom'], 'nw', 'ableToExpand')).toEqual({
			zoom: true,
			reload: true,
			expand: true,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})
	})

	test('getControlsOptions (newWindow=defined, sizeState="unableToExpand")', () => {
		const c = testGetControlsOptions

		expect(c([], 'nw', 'unableToExpand')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload'], 'nw', 'unableToExpand')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['zoom'], 'nw', 'unableToExpand')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['expand'], 'nw', 'unableToExpand')).toEqual({
			zoom: false,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload', 'zoom'], 'nw', 'unableToExpand')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand'], 'nw', 'unableToExpand')).toEqual({
			zoom: false,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['zoom', 'expand'], 'nw', 'unableToExpand')).toEqual({
			zoom: true,
			reload: false,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})

		expect(c(['reload', 'expand', 'zoom'], 'nw', 'unableToExpand')).toEqual({
			zoom: true,
			reload: true,
			expand: false,
			unexpand: false,
			newWindow: true,
			isControlsEnabled: true
		})
	})

	test('getSizeState', () => {
		const s = getSizeState

		expect(s('full', 1, 'normal')).toBe('ableToExpand')
		expect(s('full', 0.5, 'normal')).toBe('ableToExpand')
		expect(s('full', 1, 'large')).toBe('expanded')
		expect(s('full', 0.5, 'large')).toBe('expanded')
		expect(s('restricted', 1, 'normal')).toBe('unableToExpand')
		expect(s('restricted', 0.5, 'normal')).toBe('ableToExpand')
		expect(s('restricted', 1, 'large')).toBe('expanded')
		expect(s('restricted', 0.5, 'large')).toBe('expanded')
	})

	test('getMediaSize', () => {
		const m = getMediaSize
		const model = { get: () => 'id' }

		expect(m({ sizeById: {} }, model, 'default')).toBe('default')
		expect(m({ sizeById: { id: 'size' } }, model, 'default')).toBe('size')
	})

	test('getDisplayedTitle', () => {
		const t = getDisplayedTitle

		expect(t({ src: null, title: null })).toBe('IFrame missing src attribute')
		expect(t({ src: null, title: 'title' })).toBe('IFrame missing src attribute')
		expect(t({ src: 'src', title: null })).toBe('src')
		expect(t({ src: 'src', title: 'title' })).toBe('title')
		expect(t({ src: false, title: null })).toBe('')
	})

	test('getSetDimensions', () => {
		const d = getSetDimensions

		expect(d({ width: 'w', height: 'h' }, 'dw', 'dh')).toEqual({ w: 'w', h: 'h' })
		expect(d({ height: 'h' }, 'dw', 'dh')).toEqual({ w: 'dw', h: 'h' })
		expect(d({ width: 'w' }, 'dw', 'dh')).toEqual({ w: 'w', h: 'dh' })
		expect(d({}, 'dw', 'dh')).toEqual({ w: 'dw', h: 'dh' })
	})

	test('getScaleAmount', () => {
		const s = getScaleAmount

		expect(s(1, 2, 3)).toBe(-1 / 3)
		expect(s(3, 2, 1)).toBe(1)
		expect(s(100, 0, 1)).toBe(1)
		expect(s(200, 20, 400)).toBe(180 / 400)
	})

	test('getScaleDimensions (expandedSize="full", fit="scale")', () => {
		const d = getScaleDimensions
		const ms = { expandedSize: 'full', fit: 'scale' }

		expect(d(ms, 123, false, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123 * 0.5,
			containerStyle: {
				width: 'w'
			}
		})
		expect(d(ms, 123, true, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123,
			containerStyle: {}
		})
	})

	test('getScaleDimensions (expandedSize="restricted", fit="scale")', () => {
		const d = getScaleDimensions
		const ms = { expandedSize: 'restricted', fit: 'scale' }

		expect(d(ms, 123, false, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123 * 0.5,
			containerStyle: {
				width: 'w'
			}
		})
		expect(d(ms, 123, true, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123,
			containerStyle: {
				maxWidth: 'w',
				maxHeight: 'h'
			}
		})
	})

	test('getScaleDimensions (expandedSize="full", fit="scroll")', () => {
		const d = getScaleDimensions
		const ms = { expandedSize: 'full', fit: 'scroll' }

		expect(d(ms, 123, false, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123,
			containerStyle: {
				width: 'w',
				height: 'h'
			}
		})
		expect(d(ms, 123, true, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123,
			containerStyle: {}
		})
	})

	test('getScaleDimensions (expandedSize="restricted", fit="scale")', () => {
		const d = getScaleDimensions
		const ms = { expandedSize: 'restricted', fit: 'scroll' }

		expect(d(ms, 123, false, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123,
			containerStyle: {
				width: 'w',
				height: 'h'
			}
		})
		expect(d(ms, 123, true, 0.5, 0.1, { w: 'w', h: 'h' })).toEqual({
			scale: 123,
			containerStyle: {
				maxWidth: 'w',
				maxHeight: 'h'
			}
		})
	})

	test('getIFrameStyle', () => {
		const i = getIFrameStyle

		expect(i(721)).toEqual({
			transform: 'scale(721)',
			width: 1 / 721 * 100 + '%',
			height: 1 / 721 * 100 + '%'
		})
	})

	test('getAfterStyle', () => {
		const a = getAfterStyle

		expect(a(123, 456, 'scale')).toEqual({
			paddingTop: 456 / 123 * 100 + '%'
		})
		expect(a(123, 456, 'scroll')).toEqual({
			height: 456
		})
	})

	test('getZoomValues', () => {
		const z = getZoomValues
		let model

		model = {
			get: () => 'id',
			modelState: { zoom: 'model-zoom' }
		}
		expect(z({ zoomById: {} }, model)).toEqual({
			userZoom: null,
			initialZoom: 'model-zoom',
			currentZoom: 'model-zoom',
			isZoomDifferentFromInitial: false
		})
		expect(z({ zoomById: { id: 'user-zoom' } }, model)).toEqual({
			userZoom: 'user-zoom',
			initialZoom: 'model-zoom',
			currentZoom: 'user-zoom',
			isZoomDifferentFromInitial: true
		})
	})

	test('getRenderSettings', () => {
		const mediaState = {
			zoomById: {},
			sizeById: {},
			shown: {}
		}
		const model = {
			get: () => 'id',
			modelState: {
				zoom: 1,
				src: 'src',
				controls: ''
			}
		}
		expect(
			getRenderSettings(model, 500, 10, 'default-size', 123, 456, 0.1, mediaState)
		).toMatchSnapshot()
	})
})
