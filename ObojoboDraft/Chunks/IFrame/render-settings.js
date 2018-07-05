//@TODO: This includes the expand button features. Need to make this work in all containers
//including those that create a new stacking context

import Viewer from 'Viewer'
const MediaUtil = Viewer.util.MediaUtil

const SIZE_STATE_EXPANDED = 'expanded'
const SIZE_STATE_ABLE_TO_EXPAND = 'ableToExpand'
const SIZE_STATE_UNABLE_TO_EXPAND = 'unableToExpand'

const getIsShowing = (mediaState, model) => {
	return (
		(model.modelState.autoload || MediaUtil.isShowingMedia(mediaState, model)) &&
		model.modelState.src !== null
	)
}

const getControlsOptions = (modelState, sizeState) => {
	const isZoomControlEnabled = modelState.controls.indexOf('zoom') > -1
	const isReloadControlEnabled = modelState.controls.indexOf('reload') > -1
	const isExpandControlNeeded =
		modelState.controls.indexOf('expand') > -1 && sizeState === SIZE_STATE_ABLE_TO_EXPAND
	const isUnexpandControlNeeded = sizeState === SIZE_STATE_EXPANDED
	const newWindowEnabled = modelState.newWindow !== null

	return {
		zoom: isZoomControlEnabled,
		reload: isReloadControlEnabled,
		expand: isExpandControlNeeded,
		unexpand: isUnexpandControlNeeded,
		newWindow: newWindowEnabled,
		isControlsEnabled:
			isZoomControlEnabled ||
			isReloadControlEnabled ||
			isExpandControlNeeded ||
			isUnexpandControlNeeded ||
			newWindowEnabled
	}
}

const getSizeState = (expandedSize, scaleAmount, mediaSize) => {
	if (mediaSize === 'large') return SIZE_STATE_EXPANDED
	if (expandedSize === 'full' || (expandedSize === 'restricted' && scaleAmount < 1)) {
		return SIZE_STATE_ABLE_TO_EXPAND
	}
	return SIZE_STATE_UNABLE_TO_EXPAND
}

const getMediaSize = (mediaState, model, defaultSizeIfNotSet) => {
	return MediaUtil.getSize(mediaState, model) || defaultSizeIfNotSet
}

const getDisplayedTitle = modelState => {
	if (modelState.src === null) {
		return 'IFrame missing src attribute'
	} else if (modelState.title) {
		return modelState.title
	}

	return (modelState.src || '').replace(/^https?:\/\//, '')
}

const getSetDimensions = (modelState, defaultWidth, defaultHeight) => {
	return {
		w: modelState.width || defaultWidth,
		h: modelState.height || defaultHeight
	}
}

const getScaleAmount = (actualWidth, padding, setWidth) => {
	return Math.min(1, (actualWidth - padding) / setWidth)
}

const getScaleDimensions = (modelState, zoom, isExpanded, scaleAmount, minScale, setDimensions) => {
	let scale
	let containerStyle = {}

	if (isExpanded) {
		scale = zoom

		if (modelState.expandedSize === 'restricted') {
			containerStyle.maxWidth = setDimensions.w
			containerStyle.maxHeight = setDimensions.h
		}
	} else if (modelState.fit === 'scroll') {
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

const getIFrameStyle = scale => {
	return {
		transform: `scale(${scale})`,
		width: 1 / scale * 100 + '%',
		height: 1 / scale * 100 + '%'
	}
}

const getAfterStyle = (setWidth, setHeight, fit) => {
	return fit === 'scale'
		? {
				paddingTop: setHeight / setWidth * 100 + '%'
		  }
		: {
				height: setHeight
		  }
}

const getZoomValues = (mediaState, model) => {
	const userZoom = MediaUtil.getZoom(mediaState, model)
	const initialZoom = model.modelState.zoom
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
	defaultSize,
	defaultWidth,
	defaultHeight,
	minScale,
	mediaState
) => {
	const ms = model.modelState
	const zoomValues = getZoomValues(mediaState, model)
	const zoom = zoomValues.currentZoom
	const setDimensions = getSetDimensions(ms, defaultWidth, defaultHeight)
	const mediaSize = getMediaSize(mediaState, model, defaultSize)
	const scaleAmount = getScaleAmount(actualWidth, padding, setDimensions.w)
	const displayedTitle = getDisplayedTitle(ms)
	const sizeState = getSizeState(ms.expandedSize, scaleAmount, mediaSize)
	const isExpanded = sizeState === SIZE_STATE_EXPANDED
	const scaleDimensions = getScaleDimensions(
		ms,
		zoom,
		isExpanded,
		scaleAmount,
		minScale,
		setDimensions
	)
	const controlsOpts = getControlsOptions(ms, sizeState)
	const isAtMinScale = scaleDimensions.scale === minScale
	const iframeStyle = getIFrameStyle(scaleDimensions.scale)
	const afterStyle = getAfterStyle(setDimensions.w, setDimensions.h, ms.fit)
	const isShowing = getIsShowing(mediaState, model)

	return {
		zoomValues,
		zoom,
		mediaSize,
		displayedTitle,
		isExpanded,
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
}
