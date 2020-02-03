import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import YouTubeProperties from './youtube-properties-modal'
import YouTubePlayer from './youtube-player'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import EditableHiddenText from 'obojobo-document-engine/src/scripts/oboeditor/components/editable-hidden-text'

const { ModalUtil } = Common.util
const { Button } = Common.components
const isOrNot = Common.util.isOrNot

class YouTube extends React.Component {
	showSourceModal(event) {
		event.stopPropagation()

		ModalUtil.show(
			<YouTubeProperties
				content={this.props.node.data.get('content')}
				onConfirm={this.handleSourceChange.bind(this)}
			/>
		)
	}

	handleSourceChange(content) {
		const editor = this.props.editor

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

	renderVideo() {
		return <YouTubePlayer content={this.props.node.data.get('content')} />
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
					{content.videoId ? this.renderVideo() : this.renderNoVideo()}
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
