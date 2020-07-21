import React, { useEffect, useRef, useMemo } from 'react'
import Common from 'Common'

const { Dialog, SimpleDialog } = Common.components.modal
const { Switch, Button } = Common.components

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'

import './iframe-properties-modal.scss'


const MateriaPickerDialog = (props) => {
	const pickerIframe = useRef(null)

	useEffect(
		() => {
			console.log('listening?')
			if(pickerIframe.current.addEventListener){
				console.log('listening!')
				window.addEventListener('message', props.onPick)
			}

		}, [pickerIframe.current]
	)


	const buttons = useMemo(
		() => {
			return [
				{
					value: 'Cancel',
					altAction: true,
					onClick: props.onCancel
				}
			]
		}, []
	)

	return (
		<Dialog buttons={buttons} title="Choose a Widget">
			<iframe ref={pickerIframe} id="materia-lti-picker" src="/materia-lti-picker-launch" frameBorder="0" loading="lazy"></iframe>
		</Dialog>
	)
}

class MateriaProperties extends React.Component {
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
			pickerOpen: false
		}
		this.state = { ...defaultState, ...props.content }
		this.inputRef = React.createRef()

		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleURLChange = this.handleURLChange.bind(this)
		this.handleWidthChange = this.handleWidthChange.bind(this)
		this.handleHeightChange = this.handleHeightChange.bind(this)
		this.handleBorderChange = this.handleBorderChange.bind(this)
		this.handleFitChange = this.handleFitChange.bind(this)
		this.handleZoomChange = this.handleZoomChange.bind(this)
		this.openPicker = this.openPicker.bind(this)
		this.onPick = this.onPick.bind(this)
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

	onPick(event){
		if(event.type === 'click'){
			return this.setState({pickerOpen: false})
		}
		// Returned postMessage (in obojobo)
		if(event.data && event.data.embed_type && event.data.url){
			return this.setState({pickerOpen: false, src: event.data.url})
		}
		// Materia special selection postMessage
		if(event.data && typeof event.data === 'string'){
			try{
				const data = JSON.parse(event.data)
				const {name: title, url, widget} = data
				const height = parseInt(widget.height, 10)
				const width = parseInt(widget.width, 10)
				return this.setState({
					height,
					width,
					title,
					pickerOpen: false
				})
			} catch(e){
				// do nothing
			}

		}

	}

	openPicker(){
		this.setState({pickerOpen: true})
	}

	render() {
		const controlList = this.state.controls ? this.state.controls.split(',') : []

		if(this.state.pickerOpen){
			return (
				<MateriaPickerDialog onPick={this.onPick} onCancel={this.onPick}/>
			)
		}

		return (
			<SimpleDialog
				cancelOk
				title="Materia Properties"
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
							<Button id="obojobo-draft--chunks--iframe--properties-modal--src" className="correct-button" onClick={this.openPicker}>
								Select...
							</Button>
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

export default MateriaProperties
