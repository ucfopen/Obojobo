// @TODO
/* eslint react/no-string-refs: 0 */
/* eslint react/no-find-dom-node: 0 */
/* eslint no-undef: 0 */

import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import Controls from './controls'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
import React from 'react'
import ReactDOM from 'react-dom'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import { getRenderSettings } from './render-settings'

const DEFAULT_WIDTH = 710
const DEFAULT_HEIGHT = 500
const MIN_SCALE = 0.1
const MAX_SCALE = 10
const DECREASE_ZOOM_STEP = -0.1
const INCREASE_ZOOM_STEP = 0.1

const { OboComponent } = Viewer.components
const { Button } = Common.components
const { withProtocol } = Common.util
const Dispatcher = Common.flux.Dispatcher
const MediaUtil = Viewer.util.MediaUtil
const isOrNot = Common.util.isOrNot

export default class IFrame extends React.Component {
	constructor(props) {
		super(props)

		this.boundOnClickContainer = this.onClickContainer.bind(this)
		this.boundOnZoomReset = this.onClickZoomReset.bind(this)
		this.boundOnReload = this.onClickReload.bind(this)
		this.boundOnViewerContentAreaResized = this.onViewerContentAreaResized.bind(this)
		this.boundSkipToBottom = this.onClickSkipToBottom.bind(this)
		this.boundSkipToTop = this.onClickSkipToTop.bind(this)

		MediaUtil.setDefaultZoom(this.props.model.get('id'), this.props.model.modelState.initialZoom)

		this.state = {
			actualWidth: 0,
			padding: 0
		}
	}

	onClickSkipToBottom() {
		this.refs.buttonSkipToTop.focus()
	}

	onClickSkipToTop() {
		this.refs.buttonSkipToBottom.focus()
	}

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

	onClickContainer() {
		MediaUtil.show(this.props.model.get('id'))
		FocusUtil.focusComponent(this.props.model.get('id'))
	}

	onClickZoomReset() {
		MediaUtil.resetZoom(this.props.model.get('id'))
	}

	onClickSetZoom(newZoom) {
		MediaUtil.setZoom(this.props.model.get('id'), newZoom)
	}

	onClickReload() {
		this.refs.iframe.src = withProtocol(this.props.model.modelState.src)
	}

	componentDidMount() {
		const dims = this.getMeasuredDimensions()

		this.setState({
			actualWidth: dims.width,
			padding: dims.padding
		})

		if (
			window.ResizeObserver &&
			window.ResizeObserver.prototype &&
			window.ResizeObserver.prototype.observe &&
			window.ResizeObserver.prototype.disconnect
		) {
			this.resizeObserver = new ResizeObserver(this.boundOnViewerContentAreaResized)
			this.resizeObserver.observe(ReactDOM.findDOMNode(this.refs.self))
		} else {
			Dispatcher.on('viewer:contentAreaResized', this.boundOnViewerContentAreaResized)
		}
	}

	isMediaNeedingToBeHidden() {
		return (
			!this.props.model.modelState.autoload &&
			MediaUtil.isShowingMedia(this.props.moduleData.mediaState, this.props.model)
		)
	}

	componentWillUnmount() {
		if (this.resizeObserver) this.resizeObserver.disconnect()
		Dispatcher.off('viewer:contentAreaResized', this.boundOnViewerContentAreaResized)

		if (this.isMediaNeedingToBeHidden()) {
			MediaUtil.hide(this.props.model.get('id'), 'viewerClient')
		}
	}

	render() {
		const model = this.props.model
		const ms = model.modelState

		const {
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
		} = getRenderSettings(
			model,
			this.state.actualWidth,
			this.state.padding,
			DEFAULT_WIDTH,
			DEFAULT_HEIGHT,
			MIN_SCALE,
			MAX_SCALE,
			this.props.moduleData.mediaState
		)

		const src = withProtocol(ms.src)

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
						isOrNot(ms.border, 'bordered') +
						isOrNot(isShowing, 'showing') +
						isOrNot(controlsOpts.isControlsEnabled, 'controls-enabled') +
						isOrNot(ms.src === null, 'missing-src') +
						isOrNot(scaleDimensions.scale > 1, 'scaled-up')
					}
					ref="main"
				>
					<div
						className="container"
						onClick={!isShowing && ms.src !== null ? this.boundOnClickContainer : null}
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
									title={ms.title}
									src={src}
									frameBorder="0"
									allow="geolocation; microphone; camera; midi; encrypted-media; vr; fullscreen"
									style={iframeStyle}
									loading="lazy"
								/>
							) : (
								<div className="blocker" style={iframeStyle} />
							)}
						</div>
						<div className="after" style={afterStyle} />
						{isShowing ? null : (
							<div className="click-to-load">
								<span className="title" aria-hidden>
									{this.props.title || displayedTitle}
								</span>
								{ms.src === null ? null : (
									<Button ariaLabel="Click to load external content">View Content</Button>
								)}
							</div>
						)}
						{isShowing ? (
							<Button
								altAction
								className="button-skip bottom"
								ref="buttonSkipToTop"
								onClick={this.boundSkipToTop}
							>
								You are at the end of this embedded content. Click to skip to the beginning.
							</Button>
						) : null}
						{isShowing ? (
							<Controls
								newWindowSrc={src}
								controlsOptions={controlsOpts}
								isZoomResettable={!zoomValues.isZoomAtDefault}
								isZoomOutDisabled={isAtMinScale}
								isZoomInDisabled={isAtMaxScale}
								reload={this.boundOnReload}
								zoomIn={this.onClickSetZoom.bind(
									this,
									parseFloat((zoomValues.currentZoom + INCREASE_ZOOM_STEP).toFixed(2))
								)}
								zoomOut={this.onClickSetZoom.bind(
									this,
									parseFloat((zoomValues.currentZoom + DECREASE_ZOOM_STEP).toFixed(2))
								)}
								zoomReset={this.boundOnZoomReset}
							/>
						) : null}
					</div>
				</div>
			</OboComponent>
		)
	}
}
