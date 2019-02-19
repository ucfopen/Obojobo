import React from 'react'
import Common from 'Common'

import IframeProperties from './iframe-properties-modal'

import Controls from './controls'

import './editor-component.scss'

const { ModalUtil } = Common.util
const { Button } = Common.components
const isOrNot = Common.util.isOrNot

class IFrame extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isPreviewing: false
		}
	}

	showIFramePropertiesModal() {
		ModalUtil.show(
			<IframeProperties
				content={this.props.node.data.get('content')}
				onConfirm={this.changeProperties.bind(this)}
			/>
		)
	}

	changeProperties(content) {
		const editor = this.props.editor
		const change = editor.value.change()

		ModalUtil.hide()

		change.setNodeByKey(this.props.node.key, {
			data: {
				content
			}
		})
		editor.onChange(change)
	}

	togglePreviewing() {
		this.setState(state => ({
			isPreviewing: !state.isPreviewing
		}))
	}

	renderEditToolbar() {
		return (
			<div className="iframe-toolbar">
				<Button onClick={this.togglePreviewing.bind(this)}>Toggle Preview</Button>
				<Button className="properties-button" onClick={this.showIFramePropertiesModal.bind(this)}>
					IFrame Properties
				</Button>
			</div>
		)
	}

	renderIFramePreview() {
		const content = this.props.node.data.get('content')

		const iframeStyle = {
			height: 100 / content.initialZoom + '%',
			width: 100 / content.initialZoom + '%',
			transform: 'scale(' + content.initialZoom + ')'
		}

		return (
			<div className={'iframe-container'}>
				<iframe
					ref="iframe"
					src={this.props.node.data.get('content').src}
					is
					frameBorder="0"
					allow="geolocation; microphone; camera; midi; encrypted-media; vr"
					style={iframeStyle}
				/>
			</div>
		)
	}

	render() {
		const content = this.props.node.data.get('content')
		const controlList = content.controls.split(',')

		const previewStyle = {
			width: (content.width || '710') + 'px',
			height: (content.height || '500') + 'px'
		}

		const className =
			'obojobo-draft--chunks--iframe viewer pad is-previewing' +
			isOrNot(content.border, 'bordered') +
			isOrNot(this.state.isPreviewing, 'showing') +
			' is-controls-enabled' +
			' is-not-missing-src' +
			isOrNot(content.initialZoom > 1, 'scaled-up') +
			isOrNot(this.state.iframeIsSelected, 'selected')

		const controlsOpts = {
			reload: controlList.includes('reload'),
			newWindow: controlList.includes('new-window'),
			zoom: controlList.includes('zoom')
		}

		return (
			<div className={className}>
				<div className={'container'} style={previewStyle}>
					{this.renderEditToolbar()}
					{this.state.isPreviewing ? this.renderIFramePreview() : null}
					{this.state.isPreviewing ? (
						<Controls newWindowSrc={content.src} controlsOptions={controlsOpts} isEditor />
					) : null}
				</div>
			</div>
		)
	}
}

export default IFrame
