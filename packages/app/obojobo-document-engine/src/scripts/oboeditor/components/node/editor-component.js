import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { ReactEditor } from 'slate-react'

import { Transforms, Path, Editor } from 'slate'

import InsertMenu from './components/insert-menu'
import MoreInfoBox from '../navigation/more-info-box'

import './editor-component.scss'

const { OboModel } = Common.models
class Node extends React.Component {
	insertBlockAtStart(item) {
		const newBlock = item.cloneBlankNode()

		// Use the ReactEditor to get the path for the current element
		// Then use transforms to insert at that path, which effectively inserts above like in arrays
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.insertNodes(this.props.editor, newBlock, { at: path })
		Transforms.select(this.props.editor, Editor.start(this.props.editor, path))
	}

	insertBlockAtEnd(item) {
		const newBlock = item.cloneBlankNode()

		// Use the ReactEditor to get the path for the current element, and increment the last element
		// Then use transforms to insert at that path, which effectively inserts below like in arrays
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
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

	onClose() {
		// Give cursor focus back to the editor
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

				{selected ? (
					<MoreInfoBox
						className="content-node"
						id={this.props.element.id}
						isFirst
						isLast
						type={this.props.element.type}
						content={this.props.element.content || {}}
						saveId={this.saveId.bind(this)}
						saveContent={this.saveContent.bind(this)}
						contentDescription={this.props.contentDescription || []}
						deleteNode={this.deleteNode.bind(this)}
						duplicateNode={this.duplicateNode.bind(this)}
						markUnsaved={editor.markUnsaved}
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
