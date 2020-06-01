import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import './youtube-properties-modal.scss'

const { SimpleDialog } = Common.components.modal

class YouTubeProperties extends React.Component {
	constructor(props) {
		super(props)
		this.idInputRef = React.createRef()
		this.state = {
			content: this.props.content,
			startTimeError: '',
			endTimeError: ''
		}
		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
		this.onConfirm = this.onConfirm.bind(this)
		this.handleIdChange = this.handleIdChange.bind(this)
		this.handleStartTimeChange = this.handleStartTimeChange.bind(this)
		this.handleEndTimeChange = this.handleEndTimeChange.bind(this)
	}

	focusOnFirstElement() {
		return this.idInputRef.current.focus()
	}

	handleIdChange(event) {
		const videoId = event.target.value

		this.setState({
			...this.state,
			content: {
				...this.state.content,
				videoId
			}
		})
	}

	handleStartTimeChange(event) {
		const startTime = Number(event.target.value)

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
		const endTime = Number(event.target.value)

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
		const { startTime, endTime } = this.state.content

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
					<label>Youtube video id:</label>
					<input
						id="obojobo-draft--chunks--youtube--video-id"
						type="text"
						ref={this.idInputRef}
						value={this.state.content.videoId || ''}
						onChange={this.handleIdChange}
					/>
					<label>Start time in seconds (optional):</label>
					<input
						type="number"
						min="0"
						value={this.state.content.startTime || ''}
						onChange={this.handleStartTimeChange}
					/>
					<span className="error">{this.state.startTimeError}</span>
					<label>End time in seconds (optional):</label>
					<input
						type="number"
						min="1"
						value={this.state.content.endTime || ''}
						onChange={this.handleEndTimeChange}
					/>
					<span className="error">{this.state.endTimeError}</span>
				</div>
			</SimpleDialog>
		)
	}
}

export default YouTubeProperties
