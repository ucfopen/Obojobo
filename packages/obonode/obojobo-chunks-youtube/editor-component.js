import React from 'react'
import YouTubeProperties from './youtube-properties-modal'
import YoutubePlayer from './youtube-player'
import Common from 'obojobo-document-engine/src/scripts/common'
import './viewer-component.scss'
import './editor-component.scss'

const { ModalUtil } = Common.util
const { Button } = Common.components

class YouTube extends React.Component {
	showSourceModal() {
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
		return <YoutubePlayer content={this.props.node.data.get('content')} />
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
