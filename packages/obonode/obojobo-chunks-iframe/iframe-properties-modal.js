import React from 'react'
import SettingsDialog from 'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog'
import SettingsDialogForm from 'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog-form'
import SettingsDialogRow from 'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog-row'

import './iframe-properties-modal.scss'

class IFrameProperties extends React.Component {
	constructor(props) {
		super(props)
		// combinde defaults with props
		const defaultState = {
			autoload: false,
			border: false,
			fit: '',
			height: 480,
			initialZoom: 100,
			src: '',
			title: '',
			width: 640,
			newWindow: false,
			reload: false,
			zoom: false,
		}
		this.state = { ...defaultState, ...props.content, title: props.title }
		this.inputRef = React.createRef()

		this.settingsItems = [
			{
				label: 'URL',
				prop: 'src',
			},
			{
				label: 'Caption',
				prop: 'title'
			},
			{
				label: 'Width',
				prop: 'width',
				units: 'px',
				type: 'number',
				placeholder: 'auto',
				min: 100,
				max: 2000
			},
			{
				label: 'Height',
				prop: 'height',
				units: 'px',
				type: 'number',
				placeholder: 'auto',
				min: 100,
				max: 2000
			},
			{
				label: 'Border',
				prop: 'border',
				type: 'switch'
			},
			{
				label: 'Autoload',
				prop: 'autoload',
				type: 'switch'
			},
			{
				label: 'Fit',
				prop: 'fit',
				type: 'select',
				options: ['scale', 'scroll']
			},
			{
				label: 'Initial Zoom',
				prop: 'initialZoom',
				units: '%',
				type: 'number',
				min: 1,
				max: 500
			},
			{
				type: 'heading',
				text: 'Controls'
			},
			{
				label: 'Reload',
				prop: 'reload',
				type: 'switch'
			},
			{
				label: 'New Window',
				prop: 'newWindow',
				type: 'switch'
			},
			{
				label: 'Zoom',
				prop: 'zoom',
				type: 'switch'
			}
		]

		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
		this.onSettingChange = this.onSettingChange.bind(this)
		this.onConfirm = this.onConfirm.bind(this)
	}

	componentDidMount() {
		if(!this.inputRef.current) return

		this.inputRef.current.focus()
		this.inputRef.current.select()
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
		if(!this.inputRef.current) return
		this.inputRef.current.focus()
	}

	onConfirm(){
		 // extract the properties out of state we want to save
		const { autoload, border, fit, height, initialZoom, src, title, width, newWindow, reload, zoom } = this.state
		this.props.onConfirm({ autoload, border, fit, height, initialZoom, src, title, width, newWindow, reload, zoom})
	}

	onSettingChange(setting, event){
		let stateChanges = {}
		switch(setting.type){
			case 'switch':
				stateChanges[setting.prop] = event.target.checked
				break;

			default:
				stateChanges[setting.prop] = event.target.value
				break;
		}
		this.setState(stateChanges)
	}

	render() {
		return (
			<SettingsDialog
				title="IFrame Propterties"
				onConfirm={this.onConfirm}
				onCancel={this.props.onCancel}
				focusOnFirstElement={this.focusOnFirstElement}
			>
				<SettingsDialogRow>
					<SettingsDialogForm
						settings={this.state}
						config={this.settingsItems}
						onChange={this.onSettingChange}
						ref={this.inputRef}
					/>
				</SettingsDialogRow>
			</SettingsDialog>
		)
	}
}

export default IFrameProperties
