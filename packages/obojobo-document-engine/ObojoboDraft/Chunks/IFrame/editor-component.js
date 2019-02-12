import React from 'react'
import Common from 'Common'

import Controls from './controls'

import './editor-component.scss'

const { Button, Slider } = Common.components
const isOrNot = Common.util.isOrNot

class IFrame extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isPreviewing: false,
			type: 'media'
		}
	}

	handleSliderChange(property, checked) {
		const editor = this.props.editor
		const change = editor.value.change()
		const content = this.props.node.data.get('content')

		content[property] = checked

		change.setNodeByKey(this.props.node.key, { data: { content } })
		editor.onChange(change)
	}

	handleContentChange(property, event) {
		const editor = this.props.editor
		const change = editor.value.change()
		const content = this.props.node.data.get('content')

		content[property] = event.target.value

		change.setNodeByKey(this.props.node.key, { data: { content } })
		editor.onChange(change)
	}

	handleControlChange(property, checked) {
		const editor = this.props.editor
		const change = editor.value.change()
		const content = this.props.node.data.get('content')
		const controlList = content.controls.split(',')

		let controls = ''

		// Use checked value to determine the control string for the changed property
		// Use controlList values to determine control strings for unchanged properties
		if (property === 'reload') {
			controls =
				(checked ? 'reload,' : '') +
				(controlList.includes('new-window') ? 'new-window,' : '') +
				(controlList.includes('zoom') ? 'zoom' : '')
		} else if (property === 'new-window') {
			controls =
				(controlList.includes('reload') ? 'reload,' : '') +
				(checked ? 'new-window,' : '') +
				(controlList.includes('zoom') ? 'zoom' : '')
		} else {
			// if(property === 'zoom') {
			controls =
				(controlList.includes('reload') ? 'reload,' : '') +
				(controlList.includes('new-window') ? 'new-window,' : '') +
				(checked ? 'zoom' : '')
		}

		content.controls = controls

		change.setNodeByKey(this.props.node.key, { data: { content } })
		editor.onChange(change)
	}

	togglePreviewing() {
		this.setState(state => ({
			isPreviewing: !state.isPreviewing
		}))
	}

	renderIFrameEditor() {
		const content = this.props.node.data.get('content')
		const controlList = content.controls.split(',')

		const iframeStyle = {
			height: '100%',
			width: '100%',
			transform: 'scale(1)'
		}

		return (
			<div className={'iframe-container'}>
				<div className={'blocker'} style={iframeStyle}>
					<div className={'form'}>
						<div>
							<label htmlFor={'titleInput'}>Title:</label>
							<input
								type="text"
								id="titleInput"
								value={content.title || ''}
								placeholder="IFrame Title"
								onChange={this.handleContentChange.bind(this, 'title')}
								onClick={event => event.stopPropagation()}
							/>
						</div>
						<div>
							<label htmlFor={'srcInput'}>Source:</label>
							<input
								type="text"
								id="srcInput"
								value={content.src || ''}
								placeholder="Web Address"
								onChange={this.handleContentChange.bind(this, 'src')}
								onClick={event => event.stopPropagation()}
							/>
						</div>
						<div>
							<Slider
								title={'Border'}
								initialChecked={content.border}
								handleCheckChange={this.handleSliderChange.bind(this, 'border')}
							/>
						</div>
						<div>
							<label htmlFor={'fitInput'}>Fit:</label>
							<select
								id="fitInput"
								value={content.fit || 'scale'}
								onChange={this.handleContentChange.bind(this, 'fit')}
								onClick={event => event.stopPropagation()}
							>
								<option value="scale">Scale</option>
								<option value="scroll">Scroll</option>
							</select>
						</div>
						<div>
							<label>Dimensions:</label>
							<input
								id="custom-width"
								name="custom-width"
								min="1"
								max="20000"
								step="1"
								type="number"
								placeholder="Width"
								aria-label="Width"
								value={content.width}
								onChange={this.handleContentChange.bind(this, 'width')}
								onClick={event => event.stopPropagation()}
							/>
							<span>px ×</span>
							<input
								id="custom-height"
								min="1"
								max="200000"
								step="1"
								type="number"
								placeholder="Height"
								aria-label="Height"
								value={content.height}
								onChange={this.handleContentChange.bind(this, 'height')}
								onClick={event => event.stopPropagation()}
							/>
							<span>px</span>
						</div>
						<div>
							<label htmlFor={'zoomInput'}>Inital Zoom:</label>
							<input
								id="zoomInput"
								min="0.01"
								max="1000"
								step=".01"
								type="number"
								placeholder="Decimal Value"
								value={content.initialZoom}
								onChange={this.handleContentChange.bind(this, 'initialZoom')}
								onClick={event => event.stopPropagation()}
							/>
						</div>
						<div>
							<Slider
								title={'Autoload'}
								initialChecked={content.autoload}
								handleCheckChange={this.handleSliderChange.bind(this, 'autoload')}
							/>
						</div>
						<span>IFrame Controls:</span>
						<div className="controls">
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
				</div>
				<Button onClick={this.togglePreviewing.bind(this)}>Preview</Button>
			</div>
		)
	}

	renderIFramePreview() {
		const content = this.props.node.data.get('content')

		const iframeStyle = {
			height: 100 / content.initialZoom + '%',
			width: 100 / content.initialZoom + '%',
			transform: 'scale(' + content.initialZoom + ')'
		}

		return (
			<div className={'iframe-container'}>
				<iframe
					ref="iframe"
					title={'banana'}
					src={this.props.node.data.get('content').src}
					is
					frameBorder="0"
					allow="geolocation; microphone; camera; midi; encrypted-media; vr"
					style={iframeStyle}
				/>
				<Button onClick={this.togglePreviewing.bind(this)}>Edit</Button>
			</div>
		)
	}

	render() {
		const content = this.props.node.data.get('content')
		const controlList = content.controls.split(',')

		const previewStyle = {
			width: (content.width || '710') + 'px',
			height: (content.height || '500') + 'px'
		}

		const editingStyle = {
			width: 710,
			height: 500
		}

		const className =
			'obojobo-draft--chunks--iframe viewer pad is-previewing' +
			isOrNot(content.border, 'bordered') +
			isOrNot(this.state.isPreviewing, 'showing') +
			' is-controls-enabled' +
			' is-not-missing-src' +
			isOrNot(content.initialZoom > 1, 'scaled-up')

		const controlsOpts = {
			reload: controlList.includes('reload'),
			newWindow: controlList.includes('new-window'),
			zoom: controlList.includes('zoom')
		}

		return (
			<div className={className}>
				<div className={'container'} style={this.state.isPreviewing ? previewStyle : editingStyle}>
					{this.state.isPreviewing ? this.renderIFramePreview() : this.renderIFrameEditor()}
					<Controls newWindowSrc={content.src} controlsOptions={controlsOpts} isEditor />
				</div>
			</div>
		)
	}
}

export default IFrame
