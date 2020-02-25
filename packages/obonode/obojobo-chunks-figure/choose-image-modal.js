import './choose-image-modal.scss'

import React from 'react'

import API from 'obojobo-document-engine/src/scripts/viewer/util/api'
import Common from 'obojobo-document-engine/src/scripts/common'

const { SimpleDialog } = Common.components.modal

class ChooseImageModal extends React.Component {
	constructor() {
		super()

		this.state = {
			medias: [],
			isFetching: true,
			hasMore: true,
			start: 0,
			url: '',
			count: 11
		}

		this.firstRef = React.createRef()
	}

	componentDidMount() {
		this.fetchMedias()
	}

	handleFileChange(event) {
		const file = event.target.files[0]
		const formData = new window.FormData()
		formData.append('userImage', file, file.name)
		API.postMultiPart('/api/media/upload', formData).then(mediaData => {
			this.props.onCloseChooseImageModal(mediaData.media_id)
		})
	}

	// Fetch `count` number of image
	fetchMedias() {
		this.setState({
			...this.state,
			isFetching: true,
			hasMore: false
		})
		API.get(`/api/media/many/?start=${this.state.start}&count=${this.state.count}`)
			.then(res => res.json())
			.then(result => {
				if (result.status !== 'error') {
					this.setState({
						...this.state,
						medias: [...this.state.medias, ...result.data],
						isFetching: false,
						hasMore: result.hasMore,
						start: this.state.start + this.state.count
					})
				} else {
					this.setState({ ...this.state, isFetching: false, hasMore: false })
				}
			})
			.catch(() => {
				this.setState({ ...this.state, isFetching: false, hasMore: false })
			})
	}

	focusOnFirstElement() {
		return this.firstRef.current.focus()
	}

	onHandleKeyPress(event, callback) {
		if (event.key === 'Enter') {
			callback()
		}
	}

	render() {
		return (
			<SimpleDialog
				cancelOk
				title="Choose an image"
				onConfirm={() => this.props.onCloseChooseImageModal(this.state.url)}
				onCancel={() => this.props.onCloseChooseImageModal(null)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
			>
				<div className="choose-image">
					<div className="choose-image--image-controls">
						<div className="choose-image--image-controls--upload">
							<input
								type="file"
								name="fileupload"
								id="fileupload"
								className="inputfile"
								onChange={event => this.handleFileChange(event)}
								tabIndex="-1"
							/>
							<label htmlFor="fileupload">
								<span role="button" aria-controls="filename" tabIndex="0" ref={this.firstRef}>
									Upload new image
								</span>
							</label>
						</div>

						<p className="choose-image--image-controls--or">or</p>

						<input
							id="choose-image--image-controls--url"
							type="text"
							placeholder="Enter URL"
							value={this.state.url}
							onChange={e => this.setState({ url: e.target.value })}
							tabIndex="0"
							aria-label="Enter image's URL"
						/>
					</div>
					<div className="choose-image--divider" />
					<small>Recently uploaded</small>
					<div className="choose-image--image-gallary">
						{this.state.medias.map(media => (
							<img
								tabIndex={0}
								className="image-gallary--single-photo"
								key={media.id}
								id={media.id}
								src={`/api/media/${media.id}/small`}
								onClick={() => this.props.onCloseChooseImageModal(media.id)}
								onKeyPress={event =>
									this.onHandleKeyPress(event, () => this.props.onCloseChooseImageModal(media.id))
								}
								role="button"
								aria-label="Select image"
								aria-live="polite"
								aria-atomic="false"
							/>
						))}

						{this.state.isFetching ? <h5>Loading...</h5> : null}
						{this.state.hasMore ? (
							<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
								<button
									className="choose-image--image-gallary--view-more-btn button"
									onClick={() => this.fetchMedias()}
									tabIndex={0}
									aria-label="Load more images"
									aria-live="polite"
									aria-atomic="false"
								>
									Load More...
								</button>
							</div>
						) : null}
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default ChooseImageModal
