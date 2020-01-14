import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import EditableHiddenText from 'obojobo-document-engine/src/scripts/oboeditor/components/editable-hidden-text'

const { ModalUtil } = Common.util
const { Prompt } = Common.components.modal
const { Button } = Common.components
const isOrNot = Common.util.isOrNot

class YouTube extends React.Component {
	showSourceModal(event) {
		event.stopPropagation()

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
		const editor = this.props.editor
		const content = this.props.node.data.get('content')

		content.videoId = videoId

		editor.setNodeByKey(this.props.node.key, {
			data: { content }
		})
	}

	renderNoVideo() {
		return (
			<div className="empty-frame">
				<div>No Video Id.</div>
			</div>
		)
	}

	renderVideo(videoId) {
		return (
			<iframe
				src={'https://www.youtube.com/embed/' + videoId}
				frameBorder="0"
				allowFullScreen={true}
			/>
		)
	}

	deleteNode() {
		const editor = this.props.editor
		editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		const content = this.props.node.data.get('content')

		const isSelected = isOrNot(this.props.isSelected, 'selected')

		return (
			<Node {...this.props}>
				<div
					contentEditable={false}
					className={`obojobo-draft--chunks--you-tube viewer pad ${isSelected}`}
				>
					<Button className="delete-button" onClick={this.deleteNode.bind(this)}>
						×
					</Button>
					{content.videoId ? this.renderVideo(content.videoId) : this.renderNoVideo()}
					<EditableHiddenText>{this.props.children}</EditableHiddenText>
					<Button className="edit-button" onClick={this.showSourceModal.bind(this)}>
						Edit
					</Button>
				</div>
			</Node>
		)
	}
}

export default YouTube
