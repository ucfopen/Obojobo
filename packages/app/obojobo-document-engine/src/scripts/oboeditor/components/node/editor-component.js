import React from 'react'
import { Block } from 'slate'
import Common from 'Common'

import DropMenu from './components/insert-menu'

import MoreInfoBox from '../navigation/more-info-box'

import './editor-component.scss'

class Node extends React.Component {
	insertBlockAtStart(item) {
		const editor = this.props.editor

		console.log(this.props)
		console.log(this.props.node)
		console.log(this.props.parent.getPath(this.props.node.key).get(0))

		return editor.insertNodeByKey(this.props.parent.key, this.props.parent.getPath(this.props.node.key).get(0), Block.create(item.insertJSON))
	}

	insertBlockAtEnd(item) {
		const editor = this.props.editor

		return editor.insertNodeByKey(
			this.props.node.key,
			this.props.node.nodes.size,
			Block.create(item.insertJSON)
		)
	}

	convertItemsToArray(items) {
		return Array.from(items.values())
	}

	saveId() {
		console.log('mblargh')
	}

	saveContent() {
		console.log('aaaaaaaaaaaah')
	}

	deleteNode() {
		// Cursor focus is automatically returned to the editor by the onChange function
		this.props.editor.removeNodeByKey(this.props.node.key)
	}

	duplicateNode() {
		console.log(this.props.node)
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
						content={this.props.node.data.toJSON().content}
						saveId={this.saveId}
						saveContent={this.saveContent.bind(this)}
						contentDescription={[
							{
								name: 'title',
								description: 'Title',
								type: 'string'
							}
						]}
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
