import React, { memo } from 'react'
import { Range, Editor, Transforms, Element } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'

import FileMenu from './file-menu'
import ViewMenu from './view-menu'
import FormatMenu from './format-menu'
import DropDownMenu from './drop-down-menu'

import './file-toolbar.scss'

const { Button } = Common.components

const insertDisabled = (name, editor) => {
	if (!editor.selection) return true
	// If the selected area spans across multiple blocks, the selection is deleted before
	// inserting, colapsing it down to the type of the first block
	// Any node in the tree
	const list = Array.from(
		Editor.nodes(editor, {
			at: Editor.path(editor, editor.selection, { edge: 'start' }),
			match: node => Element.isElement(node) && !editor.isInline(node) && !node.subtype
		})
	)

	if (list.some(([node]) => node.type === 'ObojoboDraft.Chunks.Table')) return true

	if (list.some(([node]) => node.type === 'ObojoboDraft.Chunks.Question')) {
		if (name === 'Question' || name === 'Question Bank') return true

		return false
	}

	return false
}

const selectAll = editor => {
	if (Editor.isEditor(editor)) {
		const edges = Editor.edges(editor, [])
		Transforms.select(editor, { focus: edges[0], anchor: edges[1] })
		return ReactEditor.focus(editor)
	}

	editor.selectAll()
}

const openPreview = draftId => {
	const previewURL = window.location.origin + '/preview/' + draftId
	window.open(previewURL, '_blank')
}

const FileToolbar = props => {
	// insert actions on menu items
	// note that `editor.current` needs to be evaluated at execution time of the action!
	const editor = props.editor
	const insertMenu = props.insertableItems.map(item => ({
		name: item.name,
		action: () => {
			Transforms.insertNodes(editor, item.cloneBlankNode())
			ReactEditor.focus(editor)
		},
		disabled: insertDisabled(item.name, editor, props.value)
	}))

	const editMenu = [
		{ name: 'Undo', type: 'action', action: () => editor.undo() },
		{ name: 'Redo', type: 'action', action: () => editor.redo() },
		{
			name: 'Delete',
			type: 'action',
			action: () => editor.deleteFragment(),
			disabled: props.mode !== 'visual' || !editor.selection || Range.isCollapsed(editor.selection)
		},
		{ name: 'Select all', type: 'action', action: () => selectAll(editor) }
	]

	const saved = props.saved ? 'saved' : ''
	return (
		<div className={`visual-editor--file-toolbar`}>
			<FileMenu
				model={props.model}
				draftId={props.draftId}
				onSave={props.onSave}
				reload={props.reload}
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
			/>
			{props.mode === 'visual' ? (
				<div className="visual-editor--drop-down-menu">
					<DropDownMenu name="Insert" menu={insertMenu} />
				</div>
			) : null}
			{props.mode === 'visual' ? <FormatMenu editor={editor} value={props.value} /> : null}
			<div className={'saved-message ' + saved}>Saved!</div>
			<Button onClick={openPreview.bind(this, props.draftId)} className={'preview-button'}>
				Preview Module
			</Button>
		</div>
	)
}

export default memo(FileToolbar)
