import React from 'react'

import TextColorPickerIcon from '../../assets/text-color-picker-icon'
import Dispatcher from '../../../common/flux/dispatcher'

const COLOR_MARK = 'color'

const ColorMark = {
	plugins: {
		onKeyDown(event) {
			if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'p') {
				event.preventDefault()
				Dispatcher.trigger('color-picker:open')
			}
		},
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
			shortcut: 'Shift+P',
			type: COLOR_MARK,
			icon: TextColorPickerIcon,
			action: () => Dispatcher.trigger('color-picker:open')
		}
	]
}

export default ColorMark
