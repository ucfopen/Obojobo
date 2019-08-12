import './image-properties-modal.scss'

import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'
import ChooseImageModal from './choose-image-modal'
import Image from './image'
import { debounce, isUrlUUID } from './utils'

const { SimpleDialog } = Common.components.modal
const URL_UPDATE_DELAY = 750

class ImageProperties extends React.Component {
	constructor(props) {
		super(props)
		const defaultState = {
			url: '',
			alt: '',
			size: 100,
			height: 100,
			width: 100,
			isChoosingImage: false
		}
		this.inputRef = React.createRef()
		this.state = { ...defaultState, ...props.content }
		if (!isUrlUUID(this.props.content.url)) {
			this.state.urlInputText = this.props.content.url
		}
	}

	onSetMediaUrl(mediaId) {
		this.setState({
			url: mediaId
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

		return this.setState({ size, width: null, height: null })
	}

	focusOnFirstElement() {
		return this.inputRef.current.focus()
	}

	onSetIsChoosingImage(value) {
		this.setState({ isChoosingImage: value })
	}

	render() {
		const size = this.state.size

		if (this.state.isChoosingImage)
			return (
				<ChooseImageModal
					allowedUploadTypes={this.props.allowedUploadTypes}
					onSetMediaUrl={mediaId => this.onSetMediaUrl(mediaId)}
					onSetIsChoosingImage={value => this.onSetIsChoosingImage(value)}
				/>
			)

		return (
			<SimpleDialog
				cancelOk
				title="Image Properties"
				onConfirm={() => this.props.onConfirm(this.state)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
			>
				<div className="image-properties">
					<div>
						<div className="flex-container image-container">
							{this.state.url ? (
								<Image
									key={this.state.url}
									chunk={{
										modelState: {
											url: this.state.url,
											height: 100,
											size: 'custom',
											alt: 'Image preview'
										}
									}}
								/>
							) : (
								<span className="image-preview image-preview-placeholder">No Image</span>
							)}
							<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center">
								<button className="button" onClick={() => this.onSetIsChoosingImage(true)}>
									Change Image...
								</button>
							</div>
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
									<div className="custom-size-inputs">
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
				</div>
			</SimpleDialog>
		)
	}
}

export default ImageProperties
