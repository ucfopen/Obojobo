import React from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import InsertMenu from './components/insert-menu'
import MoreInfoBox from '../navigation/more-info-box'

import './editor-component.scss'

const { OboModel } = Common.models

class Node extends React.Component {
	insertBlockAtStart(item) {
		const newBlock = Block.create(item.cloneBlankNode())
		// Create the obomodel and set its id to match the block key to prevent duplicate keys
		const newModel = OboModel.create(item.insertJSON.type)
		newModel.setId(newBlock.key)

		// Inserts a sibling node before the current node
		return this.props.editor.insertNodeByKey(
			this.props.parent.key,
			this.props.parent.getPath(this.props.node.key).get(0),
			newBlock
		)
	}

	insertBlockAtEnd(item) {
		const newBlock = Block.create(item.cloneBlankNode())
		// Create the obomodel and set its id to match the block key to prevent duplicate keys
		const newModel = OboModel.create(item.insertJSON.type)
		newModel.setId(newBlock.key)

		// Inserts a sibling node after the current node
		return this.props.editor.insertNodeByKey(
			this.props.parent.key,
			this.props.parent.getPath(this.props.node.key).get(0) + 1,
			newBlock
		)
	}

	saveId(prevId, newId) {
		if (prevId === newId) return

		// check against existing nodes for duplicate keys
		const model = OboModel.models[prevId]
		if (!model.setId(newId)) {
			return 'The id "' + newId + '" already exists. Please choose a unique id'
		}

		const jsonNode = this.props.node.toJSON()
		jsonNode.key = newId

		this.props.editor
			.insertNodeByKey(
				this.props.parent.key,
				this.props.parent.getPath(this.props.node.key).get(0),
				Block.create(jsonNode)
			)
			.removeNodeByKey(prevId)
	}

	saveContent(prevContent, newContent) {
		this.props.editor.setNodeByKey(this.props.node.key, {
			data: { ...this.props.node.data.toJSON(), content: newContent }
		})
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
			Block.create(this.props.node.toJSON())
		)
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
		const className = `oboeditor-component component ${this.props.className || ''}`

		return (
			<div className={className.trim()} data-obo-component="true">
				{this.props.isSelected ? (
					<div className={'component-toolbar'}>
						<InsertMenu
							dropOptions={Common.Registry.insertableItems}
							className={'align-left top'}
							icon="+"
							masterOnClick={this.insertBlockAtStart.bind(this)}
						/>
						<InsertMenu
							dropOptions={Common.Registry.insertableItems}
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
						isFirst
						isLast
						type={this.props.node.type}
						content={this.props.node.data.toJSON().content || {}}
						saveId={this.saveId.bind(this)}
						saveContent={this.saveContent.bind(this)}
						contentDescription={this.props.contentDescription || []}
						deleteNode={this.deleteNode.bind(this)}
						duplicateNode={this.duplicateNode.bind(this)}
						markUnsaved={this.props.editor.markUnsaved}
						onOpen={this.onOpen.bind(this)}
						onClose={this.onClose.bind(this)}
					/>
				) : null}
				{this.props.children}
			</div>
		)
	}
}

export default Node
