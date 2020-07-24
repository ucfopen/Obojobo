import React, { useEffect, useRef, useMemo } from 'react'
import Common from 'Common'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
const { Dialog, SimpleDialog } = Common.components.modal
const { Button } = Common.components

import './materia-settings-dialog.scss'

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
			isUnlocked: false
		}
		this.state = { ...defaultState, ...props.content }
		this.inputRef = React.createRef()

		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
		this.openPicker = this.openPicker.bind(this)
		this.onPick = this.onPick.bind(this)
		this.toggleEditLock = this.toggleEditLock.bind(this)
		this.onConfirm = this.onConfirm.bind(this)
	}

	componentDidMount() {
		this.inputRef.current.focus()
		this.inputRef.current.select()
	}

	handleEventChange(prop, event){
		this.setState({ [prop]: event.target.value })
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

		const items = [
			{
				label: 'Name',
				prop: 'title',
				editable: this.state.isUnlocked
			},
			{
				label: 'Link',
				prop: 'src',
				editable: this.state.isUnlocked
			},
			{
				label: 'Width',
				prop: 'width',
				units: 'px',
				type: 'number',
				editable: this.state.isUnlocked
			},
			{
				label: 'Height',
				prop: 'height',
				units: 'px',
				type: 'number',
				editable: this.state.isUnlocked
			}
		]

		return (
			<SimpleDialog
				cancelOk
				title="Materia Widget Settings"
				onConfirm={this.onConfirm}
				onCancel={this.props.onCancel}
				focusOnFirstElement={this.focusOnFirstElement}
			>
				<div className={'obojobo-draft--chunks--materia--properties-modal'}>
					<div className="info">
					{this.state.icon
								? <div className="widget-icon"><img src={this.state.icon} alt={this.state.widgetEngine} /></div>
								: null
							}
						<Button id="obojobo-draft--chunks--materia--properties-modal--src" className="correct-button" onClick={this.openPicker}>
								{this.state.src ? 'Change Widget...' : 'Select a Widget...'}
							</Button>
					</div>

					<div className="options">
						<Button altAction onClick={this.toggleEditLock} disabled={this.state.isUnlocked}>
							{this.state.isUnlocked ? 'unlocked for editing' : 'unlock to edit'}
						</Button>
						<div className="obojobo-draft-settings--container">
							{items.map(item =>
								<>
									<label htmlFor={`obojobo-draft-seetings--item-${item.prop}`}>{item.label}:</label>
									<div>
										<input
												type={item.type || 'text'}
												id={`obojobo-draft-seetings--item-${item.prop}`}
												ref={this.inputRef}
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
					</div>

				</div>
			</SimpleDialog>
		)
	}
}

export default MateriaSettingsDialog
