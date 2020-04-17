import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { ReactEditor } from 'slate-react'

import { Transforms, Path, Editor, Element } from 'slate'

import InsertMenu from './components/insert-menu'
import MoreInfoBox from '../navigation/more-info-box'

import './editor-component.scss'

const { OboModel } = Common.models
class Node extends React.Component {
	insertBlockAtStart(item) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)

		// Change the node so that the top insert menu is closed
		// Also, toggle editable back on so that users can continue editing once
		// the new node is inserted
		Transforms.setNodes(this.props.editor, { open: null }, { at: path })
		this.props.editor.toggleEditable(true)

		const newBlock = item.cloneBlankNode()

		// Then use transforms to insert at that path, which effectively inserts above like in arrays
		Transforms.insertNodes(this.props.editor, newBlock, { at: path })
		Transforms.select(this.props.editor, Editor.start(this.props.editor, path))
	}

	insertBlockAtEnd(item) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)

		// Change the node so that the bottom insert menu is closed
		// Also, toggle editable back on so that users can continue editing once
		// the new node is inserted
		Transforms.setNodes(this.props.editor, { open: null }, { at: path })
		this.props.editor.toggleEditable(true)

		const newBlock = item.cloneBlankNode()

		// Increment the last elementof the path, then use transforms to insert at that path,
		// which effectively inserts below like in arrays
		Transforms.insertNodes(this.props.editor, newBlock, { at: Path.next(path) })
		Transforms.select(this.props.editor, Editor.start(this.props.editor, Path.next(path)))
	}

	saveId(prevId, newId) {
		if (prevId === newId) return

		// check against existing nodes for duplicate keys
		const model = OboModel.models[prevId]

		if (!newId) {
			return 'Please enter an id'
		}

		if (!model.setId(newId)) {
			return 'The id "' + newId + '" already exists. Please choose a unique id'
		}

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(this.props.editor, { id: newId }, { at: path })
	}

	saveContent(prevContent, newContent) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(this.props.editor, { content: newContent }, { at: path })
	}

	deleteNode() {
		// Cursor focus is automatically returned to the editor by the onChange function
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.removeNodes(this.props.editor, { at: path })
	}

	duplicateNode() {
		const newNode = Object.assign({}, this.props.element)

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		path[path.length - 1]++
		Transforms.insertNodes(this.props.editor, newNode, { at: path })
	}

	onOpen() {
		// Lock the editor into readOnly to prevent it from stealing cursor focus
		this.props.editor.toggleEditable(false)
	}

	// This method allows the keyboard shortcuts to open and close
	// menus (insert and more info) to play nice with mouse users
	onBlur() {
		// clear the open attribute on the top and bottom nodes
		const nodes = Array.from(
			Editor.nodes(this.props.editor, {
				at: this.props.editor.selection || this.props.editor.prevSelection,
				match: n => Element.isElement(n) && !n.subtype,
				mode: 'lowest'
			})
		)

		// Handle cases where no nodes are selected because the page is changing
		if (nodes.length === 0) {
			return this.props.editor.toggleEditable(true)
		}

		// Clear anything open on the first node
		// This could be an insert menu or a more info box
		Transforms.setNodes(
			this.props.editor,
			{ open: null },
			{
				at: nodes[0][1]
			}
		)

		// Clear anything open on the last node
		// This will only be an insert menu
		Transforms.setNodes(
			this.props.editor,
			{ open: null },
			{
				at: nodes[nodes.length - 1][1]
			}
		)

		// Give cursor focus back to the editor, reselecting the previous
		// selection if it got nulled
		if (!this.props.editor.selection) {
			Transforms.select(this.props.editor, this.props.editor.prevSelection)
		}
		this.props.editor.toggleEditable(true)
	}

	render() {
		const selected = this.props.selected
		const editor = this.props.editor

		const className = `oboeditor-component component ${this.props.className || ''}`

		return (
			<div className={className.trim()} data-obo-component="true">
				{this.props.selected ? (
					<div className={'component-toolbar'}>
						<InsertMenu
							dropOptions={Common.Registry.insertableItems}
							className={'align-left top'}
							icon="+"
							open={this.props.element.open === 'top'}
							masterOnClick={this.insertBlockAtStart.bind(this)}
							onBlur={this.onBlur.bind(this)}
						/>
						<InsertMenu
							dropOptions={Common.Registry.insertableItems}
							className={'align-left bottom'}
							icon="+"
							open={this.props.element.open === 'bottom'}
							masterOnClick={this.insertBlockAtEnd.bind(this)}
							onBlur={this.onBlur.bind(this)}
						/>
					</div>
				) : null}

				{selected ? (
					<MoreInfoBox
						className="content-node"
						id={this.props.element.id}
						isFirst
						isLast
						open={this.props.element.open === 'info'}
						type={this.props.element.type}
						content={this.props.element.content || {}}
						saveId={this.saveId.bind(this)}
						saveContent={this.saveContent.bind(this)}
						contentDescription={this.props.contentDescription || []}
						deleteNode={this.deleteNode.bind(this)}
						duplicateNode={this.duplicateNode.bind(this)}
						markUnsaved={editor.markUnsaved}
						onOpen={this.onOpen.bind(this)}
						onBlur={this.onBlur.bind(this)}
						tabIndex="-1"
					/>
				) : null}
				{this.props.children}
			</div>
		)
	}
}

export default Node
