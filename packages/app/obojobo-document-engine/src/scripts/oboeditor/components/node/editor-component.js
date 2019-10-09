import React from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import DropMenu from './components/insert-menu'

import MoreInfoBox from '../navigation/more-info-box'

import './editor-component.scss'

class Node extends React.Component {
	insertBlockAtStart(item) {
		// Inserts a sibling node before the current node
		return this.props.editor.insertNodeByKey(
			this.props.parent.key, 
			this.props.parent.getPath(this.props.node.key).get(0), 
			Block.create(item.cloneBlankNode()))
	}

	insertBlockAtEnd(item) {
		// Inserts a sibling node after the current node
		return this.props.editor.insertNodeByKey(
			this.props.parent.key, 
			this.props.parent.getPath(this.props.node.key).get(0) + 1, 
			Block.create(item.cloneBlankNode()))
	}

	convertItemsToArray(items) {
		return Array.from(items.values())
	}

	saveId(prevId, newId) {
		if(prevId === newId) return

		const jsonNode = this.props.node.toJSON()
		jsonNode.key = newId

		this.props.editor
			.insertNodeByKey(
				this.props.parent.key, 
				this.props.parent.getPath(this.props.node.key).get(0), 
				Block.create(jsonNode))
			.removeNodeByKey(prevId)
	}

	saveContent(prevContent, newContent) {
		this.props.editor.setNodeByKey(
			this.props.node.key, 
			{ data: { ...this.props.node.data.toJSON(), content: newContent } }
		)
	}

	deleteNode() {
		// Cursor focus is automatically returned to the editor by the onChange function
		this.props.editor.removeNodeByKey(this.props.node.key)
	}

	duplicateNode() {
		const editor = this.props.editor

		// Inserts a sibling node after the current node
		return editor.insertNodeByKey(
			this.props.parent.key, 
			this.props.parent.getPath(this.props.node.key).get(0) + 1, 
			Block.create(this.props.node.toJSON()))
	}

	onOpen() {
		// Lock the editor into readOnly to prevent it from stealing cursor focus
		this.props.editor.toggleEditable(false)
	}

	onClose() {
		// Give cursor focus back to the editor
		this.props.editor.toggleEditable(true)
	}

	render() {
		return (
			<div className={'oboeditor-component component'} data-obo-component="true">
				{this.props.isSelected ? (
					<div className={'component-toolbar'}>
						<DropMenu
							dropOptions={Common.Registry.getItems(this.convertItemsToArray)}
							className={'align-left top'}
							icon="+"
							masterOnClick={this.insertBlockAtStart.bind(this)}
						/>
						<DropMenu
							dropOptions={Common.Registry.getItems(this.convertItemsToArray)}
							className={'align-left bottom'}
							icon="+"
							masterOnClick={this.insertBlockAtEnd.bind(this)}
						/>
					</div>
				) : null}

				{this.props.isSelected ? (
					<MoreInfoBox
						className="content-node"
						id={this.props.node.key}
						type={this.props.node.type}
						content={this.props.node.data.toJSON().content || {}}
						saveId={this.saveId.bind(this)}
						saveContent={this.saveContent.bind(this)}
						contentDescription={this.props.contentDescription || []}
						deleteNode={this.deleteNode.bind(this)}
						duplicateNode={this.duplicateNode.bind(this)}
						markUnsaved={this.props.editor.markUnsaved}
						onOpen={this.onOpen.bind(this)}
						onClose={this.onClose.bind(this)}/>
				) : null}
				{this.props.children}
			</div>
		)
	}
}

export default Node
