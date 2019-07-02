import React from 'react'
import Common from 'Common'

const { SimpleDialog } = Common.components.modal
const { Slider } = Common.components

import './iframe-properties-modal.scss'

class IFrameProperties extends React.Component {
	constructor(props) {
		super(props)

		this.state = this.props.content
		this.inputRef = React.createRef()
	}

	componentDidMount() {
		this.inputRef.current.focus()
		this.inputRef.current.select()
	}

	handleTitleChange(event) {
		const title = event.target.value

		return this.setState({ title })
	}

	handleURLChange(event) {
		const src = event.target.value

		return this.setState({ src })
	}

	handleBorderChange(checked) {
		return this.setState({ border: checked })
	}

	handleFitChange(event) {
		const fit = event.target.value

		return this.setState({ fit })
	}

	handleWidthChange(event) {
		const width = event.target.value

		return this.setState({ width })
	}

	handleHeightChange(event) {
		const height = event.target.value

		return this.setState({ height })
	}

	handleZoomChange(event) {
		const initialZoom = event.target.value

		return this.setState({ initialZoom })
	}

	handleAutoloadChange(checked) {
		return this.setState({ autoload: checked })
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
		return this.inputRef.current.focus()
	}

	render() {
		const controlList = this.state.controls ? this.state.controls.split(',') : []

		return (
			<SimpleDialog
				cancelOk
				title="IFrame Properties"
				onConfirm={() => this.props.onConfirm(this.state)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
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
								onChange={this.handleTitleChange.bind(this)}
							/>
						</div>

						<div>
							<label htmlFor="obojobo-draft--chunks--iframe--properties-modal--src">Source:</label>
							<input
								type="text"
								id="obojobo-draft--chunks--iframe--properties-modal--src"
								value={this.state.src || ''}
								placeholder="Web Address"
								onChange={this.handleURLChange.bind(this)}
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
								onChange={this.handleWidthChange.bind(this)}
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
								onChange={this.handleHeightChange.bind(this)}
							/>
							<span className="px-label">px</span>
						</div>
						<div>
							<Slider
								title={'Border'}
								initialChecked={this.state.border}
								handleCheckChange={this.handleBorderChange.bind(this)}
							/>
						</div>
						<div>
							<Slider
								title={'Autoload'}
								initialChecked={this.state.autoload}
								handleCheckChange={this.handleAutoloadChange.bind(this)}
							/>
						</div>
						<div>
							<label htmlFor="obojobo-draft--chunks--iframe--properties-modal--fit">Fit:</label>
							<select
								id="obojobo-draft--chunks--iframe--properties-modal--fit"
								value={this.state.fit || 'scale'}
								onChange={this.handleFitChange.bind(this)}
							>
								<option value="scale">Scale</option>
								<option value="scroll">Scroll</option>
							</select>
						</div>
						<div>
							<label htmlFor={'obojobo-draft--chunks--iframe--properties-modal--zoom'}>
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
								onChange={this.handleZoomChange.bind(this)}
							/>
						</div>
					</div>

					<div className="controls">
						<h2>Controls:</h2>
						<Slider
							title={'Reload'}
							initialChecked={controlList.includes('reload')}
							handleCheckChange={this.handleControlChange.bind(this, 'reload')}
						/>
						<Slider
							title={'New Window'}
							initialChecked={controlList.includes('new-window')}
							handleCheckChange={this.handleControlChange.bind(this, 'new-window')}
						/>
						<Slider
							title={'Zoom'}
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
