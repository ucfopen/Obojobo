import './more-info-box.scss'

import ClipboardUtil from '../../util/clipboard-util'
import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'

import MoreInfoIcon from '../../assets/more-info-icon'
import TriggerListModal from '../triggers/trigger-list-modal'

const { Button, Switch } = Common.components
const { ModalUtil } = Common.util

// Expected Props:
// id: String - the id of the item to edit
// content: Object - the item data for the node.  Each key-value pair would be edited independantly
// saveId: Function(oldId, newId) - updates the id.  Returns a string error if the id couldn't save
// saveContent: Function(oldContent, newContent) - updates the content. Returns a string error if the content is invalid
// contentDescription: [Object] - a list of descriptions that tells which content attributes to display and how
// 			Each description should have a name, a description, and a type
// markUnsaved: Function() - marks the editor content as unsaved
class MoreInfoBox extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			currentId: this.props.id,
			needsUpdate: false,
			error: null,
			isOpen: false,
			content: this.props.content
		}

		this.handleClick = this.handleClick.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)

		this.toggleOpen = this.toggleOpen.bind(this)
		this.close = this.close.bind(this)

		this.handleIdChange = this.handleIdChange.bind(this)
		this.onSave = this.onSave.bind(this)

		this.showTriggersModal = this.showTriggersModal.bind(this)
		this.closeModal = this.closeModal.bind(this)

		this.node = React.createRef()
		this.idInput = React.createRef()
	}

	componentWillUnmount() {
		this.close()
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.props.open && this.props.open !== prevProps.open) {
			// When props are toggled open, set the state to open
			// This way state can handle actually opening the MoreInfoBox
			// imporving the consistency of the UI
			return this.setState({ isOpen: true})
		}

		// This autofocuses the id input box when the node is opened
		// for easy use by keyboard users
		if (this.state.isOpen && this.state.isOpen !== prevState.isOpen) {
			document.addEventListener('mousedown', this.handleClick, false)
			this.idInput.current.focus()
			setTimeout(() => { this.idInput.current.select() }, 200)
		}
	}

	handleClick(event) {
		if (!this.node.current || this.node.current.contains(event.target)) return

		// When the click is outside the box, close the box
		return this.onSave()
	}

	onKeyDown(event) {
		if (event.key === 'Escape') {
			return this.onSave()
		}
	}

	handleIdChange(event) {
		const currentId = event.target.value

		return this.setState({ currentId, needsUpdate: true })
	}

	handleContentChange(key, event) {
		event.stopPropagation()
		const newContent = {}
		newContent[key] = event.target.value

		this.setState(prevState => ({
			content: Object.assign(prevState.content, newContent),
			needsUpdate: true
		}))
	}

	handleSwitchChange(key, booleanValue) {
		const newContent = {}
		newContent[key] = booleanValue

		this.setState(prevState => ({
			content: Object.assign(prevState.content, newContent)
		}))
	}

	handleAbstractToggleChange(changeFn, booleanValue) {
		this.setState(prevState => ({ content: changeFn(prevState.content, booleanValue) }))
	}

	onSave() {
		// Save the internal content to the editor state
		const error =
			this.props.saveContent(this.props.content, this.state.content) ||
			this.props.saveId(this.props.id, this.state.currentId)
		if (!error) {
			// Wrapping these methods in a Timeout prevents a race condition with editor updates
			this.props.markUnsaved()
			return this.close()
		}

		this.setState({ error })
	}

	toggleOpen(event) {
		event.stopPropagation()

		if (this.state.isOpen) {
			if (this.state.needsUpdate) {
				this.onSave()
			} else {
				this.close()
			}
		} else {
			this.setState({ isOpen: true })
			if (this.props.onOpen) this.props.onOpen()
		}
	}

	close() {
		document.removeEventListener('mousedown', this.handleClick, false)
		if (this.props.onBlur) this.props.onBlur('info')
		return this.setState({ isOpen: false })
	}

	showTriggersModal() {
		// Prevent info box from closing when modal is opened
		document.removeEventListener('mousedown', this.handleClick, false)
		ModalUtil.show(<TriggerListModal content={this.state.content} onClose={this.closeModal} />)
	}

	closeModal(modalState) {
		this.setState(prevState => ({
			content: { ...prevState.content, triggers: modalState.triggers },
			needsUpdate: true
		}))
		document.addEventListener('mousedown', this.handleClick, false)
		ModalUtil.hide()
	}

	renderItem(description) {
		switch (description.type) {
			case 'input':
				return (
					<div key={description.description}>
						<label>{description.description}</label>
						<input
							type="text"
							value={this.state.content[description.name]}
							onChange={this.handleContentChange.bind(this, description.name)}
							onClick={event => event.stopPropagation()}
						/>
					</div>
				)
			case 'select':
				return (
					<div key={description.description}>
						<label>{description.description}</label>
						<select
							className="select-item"
							value={this.state.content[description.name]}
							onChange={this.handleContentChange.bind(this, description.name)}
							onClick={event => event.stopPropagation()}
						>
							{description.values.map(option => (
								<option value={option.value} key={option.value}>
									{option.description}
								</option>
							))}
						</select>
					</div>
				)
			case 'toggle':
				return (
					<Switch
						key={description.description}
						title={description.description}
						initialChecked={this.state.content[description.name]}
						handleCheckChange={this.handleSwitchChange.bind(this, description.name)}
					/>
				)
			// Toggles complex things, like Lock Nav during Assessment Attempt
			case 'abstract-toggle':
				return (
					<Switch
						key={description.description}
						title={description.description}
						initialChecked={description.value(this.state.content)}
						handleCheckChange={this.handleAbstractToggleChange.bind(this, description.onChange)}
					/>
				)
		}
	}

	renderInfoBox() {
		const triggers = this.state.content.triggers

		return (
			<div className="more-info-box">
				<div className="container">
					<div className="properties">
						<div>{this.props.type}</div>
						<div>
							<div>
								<label htmlFor="oboeditor--components--more-info-box--id-input">Id</label>
								<input
									autoFocus
									type="text"
									id="oboeditor--components--more-info-box--id-input"
									value={this.state.currentId}
									onChange={this.handleIdChange}
									className="id-input"
									onClick={event => event.stopPropagation()}
									ref={this.idInput}
								/>
								<Button
									className="input-aligned-button"
									onClick={() => ClipboardUtil.copyToClipboard(this.state.currentId)}
								>
									Copy Id
								</Button>
							</div>
							{this.props.contentDescription.map(description => this.renderItem(description))}
						</div>
						<div>
							<span className="triggers">
								Triggers:
								{triggers && triggers.length > 0 ? (
									<span>
										{triggers
											.map(trigger => trigger.type)
											.reduce((accum, trigger) => accum + ', ' + trigger)}
									</span>
								) : null}
							</span>
							<Button className="trigger-button" onClick={this.showTriggersModal}>
								✎ Edit
							</Button>
						</div>
						{this.props.hideButtonBar ? null : (
							<div className="button-bar">
								<Button className="delete-page-button" onClick={this.props.deleteNode}>
									Delete
								</Button>
								{!this.props.isAssessment ? (
									<Button onClick={this.props.duplicateNode}>Duplicate</Button>
								) : null}
								{this.props.isFirst ? null : (
									<Button onClick={() => this.props.moveNode(this.props.index - 1)}>Move Up</Button>
								)}
								{this.props.isLast ? null : (
									<Button onClick={() => this.props.moveNode(this.props.index + 1)}>
										Move Down
									</Button>
								)}
							</div>
						)}
					</div>
					<div className="box-controls">
						{this.state.error ? <p className="error">{this.state.error}</p> : null}
						<Button onClick={this.onSave} className="cancel-button">
							Done
						</Button>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div
				ref={this.node}
				className={'visual-editor--more-info ' + (this.props.className || '')}
				onKeyDown={this.onKeyDown}>
				<button
					className={'more-info-button ' + (this.state.isOpen ? 'is-open' : '')}
					onClick={this.toggleOpen}
					tabIndex={this.props.tabIndex || 0}
					aria-label="Toggle More Info Box">
					<MoreInfoIcon />
				</button>
				{this.state.isOpen ? this.renderInfoBox() : null}
			</div>
		)
	}
}

export default MoreInfoBox
