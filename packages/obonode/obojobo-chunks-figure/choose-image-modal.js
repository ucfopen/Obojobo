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
			start: 0,
			count: 10,
			hasMore: true,
			isFetching: true
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

	fetchMedias() {
		this.setState({ isFetching: true })
		APIUtil.get(`/api/media/many/?start=${this.state.start}&count=${this.state.count}`)
			.then(res => res.json())
			.then(result => {
				if (result.status != 'error') {
					this.setState({
						...this.state,
						medias: [...this.state.medias, ...result],
						start: this.state.start + this.state.count,
						hasMore: result.length == this.state.count,
						isFetching: false
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
				onConfirm={() => this.props.onSetIsChoosingImage(false)}
				onCancel={() => this.props.onSetIsChoosingImage(false)}
			>
				<div className="choose-image">
					<div className="choose-image--image-controls">
						<label htmlFor="choose-image--image-controls--upload">
							<input
								type="file"
								id="choose-image--image-controls--upload"
								accept={this.props.allowedUploadTypes}
								onChange={e => {
									this.handleFileChange(e)
								}}
							/>
							<span className="upload">+ Upload new image</span>
						</label>
						<div className="choose-image--controls--or">or</div>

						<div className="figure--url--upload">
							<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
								<button className="button">Enter URL</button>
							</div>
						</div>
					</div>
					<div className="choose-image--divider" />
					<div className="choose-image--image-gallary">
						{this.state.medias.map(media => {
							return (
								<img
									id={media.id}
									className="image-gallary--single-photo"
									src={
										'data:image/jpeg;base64,' +
										btoa(String.fromCharCode.apply(null, media.thumbnail.binaryData.data))
									}
									onClick={() => {
										this.props.onSetMediaUrl(media.id)
										this.props.onSetIsChoosingImage(false)
									}}
								/>
							)
						})}
						{this.state.isFetching ? (
							<p>loading...</p>
						) : this.state.hasMore ? (
							<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
								<button
									className="choose-image--image-gallary--view-more-btn button"
									onClick={() => this.fetchMedias()}
								>
									View More
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
