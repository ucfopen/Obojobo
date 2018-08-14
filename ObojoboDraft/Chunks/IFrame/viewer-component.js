import './viewer-component.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import Common from 'Common'
import Viewer from 'Viewer'

import Controls from './controls'
import { getRenderSettings } from './render-settings'

const DEFAULT_WIDTH = 710
const DEFAULT_HEIGHT = 500
const MIN_SCALE = 0.1

const { OboComponent, Button } = Common.components
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

		this.state = {
			actualWidth: 0,
			padding: 0
		}
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
	}

	onClickZoomReset() {
		MediaUtil.resetZoom(this.props.model.get('id'))
	}

	onClickSetZoom(newZoom) {
		MediaUtil.setZoom(this.props.model.get('id'), newZoom)
	}

	onClickReload() {
		this.refs.iframe.src = this.createSrc(this.props.model.modelState.src)
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

	render() {
		const model = this.props.model
		const ms = model.modelState

		const {
			zoomValues,
			zoom,
			displayedTitle,
			scaleDimensions,
			isShowing,
			controlsOpts,
			isAtMinScale,
			iframeStyle,
			afterStyle
		} = getRenderSettings(
			model,
			this.state.actualWidth,
			this.state.padding,
			DEFAULT_WIDTH,
			DEFAULT_HEIGHT,
			MIN_SCALE,
			this.props.moduleData.mediaState
		)

		const src = this.createSrc(ms.src)

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData} ref="self">
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
						<div className="iframe-container">
							{!isShowing ? (
								<div className="blocker" style={iframeStyle} />
							) : (
								<iframe
									ref="iframe"
									title={ms.title}
									src={src}
									is
									frameBorder="0"
									allow="geolocation; microphone; camera; midi; encrypted-media; vr"
									style={iframeStyle}
								/>
							)}
						</div>
						<div className="after" style={afterStyle} />
						{isShowing ? null : (
							<div className="click-to-load">
								<span className="title">{displayedTitle}</span>
								{ms.src === null ? null : <Button>View Content</Button>}
							</div>
						)}
						<Controls
							newWindowSrc={src}
							controlsOptions={controlsOpts}
							isZoomAbleToBeReset={zoomValues.isZoomDifferentFromInitial}
							isUnableToZoomOut={isAtMinScale}
							reload={this.boundOnReload}
							zoomIn={this.onClickSetZoom.bind(this, parseFloat((zoom + 0.1).toFixed(2)))}
							zoomOut={this.onClickSetZoom.bind(this, parseFloat((zoom - 0.1).toFixed(2)))}
							zoomReset={this.boundOnZoomReset}
						/>
					</div>
				</div>
			</OboComponent>
		)
	}
}
