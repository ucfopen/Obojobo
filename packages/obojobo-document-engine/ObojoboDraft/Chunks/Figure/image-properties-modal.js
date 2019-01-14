import React from 'react'
import Common from 'Common'

const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

import './image-properties-modal.scss'

class ImageProperties extends React.Component {
	constructor(props) {
		super(props)

		this.state = this.props.content
	}

	onKeyUp(event) {
		if (event.keyCode === 27) {
			return ModalUtil.hide()
		}

		if (event.key === "Enter") {
			return this.props.onConfirm(this.state)
		}
	}

	handleURLTextChange(event) {
		const url = event.target.value

		return this.setState({url})
	}

	handleAltTextChange(event) {
		const alt = event.target.value

		return this.setState({alt})
	}

	handleWidthTextChange(event) {
		const width = event.target.value

		return this.setState({width})
	}

	handleHeightTextChange(event) {
		const height = event.target.value

		return this.setState({height})
	}

	onCheckSize(event) {
		const size = event.target.value

		return this.setState({ size })
	}

	focusOnFirstElement() {
		return this.refs.input.focus()
	}

	render() {
		const size = this.state.size

		return (
			<SimpleDialog
				cancelOk
				title="Figure Properties"
				onConfirm={() => this.props.onConfirm(this.state)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}>
				<div className="image-properties">
					<label htmlFor="urlInput">URL:</label>
					<input
						type="text"
						id="urlInput"
						value={this.state.url || ''}
						onKeyUp={this.onKeyUp.bind(this)}
						onChange={event => this.handleURLTextChange(event)}
						ref={'input'}
						size="50"
						placeholder="Web Address of the Image"/>
					<label htmlFor="altInput">Alt Text:</label>
					<input
						type="text"
						id="altInput"
						value={this.state.alt || ''}
						onKeyUp={this.onKeyUp.bind(this)}
						onChange={event => this.handleAltTextChange(event)}
						size="50"
						placeholder="Describe the Image"/>
					<label htmlFor="sizeInput">Size:</label>
					<fieldset>
						<div className="size-input">
							<input
								type="radio"
								name="size"
								value="large"
								id="large"
								checked={size === "large"}
								onChange={this.onCheckSize.bind(this)}/>
							<label htmlFor="large">Large</label>
						</div>
						<div className="size-input">
							<input
								type="radio"
								name="size"
								value="medium"
								id="medium"
								checked={size === "medium"}
								onChange={this.onCheckSize.bind(this)}/>
							<label htmlFor="medium">Medium</label>
						</div>
						<div className="size-input">
							<input
								type="radio"
								name="size"
								value="small"
								id="small"
								checked={size === "small"}
								onChange={this.onCheckSize.bind(this)}/>
							<label htmlFor="small">Small</label>
						</div>
						<div className="size-input">
							<input
								type="radio"
								name="size"
								value="custom"
								id="custom"
								checked={size === "custom"}
								onChange={this.onCheckSize.bind(this)}/>
							<label htmlFor="custom">Custom</label>
							{size === "custom" ?
								<div
									className="custom-size-inputs"
									id="custom-size-inputs">
									<input
										id="custom-width"
										name="custom-width"
										min="1"
										max="2000"
										step="1"
										type="number"
										placeholder="Width"
										aria-label="Width"
										value={this.state.width}
										onChange={this.handleWidthTextChange.bind(this)}/>
									<span>px ×</span>
									<input
										id="custom-height"
										name="custom-height"
										min="1"
										max="2000"
										step="1"
										type="number"
										placeholder="Height"
										aria-label="Height"
										value={this.state.height}
										onChange={this.handleHeightTextChange.bind(this)}/>
									<span>px</span>
								</div> : null}
						</div>
					</fieldset>
				</div>
			</SimpleDialog>
		)
	}
}

export default ImageProperties
