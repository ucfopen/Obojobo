import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { ReactEditor } from 'slate-react'

import { Transforms, Path } from 'slate'

import InsertMenu from './components/insert-menu'
import MoreInfoBox from '../navigation/more-info-box'
import generateId from '../../generate-ids'

import './editor-component.scss'

const { OboModel } = Common.models

const insertBlockAtStart = (editor, element, item) => {
	const newBlock = item.cloneBlankNode()

	// Use the ReactEditor to get the path for the current element
	// Then use transforms to insert at that path, which effectively inserts above like in arrays
	const path = ReactEditor.findPath(editor, element)
	Transforms.insertNodes(editor, newBlock, { at: path })
}

const insertBlockAtEnd = (editor, element, item) => {
	const newBlock = item.cloneBlankNode()
	
	// Use the ReactEditor to get the path for the current element, and increment the last element
	// Then use transforms to insert at that path, which effectively inserts below like in arrays
	const path = ReactEditor.findPath(editor, element)
	Transforms.insertNodes(editor, newBlock, { at: Path.next(path) })
}

const saveId = (editor, element, prevId, newId) => {
	if (prevId === newId) return

	// check against existing nodes for duplicate keys
	const model = OboModel.models[prevId]
	if (!model.setId(newId)) {
		return 'The id "' + newId + '" already exists. Please choose a unique id'
	}

	const path = ReactEditor.findPath(editor, element)
	Transforms.setNodes(editor, { id: newId }, { at: path })
}

const saveContent = (editor, element, prevContent, newContent) => {
	const path = ReactEditor.findPath(editor, element)
	Transforms.setNodes(editor, { content: newContent }, { at: path })
}

const deleteNode = (editor, element) => {
	// Cursor focus is automatically returned to the editor by the onChange function
	const path = ReactEditor.findPath(editor, element)
	Transforms.removeNodes(editor, { at: path })
}

const duplicateNode = (editor, element) => {
	// ELLI TODO - this has an issue where duplicate nodes steal focus from their projenator
	const newNode = Object.assign({}, element)
	newNode.id = generateId()

	const newModel = OboModel.create(newNode.type)
	newModel.setId(newNode.id)

	const path = ReactEditor.findPath(editor, element)
	path[path.length - 1]++
	Transforms.insertNodes(editor, newNode, { at: path })
}

const onOpen = (editor) => {
	// Lock the editor into readOnly to prevent it from stealing cursor focus
	editor.toggleEditable(false)
}

const onClose = (editor) => {
	// Give cursor focus back to the editor
	editor.toggleEditable(true)
}

const Node = (props) => {
	const selected = props.selected
	const editor = props.editor

	return (
		<div className={'oboeditor-component component'} data-obo-component="true">
			{selected ? (
				<div className={'component-toolbar'}>
					<InsertMenu
						dropOptions={Common.Registry.insertableItems}
						className={'align-left top'}
						icon="+"
						masterOnClick={insertBlockAtStart.bind(this, editor, props.element)}/>
					<InsertMenu
						dropOptions={Common.Registry.insertableItems}
						className={'align-left bottom'}
						icon="+"
						masterOnClick={insertBlockAtEnd.bind(this, editor, props.element)}
					/>
				</div>
			) : null}

			{selected ? (
				<MoreInfoBox
					className="content-node"
					id={props.element.id}
					isFirst
					isLast
					type={props.element.type}
					content={props.element.content || {}}
					saveId={saveId.bind(this, editor, props.element)}
					saveContent={saveContent.bind(this, editor, props.element)}
					contentDescription={props.contentDescription || []}
					deleteNode={deleteNode.bind(this, editor, props.element)}
					duplicateNode={duplicateNode.bind(this, editor, props.element)}
					markUnsaved={editor.markUnsaved}
					onOpen={onOpen.bind(this, editor)}
					onClose={onClose.bind(this, editor)}/>
			) : null}
			{props.children}
		</div>
	)
}

export default Node
