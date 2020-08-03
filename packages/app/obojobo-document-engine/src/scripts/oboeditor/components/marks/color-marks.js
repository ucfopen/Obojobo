import React from 'react'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'

import TextColorPickerIcon from '../../assets/text-color-picker-icon'

const COLOR_MARK = 'color'

const ColorMark = {
	plugins: {
		renderLeaf(props) {
			let { children } = props
			const { leaf } = props

			if (leaf[COLOR_MARK]) children = <span style={{ color: leaf.color }}>{children}</span>

			props.children = children
			return props
		}
	},
	marks: [
		{
			name: 'Color',
			type: COLOR_MARK,
			icon: TextColorPickerIcon,
			action: editor => {
				const marks = Editor.marks(editor)
				const isActive = marks[COLOR_MARK] === true

				if (isActive) {
					Editor.removeMark(editor, COLOR_MARK)
				} else {
					Editor.addMark(editor, COLOR_MARK, 'red')
				}

				ReactEditor.focus(editor)
			}
		}
	]
}

export default ColorMark
