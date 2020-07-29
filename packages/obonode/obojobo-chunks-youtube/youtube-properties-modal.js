import React from 'react'
import Common from '../../app/obojobo-document-engine/src/scripts/common'
import ParseYoutubeUrl from '../../app/obojobo-document-engine/src/scripts/oboeditor/util/parse-youtube-url'

import './youtube-properties-modal.scss'

const { SimpleDialog } = Common.components.modal
const { MoreInfoButton } = Common.components

class YouTubeProperties extends React.Component {
	constructor(props) {
		super(props)
		this.convertStringToSeconds = this.convertStringToSeconds.bind(this)
		this.idInputRef = React.createRef()
		this.videoUrlInputRef = React.createRef()
		this.state = {
			content: this.props.content,
			startTimeError: '',
			endTimeError: ''
		}
		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
		this.onConfirm = this.onConfirm.bind(this)
		this.handleStartTimeBlur = this.handleStartTimeBlur.bind(this)
		this.handleEndTimeBlur = this.handleEndTimeBlur.bind(this)
		this.handleStartTimeChange = this.handleStartTimeChange.bind(this)
		this.handleEndTimeChange = this.handleEndTimeChange.bind(this)
		this.handleUrlChange = this.handleUrlChange.bind(this)
		this.handleUrlBlur = this.handleUrlBlur.bind(this)
	}

	convertStringToSeconds(str) {
		let arr = str.split(':')
		let s = 0,
			m = 1

		// just return the string if it's not valid,
		// the user is probably still typing
		if (arr.length === 0) {
			return str
		}

		while (arr.length > 0) {
			s += m * parseInt(arr.pop(), 10)
			m *= 60
		}

		return s
	}

	focusOnFirstElement() {
		return this.videoUrlInputRef.current.focus()
	}

	handleUrlChange(event) {
		const videoUrl = event.target.value

		this.setState({
			...this.state,
			content: {
				...this.state.content,
				videoUrl
			}
		})
	}

	handleUrlBlur(event) {
		const videoInfo = ParseYoutubeUrl.youTubeParseUrl(event.target.value)
		const videoId = videoInfo.videoId === false ? '' : videoInfo.videoId
		const videoInputValidClass =
			videoInfo.videoId === false ? 'youtube--video-invalid' : 'youtube--video-valid'
		const videoUrl = event.target.value
		const startTime = videoInfo.startTime
		const endTime = videoInfo.endTime

		this.setState({
			...this.state,
			content: {
				...this.state.content,
				videoId,
				videoUrl,
				videoInputValidClass,
				startTime,
				endTime
			}
		})
	}

	handleStartTimeChange(event) {
		const startTime = event.target.value

		this.setState({
			startTimeError: '',
			endTimeError: '',
			content: {
				...this.state.content,
				startTime
			}
		})
	}

	handleEndTimeChange(event) {
		const endTime = event.target.value

		this.setState({
			startTimeError: '',
			endTimeError: '',
			content: {
				...this.state.content,
				endTime
			}
		})
	}

	handleStartTimeBlur(event) {
		const startTime = this.convertStringToSeconds(event.target.value)

		this.setState({
			startTimeError: '',
			endTimeError: '',
			content: {
				...this.state.content,
				startTime
			}
		})
	}

	handleEndTimeBlur(event) {
		const endTime = this.convertStringToSeconds(event.target.value)

		this.setState({
			startTimeError: '',
			endTimeError: '',
			content: {
				...this.state.content,
				endTime
			}
		})
	}

	onConfirm() {
		const { startTime, endTime, videoId } = this.state.content

		const videoInfo = ParseYoutubeUrl.youTubeParseUrl(videoId)

		this.setState({
			videoId: videoInfo.videoId,
			content: {
				...this.state.content
			}
		})

		if (startTime < 0) {
			return this.setState({ startTimeError: 'Start time must be > 0' })
		}

		if (endTime < 0) {
			return this.setState({ endTimeError: 'End time must be > 0' })
		}

		if (startTime && endTime && endTime <= startTime) {
			return this.setState({ endTimeError: 'End time must be > start time' })
		}

		return this.props.onConfirm(this.state.content)
	}

	render() {
		return (
			<SimpleDialog
				cancelOk
				title="YouTube Video"
				focusOnFirstElement={this.focusOnFirstElement}
				onConfirm={this.onConfirm}
			>
				<div className="youtube-video-properties">
					<div className="youtube-video-properties-input-wrapper">
						<label>Youtube video url:</label>
						<div>
							<MoreInfoButton ariaLabel="Click to explain youtube video options">
								<div className="text-items">
									<p>Add video by pasting one of the following:</p>
									<hr />
									<ul>
										<li>The video url, from your browser&apos;s address bar</li>
										<li>Embed code, provided by Youtube</li>
										<li>The video&apos;s id</li>
									</ul>
								</div>
							</MoreInfoButton>
						</div>
					</div>

					<input
						id="obojobo-draft--chunks--youtube--video-url"
						type="text"
						ref={this.videoUrlInputRef}
						value={this.state.content.videoUrl || ''}
						onChange={this.handleUrlChange}
						onBlur={this.handleUrlBlur}
						className={this.state.content.videoInputValidClass}
					/>
					<input
						id="obojobo-draft--chunks--youtube--video-id"
						type="hidden"
						ref={this.idInputRef}
						value={this.state.content.videoId || ''}
					/>

					<label>Start time (optional):</label>
					<input
						type="text"
						min="0"
						value={this.state.content.startTime || ''}
						onChange={this.handleStartTimeChange}
						onBlur={this.handleStartTimeBlur}
					/>
					<small>Seconds or MM:SS format (e.g. 135 or 2:15)</small>
					<span className="error">{this.state.startTimeError}</span>
					<label>End time (optional):</label>
					<input
						type="text"
						min="1"
						value={this.state.content.endTime || ''}
						onChange={this.handleEndTimeChange}
						onBlur={this.handleEndTimeBlur}
					/>
					<span className="error">{this.state.endTimeError}</span>
				</div>
			</SimpleDialog>
		)
	}
}

export default YouTubeProperties
