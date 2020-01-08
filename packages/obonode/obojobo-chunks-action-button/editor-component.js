import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import {
	useEditor,
	useSelected,
	ReactEditor
} from 'slate-react'
import { Transforms } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import TriggerListModal from 'obojobo-document-engine/src/scripts/oboeditor/components/triggers/trigger-list-modal'
import ActionButtonEditorAction from './action-button-editor-action'

const { ModalUtil } = Common.util
const { Button } = Common.components

const showTriggersModal = (props, editor) => {
	// Do a deep clone of the content to allow writes to the new copy
	// Because content is fairly shallow, this is responsive even with a large number of actions
	const contentCopy = JSON.parse(JSON.stringify(props.element.content))

	ModalUtil.show(
		<TriggerListModal 
			content={contentCopy}
			onClose={closeModal.bind(this, editor, props)}/>
	)
}


// Hide the popup modal, and then use Slate's Transforms library to save any changes that the 
// user made to the onClick actions by combining the previous content and the current content.
const closeModal = (editor, props, modalState) => {
	ModalUtil.hide()
	const path = ReactEditor.findPath(editor, props.element)
	Transforms.setNodes(editor, { content: {...props.element.content, ...modalState} }, { at: path })
}

const renderTriggers = (props, editor) => {
	const content = props.element.content
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
				<Button className="add-action" onClick={showTriggersModal.bind(this, props, editor)}>
					Edit Triggers
				</Button>
			</div>
		</div>
	)
}

/**
 * Display an Obojobo Action button node.  Users can type into the main body of the Action Button
 * to change the label text. When the node is selected, display a menu that contains a list of 
 * actions associated with the onClick trigger, as well a a button to launch the Trigger Dialog so 
 * that users can edit the onClick actions.
 */
const ActionButton = props => {
	const selected = useSelected()
	const editor = useEditor()

	return (
		<Node {...props}>
			<div className="text-chunk obojobo-draft--chunks--action-button pad">
				<div className="obojobo-draft--components--button align-center">
					<div className="button">{props.children}</div>
				</div>
				{selected ? renderTriggers(props, editor) : null}
			</div>
		</Node>
	)
}

export default ActionButton
