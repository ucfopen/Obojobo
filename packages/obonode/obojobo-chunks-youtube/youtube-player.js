import React from 'react'
import Common from 'Common'
import insertDomTag from 'obojobo-document-engine/src/scripts/common/util/insert-dom-tag'

const { uuid } = Common.util

// while youtube iframe api script is loading
// this will be filled with loadVideo() callbacks
// from YouTubePlayer components waiting for it to load
// They'll all get called once it loads
const instanceCallbacksForYouTubeReady = []

// single global hangler that notifies all registered YouTubePlayer Components
const onYouTubeIframeAPIReadyHandler = () =>{
	// call every registered callback when ready
	instanceCallbacksForYouTubeReady.forEach(cb => cb())
}

class YouTubePlayer extends React.Component {
	constructor(props) {
		super(props)
		this.playerId = `obojobo-draft--chunks-you-tube-player-${uuid()}`
		this.player = null
		this.loadVideo = this.loadVideo.bind(this)
	}

	componentDidMount() {
		// load YouTube Iframe API if it's not here yet
		if(!window.YT){
			this.loadYouTubeAPIWithCallback(this.loadVideo)
		} else{
			this.loadVideo()
		}
	}

	componentDidUpdate(prevProps) {
		// Don't update this component if the video properties haven't changed
		if (!this.shouldVideoUpdate(prevProps)) {
			return
		}

		this.loadVideo()
	}

	loadYouTubeAPIWithCallback(onReadyCallBack){
		// register a callback for this component
		instanceCallbacksForYouTubeReady.push(onReadyCallBack)

		// no event handler registered yet?
		if(!window.onYouTubeIframeAPIReady){
			// register a single global handler
			window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReadyHandler

			// add the script tag that loads the youtube iframe api
			insertDomTag({src: 'https://www.youtube.com/iframe_api'}, 'script')
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
