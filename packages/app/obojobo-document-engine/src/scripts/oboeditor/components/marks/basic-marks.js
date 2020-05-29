import React from 'react'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'

import BoldIcon from '../../assets/bold-icon'
import ItalicIcon from '../../assets/italic-icon'
import StrikeIcon from '../../assets/strike-icon'
import QuoteIcon from '../../assets/quote-icon'
import MonoIcon from '../../assets/mono-icon'
import LatexIcon from '../../assets/latex-icon'

const BOLD_MARK = 'b'
const ITALIC_MARK = 'i'
const STRIKE_MARK = 'del'
const QUOTE_MARK = 'q'
const MONOSPACE_MARK = 'monospace'
const LATEX_MARK = '_latex'

const BasicMarks = {
	plugins: {
		onKeyDown(event, editor, next) {
			if (event.shiftKey) return
			if (!(event.ctrlKey || event.metaKey)) return

			switch (event.key) {
				case 'b':
					event.preventDefault()
					return editor.toggleMark(BOLD_MARK)
				case 'i':
					event.preventDefault()
					return editor.toggleMark(ITALIC_MARK)
				case 'd':
					event.preventDefault()
					return editor.toggleMark(STRIKE_MARK)
				case "'":
					event.preventDefault()
					return editor.toggleMark(QUOTE_MARK)
				case 'm':
					event.preventDefault()
					return editor.toggleMark(MONOSPACE_MARK)
				case '/':
					event.preventDefault()
					return editor.toggleMark(LATEX_MARK)
			}
		},
		renderLeaf(props) {
			let { children } = props
			const { leaf } = props

			if (leaf[LATEX_MARK]) {
				children = (
					<div spellCheck={false} className={'latex-editor '}>
						{children}
					</div>
				)
			}
			if (leaf[BOLD_MARK]) children = <strong>{children}</strong>
			if (leaf[ITALIC_MARK]) children = <em>{children}</em>
			if (leaf[STRIKE_MARK]) children = <del>{children}</del>
			if (leaf[QUOTE_MARK]) children = <q>{children}</q>
			if (leaf[MONOSPACE_MARK]) children = <code>{children}</code>

			props.children = children
			return props
		},
		commands: {
			toggleMark(editor, format) {
				const marks = Editor.marks(editor)
				const isActive = marks[format] === true

				if (isActive) {
					Editor.removeMark(editor, format)
				} else {
					Editor.addMark(editor, format, true)
				}

				ReactEditor.focus(editor)
			}
		}
	},
	marks: [
		{
			name: 'Bold',
			shortcut: 'B',
			type: BOLD_MARK,
			icon: BoldIcon,
			action: editor => editor.toggleMark(BOLD_MARK)
		},
		{
			name: 'Italic',
			shortcut: 'I',
			type: ITALIC_MARK,
			icon: ItalicIcon,
			action: editor => editor.toggleMark(ITALIC_MARK)
		},
		{
			name: 'Strikethrough',
			shortcut: 'D',
			type: STRIKE_MARK,
			icon: StrikeIcon,
			action: editor => editor.toggleMark(STRIKE_MARK)
		},
		{
			name: 'Quote',
			shortcut: '"',
			type: QUOTE_MARK,
			icon: QuoteIcon,
			action: editor => editor.toggleMark(QUOTE_MARK)
		},
		{
			name: 'Monospace',
			shortcut: 'M',
			type: MONOSPACE_MARK,
			icon: MonoIcon,
			action: editor => editor.toggleMark(MONOSPACE_MARK)
		},
		{
			name: 'Equation',
			shortcut: '/',
			type: LATEX_MARK,
			icon: LatexIcon,
			action: editor => editor.toggleMark(LATEX_MARK)
		}
	]
}

export default BasicMarks
