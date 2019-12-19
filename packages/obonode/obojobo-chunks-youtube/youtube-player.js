import React from 'react'
import Common from 'Common'

const { uuid } = Common.util
const _callbacks = []
const tag = document.createElement('script')

// Load YouTube's Iframe API
tag.src = 'https://www.youtube.com/iframe_api'
document.body.appendChild(tag)

window.onYouTubeIframeAPIReady = () => {
	while (YouTubePlayer.callbacks.length > 0) {
		const callback = YouTubePlayer.callbacks.shift()
		callback()
	}
}

class YouTubePlayer extends React.Component {
	static get callbacks() {
		return _callbacks
	}

	constructor(props) {
		super(props)
		this.playerId = `obojobo-draft--chunks-you-tube-player-${uuid()}`
		this.player = null
	}

	componentDidMount() {
		if (window.YT && window.YT.Player) {
			this.loadVideo()
			return
		}

		// Wait for YouTube's API to be loaded before loading a video
		_callbacks.push(this.loadVideo.bind(this))
	}

	componentDidUpdate(prevProps) {
		// Don't update this component if the video properties haven't changed
		if (!this.shouldVideoUpdate(prevProps)) {
			return
		}

		this.loadVideo()
	}

	loadVideo() {
		if (!this.props.content) {
			return
		}

		const { videoId, startTime, endTime } = this.props.content

		if (this.player) {
			this.player.cueVideoById({
				videoId,
				startSeconds: startTime,
				endSeconds: endTime
			})
			return
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

		return (
			prevContent.startTime !== startTime ||
			prevContent.endTime !== endTime ||
			prevContent.videoId !== videoId
		)
	}

	render() {
		return <div id={this.playerId} className="obojobo-draft--chunks-you-tube-player" />
	}
}

export default YouTubePlayer
