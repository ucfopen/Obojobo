import React from 'react'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'

import SupIcon from '../../assets/sup-icon'
import SubIcon from '../../assets/sub-icon'

const SCRIPT_MARK = 'sup'

const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

const ScriptMark = {
	plugins: {
		onKeyDown(event, editor, next) {
			if (event.shiftKey) return
			if (!(event.ctrlKey || event.metaKey)) return

			switch (event.key) {
				case ',':
					event.preventDefault()
					return editor.toggleScript(-1)
				case '.':
					event.preventDefault()
					return editor.toggleScript(1)
			}
		},
		renderLeaf(props) {
			let { children } = props
			const { leaf } = props
			const { parent } = children.props

			if (parent && parent.type === HTML_NODE) {
				return props
			}

			if (leaf[SCRIPT_MARK] && leaf.num > 0) children = <sup>{props.children}</sup>
			if (leaf[SCRIPT_MARK] && leaf.num < 0) children = <sub>{props.children}</sub>

			props.children = children
			return props
		},
		commands: {
			toggleScript: (editor, modifier) => {
				const marks = Editor.marks(editor)
				const isActive = marks.sup === true && marks.num === modifier

				if (isActive) {
					Editor.removeMark(editor, 'sup')
					Editor.removeMark(editor, 'num')
				} else {
					Editor.addMark(editor, 'sup', true)
					Editor.addMark(editor, 'num', modifier)
				}

				ReactEditor.focus(editor)
			}
		}
	},
	marks: [
		{
			name: 'Superscript',
			shortcut: '.',
			type: SCRIPT_MARK,
			icon: SupIcon,
			action: editor => editor.toggleScript(1)
		},
		{
			name: 'Subscript',
			shortcut: ',',
			type: SCRIPT_MARK,
			icon: SubIcon,
			action: editor => editor.toggleScript(-1)
		}
	]
}

export default ScriptMark
