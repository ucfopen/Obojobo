import React from 'react'
import Common from 'Common'

const { SimpleDialog } = Common.components.modal
const { Switch } = Common.components

import './iframe-properties-modal.scss'

class IFrameProperties extends React.Component {
	constructor(props) {
		super(props)
		const defaultState = {
			autoload: false,
			border: false,
			fit: '',
			height: 480,
			initialZoom: 1,
			src: '',
			title: '',
			width: 640,
			controls: '',
			size: ''
		}
		this.state = { ...defaultState, ...props.content }
		this.inputRef = React.createRef()

		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleURLChange = this.handleURLChange.bind(this)
		this.handleWidthChange = this.handleWidthChange.bind(this)
		this.handleHeightChange = this.handleHeightChange.bind(this)
		this.handleBorderChange = this.handleBorderChange.bind(this)
		this.handleAutoloadChange = this.handleAutoloadChange.bind(this)
		this.handleFitChange = this.handleFitChange.bind(this)
		this.handleSizeChange = this.handleSizeChange.bind(this)
		this.handleZoomChange = this.handleZoomChange.bind(this)
	}

	componentDidMount() {
		this.inputRef.current.focus()
		this.inputRef.current.select()
	}

	handleTitleChange(event) {
		const title = event.target.value

		this.setState({ title })
	}

	handleURLChange(event) {
		const src = event.target.value

		this.setState({ src })
	}

	handleBorderChange(checked) {
		this.setState({ border: checked })
	}

	handleFitChange(event) {
		const fit = event.target.value

		this.setState({ fit })
	}

	handleSizeChange(event) {
		const size = event.target.value

		this.setState({ size })
	}

	handleWidthChange(event) {
		const width = event.target.value

		this.setState({ width })
	}

	handleHeightChange(event) {
		const height = event.target.value

		this.setState({ height })
	}

	handleZoomChange(event) {
		const initialZoom = event.target.value

		this.setState({ initialZoom })
	}

	handleAutoloadChange(checked) {
		this.setState({ autoload: checked })
	}

	handleControlChange(property, checked) {
		const controls = new Set(this.state.controls.split(','))

		// Use checked value to determine the control string for the changed property
		// Use controlList values to determine control strings for unchanged properties
		if (checked) {
			controls.add(property)
		} else {
			controls.delete(property)
		}

		this.setState({ controls: [...controls].join(',') })
	}

	focusOnFirstElement() {
		this.inputRef.current.focus()
	}

	render() {
		const controlList = this.state.controls ? this.state.controls.split(',') : []

		return (
			<SimpleDialog
				cancelOk
				title="IFrame Properties"
				onConfirm={() => this.props.onConfirm(this.state)}
				onCancel={this.props.onCancel}
				focusOnFirstElement={this.focusOnFirstElement}
			>
				<div className={'iframe-properties'}>
					<div className="info">
						<div>
							<label htmlFor="obojobo-draft--chunks--iframe--properties-modal--title">Title:</label>
							<input
								type="text"
								id="obojobo-draft--chunks--iframe--properties-modal--title"
								ref={this.inputRef}
								value={this.state.title || ''}
								placeholder="IFrame Title"
								onChange={this.handleTitleChange}
							/>
						</div>

						<div>
							<label htmlFor="obojobo-draft--chunks--iframe--properties-modal--src">Source:</label>
							<input
								type="text"
								id="obojobo-draft--chunks--iframe--properties-modal--src"
								value={this.state.src || ''}
								placeholder="Web Address"
								onChange={this.handleURLChange}
							/>
						</div>
					</div>

					<div className="options">
						<h2>Options:</h2>
						<div>
							<label>Dimensions:</label>
							<input
								id="obojobo-draft--chunks--iframe--properties-modal--custom-width"
								name="custom-width"
								min="1"
								max="20000"
								step="1"
								type="number"
								placeholder="Width"
								aria-label="Width"
								value={this.state.width}
								onChange={this.handleWidthChange}
							/>
							<span className="px-label">px ×</span>
							<input
								id="obojobo-draft--chunks--iframe--properties-modal--custom-height"
								min="1"
								max="200000"
								step="1"
								type="number"
								placeholder="Height"
								aria-label="Height"
								value={this.state.height}
								onChange={this.handleHeightChange}
							/>
							<span className="px-label">px</span>
						</div>
						<div>
							<Switch
								title="Border"
								initialChecked={this.state.border}
								handleCheckChange={this.handleBorderChange}
							/>
						</div>
						<div>
							<Switch
								title="Autoload"
								initialChecked={this.state.autoload}
								handleCheckChange={this.handleAutoloadChange}
							/>
						</div>
						<div>
							<label htmlFor="obojobo-draft--chunks--iframe--properties-modal--fit">Fit:</label>
							<select
								id="obojobo-draft--chunks--iframe--properties-modal--fit"
								value={this.state.fit || 'scale'}
								onChange={this.handleFitChange}
							>
								<option value="scale">Scale</option>
								<option value="scroll">Scroll</option>
							</select>
						</div>
						<div>
							<label htmlFor="obojobo-draft--chunks--iframe--properties-modal--size">Size:</label>
							<select
								id="obojobo-draft--chunks--iframe--properties-modal--size"
								value={this.state.size || "medium"}
								onChange={this.handleSizeChange}
							>
								<option value="large">Large</option>
								<option value="medium">Medium</option>
							</select>
						</div>
						<div>
							<label htmlFor="obojobo-draft--chunks--iframe--properties-modal--zoom">
								Initial Zoom:
							</label>
							<input
								id="obojobo-draft--chunks--iframe--properties-modal--zoom"
								min="0.01"
								max="1000"
								step=".01"
								type="number"
								placeholder="Decimal Value"
								value={this.state.initialZoom}
								onChange={this.handleZoomChange}
							/>
						</div>
					</div>

					<div className="controls">
						<h2>Controls:</h2>
						<Switch
							title="Reload"
							initialChecked={controlList.includes('reload')}
							handleCheckChange={this.handleControlChange.bind(this, 'reload')}
						/>
						<Switch
							title="New Window"
							initialChecked={controlList.includes('new-window')}
							handleCheckChange={this.handleControlChange.bind(this, 'new-window')}
						/>
						<Switch
							title="Zoom"
							initialChecked={controlList.includes('zoom')}
							handleCheckChange={this.handleControlChange.bind(this, 'zoom')}
						/>
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default IFrameProperties
