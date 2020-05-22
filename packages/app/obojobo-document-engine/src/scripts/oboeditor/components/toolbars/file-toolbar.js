import React, { memo, useMemo } from 'react'
import { Range, Editor, Transforms, Element } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import FileMenu from './file-menu'
import ViewMenu from './view-menu'
import DropDownMenu from './drop-down-menu'

import './file-toolbar.scss'

const { Button } = Common.components

const openPreview = draftId => {
	const previewURL = window.location.origin + '/preview/' + draftId
	window.open(previewURL, '_blank')
}

const FileToolbar = props => {
	const editor = props.editor
	const selectAll = props.selectAll || editor.selectAll

	const editMenu = [
		{ name: 'Undo', type: 'action', action: () => editor.undo() },
		{ name: 'Redo', type: 'action', action: () => editor.redo() },
		{
			name: 'Delete',
			type: 'action',
			action: () => editor.deleteFragment(),
			disabled: props.isDeletable === null ? true : props.isDeletable
		},
		{ name: 'Select all', type: 'action', action: () => selectAll(editor) }
	]

	const saved = props.saved ? 'saved' : ''

	return (
		<div className={`visual-editor--file-toolbar`}>
			<FileMenu
				title={props.title}
				draftId={props.draftId}
				onSave={props.onSave}
				reload={props.reload}
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
			{props.insertMenu}
			{props.formatMenu}
			<div className={'saved-message ' + saved}>Saved!</div>
			<Button onClick={openPreview.bind(this, props.draftId)} className={'preview-button'}>
				Preview Module
			</Button>
		</div>
	)
}

export default memo(FileToolbar)
