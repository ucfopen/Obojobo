// @TODO
/* eslint react/no-string-refs: 0 */
/* eslint react/no-find-dom-node: 0 */
/* eslint no-undef: 0 */

import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import Controls from './controls'
// import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
import React from 'react'
import ReactDOM from 'react-dom'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import IFrameControlTypes from './iframe-control-types'
import IFrameFitTypes from './iframe-fit-types'
import { getRenderSettings } from './render-settings'

const DEFAULT_WIDTH = 710
const DEFAULT_HEIGHT = 500
const MIN_SCALE = 0.1
const MAX_SCALE = 10
const DECREASE_ZOOM_STEP = -0.1
const INCREASE_ZOOM_STEP = 0.1

const { OboComponent } = Viewer.components
const { Button } = Common.components
const Dispatcher = Common.flux.Dispatcher
const MediaUtil = Viewer.util.MediaUtil
const isOrNot = Common.util.isOrNot

export default class IFrame extends React.Component {
	constructor(props) {
		super(props)

		// this.boundOnClickContainer = this.onClickContainer.bind(this)
		// this.boundOnZoomReset = this.onClickZoomReset.bind(this)
		// this.boundOnReload = this.onClickReload.bind(this)
		// this.boundOnViewerContentAreaResized = this.onViewerContentAreaResized.bind(this)
		// this.boundSkipToBottom = this.onClickSkipToBottom.bind(this)
		// this.boundSkipToTop = this.onClickSkipToTop.bind(this)

		// MediaUtil.setDefaultZoom(
		// 	this.props.model.attributes.id,
		// 	this.props.model.modelState.initialZoom
		// )

		const {
			src,
			controls,
			title,
			type,
			fit,
			initialZoom,
			autoload,
			height,
			width,
			border
		} = this.props.model.attributes.content

		this.state = {
			actualWidth: 0,
			padding: 0,
			isShowing: autoload || false,
			displayedTitle: title || this.createSrc(src),
			zoon: initialZoom || 1,
			height: height || DEFAULT_HEIGHT,
			width: width || DEFAULT_WIDTH,
			border: border,
			src: this.createSrc(src),
			controls: controls,
			fit: fit,
			type: type
		}
	}

	// onClickSkipToBottom() {
	// 	this.refs.buttonSkipToTop.focus()
	// }

	// onClickSkipToTop() {
	// 	this.refs.buttonSkipToBottom.focus()
	// }

	getMeasuredDimensions() {
		const cs = window.getComputedStyle(this.refs.main, null)

		return {
			width: ReactDOM.findDOMNode(this.refs.self).getBoundingClientRect().width,
			padding:
				parseFloat(cs.getPropertyValue('padding-left')) +
				parseFloat(cs.getPropertyValue('padding-right'))
		}
	}

	onViewerContentAreaResized() {
		const dims = this.getMeasuredDimensions()

		this.setState({
			actualWidth: dims.width,
			padding: dims.padding
		})
	}

	// onClickContainer() {
	// 	MediaUtil.show(this.props.model.attributes.id)
	// 	// FocusUtil.focusComponent(this.props.model.attributes.id)
	// }

	// onClickZoomReset() {
	// 	MediaUtil.resetZoom(this.props.model.attributes.id)
	// }

	// onClickSetZoom(newZoom) {
	// 	MediaUtil.setZoom(this.props.model.attributes.id, newZoom)
	// }

	onClickReload() {
		this.refs.iframe.src = this.createSrc(this.state.src)
	}

	componentDidMount() {
		// const dims = this.getMeasuredDimensions()
		// this.setState({
		// 	actualWidth: dims.width,
		// 	padding: dims.padding
		// })
		// if (
		// 	window.ResizeObserver &&
		// 	window.ResizeObserver.prototype &&
		// 	window.ResizeObserver.prototype.observe &&
		// 	window.ResizeObserver.prototype.disconnect
		// ) {
		// 	this.resizeObserver = new ResizeObserver(this.boundOnViewerContentAreaResized)
		// 	this.resizeObserver.observe(ReactDOM.findDOMNode(this.refs.self))
		// } else {
		// 	Dispatcher.on('viewer:contentAreaResized', this.boundOnViewerContentAreaResized)
		// }
	}

	// isMediaNeedingToBeHidden() {
	// 	return (
	// 		!this.props.model.modelState.autoload &&
	// 		MediaUtil.isShowingMedia(this.props.moduleData.mediaState, this.props.model)
	// 	)
	// }

	componentWillUnmount() {
		// if (this.resizeObserver) this.resizeObserver.disconnect()
		// Dispatcher.off('viewer:contentAreaResized', this.boundOnViewerContentAreaResized)
		// if (this.isMediaNeedingToBeHidden()) {
		// 	MediaUtil.hide(this.props.model.attributes.id, 'viewerClient')
		// }
	}

