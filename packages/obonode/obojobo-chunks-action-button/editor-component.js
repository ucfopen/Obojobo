import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import TriggerListModal from 'obojobo-document-engine/src/scripts/oboeditor/components/triggers/trigger-list-modal'

import NewActionModal from './new-action-modal'

const { ModalUtil } = Common.util
const { Button } = Common.components

const Action = props => {
	let description

	switch(props.type){
		case 'nav:goto':
			description = 'Go to "' + props.value.id + '"'
			break
		case 'nav:prev':
			description = 'Go to the previous page'
			break
		case 'nav:next':
			description = 'Go to the next page'
			break
		case 'nav:openExternalLink':
			description = 'Open ' + props.value.url
			break
		case 'nav:lock':
			description = 'Lock navigation'
			break
		case 'nav:unlock':
			description = 'Unlock navigation'
			break
		case 'nav:open':
			description = 'Open the navigation menu'
			break
		case 'nav:close':
			description = 'Close the navigation menu'
			break
		case 'nav:toggle':
			description = 'Toggle the navigation drawer'
			break
		case 'assessment:startAttempt':
			description = 'Start an attempt for "' + props.value.id + '"'
			break
		case 'assessment:endAttempt':
			description = 'End an attempt for "' + props.value.id + '"'
			break
		case 'viewer:alert':
			description = 'Display a popup message'
			break
		case 'viewer:scrollToTop':
			description = 'Scroll to the top of the page'
			break
		case 'focus:component':
			description = 'Focus on "' + props.value.id + '"'
			break
	}

	return (
		<div className="trigger">
			<span>{description}</span>
		</div>
	)
}

class ActionButton extends React.Component {
	constructor(props) {
		super(props)

		this.showTriggersModal = this.showTriggersModal.bind(this)
		this.closeModal = this.closeModal.bind(this)
	}

	showAddActionModal() {
		ModalUtil.show(<NewActionModal onConfirm={this.addAction.bind(this)} />)
	}

	addAction(newAction) {
		const editor = this.props.editor
		const content = this.props.node.data.get('content')

		content.actions.push(newAction)

		return editor.setNodeByKey(this.props.node.key, {
			data: { content }
		})
	}

	removeAction(index) {
		const editor = this.props.editor
		const content = this.props.node.data.get('content')

		content.actions.splice(index, 1)

		return editor.setNodeByKey(this.props.node.key, {
			data: { content }
		})
	}

	showTriggersModal() {
		ModalUtil.show(
			<TriggerListModal 
				content={this.props.node.data.get('content')} 
				onClose={this.closeModal}/>
		)
	}

	closeModal(modalState) {
		this.props.editor.setNodeByKey(
			this.props.node.key, 
			{ data: { ...this.props.node.data.toJSON(), content: modalState } }
		)
	}

	renderTriggers() {
		const content = this.props.node.data.get('content')
		const onClickTrigger = content.triggers.filter(trigger => trigger.type === 'onClick')[0]
		return (
			<div className="trigger-box" contentEditable={false}>
				<div className="box-border">
					<div className="trigger-list">
						<div className="title">
							When the button is clicked:
						</div>
						{ onClickTrigger.actions.map(action => (<Action key={action.type} {...action} />)) }
					</div>
					<Button className="add-action" onClick={this.showTriggersModal}>
						Edit Triggers
					</Button>
				</div>
			</div>
		)
	}

	render() {
		const { isSelected } = this.props

		return (
			<Node {...this.props}>
				<div className="text-chunk obojobo-draft--chunks--action-button pad">
					<div className="obojobo-draft--components--button align-center">
						<div className="button">{this.props.children}</div>
					</div>
					{isSelected ? this.renderTriggers() : null}
				</div>
			</Node>
		)
	}
}

export default ActionButton
