import React from 'react'
import Common from 'Common'

import './editor-component.scss'

const { ModalUtil } = Common.util
const { Prompt } = Common.components.modal
const { Button } = Common.components

class YouTube extends React.Component {
	constructor(props) {
		super(props)
	}

	showSourceModal() {
		ModalUtil.show(
			<Prompt
				cancelOk
				title="YouTube Video"
				message="Enter the video id for the Youtube Video:"
				value={this.props.node.data.get('content').videoId}
				onConfirm={this.handleSourceChange.bind(this)}
			/>
		)
	}

	handleSourceChange(videoId) {
		ModalUtil.hide()

		const editor = this.props.editor
		const content = this.props.node.data.get('content')

		content.videoId = videoId

		editor.setNodeByKey(this.props.node.key, {
			data: { content }
		})

		this.forceUpdate() // Calls the extra render cycle that Slate needs to update
	}

	renderNoVideo() {
		return (
			<div className="empty-frame">
				<div>No Video Id.</div>
			</div>
		)
	}

	renderVideo() {
		const content = this.props.node.data.get('content')
		return (
			<iframe
				src={'https://www.youtube.com/embed/' + content.videoId}
				frameBorder="0"
				allowFullScreen="true"
			/>
		)
	}

	render() {
		const content = this.props.node.data.get('content')

		return (
			<div className={'obojobo-draft--chunks--you-tube viewer pad'}>
				{content.videoId ? this.renderVideo() : this.renderNoVideo()}
				<Button onClick={this.showSourceModal.bind(this)}>Edit</Button>
			</div>
		)
	}
}

export default YouTube
