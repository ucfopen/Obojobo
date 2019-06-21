import './image-properties-modal.scss'

import { debounce, isUrlUUID } from './utils'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import Common from 'obojobo-document-engine/src/scripts/common'
import Image from './image'
import React from 'react'

const { SimpleDialog } = Common.components.modal
const URL_UPDATE_DELAY = 750

class ImageProperties extends React.Component {
	constructor(props) {
		super(props)

		this.inputRef = React.createRef()
		this.state = this.props.content
		if (!isUrlUUID(this.props.content.url)) {
			this.state.urlInputText = this.props.content.url
		}
	}

	handleFileChange(event) {
		const file = event.target.files[0]
		const formData = new window.FormData()
		formData.append('userImage', file, file.name)
		APIUtil.postMultiPart('/api/media/upload', formData).then(mediaData => {
			this.setState({ url: mediaData.media_id, urlInputText: '', filename: mediaData.filename })
		})
	}

	handleURLTextChange(event) {
		const urlInputText = event.target.value
		this.setState({ urlInputText })
		debounce(URL_UPDATE_DELAY, () => this.setState({ url: urlInputText, filename: null }))
	}

	handleAltTextChange(event) {
		const alt = event.target.value

		return this.setState({ alt })
	}

	handleWidthTextChange(event) {
		const width = event.target.value

		return this.setState({ width })
	}

	handleHeightTextChange(event) {
		const height = event.target.value

		return this.setState({ height })
	}

	onCheckSize(event) {
		const size = event.target.value

		return this.setState({ size })
	}

	focusOnFirstElement() {
		return this.inputRef.current.focus()
	}

	render() {
		const size = this.state.size

		return (
			<SimpleDialog
				cancelOk
				title="Figure Properties"
				onConfirm={() => this.props.onConfirm(this.state)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
			>
				<div className="image-properties">
					<label htmlFor="obojobo-draft--chunks--figure--url">URL:</label>
					<div className="flex-container">
						<div>
							<input
								type="text"
								id="obojobo-draft--chunks--figure--url"
								value={this.state.urlInputText || ''}
								onChange={this.handleURLTextChange.bind(this)}
								ref={this.inputRef}
								size="50"
								placeholder="Web Address of the Image"
							/>
						</div>
						<div className="figure--url--or">Or</div>
						<div className="figure--url--upload">
							<label htmlFor="obojobo-draft--chunks--figure--image-file-input">
								<input
									type="file"
									id="obojobo-draft--chunks--figure--image-file-input"
									accept={this.props.allowedUploadTypes}
									onChange={this.handleFileChange.bind(this)}
								/>
								<span className="upload">Upload</span>
							</label>
						</div>
					</div>

					<div className="flex-container image-container">
						{
							this.state.url ?
							<Image
								chunk={{
									modelState: {
										url: this.state.url,
										height: 100,
										size: 'custom',
										alt: 'Image preview'
									}
								}}
							/>
							:
							<span className="image-preview image-preview-placeholder">No Image</span>
						}
						<div className="image-preview">{this.state.filename || 'Image Preview'}</div>
					</div>

					<label htmlFor="obojobo-draft--chunks--figure--alt">Alt Text:</label>
					<input
						type="text"
						id="obojobo-draft--chunks--figure--alt"
						value={this.state.alt || ''}
						onChange={this.handleAltTextChange.bind(this)}
						size="50"
						placeholder="Describe the Image"
					/>

					<label htmlFor="obojobo-draft--chunks--figure--size">Size:</label>
					<fieldset id="obojobo-draft--chunks--figure--size">
						<div className="size-input">
							<input
								type="radio"
								name="size"
								value="large"
								id="obojobo-draft--chunks--figure--size-large"
								checked={size === 'large'}
								onChange={this.onCheckSize.bind(this)}
							/>
							<label htmlFor="obojobo-draft--chunks--figure--size-large">Large</label>
						</div>
						<div className="size-input">
							<input
								type="radio"
								name="size"
								value="medium"
								id="obojobo-draft--chunks--figure--size-medium"
								checked={size === 'medium'}
								onChange={this.onCheckSize.bind(this)}
							/>
							<label htmlFor="obojobo-draft--chunks--figure--size-medium">Medium</label>
						</div>
						<div className="size-input">
							<input
								type="radio"
								name="size"
								value="small"
								id="obojobo-draft--chunks--figure--size-small"
								checked={size === 'small'}
								onChange={this.onCheckSize.bind(this)}
							/>
							<label htmlFor="obojobo-draft--chunks--figure--size-small">Small</label>
						</div>
						<div className="size-input">
							<input
								type="radio"
								name="size"
								value="custom"
								id="obojobo-draft--chunks--figure--size-custom"
								checked={size === 'custom'}
								onChange={this.onCheckSize.bind(this)}
							/>
							<label htmlFor="obojobo-draft--chunks--figure--size-custom">Custom</label>
							{size === 'custom' ? (
								<div className="custom-size-inputs" >
									<input
										id="obojobo-draft--chunks--figure--custom-width"
										name="custom-width"
										min="1"
										max="2000"
										step="1"
										type="number"
										placeholder="Width"
										aria-label="Width"
										value={this.state.width || ''}
										onChange={this.handleWidthTextChange.bind(this)}
									/>
									<span>px × </span>
									<input
										id="obojobo-draft--chunks--figure--custom-height"
										name="custom-height"
										min="1"
										max="2000"
										step="1"
										type="number"
										placeholder="Height"
										aria-label="Height"
										value={this.state.height || ''}
										onChange={this.handleHeightTextChange.bind(this)}
									/>
									<span>px</span>
								</div>
							) : null}
						</div>
					</fieldset>
				</div>
			</SimpleDialog>
		)
	}
}

export default ImageProperties
