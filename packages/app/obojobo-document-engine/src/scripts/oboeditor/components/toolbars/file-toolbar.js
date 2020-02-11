import React, { memo } from 'react'
import { Range, Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import FileMenu from './file-menu'
import ViewMenu from './view-menu'
import FormatMenu from './format-menu'
import DropDownMenu from './drop-down-menu'

import './file-toolbar.scss'

const insertDisabled = (name, editor, value) => {
	if(!editor.selection) return true
	// If the selected area spans across multiple blocks, the selection is deleted before
	// inserting, colapsing it down to the type of the first block
	const [first] = Editor.first(editor, editor.selection)
	if(first.type === 'ObojoboDraft.Chunks.Table.Cell') return true
	if(!value || !value.blocks) return false

	if(value.fragment.filterDescendants(node => node.type === 'ObojoboDraft.Chunks.Question').size) {
		if(name === 'Question' || name === 'Question Bank') return true

		return false
	}

	return false
}

const selectAll = (editor) => {
	if(Editor.isEditor){
		const edges = Editor.edges(editor, [])
		Transforms.select(editor, { focus: edges[0], anchor: edges[1] })
		return ReactEditor.focus(editor)
	}

	editor.selectAll()
}

const FileToolbar = props => {
	// insert actions on menu items
	// note that `editor.current` needs to be evaluated at execution time of the action!
	const editor = props.editor
	const insertMenu = props.insertableItems.map(item => ({
		name: item.name,
		action: () => Transforms.insertNodes(editor, item.cloneBlankNode()),
		disabled: insertDisabled(item.name, editor, props.value)
	}))

	const editMenu = [
		{ name: 'Undo', type: 'action', action: () => editor.undo() },
		{ name: 'Redo', type: 'action', action: () => editor.redo() },
		{ name: 'Delete', type: 'action', action: () => editor.deleteFragment(), disabled: props.mode !== 'visual' || !editor.selection || Range.isCollapsed(editor.selection) },
		{ name: 'Select all', type: 'action', action: () => selectAll(editor) }
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
				mode={props.mode}/>
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
