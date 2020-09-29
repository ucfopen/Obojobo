import React from 'react'

import TextColorPickerIcon from '../../assets/text-color-picker-icon'
import Dispatcher from '../../../common/flux/dispatcher'

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
			action: () => Dispatcher.trigger('color-picker:open')
		}
	]
}

export default ColorMark
