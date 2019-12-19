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
				message="Enter the video id for the Youtube Video:"
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
				onConfirm={this.onConfirm.bind(this)}
			>
				<div className="youtube-video-properties">
					<label>Youtube video id:</label>
					<input
						type="text"
						ref={this.idInputRef}
						value={this.state.content.videoId || ''}
						onChange={this.handleIdChange.bind(this)}
					/>
					<label>Start time (optional):</label>
					<input
						type="number"
						min="0"
						value={this.state.content.startTime || ''}
						onChange={this.handleStartTimeChange.bind(this)}
					/>
					<span className="error">{this.state.startTimeError}</span>
					<label>End time (optional):</label>
					<input
						type="number"
						min="1"
						value={this.state.content.endTime || ''}
						onChange={this.handleEndTimeChange.bind(this)}
					/>
					<span className="error">{this.state.endTimeError}</span>
				</div>
			</SimpleDialog>
		)
	}
}

export default YouTubeProperties
