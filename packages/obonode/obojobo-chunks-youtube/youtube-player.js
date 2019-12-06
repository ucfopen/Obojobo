import React from 'react'
import Common from 'Common'
import './viewer-component.scss'
import './editor-component.scss'

const { uuid } = Common.util

class YoutubePlayer extends React.Component {
	constructor(props) {
		super(props)
		this.playerId = `obojobo-draft--chunks-you-tube-player-${uuid()}`
	}

	componentDidMount() {
		if (window.YT) {
			this.loadVideo()
			return
		}

		// Load YouTube's Iframe API asynchronously, but only once
		const tag = document.createElement('script')
		tag.src = 'https://www.youtube.com/iframe_api'
		window.onYouTubeIframeAPIReady = this.loadVideo.bind(this)
		document.body.appendChild(tag)
	}

	componentDidUpdate(prevProps) {
		// Don't update this component if the video properties haven't changed
		if (!this.shouldVideoUpdate(prevProps)) {
			return
		}

		this.loadVideo()
	}

	loadVideo() {
		const { videoId, startTime, endTime } = this.props.content

		// Loading a new video or changing start/end times automatically
		// starts the video so the player has to be destroyed and re-created again
		if (this.player) {
			this.player.destroy()
		}

		this.player = new window.YT.Player(this.playerId, {
			videoId,
			playerVars: {
				start: startTime,
				end: endTime
			}
		})
	}

	shouldVideoUpdate(prevProps) {
		const prevContent = prevProps.content
		const { startTime, endTime, videoId } = this.props.content

		// Changing a video should always trigger an update
		if (prevContent.videoId !== videoId) {
			return true
		}

		// Changing start/end times should always trigger an update
		return prevContent.startTime !== startTime || prevContent.endTime !== endTime
	}

	render() {
		// The player needs to be wrapped in a div to prevent a DOMException
		// when this component gets unmounted
		return (
			<div>
				<div id={this.playerId} className="obojobo-draft--chunks-you-tube-player" />
			</div>
		)
	}
}

export default YoutubePlayer