	createSrc(src) {
		src = '' + src

		const lcSrc = src.toLowerCase()
		if (
			!(
				lcSrc.indexOf('http://') === 0 ||
				lcSrc.indexOf('https://') === 0 ||
				lcSrc.indexOf('//') === 0
			)
		) {
			src = '//' + src
		}

		return src
	}

	getIFrameStyle(scale) {
		return {
			transform: `scale(${scale})`,
			width: (1 / scale) * 100 + '%',
			height: (1 / scale) * 100 + '%'
		}
	}

	onShowContent() {
		this.setState({
			isShowing: true
		})
	}

	getControlsOptions(modelState) {
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

	getZoomValues() {
		const currentZoom = this.state.zoon
		const defaultZoom = this.props.model.attributes.initialZoom || 1
		const isZoomAtDefault = currentZoom === defaultZoom

		return {
			currentZoom,
			defaultZoom,
			isZoomAtDefault
		}
	}

	getScaleDimensions() {
		let scale
		let containerStyle = {}

		if (this.state.fit === IFrameFitTypes.SCROLL) {
			scale = this.state.zoom
			containerStyle = {
				width: this.state.width,
				height: this.state.height
			}
		} else {
			scale = this.getScaleAmount() * this.state.zoom
			containerStyle = {
				width: this.state.width
			}
		}

		scale = Math.max(MIN_SCALE, scale)

		return {
			scale,
			containerStyle
		}
	}

	getScaleAmount() {
		return Math.min(1, (this.state.width - this.state.padding) / this.state.width)
	}

	render() {
		const model = this.props.model
		const { isShowing, src, displayedTitle, initialZoom, border } = this.state

		const ariaRegionLabel = 'test'
		const afterStyle = { height: 500 }
		const controlsOpts = this.getControlsOptions(model.modelState)
		const zoomValues = this.getZoomValues()
		const scaleDimensions = this.getScaleDimensions()
		const isAtMinScale = scaleDimensions.scale <= MIN_SCALE
		const isAtMaxScale = scaleDimensions.scale >= MAX_SCALE
		const newIframeStyle = this.getIFrameStyle(initialZoom || 1)

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				ref="self"
				role="region"
				aria-label={ariaRegionLabel}
			>
				<div
					className={
						'obojobo-draft--chunks--iframe viewer pad' +
						isOrNot(this.props.moduleData.isPreviewing, 'previewing') +
						isOrNot(border, 'bordered') +
						isOrNot(isShowing, 'showing') +
						isOrNot(controlsOpts.isControlsEnabled, 'controls-enabled') +
						isOrNot(src === null, 'missing-src') +
						isOrNot(scaleDimensions.scale > 1, 'scaled-up')
					}
					ref="main"
				>
					<div
						className="container"
						onClick={!isShowing && src !== null ? () => this.onShowContent() : null}
						style={scaleDimensions.containerStyle}
					>
						{isShowing ? (
							<Button
								altAction
								className="button-skip top"
								ref="buttonSkipToBottom"
								onClick={this.boundSkipToBottom}
							>
								You are at the beginning of this embedded content. Click to skip to the end.
							</Button>
						) : null}
						<div className="iframe-container">
							{isShowing ? (
								<iframe
									ref="iframe"
									title={displayedTitle}
									src={src}
									frameBorder="0"
									allow="geolocation; microphone; camera; midi; encrypted-media; vr"
									style={newIframeStyle}
								/>
							) : (
								<div className="blocker" style={newIframeStyle} />
							)}
						</div>
						<div className="after" style={afterStyle} />
						{isShowing ? null : (
							<div className="click-to-load">
								<span className="title" aria-hidden>
									{displayedTitle}
								</span>
								{src === null ? null : (
									<Button
										ariaLabel="Click to load external content"
										onClick={() => this.onShowContent()}
									>
										View Content
									</Button>
								)}
							</div>
						)}
						{/* {isShowing ? (
							<Button
								altAction
								className="button-skip bottom"
								ref="buttonSkipToTop"
								onClick={this.boundSkipToTop}
							>
								You are at the end of this embedded content. Click to skip to the beginning.
							</Button>
						) : null} */}
						{isShowing ? (
							<Controls
								newWindowSrc={src}
								controlsOptions={controlsOpts}
								isZoomResettable={!zoomValues.isZoomAtDefault}
								isZoomOutDisabled={isAtMinScale}
								isZoomInDisabled={isAtMaxScale}
								reload={() => this.onClickReload()}
								// zoomIn={this.onClickSetZoom.bind(
								// 	this,
								// 	parseFloat((zoomValues.currentZoom + INCREASE_ZOOM_STEP).toFixed(2))
								// )}
								// zoomOut={this.onClickSetZoom.bind(
								// 	this,
								// 	parseFloat((zoomValues.currentZoom + DECREASE_ZOOM_STEP).toFixed(2))
								// )}
								// zoomReset={this.boundOnZoomReset}
							/>
						) : null}
					</div>
				</div>
			</OboComponent>
		)
	}
}
