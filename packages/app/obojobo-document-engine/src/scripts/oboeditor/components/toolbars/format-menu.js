import React from 'react'
import { useEditor } from 'slate-react'

import DropDownMenu from './drop-down-menu'

import BasicMarks from '../marks/basic-marks'
import LinkMark from '../marks/link-mark'
import ScriptMarks from '../marks/script-marks'
import AlignMarks from '../marks/align-marks'
import IndentMarks from '../marks/indent-marks'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
// const LIST_NODE = 'ObojoboDraft.Chunks.List'

const textMarks = [...BasicMarks.marks, ...LinkMark.marks, ...ScriptMarks.marks]
const alignIndentMarks = [...AlignMarks.marks, ...IndentMarks.marks]

const FormatMenu = props => {
	const editor = useEditor()
	const textMenu = {
		name: 'Text',
		type: 'sub-menu',
		menu: textMarks.map(mark => ({
			name: mark.name,
			shortcut: 'Ctrl+' + mark.shortcut,
			shortcutMac: '⌘+' + mark.shortcut,
			type: 'action',
			action: () => mark.action(editor),
			disabled: props.hasSelection
		}))
	}

	const paragraphMenu = {
		name: 'Paragraph styles',
		type: 'sub-menu',
		menu: [
			{
				name: 'Normal Text',
				type: 'action',
				shortcut: 'Ctrl+Shift+Space',
				action: () => editor.changeToType(TEXT_NODE)
			},
			{
				name: 'Heading 1',
				type: 'action',
				shortcut: 'Ctrl+Shift+1',
				action: () => editor.changeToType(HEADING_NODE, { headingLevel: 1 })
			},
			{
				name: 'Heading 2',
				type: 'action',
				shortcut: 'Ctrl+Shift+2',
				action: () => editor.changeToType(HEADING_NODE, { headingLevel: 2 })
			},
			{
				name: 'Heading 3',
				type: 'action',
				shortcut: 'Ctrl+Shift+3',
				action: () => editor.changeToType(HEADING_NODE, { headingLevel: 3 })
			},
			{
				name: 'Heading 4',
				type: 'action',
				shortcut: 'Ctrl+Shift+4',
				action: () => editor.changeToType(HEADING_NODE, { headingLevel: 4 })
			},
			{
				name: 'Heading 5',
				type: 'action',
				shortcut: 'Ctrl+Shift+5',
				action: () => editor.changeToType(HEADING_NODE, { headingLevel: 5 })
			},
			{
				name: 'Heading 6',
				type: 'action',
				shortcut: 'Ctrl+Shift+6',
				action: () => editor.changeToType(HEADING_NODE, { headingLevel: 6 })
			},
			{
				name: 'Code',
				type: 'action',
				shortcut: 'Ctrl+Shift+C',
				action: () => editor.changeToType(CODE_NODE)
			}
		]
	}

	const alignMenu = {
		name: 'Align & indent',
		type: 'sub-menu',
		menu: alignIndentMarks.map(mark => {
			if (mark.name === 'Unindent' || mark.name === 'Indent') {
				return {
					name: mark.name,
					shortcut: mark.shortcut,
					type: 'action',
					action: () => mark.action(editor)
				}
			}

			return {
				name: mark.name,
				shortcut: 'Ctrl+' + mark.shortcut,
				shortcutMac: '⌘+' + mark.shortcut,
				type: 'action',
				action: () => mark.action(editor)
			}
		})
	}

	// @TODO: Removed until Lists are completed
	// const bulletsMenu = {
	// 	name: 'Bullets & numbering',
	// 	type: 'sub-menu',
	// 	menu: [
	// 		{
	// 			name: 'Bulleted List',
	// 			type: 'sub-menu',
	// 			menu: [
	// 				{
	// 					name: '● Disc',
	// 					type: 'action',
	// 					shortcut: 'Ctrl+Shift+K',
	// 					shortcutMac: '⌘+Shift+K',
	// 					action: () =>
	// 						editor.changeToType(LIST_NODE, { type: 'unordered', bulletStyle: 'disc' })
	// 				},
	// 				{
	// 					name: '○ Circle',
	// 					type: 'action',
	// 					action: () =>
	// 						editor.changeToType(LIST_NODE, { type: 'unordered', bulletStyle: 'circle' })
	// 				},
	// 				{
	// 					name: '■ Square',
	// 					type: 'action',
	// 					action: () =>
	// 						editor.changeToType(LIST_NODE, { type: 'unordered', bulletStyle: 'square' })
	// 				}
	// 			]
	// 		},
	// 		{
	// 			name: 'Numbered List',
	// 			type: 'sub-menu',
	// 			menu: [
	// 				{
	// 					name: 'Numbers',
	// 					type: 'action',
	// 					shortcut: 'Ctrl+Shift+L',
	// 					shortcutMac: '⌘+Shift+L',
	// 					action: () =>
	// 						editor.changeToType(LIST_NODE, { type: 'ordered', bulletStyle: 'decimal' })
	// 				},
	// 				{
	// 					name: 'Lowercase Alphabet',
	// 					type: 'action',
	// 					action: () =>
	// 						editor.changeToType(LIST_NODE, { type: 'ordered', bulletStyle: 'lower-alpha' })
	// 				},
	// 				{
	// 					name: 'Lowercase Roman Numerals',
	// 					type: 'action',
	// 					action: () =>
	// 						editor.changeToType(LIST_NODE, { type: 'ordered', bulletStyle: 'lower-roman' })
	// 				},
	// 				{
	// 					name: 'Uppercase Alphabet',
	// 					type: 'action',
	// 					action: () =>
	// 						editor.changeToType(LIST_NODE, { type: 'ordered', bulletStyle: 'upper-alpha' })
	// 				},
	// 				{
	// 					name: 'Uppercase Roman Numerals',
	// 					type: 'action',
	// 					action: () =>
	// 						editor.changeToType(LIST_NODE, { type: 'ordered', bulletStyle: 'upper-roman' })
	// 				}
	// 			]
	// 		}
	// 	]
	// }

	// @TODO: Bullets menu removed until lists are complete
	const menu = [textMenu, paragraphMenu, alignMenu /*bulletsMenu*/]

	return (
		<div className="visual-editor--drop-down-menu">
			<DropDownMenu name="Format" menu={menu} />
		</div>
	)
}

export default FormatMenu
