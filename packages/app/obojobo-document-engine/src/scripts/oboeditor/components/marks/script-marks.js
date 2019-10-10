import React from 'react'

import SupIcon from '../../assets/sup-icon'
import SubIcon from '../../assets/sub-icon'

const SCRIPT_MARK = 'sup'

const ScriptMark = {
	plugins: {
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey)) return next()

			switch(event.key) {
				case '-':
				case ',':
					event.preventDefault()
					return editor.toggleScript(-1)
				case '=':
				case '.':
					event.preventDefault()
					return editor.toggleScript(1)
				default:
					return next()
			}
		},
		renderMark(props, editor, next) {
			switch (props.mark.type) {
				case SCRIPT_MARK:
					if (props.mark.data.get('num') === 1) {
						return <sup>{props.children}</sup>
					} else {
						return <sub>{props.children}</sub>
					}
				default:
					return next()
			}
		},
		queries: {
			toggleScript: (editor, modifier) => {
				const value = editor.value
				const hasScript = value.marks.some(mark => {
					if (mark.type !== SCRIPT_MARK) return false

					return mark.data.get('num') === modifier
				})

				if (hasScript) {
					return editor.removeMark({
						type: 'sup',
						data: { num: modifier }
					})
				} else {
					return editor.addMark({
						type: 'sup',
						data: { num: modifier }
					})
				}
			}
		}
	},
	marks: [
		{
			name: 'Superscript',
			type: SCRIPT_MARK,
			icon: SupIcon,
			action: editor => editor.toggleScript(1)
		},
		{
			name: 'Subscript',
			type: SCRIPT_MARK,
			icon: SubIcon,
			action: editor => editor.toggleScript(-1)
		}
	]
}

export default ScriptMark
