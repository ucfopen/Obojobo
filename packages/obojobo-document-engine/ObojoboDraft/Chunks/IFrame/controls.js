import './controls.scss'

import React from 'react'
import parseURL from 'url-parse'

import Common from 'Common'
const isOrNot = Common.util.isOrNot

const controls = props => {
	const controlsOpts = props.controlsOptions
	const newWindowToolTip = parseURL(props.newWindowSrc).hostname

	return (
		<div
			className={
				'obojobo-draft--chunks--iframe--controls' +
				isOrNot(controlsOpts.zoom, 'zoomable') +
				isOrNot(controlsOpts.reload, 'reloadable')
			}
		>
			{controlsOpts.reload ? (
				<div className="control-button-container reload">
					<button className="reload-button" onClick={props.reload}>
						Reload
					</button>
					<span className="tool-tip">Reload</span>
				</div>
			) : null}
			{controlsOpts.newWindow ? (
				<div className="new-window-link">
					<a target="_blank" rel="noopener noreferrer" href={props.newWindowSrc}>
						View in a new window
					</a>

					<span className="tool-tip">{newWindowToolTip}</span>
				</div>
			) : null}
			{controlsOpts.zoom ? (
				<div className="size-controls">
					<div className="zoom-controls">
						{props.isZoomAbleToBeReset ? (
							<div className="control-button-container zoom-reset">
								<button className="zoom-reset-button" onClick={props.zoomReset}>
									Reset zoom
								</button>
								<span className="tool-tip">Reset zoom</span>
							</div>
						) : null}
						<div className="control-button-container zoom-out">
							<button
								disabled={props.isUnableToZoomOut}
								className="zoom-out-button"
								onClick={props.zoomOut}
							>
								Zoom out
							</button>
							<span className="tool-tip">
								{props.isUnableToZoomOut ? "Whoa that's tiny! 😲" : 'Zoom out'}
							</span>
						</div>
						<div className="control-button-container zoom-in">
							<button className="zoom-in-button" onClick={props.zoomIn}>
								Zoom in
							</button>
							<span className="tool-tip">Zoom in</span>
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}

export default controls
