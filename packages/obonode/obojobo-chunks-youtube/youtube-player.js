import React from 'react'
import Common from 'Common'
import './viewer-component.scss'
import './editor-component.scss'

const { uuid } = Common.util
const _callbacks = []

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
		this.loadYouTubeApi()
	}

	componentDidUpdate(prevProps) {
		// Don't update this component if the video properties haven't changed
		if (!this.shouldVideoUpdate(prevProps)) {
			return
		}

		this.loadVideo()
	}

	loadYouTubeApi() {
		if (window.YT) {
			this.loadVideo()
			return
		}

		const youtubeUrl = 'https://www.youtube.com/iframe_api'
		const scripts = Array.from(document.querySelectorAll('script'))
		const isLoading = scripts.some(script => script.src === youtubeUrl)

		// Makes sure multiple script tags aren't added
		if (!isLoading) {
			const tag = document.createElement('script')
			tag.src = youtubeUrl
			document.body.appendChild(tag)
		}

		// Wait for YouTube's API to be loaded before loading a video
		_callbacks.push(this.loadVideo.bind(this))
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
