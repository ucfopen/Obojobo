import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import Button from 'obojobo-document-engine/src/scripts/common/components/button'
import MateriaPickerDialog from './materia-picker-dialog'
import SettingsDialog from 'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog'
import SettingsDialogForm from 'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog-form'
import SettingsDialogRow from 'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog-row'

import './materia-settings-dialog.scss'

class MateriaSettingsDialog extends React.Component {
	constructor(props) {
		super(props)

		const defaultState = {
			height: 0,
			width: 0,
			caption: '' || props.content.caption || props.caption,
			src: '',
			icon: '',
			widgetEngine: '',
			pickerOpen: false,
			// start open if theres no icon and src is set (custom link)
			// start closed if there's no src (empty node)
			showCustomize: !props.content.icon && props.content.src
		}
		this.state = { ...defaultState, ...props.content }

		this.inputRef = React.createRef()
		this.formRef = React.createRef()
		this.widthRef = React.createRef()
		this.heightRef = React.createRef()
		this.pickerIframeRef = React.createRef()
		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
		this.openPicker = this.openPicker.bind(this)
		this.onPick = this.onPick.bind(this)
		this.toggleEditLock = this.toggleEditLock.bind(this)
		this.onConfirm = this.onConfirm.bind(this)
		this.onSettingChange = this.onSettingChange.bind(this)

		this.settingsItems = [
			{
				label: 'URL',
				prop: 'src'
			},
			{
				label: 'Width',
				prop: 'width',
				units: 'px',
				type: 'number',
				placeholder: 'auto',
				validity: ''
			},
			{
				label: 'Height',
				prop: 'height',
				units: 'px',
				type: 'number',
				placeholder: 'auto',
				validity: ''
			}
		]
	}

	onSettingChange(setting, event) {
		const value = event.target.value
		const stateChanges = { [setting.prop]: value }

		// if src is cleared, clear icon & engine too
		// because we only know what they are when using
		// the lti launched content picker
		if (setting.prop === 'src' && !value) {
			stateChanges.icon = ''
			stateChanges.widgetEngine = ''
		}

		this.setState(stateChanges)
	}

	focusOnFirstElement() {
		if (!this.inputRef.current) return
		this.inputRef.current.focus()
	}

	standardizeIconUrl(url) {
		// makes sure we're getting the 92x92 px icon at 2x pixel density
		return url.replace(/icon-.+\.png/, 'icon-92@2x.png')
	}

	onPick(event) {
		// handles cancel button clicks from the picker
		if (event.type === 'click') {
			this.setState({ pickerOpen: false })
			return
		}

		// only proceed if it's a postmessage
		if (event.type !== 'message') return

		// only listen to postmessages from materia
		if (event.origin !== this.props.materiaHost) return

		// Materia custom selection message (not a standard LTI thing)
		if (event.data && typeof event.data === 'string') {
			try {
				const data = JSON.parse(event.data)
				const { name: caption, embed_url: src, img: icon, widget } = data
				const height = parseInt(widget.height, 10)
				const width = parseInt(widget.width, 10)
				this.setState({
					height,
					width,
					src,
					widgetEngine: widget.name,
					caption: this.state.caption || caption, // don't update if title is already set so we don't overwrite customization
					icon: this.standardizeIconUrl(icon),
					pickerOpen: false,
					showCustomize: false
				})
			} catch (e) {
				// do nothing
				console.error('Error parsing Materia resource selection.') // eslint-disable-line no-console
				console.error(e) // eslint-disable-line no-console
			}
		}
	}

	toggleEditLock() {
		this.setState({ showCustomize: !this.state.showCustomize })
	}

	openPicker() {
		this.setState({ pickerOpen: true })
	}

	updateValidation() {
		console.log('uv', this.state)
		if (this.state.width < 100) {
			this.widthRef.current.setCustomValidity('The width must be at least 100 px')
		} else {
			this.widthRef.current.setCustomValidity('')
		}

		if (this.state.height < 100) {
			this.heightRef.current.setCustomValidity('The height must be at least 100 px')
		} else {
			this.widthRef.current.setCustomValidity('')
		}
	}

	onConfirm() {
		// this.updateValidation()

		const formIsValid = this.formRef.current.reportValidity()
		console.log('fiv', formIsValid)
		if (formIsValid) {
			return
			// extract the properties out of state we want to save
			const { caption, height, width, src, widgetEngine, icon } = this.state
			this.props.onConfirm({ caption, height, width, src, widgetEngine, icon })
		}
	}

	render() {
		// Display the LTI Widget Picker
		if (this.state.pickerOpen) {
			return (
				<MateriaPickerDialog
					onPick={this.onPick}
					onCancel={this.onPick}
					draftId={this.props.draftId}
					contentId={this.props.contentId}
					nodeId={this.props.nodeId}
					ref={this.pickerIframeRef}
				/>
			)
		}

		// Display the settings dialog
		return (
			<SettingsDialog
				title="Materia Widget Settings"
				onConfirm={this.onConfirm}
				onCancel={this.props.onCancel}
				focusOnFirstElement={this.focusOnFirstElement}
			>
				<form ref={this.formRef} onSubmit={event => event.preventDefault()}>
					<div className="row center">
						Note: Materia scores do not sync to Obojobo (coming soon).
					</div>
					<SettingsDialogRow className="highlight">
						{this.state.icon ? (
							<div className="widget-icon">
								<img src={this.state.icon} alt={this.state.widgetEngine} />
							</div>
						) : null}
						{this.state.caption ? <div className="widget-name">{this.state.caption}</div> : null}
						<Button
							id="obojobo-draft--chunks--materia--properties-modal--src"
							className="correct-button"
							onClick={this.openPicker}
							ref={this.inputRef}
						>
							{this.state.src ? 'Change Widget...' : 'Select a Widget...'}
						</Button>
					</SettingsDialogRow>

					<SettingsDialogRow className="center">
						<Button
							altAction
							className={`toggle-view-button ${isOrNot(this.state.showCustomize, 'open')}`}
							onClick={this.toggleEditLock}
						>
							{this.state.showCustomize ? 'Hide Customize' : 'Customize'}
						</Button>
						{this.state.showCustomize ? (
							<SettingsDialogForm
								settings={this.state}
								config={this.settingsItems}
								onChange={this.onSettingChange}
							/>
						) : null}
					</SettingsDialogRow>
				</form>
			</SettingsDialog>
		)
	}
}

export default MateriaSettingsDialog
