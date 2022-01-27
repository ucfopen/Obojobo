import './choose-image-modal.scss'

import React from 'react'

import API from 'obojobo-document-engine/src/scripts/viewer/util/api'
import Common from 'obojobo-document-engine/src/scripts/common'

const { SimpleDialog } = Common.components.modal
import { uploadFileViaImageNode } from './utils'
const IMAGE_BATCH_SIZE = 11 // load 11 images at a time

class ChooseImageModal extends React.Component {
	constructor() {
		super()

		this.state = {
			media: [],
			isFetching: true,
			hasMore: true,
			page: 1,
			url: ''
		}

		this.firstRef = React.createRef()
		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
	}

	componentDidMount() {
		this.fetchMedias()
	}

	handleFileChange(event) {
		const file = event.target.files[0]

		uploadFileViaImageNode(file).then(mediaData => {
			this.props.onCloseChooseImageModal(mediaData)
		})
	}

	// Fetch `count` number of image
	fetchMedias() {
		this.setState({
			isFetching: true,
			hasMore: false
		})
		API.get(`/api/media/all?page=${this.state.page}&per_page=${IMAGE_BATCH_SIZE}`)
			.then(res => res.json())
			.then(result => {
				if (result.status === 'error') {
					throw Error('Error Loading Media')
				}

				this.setState({
					media: [...this.state.media, ...result.media],
					isFetching: false,
					hasMore: result.hasMore,
					page: this.state.page + 1
				})
			})
			.catch(() => {
				this.setState({ isFetching: false, hasMore: false })
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
		const imageLoadText = this.state.isFetching
			? 'Recently uploaded image list loading'
			: `${this.state.media.length} Recent Images loaded${this.state.hasMore ? ' with more' : ''}`

		return (
			<SimpleDialog
				cancelOk
				title="Upload or Choose an Image"
				onConfirm={() => this.props.onCloseChooseImageModal(this.state.url)}
				onCancel={() => this.props.onCloseChooseImageModal(null)}
				focusOnFirstElement={this.focusOnFirstElement}
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
									Upload New Image
								</span>
							</label>
							<span className="error-message">
								{this.props.error ? 'Error: ' + this.props.error : ''}
							</span>
						</div>

						<p className="choose-image--image-controls--or">or</p>

						<input
							id="choose-image--image-controls--url"
							type="text"
							placeholder="Enter image URL"
							value={this.props.url}
							onChange={e => this.setState({ url: e.target.value })}
							tabIndex="0"
							aria-label="Enter image URL"
						/>
					</div>
					<div className="choose-image--divider" />
					<small>Your Recently Uploaded Images</small>
					<div
						className="choose-image--image-gallary"
						aria-live="polite"
						aria-atomic="true"
						aria-label={imageLoadText}
					>
						{this.state.media.map((media, i) => (
							<img
								tabIndex={0}
								className="image-gallary--single-photo"
								key={media.id}
								id={media.id}
								src={`/api/media/${media.id}/small`}
								onClick={() => this.props.onCloseChooseImageModal(media)}
								onKeyPress={event =>
									this.onHandleKeyPress(event, () => this.props.onCloseChooseImageModal(media))
								}
								role="button"
								alt={`Select image ${i + 1}: ${media.fileName}`}
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
