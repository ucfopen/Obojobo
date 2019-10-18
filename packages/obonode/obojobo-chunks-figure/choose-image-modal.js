import './choose-image-modal.scss'

import React from 'react'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
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
		APIUtil.postMultiPart('/api/media/upload', formData).then(mediaData => {
			this.props.onCloseChoosingImageModal(mediaData.media_id)
		})
	}

	// Fetch `count` number of image
	fetchMedias() {
		this.setState({
			...this.state,
			isFetching: true,
			hasMore: false
		})
		APIUtil.get(`/api/media/many/?start=${this.state.start}&count=${this.state.count}`)
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
				}
			})
			.catch(err => {
				// eslint-disable-next-line no-console
				console.log(err)
			})
	}

	focusOnFirstElement() {
		return this.firstRef.current.focus()
	}

	render() {
		return (
			<SimpleDialog
				cancelOk
				title="Choose an image"
				onConfirm={() => this.props.onCloseChoosingImageModal(this.state.url)}
				onCancel={() => this.props.onCloseChoosingImageModal(this.state.url)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
			>
				<div className="choose-image">
					<div className="choose-image--image-controls">
						<label htmlFor="choose-image--image-controls--upload">
							<input
								type="file"
								id="choose-image--image-controls--upload"
								accept={this.props.allowedUploadTypes}
								onChange={e => this.handleFileChange(e)}
							/>

							<span className="upload" tabIndex={0} ref={this.firstRef}>
								+ Upload new image
							</span>
						</label>

						<div className="choose-image--image-controls--or">or</div>

						<input
							id="choose-image--image-controls--url"
							type="text"
							placeholder="Enter URL"
							value={this.state.url}
							onChange={e => this.setState({ url: e.target.value })}
						/>
					</div>
					<div className="choose-image--divider" />
					<small>Recently uploaded</small>
					<div className="choose-image--image-gallary">
						{this.state.medias.map(media => (
							<img
								tabIndex={0}
								key={media.id}
								id={media.id}
								className="image-gallary--single-photo"
								src={`/api/media/${media.id}/small`}
								onClick={() => this.props.onCloseChoosingImageModal(media.id)}
							/>
						))}

						{this.state.isFetching ? <h5>Loading...</h5> : null}
						{this.state.hasMore ? (
							<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
								<button
									className="choose-image--image-gallary--view-more-btn button"
									onClick={() => this.fetchMedias()}
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
