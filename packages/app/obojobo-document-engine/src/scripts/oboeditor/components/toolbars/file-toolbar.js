import React, { memo, useCallback } from 'react'
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
	// selectAll is provided by Slate editor or as a prop
	const selectAll = props.selectAll || editor.selectAll

	const onPreviewClickHandler = useCallback(() => {
		openPreview(props.draftId)
	}, [props.draftId])

	const onSelectAllHandler = useCallback(() => {
		selectAll(editor)
	}, [selectAll, editor])

	const editMenu = [
		{
			name: 'Undo',
			shortcut: 'CTRL+Z',
			shortcutMac: '⌘Z',
			type: 'action',
			action: editor.undo
		},
		{
			name: 'Redo',
			shortcut: 'CTRL+Y',
			shortcutMac: '⌘Y',
			type: 'action',
			action: editor.redo
		},
		{
			name: 'Delete',
			type: 'action',
			action: editor.deleteFragment,
			disabled: props.isDeletable === null ? true : props.isDeletable
		},
		{
			name: 'Select all',
			shortcut: 'CTRL+A',
			shortcutMac: '⌘A',
			type: 'action',
			action: onSelectAllHandler
		}
	]

	let className = ''
	let message = ''
	switch (props.saveState) {
		case 'saving':
			className = 'saving'
			message = 'Saving...'
			break
		case 'saveSuccessful':
			className = 'saved'
			message = 'Saved!'
			break
	}

	return (
		<div className={`visual-editor--file-toolbar`}>
			<FileMenu
				title={props.title}
				draftId={props.draftId}
				onSave={props.onSave}
				reload={props.reload}
				mode={props.mode}
				accessLevel={props.accessLevel}
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
			<div className={'saved-message ' + className}>{message}</div>
			<Button onClick={onPreviewClickHandler} className={'preview-button'}>
				Preview Module
			</Button>
		</div>
	)
}

export default memo(FileToolbar)
