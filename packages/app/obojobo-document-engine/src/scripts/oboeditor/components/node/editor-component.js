import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import {
  useEditor,
  useSelected,
  ReactEditor
} from 'slate-react'

import { Transforms } from 'slate'

import InsertMenu from './components/insert-menu'
import MoreInfoBox from '../navigation/more-info-box'

import './editor-component.scss'

const { OboModel } = Common.models

const insertBlockAtStart = (editor, element, item) => {
	const newBlock = item.cloneBlankNode()
	// Create the obomodel and set its id to match the block key to prevent duplicate keys
	const newModel = OboModel.create(item.insertJSON.type)
	newModel.setId(newBlock.key)

	// Use the ReactEditor to get the path for the current element
	// Then use transforms to insert at that path, which effectively inserts above like in arrays
	const path = ReactEditor.findPath(editor, element)
	Transforms.insertNodes(editor, newBlock, { at: path })
}

const insertBlockAtEnd = (editor, element, item) => {
	const newBlock = item.cloneBlankNode()
	// Create the obomodel and set its id to match the block key to prevent duplicate keys
	const newModel = OboModel.create(item.insertJSON.type)
	newModel.setId(newBlock.key)

	// Use the ReactEditor to get the path for the current element, and increment the last element
	// Then use transforms to insert at that path, which effectively inserts above like in arrays
	const path = ReactEditor.findPath(editor, element)
	path[path.length - 1]++
	Transforms.insertNodes(editor, newBlock, { at: path })
}

const saveId = (prevId, newId) => {
	console.log('saveId')
	// if (prevId === newId) return

	// // check against existing nodes for duplicate keys
	// const model = OboModel.models[prevId]
	// if (!model.setId(newId)) {
	// 	return 'The id "' + newId + '" already exists. Please choose a unique id'
	// }

	// const jsonNode = this.props.node.toJSON()
	// jsonNode.key = newId

	// this.props.editor
	// 	.insertNodeByKey(
	// 		this.props.parent.key,
	// 		this.props.parent.getPath(this.props.node.key).get(0),
	// 		Block.create(jsonNode)
	// 	)
	// 	.removeNodeByKey(prevId)
}

const saveContent = (prevContent, newContent) => {
	console.log('saveContent')
	// this.props.editor.setNodeByKey(this.props.node.key, {
	// 	data: { ...this.props.node.data.toJSON(), content: newContent }
	// })
}

const deleteNode = () => {
	console.log('deleteNode')
	// // Cursor focus is automatically returned to the editor by the onChange function
	// this.props.editor.removeNodeByKey(this.props.node.key)
}

const duplicateNode = () => {
	console.log('duplicateNode')
	// const editor = this.props.editor

	// // Inserts a sibling node after the current node
	// return editor.insertNodeByKey(
	// 	this.props.parent.key,
	// 	this.props.parent.getPath(this.props.node.key).get(0) + 1,
	// 	Block.create(this.props.node.toJSON())
	// )
}

const onOpen = () => {
	// // Lock the editor into readOnly to prevent it from stealing cursor focus
	// this.props.editor.toggleEditable(false)
}

const onClose = () => {
	// // Give cursor focus back to the editor
	// this.props.editor.toggleEditable(true)
}

const Node = (props) => {
	const selected = useSelected()
	const editor = useEditor()

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
					saveId={saveId}
					saveContent={saveContent}
					contentDescription={props.contentDescription || []}
					deleteNode={deleteNode}
					duplicateNode={duplicateNode}
					markUnsaved={editor.markUnsaved}
					onOpen={onOpen}
					onClose={onClose}/>
			) : null}
			{props.children}
		</div>
	)
}

export default Node
