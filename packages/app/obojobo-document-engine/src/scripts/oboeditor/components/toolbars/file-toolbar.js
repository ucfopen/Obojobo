import React, { memo } from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import FileMenu from './file-menu'
import ViewMenu from './view-menu'
import FormatMenu from './format-menu'
import DropDownMenu from './drop-down-menu'

import './file-toolbar.scss'

const { OboModel } = Common.models

const isCollapsed = selection => {
	return selection.focus.key === selection.anchor.key && selection.focus.offset === selection.anchor.offset
}

const insertDisabled = (name, value) => {
	if(!value || !value.blocks) return false
	// If the selected area spans across multiple blocks, the selection is deleted before
	// inserting, colapsing it down to the type of the first block
	const firstType = value.blocks.get(0).type
	if(firstType === 'ObojoboDraft.Chunks.Table.Cell') return true

	if(value.fragment.filterDescendants(node => node.type === 'ObojoboDraft.Chunks.Question').size) {
		if(name === 'Question' || name === 'Question Bank') return true

		return false
	}

	return false
}

const FileToolbar = props => {
	// insert actions on menu items
	// note that `editor.current` needs to be evaluated at execution time of the action!
	const editor = props.editorRef
	const insertMenu = props.insertableItems.map(item => ({
		name: item.name,
		action: () => {
			const newBlock = Block.create(item.cloneBlankNode())
			const newModel = OboModel.create(item.insertJSON.type)
			newModel.setId(newBlock.key)
			editor.current.insertBlock(newBlock)
		},
		disabled: insertDisabled(item.name, props.value)
	}))

	const editMenu = [
		{ name: 'Undo', type: 'action', action: () => editor.current.undo() },
		{ name: 'Redo', type: 'action', action: () => editor.current.redo() },
		{ name: 'Delete', type: 'action', action: () => editor.current.delete(), disabled: props.mode === 'visual' && isCollapsed(props.value.selection) },
		{ name: 'Select all', type: 'action', action: () => editor.current.moveToRangeOfDocument().focus() }
	]

	const saved = props.saved ? 'saved' : ''
	return (
		<div className={`visual-editor--file-toolbar`}>
			<FileMenu
				model={props.model}
				draftId={props.draftId}
				onSave={props.onSave}
				onRename={props.onRename}
				mode={props.mode}
			/>
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu name="Edit" menu={editMenu} />
			</div>
			<ViewMenu
				draftId={props.draftId}
				switchMode={props.switchMode}
				onSave={props.onSave}
				mode={props.mode}
				togglePlaceholders={props.togglePlaceholders}
				showPlaceholders={props.showPlaceholders}
			/>
			{props.mode === 'visual' ? (
				<div className="visual-editor--drop-down-menu">
					<DropDownMenu name="Insert" menu={insertMenu} />
				</div>
			) : null}
			{props.mode === 'visual' ? (
				<FormatMenu editor={editor} value={props.value} />
			) : null}
			<div className={'saved-message ' + saved}>Saved!</div>
		</div>
	)
}

export default memo(FileToolbar)
