import IFrameControlTypes from './iframe-control-types'
import IFrameFitTypes from './iframe-fit-types'
import IFrameSizingTypes from './iframe-sizing-types'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import IFrameDefaultSizes from './iframe-default-sizes'
const MediaUtil = Viewer.util.MediaUtil

const DEFAULT_WIDTH = 640
const DEFAULT_HEIGHT = 480

const getIsShowing = (mediaState, model) => {
	return (
		(model.modelState.autoload || MediaUtil.isShowingMedia(mediaState, model)) &&
		model.modelState.src !== null
	)
}

const getControlsOptions = modelState => {
	const isZoomControlEnabled = modelState.controls.indexOf(IFrameControlTypes.ZOOM) > -1
	const isReloadControlEnabled = modelState.controls.indexOf(IFrameControlTypes.RELOAD) > -1
	const isNewWindowEnabled = modelState.controls.indexOf(IFrameControlTypes.NEW_WINDOW) > -1

	return {
		zoom: isZoomControlEnabled,
		reload: isReloadControlEnabled,
		newWindow: isNewWindowEnabled,
		isControlsEnabled: isZoomControlEnabled || isReloadControlEnabled || isNewWindowEnabled
	}
}

const getDisplayedTitle = modelState => {
	if (modelState.src === null) {
		return 'IFrame missing src attribute'
	} else if (modelState.title) {
		return modelState.title
	}

	return (modelState.src || '').replace(/^https?:\/\//, '')
}

const getAriaRegionLabel = (modelState, displayedTitle) => {
	if (modelState.title) {
		return 'External content "' + displayedTitle + '" from ' + modelState.src + '.'
	} else {
		return 'External content from ' + modelState.src + '.'
	}
}

const getSetDimensions = modelState => {
	switch (modelState.sizing) {
		case IFrameSizingTypes.MAX_WIDTH:
			return {
				w: IFrameDefaultSizes.MAX_WIDTH,
				h: modelState.height || DEFAULT_HEIGHT
			}

		case IFrameSizingTypes.TEXT_WIDTH:
			return {
				w: IFrameDefaultSizes.TEXT_WIDTH,
				h: modelState.height || DEFAULT_HEIGHT
			}

		default:
			return {
				w: modelState.width || DEFAULT_WIDTH,
				h: modelState.height || DEFAULT_HEIGHT
			}
	}
}

const getScaleAmount = (actualWidth, padding, setWidth) => {
	return Math.min(1, (actualWidth - padding) / setWidth)
}

const getScaleDimensions = (modelState, zoom, scaleAmount, minScale, setDimensions) => {
	let scale
	let containerStyle = {}

	if (modelState.fit === IFrameFitTypes.SCROLL) {
		scale = zoom
		containerStyle = {
			width: setDimensions.w,
			height: setDimensions.h
		}
	} else {
		scale = scaleAmount * zoom
		containerStyle = {
			width: setDimensions.w
		}
	}

	scale = Math.max(minScale, scale)

	return {
		scale,
		containerStyle
	}
}

const getIFrameStyle = scale => ({
	transform: `scale(${scale})`,
	width: (1 / scale) * 100 + '%',
	height: (1 / scale) * 100 + '%'
})

const getAfterStyle = (setWidth, setHeight, fit) => {
	if (fit === IFrameFitTypes.SCALE) {
		return { paddingTop: (setHeight / setWidth) * 100 + '%' }
	}

	return { height: setHeight }
}

const getZoomValues = (mediaState, model) => {
	const currentZoom = MediaUtil.getZoom(mediaState, model)
	const defaultZoom = MediaUtil.getDefaultZoom(mediaState, model)
	const isZoomAtDefault = MediaUtil.isZoomAtDefault(mediaState, model)

	return {
		currentZoom,
		defaultZoom,
		isZoomAtDefault
	}
}

const getRenderSettings = (model, actualWidth, padding, minScale, maxScale, mediaState) => {
	const ms = model.modelState
	const zoomValues = getZoomValues(mediaState, model)
	const setDimensions = getSetDimensions(ms)
	const scaleAmount = getScaleAmount(actualWidth, padding, setDimensions.w)
	const displayedTitle = getDisplayedTitle(ms)
	const ariaRegionLabel = getAriaRegionLabel(ms, displayedTitle)
	const scaleDimensions = getScaleDimensions(
		ms,
		zoomValues.currentZoom,
		scaleAmount,
		minScale,
		setDimensions
	)
	const controlsOpts = getControlsOptions(ms)
	const isAtMinScale = scaleDimensions.scale <= minScale
	const isAtMaxScale = scaleDimensions.scale >= maxScale
	const iframeStyle = getIFrameStyle(scaleDimensions.scale)
	const afterStyle = getAfterStyle(setDimensions.w, setDimensions.h, ms.fit)
	const isShowing = getIsShowing(mediaState, model)

	return {
		zoomValues,
		displayedTitle,
		ariaRegionLabel,
		scaleDimensions,
		isShowing,
		controlsOpts,
		isAtMinScale,
		isAtMaxScale,
		iframeStyle,
		afterStyle
	}
}

export {
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
}
