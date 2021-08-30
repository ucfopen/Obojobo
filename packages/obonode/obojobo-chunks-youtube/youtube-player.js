import React from 'react'
import Common from 'Common'
import insertDomTag from 'obojobo-document-engine/src/scripts/common/util/insert-dom-tag'

const { uuid } = Common.util

// while youtube iframe api script is loading
// this will be filled with loadVideo() callbacks
// from YouTubePlayer components waiting for it to load
// They'll all get called once it loads
const instanceCallbacksForYouTubeReady = []

const loadedVideos = {}

// single global hangler that notifies all registered YouTubePlayer Components
const onYouTubeIframeAPIReadyHandler = () => {
	// call every registered callback when ready
	instanceCallbacksForYouTubeReady.forEach(cb => cb())
}

class YouTubePlayer extends React.Component {
	constructor(props) {
		super(props)
		this.playerId = `obojobo-draft--chunks-you-tube-player-${uuid()}`
		this.player = null
		this.loadVideo = this.loadVideo.bind(this)
		this.onStateChange = this.onStateChange.bind(this)

		this.state = {
			youTubePlayerId: null
		}
	}

	componentDidMount() {
		// load YouTube Iframe API if it's not here yet
		if (!window.YT) {
			this.loadYouTubeAPIWithCallback(this.loadVideo)
		} else {
			this.loadVideo()
		}
	}

	componentWillUnmount() {
		delete loadedVideos[this.state.youTubePlayerId]
	}

	componentDidUpdate(prevProps) {
		// Don't update this component if the video properties haven't changed
		if (!this.shouldVideoUpdate(prevProps)) {
			return
		}

		this.loadVideo()
	}

	loadYouTubeAPIWithCallback(onReadyCallBack) {
		// register a callback for this component
		instanceCallbacksForYouTubeReady.push(onReadyCallBack)

		// no event handler registered yet?
		if (!window.onYouTubeIframeAPIReady) {
			// register a single global handler
			window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReadyHandler

			// add the script tag that loads the youtube iframe api
			insertDomTag({ src: '//www.youtube.com/iframe_api' }, 'script')
		}
	}

	loadVideo() {
		if (!this.props.content || !window.YT || !window.YT.Player) {
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
			// use youtube enhanced privacy mode
			host: 'https://www.youtube-nocookie.com',
			playerVars: {
				start: startTime,
				end: endTime
			},
			events: {
				onStateChange: this.onStateChange
			}
		})
		this.setState({ youTubePlayerId: this.player.id })

		loadedVideos[this.player.id] = this.player
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

	onStateChange(playerState) {
		switch (playerState.data) {
			case 1: // video playing
				Object.values(loadedVideos).forEach(video => {
					if (video.id !== playerState.target.id) {
						video.pauseVideo()
					}
				})
				break
		}
	}
}

export default YouTubePlayer
