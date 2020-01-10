import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import TriggerListModal from 'obojobo-document-engine/src/scripts/oboeditor/components/triggers/trigger-list-modal'
import ActionButtonEditorAction from './action-button-editor-action'

const { ModalUtil } = Common.util
const { Button } = Common.components

class ActionButton extends React.Component {
	constructor(props) {
		super(props)

		this.showTriggersModal = this.showTriggersModal.bind(this)
		this.closeModal = this.closeModal.bind(this)
	}

	showTriggersModal() {
		ModalUtil.show(
			<TriggerListModal content={this.props.node.data.get('content')} onClose={this.closeModal} />
		)
	}

	closeModal(modalState) {
		this.props.editor.setNodeByKey(this.props.node.key, {
			data: { ...this.props.node.data.toJSON(), content: modalState }
		})
	}

	renderTriggers() {
		const content = this.props.node.data.get('content')
		const onClickTrigger = content.triggers.find(trigger => trigger.type === 'onClick')
		return (
			<div className="trigger-box" contentEditable={false}>
				<div className="box-border">
					<div className="trigger-list">
						<div className="title">When the button is clicked:</div>
						{onClickTrigger.actions.map(action => (
							<ActionButtonEditorAction key={action.type} {...action} />
						))}
					</div>
					<Button className="add-action" onClick={this.showTriggersModal}>
						Edit Triggers
					</Button>
				</div>
			</div>
		)
	}

	render() {
		return (
			<Node {...this.props}>
				<div className="text-chunk obojobo-draft--chunks--action-button pad">
					<div className="obojobo-draft--components--button align-center">
						<div className="button">{this.props.children}</div>
					</div>
					{this.props.isSelected ? this.renderTriggers() : null}
				</div>
			</Node>
		)
	}
}

export default ActionButton
