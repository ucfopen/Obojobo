import Viewer from 'Viewer'
const MediaUtil = Viewer.util.MediaUtil

import IFrameFitTypes from './iframe-fit-types'
import IFrameControlTypes from './iframe-control-types'

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

const getSetDimensions = (modelState, defaultWidth, defaultHeight) => ({
	w: modelState.width || defaultWidth,
	h: modelState.height || defaultHeight
})

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
	width: 1 / scale * 100 + '%',
	height: 1 / scale * 100 + '%'
})

const getAfterStyle = (setWidth, setHeight, fit) => {
	if (fit === IFrameFitTypes.SCALE) {
		return { paddingTop: setHeight / setWidth * 100 + '%' }
	}

	return { height: setHeight }
}

const getZoomValues = (mediaState, model) => {
	const userZoom = MediaUtil.getZoom(mediaState, model)
	const initialZoom = model.modelState.initialZoom
	const currentZoom = userZoom || initialZoom
	const isZoomDifferentFromInitial = currentZoom !== initialZoom

	return {
		userZoom,
		initialZoom,
		currentZoom,
		isZoomDifferentFromInitial
	}
}

const getRenderSettings = (
	model,
	actualWidth,
	padding,
	defaultWidth,
	defaultHeight,
	minScale,
	mediaState
) => {
	const ms = model.modelState
	const zoomValues = getZoomValues(mediaState, model)
	const zoom = zoomValues.currentZoom
	const setDimensions = getSetDimensions(ms, defaultWidth, defaultHeight)
	const scaleAmount = getScaleAmount(actualWidth, padding, setDimensions.w)
	const displayedTitle = getDisplayedTitle(ms)
	const scaleDimensions = getScaleDimensions(ms, zoom, scaleAmount, minScale, setDimensions)
	const controlsOpts = getControlsOptions(ms)
	const isAtMinScale = scaleDimensions.scale === minScale
	const iframeStyle = getIFrameStyle(scaleDimensions.scale)
	const afterStyle = getAfterStyle(setDimensions.w, setDimensions.h, ms.fit)
	const isShowing = getIsShowing(mediaState, model)

	return {
		zoomValues,
		zoom,
		displayedTitle,
		scaleDimensions,
		isShowing,
		controlsOpts,
		isAtMinScale,
		iframeStyle,
		afterStyle
	}
}

export {
	getIsShowing,
	getControlsOptions,
	getDisplayedTitle,
	getSetDimensions,
	getScaleAmount,
	getScaleDimensions,
	getIFrameStyle,
	getAfterStyle,
	getZoomValues,
	getRenderSettings
}
