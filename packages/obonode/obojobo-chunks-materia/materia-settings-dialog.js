import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import SimpleDialog from 'obojobo-document-engine/src/scripts/common/components/modal/simple-dialog'
import Button from 'obojobo-document-engine/src/scripts/common/components/button'
import MateriaPickerDialog from './materia-picker-dialog'
import './materia-settings-dialog.scss'

class MateriaSettingsDialog extends React.Component {
	constructor(props) {
		super(props)

		const defaultState = {
			autoload: false,
			border: true,
			height: 0,
			width: 0,
			initialZoom: 1,
			fit: 'scale',
			src: '',
			title: '',
			icon: '',
			widgetEngine: '',
			pickerOpen: false,
			// start open if theres no icon and src is set (custom link)
			// start closed if there's no src (empty node)
			isUnlocked: (!props.content.icon && props.content.src)
		}
		this.state = { ...defaultState, ...props.content }

		this.inputRef = React.createRef()
		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
		this.openPicker = this.openPicker.bind(this)
		this.onPick = this.onPick.bind(this)
		this.toggleEditLock = this.toggleEditLock.bind(this)
		this.onConfirm = this.onConfirm.bind(this)

		this.settingsItems = [
			{
				label: 'Name',
				prop: 'title',
			},
			{
				label: 'Link',
				prop: 'src',
			},
			{
				label: 'Width',
				prop: 'width',
				units: 'px',
				type: 'number',
			},
			{
				label: 'Height',
				prop: 'height',
				units: 'px',
				type: 'number',
			}
		]
	}

	handleEventChange(prop, event){
		this.setState({ [prop]: event.target.value })
	}

	focusOnFirstElement() {
		if (this.inputRef && this.inputRef.current) {
			return this.inputRef.current.focus()
		}
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
				console.log(data)
				const {name: title, url, widget} = data
				const height = parseInt(widget.height, 10)
				const width = parseInt(widget.width, 10)
				return this.setState({
					height,
					width,
					title,
					src: data.embed_url,
					widgetEngine: widget.name,
					icon: data.img.replace(/icon-.+\.png/, 'icon-92@2x.png'),
					pickerOpen: false,
					isUnlocked: false
				})
			} catch(e){
				// do nothing
			}
		}

	}

	toggleEditLock(){
		this.setState({isUnlocked: !this.state.isUnlocked})
	}

	openPicker(){
		this.setState({pickerOpen: true})
	}

	onConfirm(){
		// extract the properties out of state we want to save
		const { height, width, title, src, widgetEngine, icon } = this.state
		this.props.onConfirm({ height, width, title, src, widgetEngine, icon })
	}

	render() {
		if(this.state.pickerOpen){
			return (
				<MateriaPickerDialog onPick={this.onPick} onCancel={this.onPick}/>
			)
		}

		return (
			<SimpleDialog
				cancelOk
				title="Materia Widget Settings"
				onConfirm={this.onConfirm}
				onCancel={this.props.onCancel}
				focusOnFirstElement={this.focusOnFirstElement}
			>
				<div className={'obojobo-draft--chunks--materia--properties-modal'}>

					<div className="row info">
						{this.state.icon
							? <div className="widget-icon"><img src={this.state.icon} alt={this.state.widgetEngine} /></div>
							: null
						}
						{this.state.title
							? <div className="widget-name">{this.state.title}</div>
							: null
						}
						<Button
							id="obojobo-draft--chunks--materia--properties-modal--src"
							className="correct-button"
							onClick={this.openPicker}
							ref={this.inputRef}
						>
							{this.state.src ? 'Change Widget...' : 'Select a Widget...'}
						</Button>
					</div>

					<div className="row center">

						<Button
							className={`toggle-view-button ${isOrNot(this.state.isUnlocked, 'open')}`}
							altAction
							onClick={this.toggleEditLock}
						>
							{this.state.isUnlocked ? 'Close Customize' : 'Customize'}
						</Button>

						{this.state.isUnlocked
							? <div className="obojobo-draft-settings--container">
								{this.settingsItems.map(item =>
									<>
										<label htmlFor={`obojobo-draft-seetings--item-${item.prop}`}>{item.label}:</label>
										<div>
											<input
													type={item.type || 'text'}
													id={`obojobo-draft-seetings--item-${item.prop}`}
													disabled={item.editable === false}
													value={this.state[item.prop] || ''}
													placeholder={(item.placeholder || item.label) + " not set"}
													onChange={this.handleEventChange.bind(this, item.prop)}
											/>
											{item.units
												? <span className="obojobo-draft-settings--units">{item.units}</span>
												: null
											}
										</div>
									</>
								)}
							</div>
							: null
						}
					</div>



				</div>
			</SimpleDialog>
		)
	}
}

export default MateriaSettingsDialog
