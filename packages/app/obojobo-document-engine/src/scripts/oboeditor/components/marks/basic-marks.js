import React from 'react'

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
			if (!(event.ctrlKey || event.metaKey)) return next()

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
				case 'q':
					event.preventDefault()
					return editor.toggleMark(LATEX_MARK)
				default:
					return next()
			}
		},
		renderMark(props, editor, next) {
			switch (props.mark.type) {
				case BOLD_MARK:
					return <strong>{props.children}</strong>
				case ITALIC_MARK:
					return <em>{props.children}</em>
				case STRIKE_MARK:
					return <del>{props.children}</del>
				case QUOTE_MARK:
					return <q>{props.children}</q>
				case MONOSPACE_MARK:
					return <code>{props.children}</code>
				case LATEX_MARK:
					return <span className={'latex-editor'}>{props.children}</span>
				default:
					return next()
			}
		}
	},
	marks: [
		{
			name: 'Bold',
			type: BOLD_MARK,
			icon: BoldIcon,
			action: editor => editor.toggleMark(BOLD_MARK).focus()
		},
		{
			name: 'Italic',
			type: ITALIC_MARK,
			icon: ItalicIcon,
			action: editor => editor.toggleMark(ITALIC_MARK).focus()
		},
		{
			name: 'Strikethrough',
			type: STRIKE_MARK,
			icon: StrikeIcon,
			action: editor => editor.toggleMark(STRIKE_MARK).focus()
		},
		{
			name: 'Quote',
			type: QUOTE_MARK,
			icon: QuoteIcon,
			action: editor => editor.toggleMark(QUOTE_MARK).focus()
		},
		{
			name: 'Monospace',
			type: MONOSPACE_MARK,
			icon: MonoIcon,
			action: editor => editor.toggleMark(MONOSPACE_MARK).focus()
		},
		{
			name: 'Equation',
			type: LATEX_MARK,
			icon: LatexIcon,
			action: editor => editor.toggleMark(LATEX_MARK).focus()
		}
	]
}

export default BasicMarks
