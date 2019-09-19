import './more-info-box.scss'

import ClipboardUtil from '../../util/clipboard-util'
import Common from 'Common'
import EditorUtil from '../../util/editor-util'
import React from 'react'
import generateId from '../../generate-ids'

import MoreInfoIcon from '../../assets/more-info-icon'
import TriggerListModal from '../triggers/trigger-list-modal'

const { SimpleDialog } = Common.components.modal
const { Button } = Common.components
const { ModalUtil } = Common.util

const { OboModel } = Common.models

class MoreInfoBox extends React.Component {
	constructor(props) {
		super(props)

		this.model = OboModel.models[this.props.item.id]

		this.state = {
			currentId: this.props.item.id,
			currentTitle: this.props.item.label,
			error: null,
			isOpen: false,
			content: this.model.get('content') 
		}

		this.state.content.mockattribute = 'ahahahahahahah'

		this.toggleOpen = this.toggleOpen.bind(this)
		this.close = this.close.bind(this)

		this.handleIdChange = this.handleIdChange.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.onSave = this.onSave.bind(this)
		this.handleClick = this.handleClick.bind(this)

		this.duplicatePage = this.duplicatePage.bind(this)

		this.showDeleteModal = this.showDeleteModal.bind(this)
		this.deletePage = this.deletePage.bind(this)

		this.showTriggersModal = this.showTriggersModal.bind(this)
		this.closeModal = this.closeModal.bind(this)

		this.node = React.createRef()
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClick, false)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false)
	}

	handleClick(event) {
		if (!this.node.current || this.node.current.contains(event.target)) return

		// When the click is outside the box, close the box
		this.close()
	}

	renamePage(pageId, label) {
		if (this.isWhiteSpace(label)) label = null

		EditorUtil.renamePage(pageId, label)
	}

	movePage(pageId, index) {
		EditorUtil.movePage(pageId, index)
	}

	setStartPage(pageId) {
		EditorUtil.setStartPage(pageId)
	}

	duplicatePage() {
		this.props.savePage()
		const newPage = this.model.flatJSON()
		newPage.children= this.model.get('children')
		// Removes duplicate ids from duplicated pages
		newPage.id = generateId()
		newPage.content.title = this.props.item.label + ' - (Copy)'
		EditorUtil.addPage(newPage, this.props.item.id)
	}

	isWhiteSpace(str) {
		return !/[\S]/.test(str)
	}

	handleIdChange(event) {
		const currentId = event.target.value

		return this.setState({ currentId })
	}

	handleTitleChange(event) {
		const currentTitle = event.target.value

		return this.setState({ currentTitle })
	}

	onSave() {
		if(this.model.setId(this.state.currentId)) {
			this.renamePage(this.state.currentId, this.state.currentTitle)
			return this.close()
		}
		
		this.setState(state => ({ error: 'The id "' + state.currentId + '" already exists. Please choose a unique id'}))
	}

	toggleOpen() {
		return this.setState(state => ({ isOpen: !state.isOpen }))
	}

	close() {
		return this.setState({ isOpen: false })
	}

	showDeleteModal() {
		ModalUtil.show(
			<SimpleDialog cancelOk onConfirm={this.deletePage}>
				{'Are you sure you want to delete ' +
					this.props.item.label +
					'? This will permanately delete all content in the page'}
			</SimpleDialog>
		)
	}

	deletePage() {
		ModalUtil.hide()

		EditorUtil.deletePage(this.props.item.id)
	}

	showTriggersModal() {
		// Prevent info box from closing when modal is opened
		document.removeEventListener('mousedown', this.handleClick, false)
		ModalUtil.show(
			<TriggerListModal 
				content={this.model.get('content')} 
				onConfirm={this.closeModal} 
				saveTriggers={this.saveTriggers}/>
		)
	}

	closeModal(modalState) {
		this.model.setStateProp('triggers', modalState.triggers)
		document.addEventListener('mousedown', this.handleClick, false)
		ModalUtil.hide()
	}

	renderInfoBox() {
		const triggers = this.model.get('content').triggers
		return (
			<div className="more-info-box">
				<div className="container">
					<div className="properties">
						<div>
							{this.model.get('type')}
						</div>
						<div>
							<div>
								<label htmlFor="oboeditor--components--more-info-box--id-input">Id</label>
								<input
									type="text"
									id="oboeditor--components--more-info-box--id-input"
									value={this.state.currentId}
									onChange={this.handleIdChange}
									className="id-input"/>
								<Button 
									className="input-aligned-button"
									onClick={() => ClipboardUtil.copyToClipboard(this.state.currentId)}>
										Copy Link
								</Button>
							</div>
							<div>
								<label htmlFor="oboeditor--components--more-info-box--title-input">Title</label>
								<input
									type="text"
									id="oboeditor--components--more-info-box--title-input"
									value={this.state.currentTitle}
									onChange={this.handleTitleChange}/>
							</div>
						</div>
						<div>
							Triggers:
							{ triggers && triggers.length > 0 ?
								<span
									className="triggers">
									{ triggers
											.map(trigger => trigger.type)
											.reduce((accum, trigger) => accum + ", " + trigger) }
								</span>
								: null }
							<Button 
								className="trigger-button"
								onClick={this.showTriggersModal}>
								✎ Edit
							</Button>
						</div>
						<div>
							<Button 
								className="delete-page-button"
								onClick={this.showDeleteModal}>Delete</Button>
							<Button 
								className="duplicate-button"
								onClick={this.duplicatePage}>
								Duplicate
							</Button>
						</div>
					</div>
					<div>
						{this.state.error ? <p>{this.state.error}</p> : null }
						<Button 
							onClick={this.close}
							className="cancel-button">
							Cancel
						</Button>
						<Button 
							onClick={this.onSave}
							className="save-button">
							Save
						</Button>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div ref={this.node} className="more-info">
				<button 
					className={'more-info-button ' + ( this.state.isOpen ? 'is-open' : '')}
					onClick={this.toggleOpen}>
					<MoreInfoIcon />
				</button>
				{ this.state.isOpen ? this.renderInfoBox() : null }
			</div>
		)
	}
}

export default MoreInfoBox
