import './viewer-component.scss'

import isOrNot from '../../../src/scripts/common/isornot'

import Common from 'Common'
let { OboComponent, DeleteButton, Button } = Common.components
let { Dispatcher } = Common.flux
let MediaUtil = Viewer.util.MediaUtil

const DEFAULT_WIDTH = 710
const DEFAULT_HEIGHT = 500

export default class IFrame extends React.Component {
	constructor(props) {
		super(props)

		this.boundOnClickBlocker = this.onClickBlocker.bind(this)
		this.boundOnClickExpand = this.onClickExpand.bind(this)
		this.boundOnClickExpandClose = this.onClickExpandClose.bind(this)
		this.boundOnViewerContentAreaResized = this.onViewerContentAreaResized.bind(this)

		this.state = {
			// loaded: this.props.model.modelState.autoload,
			initialActualWidth: 0,
			actualWidth: 0,
			expanded: false,
			padding: 0
		}
	}

	isShowing() {
		return this.props.model.modelState.autoload || MediaUtil.isShowingMedia(this.props.moduleData.mediaState, this.props.model)
	}

	getMeasuredDimensions() {
		let cs = window.getComputedStyle(ReactDOM.findDOMNode(this.refs.main), null)
		
		return {
			width: ReactDOM.findDOMNode(this).getBoundingClientRect().width,
			padding: parseFloat(cs.getPropertyValue('padding-left')) + parseFloat(cs.getPropertyValue('padding-right'))
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
		if (this.isShowing()) return

		// this.setState({
		// 	loaded: true
		// })
		MediaUtil.show(this.props.model.get('id'))
	}

	onClickExpand() {
		this.setState({
			expanded: true
		})
	}

	onClickExpandClose() {
		this.setState({
			expanded: false
		})
	}

	componentDidMount() {
		let dims = this.getMeasuredDimensions()

		this.setState({
			actualWidth: dims.width,
			padding: dims.padding
		})

		if(window.ResizeObserver && window.ResizeObserver.prototype && window.ResizeObserver.prototype.observe && window.ResizeObserver.prototype.disconnect)
		{
			this.resizeObserver = new ResizeObserver(this.boundOnViewerContentAreaResized)
			this.resizeObserver.observe(ReactDOM.findDOMNode(this))
		}
		else
		{
			Dispatcher.on('viewer:contentAreaResized', this.boundOnViewerContentAreaResized)
		}
	}

	componentWillUnmount() {
		if(this.resizeObserver) this.resizeObserver.disconnect()
		Dispatcher.off('viewer:contentAreaResized', this.boundOnViewerContentAreaResized )

		if(!this.props.model.modelState.autoload && MediaUtil.isShowingMedia(this.props.moduleData.mediaState, this.props.model))
		{
			MediaUtil.hide(this.props.model.get('id'))
		}
	}

	render() {
		let ms = this.props.model.modelState
		let w = ms.width || DEFAULT_WIDTH
		let h = ms.height || DEFAULT_HEIGHT

		// if (h % 2 !== 0) h += 0.5

		// if(w === null)
		// {
		// 	w = this.state.initialActualWidth - this.state.padding
		// }

		let scale

		let containerStyle

		// let testScale = Math.min(1, (this.state.actualWidth - this.state.padding) / w) * ms.scale
		// let fit = ms.fit

		// if(testScale < ms.forceScrollFitAtScale)
		// {
		// 	fit = 'scroll'
		// }

		if (this.state.expanded) {
			scale = ms.expandedScale

			containerStyle = {
				width: 'calc(100% - 1em)',
				height: 'calc(100% - 4.5em)'
			}

			if (ms.expandedSize === 'restricted') {
				containerStyle.maxWidth = w
				containerStyle.maxHeight = h
			}
		} else {
			if (ms.fit === 'scroll') {
				scale = ms.scale
				containerStyle = {
					width: w,
					height: h
				}
			} else {
				scale = Math.min(1, (this.state.actualWidth - this.state.padding) / w) * ms.scale
				// scale = Math.min(1, (this.state.actualWidth - 0) / w) * ms.scale
				containerStyle = {
					width: w
				}
			}
		}

		scale = Math.min(1, scale)

		let iframeStyle = {
			transform: `scale(${scale})`,
			width: 1 / scale * 100 + '%',
			height: 1 / scale * 100 + '%'
		}

		let isShowing = this.isShowing()

		let shouldShowExpandButton =
			isShowing &&
			ms.expand &&
			!this.state.expanded &&
			(ms.expandedSize === 'full' || (ms.expandedSize === 'restricted' && scale < 1))

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<div
					className={
						'obojobo-draft--chunks--iframe viewer pad' +
						isOrNot(ms.border, 'bordered') +
						isOrNot(isShowing, 'showing') +
						isOrNot(ms.expand, 'expandable') +
						isOrNot(this.state.expanded, 'expanded')
					}
					ref="main"
				>
					{this.state.expanded ? (
						<div className="expanded-background" onClick={this.boundOnClickExpandClose} />
					) : null}
					<div
						className="container"
						ref="container"
						onClick={this.boundOnClickBlocker}
						style={containerStyle}
					>
						<div className="iframe-container" ref="iframeContainer">
							{!isShowing ? (
								<div className="blocker" style={iframeStyle} />
							) : (
								<iframe
									ref="iframe"
									src={ms.src}
									is
									frameBorder="0"
									allowFullScreen="true"
									allow={ms.allow}
									style={iframeStyle}
								/>
							)}
						</div>
						{ms.fit === 'scale' ? (
							<div
								className="after"
								style={{
									paddingTop: h / w * 100 + '%'
								}}
							/>
						) : (
							<div
								className="after"
								style={{
									height: h
								}}
							/>
						)}
						{isShowing ? null : (
							<div className="click-to-load">
								<span className="title">{ms.title || ms.src.replace(/^https?:\/\//,'')}</span>
								<Button>View Content</Button>
							</div>
						)}
						{shouldShowExpandButton ? (
							<div className="expand">
								<button className="expand-button" onClick={this.boundOnClickExpand}>
									Expand
								</button>
							</div>
						) : null}
						{this.state.expanded ? <DeleteButton onClick={this.boundOnClickExpandClose} /> : null}
					</div>
					{this.state.expanded ? (
						<div
							className="container-placeholder"
							style={{
								width: w,
								height: h
							}}
						/>
					) : null}
					{ms.newWindow ? (
						<div className="new-window-link">
							<a target="_blank" href={ms.newWindowSrc ? ms.newWindowSrc : ms.src}>
								View in a new window
							</a>

							<span className="tool-tip">{ms.newWindowSrc ? ms.newWindowSrc : ms.src}</span>
						</div>
					) : null}
				</div>
			</OboComponent>
		)
	}
}
