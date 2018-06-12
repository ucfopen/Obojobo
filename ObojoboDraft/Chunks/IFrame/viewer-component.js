import './viewer-component.scss'

// import parseURL from 'url-parse'

import React from 'react'
import ReactDOM from 'react-dom'

import Common from 'Common'
import Viewer from 'Viewer'

import Controls from './controls'
import { getRenderSettings } from './render-settings'

let DEFAULT_WIDTH = 710
let DEFAULT_HEIGHT = 500
let MIN_SCALE = 0.1

let { OboComponent, Button } = Common.components
let Dispatcher = Common.flux.Dispatcher
let MediaUtil = Viewer.util.MediaUtil
let NavUtil = Viewer.util.NavUtil
let MediaStore = Viewer.stores.MediaStore
let Logo = Viewer.components.Logo
let Header = Viewer.components.Header
let isOrNot = Common.util.isOrNot

export default class IFrame extends React.Component {
	constructor(props) {
		super(props)

		this.boundOnClickBlocker = this.onClickBlocker.bind(this)
		this.boundOnClickExpand = this.onClickExpand.bind(this)
		this.boundOnClickExpandClose = this.onClickExpandClose.bind(this)
		this.boundOnZoomReset = this.onClickZoomReset.bind(this)
		this.boundOnReload = this.onClickReload.bind(this)
		this.boundOnViewerContentAreaResized = this.onViewerContentAreaResized.bind(this)

		this.state = {
			actualWidth: 0,
			padding: 0
		}
	}

	getMeasuredDimensions() {
		let cs = window.getComputedStyle(ReactDOM.findDOMNode(this.refs.main), null)

		return {
			width: ReactDOM.findDOMNode(this).getBoundingClientRect().width,
			padding:
				parseFloat(cs.getPropertyValue('padding-left')) +
				parseFloat(cs.getPropertyValue('padding-right'))
		}
	}

	onViewerContentAreaResized() {
		let dims = this.getMeasuredDimensions()

		this.setState({
			actualWidth: dims.width,
			padding: dims.padding
		})
	}

	onClickBlocker() {
		MediaUtil.show(this.props.model.get('id'))
	}

	onClickExpand() {
		MediaUtil.setSize(this.props.model.get('id'), 'large')
	}

	onClickExpandClose() {
		MediaUtil.setSize(this.props.model.get('id'), null)
	}

	onClickZoomReset() {
		MediaUtil.resetZoom(this.props.model.get('id'))
	}

	onClickSetZoom(newZoom) {
		MediaUtil.setZoom(this.props.model.get('id'), newZoom)
	}

	onClickReload() {
		let src = this.props.model.modelState.src

		this.refs.iframe.src = ''
		setTimeout(() => {
			this.refs.iframe.src = src
		})
	}

	componentDidMount() {
		let dims = this.getMeasuredDimensions()

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
			this.resizeObserver.observe(ReactDOM.findDOMNode(this))
		} else {
			Dispatcher.on('viewer:contentAreaResized', this.boundOnViewerContentAreaResized)
		}
	}

	componentWillUnmount() {
		if (this.resizeObserver) this.resizeObserver.disconnect()
		Dispatcher.off('viewer:contentAreaResized', this.boundOnViewerContentAreaResized)

		if (
			!this.props.model.modelState.autoload &&
			MediaUtil.isShowingMedia(this.props.moduleData.mediaState, this.props.model)
		) {
			MediaUtil.hide(this.props.model.get('id'), 'viewerClient')
		}
	}

	renderExpandedBackground() {
		return (
			<div className="expanded-background">
				<Header
					logoPosition="left"
					moduleTitle={this.props.moduleData.model.title}
					location={NavUtil.getNavTargetModel(this.props.moduleData.navState).title || ''}
				/>
				<Button onClick={this.boundOnClickExpandClose}>Close</Button>
			</div>
		)
	}

	render() {
		let model = this.props.model
		let ms = model.modelState

		let {
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
		} = getRenderSettings(
			model,
			this.state.actualWidth,
			this.state.padding,
			MediaStore.constructor.SIZE_DEFAULT,
			DEFAULT_WIDTH,
			DEFAULT_HEIGHT,
			MIN_SCALE,
			this.props.moduleData.mediaState
		)

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<div
					className={
						'obojobo-draft--chunks--iframe viewer pad' +
						isOrNot(this.props.moduleData.isPreviewing, 'previewing') +
						isOrNot(ms.border, 'bordered') +
						isOrNot(isShowing, 'showing') +
						isOrNot(controlsOpts.isControlsEnabled, 'controls-enabled') +
						isOrNot(ms.src === null, 'missing-src') +
						isOrNot(scaleDimensions.scale > 1, 'scaled-up') +
						(' is-size-' + mediaSize)
					}
					ref="main"
				>
					{isExpanded ? this.renderExpandedBackground() : null}
					<div
						className="container"
						ref="container"
						onClick={isShowing || ms.src !== null ? this.boundOnClickBlocker : null}
						style={scaleDimensions.containerStyle}
					>
						<div className="iframe-container" ref="iframeContainer">
							{!isShowing ? (
								<div className="blocker" style={iframeStyle} />
							) : (
								<iframe
									ref="iframe"
									title={ms.title}
									src={ms.src}
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
							newWindowSrc={ms.newWindowSrc ? ms.newWindowSrc : ms.src}
							controlsOptions={controlsOpts}
							isZoomAbleToBeReset={zoomValues.isZoomDifferentFromInitial}
							isUnableToZoomOut={isAtMinScale}
							reload={this.boundOnReload}
							zoomIn={this.onClickSetZoom.bind(this, zoom + 0.1)}
							zoomOut={this.onClickSetZoom.bind(this, zoom - 0.1)}
							zoomReset={this.boundOnZoomReset}
							expand={this.boundOnClickExpand}
							expandClose={this.boundOnClickExpandClose}
						/>
					</div>
				</div>
			</OboComponent>
		)
	}
}
