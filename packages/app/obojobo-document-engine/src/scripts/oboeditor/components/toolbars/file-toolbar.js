import React from 'react'
import Common from 'Common'

import FileMenu from './file-menu'
import ViewMenu from './view-menu'
import DropDownMenu from './drop-down-menu'

import BasicMarks from '../marks/basic-marks'
import LinkMark from '../marks/link-mark'
import ScriptMarks from '../marks/script-marks'
import AlignMarks from '../marks/align-marks'
import IndentMarks from '../marks/indent-marks'

import './file-toolbar.scss'

const FileToolbar = props => {
	const editMenu = {
		name: 'Edit',
		menu: [
			{ name: 'Undo', type: 'action', action: () =>  props.getEditor().undo()},
			{ name: 'Redo', type: 'action', action: () =>  props.getEditor().redo()},
			{ name: 'Delete', type: 'action', action: () => props.getEditor().delete()},
			{ name: 'Select all', type: 'action', action: () => props.getEditor().moveToRangeOfDocument().focus()}
		]
	}

	const insertMenu = {
		name: 'Insert',
		menu: Common.Registry.getItems(items => Array.from(items.values())).map(item => {
			item.disabled = true
			return item
		})
	}

	const textMarks = [
		...BasicMarks.marks,
		...LinkMark.marks,
		...ScriptMarks.marks
	]

	const alignIndentMarks = [
		...AlignMarks.marks,
		...IndentMarks.marks
	]

	const formatMenu = {
		name: 'Format',
		menu: [
			{
				name: 'Text',
				type: 'sub-menu',
				menu: textMarks.map(mark => ({
					name: mark.name,
					type: 'action',
					action: () => mark.action(props.getEditor())
				}))
			},
			{
				name: 'Paragraph styles',
				type: 'sub-menu',
				menu: [
					{ name: 'Normal Text', type: 'action', disabled: true },
					{ name: 'Heading 1', type: 'action', disabled: true },
					{ name: 'Heading 2', type: 'action', disabled: true },
					{ name: 'Heading 3', type: 'action', disabled: true },
					{ name: 'Heading 4', type: 'action', disabled: true },
					{ name: 'Heading 5', type: 'action', disabled: true },
					{ name: 'Heading 6', type: 'action', disabled: true }
				]
			},
			{
				name: 'Align & indent',
				type: 'sub-menu',
				menu: alignIndentMarks.map(mark => ({
					name: mark.name,
					type: 'action',
					action: () => mark.action(props.getEditor())
				}))
			},
			{
				name: 'Bullets & numbering',
				type: 'sub-menu',
				menu: [
					{
						name: 'Bulletted List',
						type: 'sub-menu',
						menu: [
							{ name: 'Disc', type: 'action', disabled: true },
							{ name: 'Circle', type: 'action', disabled: true },
							{ name: 'Square', type: 'action', disabled: true }
						]
					},
					{
						name: 'Numbered List',
						type: 'sub-menu',
						menu: [
							{ name: 'Numbers', type: 'action', disabled: true },
							{ name: 'Uppercase Alphabet', type: 'action', disabled: true },
							{ name: 'Uppercase Roman Numerals', type: 'action', disabled: true },
							{ name: 'Lowercase Alphabet', type: 'action', disabled: true },
							{ name: 'Lowercase Roman Numerals', type: 'action', disabled: true }
						]
					},
				]
			}
		]
	}

	const saved = props.saved ? "saved" : ""

	return (
		<div className={`visual-editor--file-toolbar`}>
			<FileMenu
				model={props.model}
				draftId={props.draftId}
				onSave={props.onSave}
				onRename={props.onRename}/>
			<DropDownMenu menu={editMenu} />
			<ViewMenu
				draftId={props.draftId} 
				switchMode={props.switchMode}
				onSave={props.onSave}/>
			<DropDownMenu menu={insertMenu}/>
			{props.mode === 'visual' ? <DropDownMenu menu={formatMenu}/> : null}
			<div className={"saved-message " + saved}>
				Saved!
			</div>
		</div>
	)
}

export default FileToolbar
