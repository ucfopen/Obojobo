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
	}

	componentDidMount() {
		this.fetchMedias()
	}

	handleFileChange(event) {
		const file = event.target.files[0]
		const formData = new window.FormData()
		formData.append('userImage', file, file.name)
		APIUtil.postMultiPart('/api/media/upload', formData).then(mediaData => {
			this.props.onSetMediaUrl(mediaData.media_id)
			this.props.onSetIsChoosingImage(false)
		})
	}

	// Fetch `count` number of image
	fetchMedias() {
		this.setState({
			...this.state,
			isFetching: true
		})
		APIUtil.get(`/api/media/many/?start=${this.state.start}&count=${this.state.count}`)
			.then(res => res.json())
			.then(result => {
				if (result.status != 'error') {
					this.setState({
						...this.state,
						medias: [...this.state.medias, ...result],
						isFetching: false,
						hasMore: result.length === this.state.count,
						start: this.state.start + this.state.count
					})
				}
			})
			.catch(err => {
				console.log(err)
			})
	}

	render() {
		return (
			<SimpleDialog
				cancelOk
				title="Choose an image"
				onConfirm={() => {
					this.props.onSetIsChoosingImage(false)
					this.props.onSetMediaUrl(this.state.url)
				}}
				onCancel={() => this.props.onSetIsChoosingImage(false)}
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
							<span className="upload">+ Upload new image</span>
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
								key={media.id}
								id={media.id}
								className="image-gallary--single-photo"
								src={`/api/media/${media.id}/small`}
								onClick={() => {
									this.props.onSetMediaUrl(media.id)
									this.props.onSetIsChoosingImage(false)
								}}
							/>
						))}

						{this.state.isFetching ? (
							<h5>Loading...</h5>
						) : this.state.hasMore ? (
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
