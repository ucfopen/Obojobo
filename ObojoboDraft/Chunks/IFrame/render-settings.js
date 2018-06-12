import Viewer from 'Viewer'
let MediaUtil = Viewer.util.MediaUtil

let SIZE_STATE_EXPANDED = 'expanded'
let SIZE_STATE_ABLE_TO_EXPAND = 'ableToExpand'
let SIZE_STATE_UNABLE_TO_EXPAND = 'unableToExpand'

let getIsShowing = (mediaState, model) => {
	return (
		(model.modelState.autoload || MediaUtil.isShowingMedia(mediaState, model)) &&
		model.modelState.src !== null
	)
}

let getControlsOptions = (modelState, sizeState) => {
	let isZoomControlEnabled = modelState.controls.indexOf('zoom') > -1
	let isReloadControlEnabled = modelState.controls.indexOf('reload') > -1
	let isExpandControlNeeded =
		modelState.controls.indexOf('expand') > -1 && sizeState === SIZE_STATE_ABLE_TO_EXPAND
	let isUnexpandControlNeeded = sizeState === SIZE_STATE_EXPANDED
	let newWindowEnabled = modelState.newWindow !== null

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

let getSizeState = (expandedSize, scaleAmount, mediaSize) => {
	if (mediaSize === 'large') return SIZE_STATE_EXPANDED
	if (expandedSize === 'full' || (expandedSize === 'restricted' && scaleAmount < 1))
		return SIZE_STATE_ABLE_TO_EXPAND
	return SIZE_STATE_UNABLE_TO_EXPAND
}

let getMediaSize = (mediaState, model, defaultSizeIfNotSet) => {
	return MediaUtil.getSize(mediaState, model) || defaultSizeIfNotSet
}

let getDisplayedTitle = modelState => {
	if (modelState.src === null) {
		return 'IFrame missing src attribute'
	} else if (modelState.title) {
		return modelState.title
	}

	return (modelState.src || '').replace(/^https?:\/\//, '')
}

let getSetDimensions = (modelState, defaultWidth, defaultHeight) => {
	return {
		w: modelState.width || defaultWidth,
		h: modelState.height || defaultHeight
	}
}

let getScaleAmount = (actualWidth, padding, setWidth) => {
	return Math.min(1, (actualWidth - padding) / setWidth)
}

let getScaleDimensions = (modelState, zoom, isExpanded, scaleAmount, minScale, setDimensions) => {
	let scale
	let containerStyle = {}

	if (isExpanded) {
		scale = zoom

		if (modelState.expandedSize === 'restricted') {
			containerStyle.maxWidth = setDimensions.w
			containerStyle.maxHeight = setDimensions.h
		}
	} else {
		if (modelState.fit === 'scroll') {
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
	}

	scale = Math.max(minScale, scale)

	return {
		scale,
		containerStyle
	}
}

let getIFrameStyle = scale => {
	return {
		transform: `scale(${scale})`,
		width: 1 / scale * 100 + '%',
		height: 1 / scale * 100 + '%'
	}
}

let getAfterStyle = (setWidth, setHeight, fit) => {
	return fit === 'scale'
		? {
				paddingTop: setHeight / setWidth * 100 + '%'
		  }
		: {
				height: setHeight
		  }
}

let getZoomValues = (mediaState, model) => {
	let userZoom = MediaUtil.getZoom(mediaState, model)
	let initialZoom = model.modelState.zoom
	let currentZoom = userZoom || initialZoom
	let isZoomDifferentFromInitial = currentZoom !== initialZoom

	return {
		userZoom,
		initialZoom,
		currentZoom,
		isZoomDifferentFromInitial
	}
}

let getRenderSettings = (
	model,
	actualWidth,
	padding,
	defaultSize,
	defaultWidth,
	defaultHeight,
	minScale,
	mediaState
) => {
	let ms = model.modelState
	let zoomValues = getZoomValues(mediaState, model)
	let zoom = zoomValues.currentZoom
	let setDimensions = getSetDimensions(ms, defaultWidth, defaultHeight)
	let mediaSize = getMediaSize(mediaState, model, defaultSize)
	let scaleAmount = getScaleAmount(actualWidth, padding, setDimensions.w)
	let displayedTitle = getDisplayedTitle(ms)
	let sizeState = getSizeState(ms.expandedSize, scaleAmount, mediaSize)
	let isExpanded = sizeState === SIZE_STATE_EXPANDED
	let scaleDimensions = getScaleDimensions(
		ms,
		zoom,
		isExpanded,
		scaleAmount,
		minScale,
		setDimensions
	)
	let controlsOpts = getControlsOptions(ms, sizeState)
	let isAtMinScale = scaleDimensions.scale === minScale
	let iframeStyle = getIFrameStyle(scaleDimensions.scale)
	let afterStyle = getAfterStyle(setDimensions.w, setDimensions.h, ms.fit)
	let isShowing = getIsShowing(mediaState, model)

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
