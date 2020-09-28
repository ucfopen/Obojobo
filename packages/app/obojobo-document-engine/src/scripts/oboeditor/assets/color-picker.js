import './color-picker.scss'

import React, { useState } from 'react'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from '../../common'

const { Button } = Common.components
const COLOR_MARK = 'color'
const colorChoices = [
	['#000000', '#434343', '#999999', '#cccccc', '#ffffff'],
	['#990000', '#cc0000', '#e06666', '#ea9999', '#f4cccc'],
	['#b45f06', '#e69138', '#f6b26b', '#f9cb9c', '#fce5cd'],
	['#bf9000', '#f1c232', '#ffd966', '#ffe599', '#fff2cc'],
	['#38761d', '#6aa84f', '#93c47d', '#b6d7a8', '#d9ead3'],
	['#1155cc', '#3c78d8', '#6fa8dc', '#9fc5e8', '#cfe2f3'],
	['#741b47', '#a64d79', '#c27ba0', '#d5a6bd', '#ead1dc']
]

const ColorPicker = props => {
	const [expanded, setExpanded] = useState(false)
	const [hex, setHex] = useState('')

	const onClick = color => {
		const { editor } = props
		props.onClose()

		Editor.addMark(editor, COLOR_MARK, color)
		ReactEditor.focus(editor)
		editor.toggleEditable(true)
	}

	const onChange = event => {
		event.preventDefault()
		const value = event.target.value
		if (value === '' || (!isNaN(Number('0x' + value)) && value.length <= 6)) {
			setHex(value)
		}
	}

	return (
		<div className="color-picker" onClick={e => e.stopPropagation()}>
			<div className="color-picker--color-choices">
				{colorChoices.map(colors =>
					expanded ? (
						<div key={colors[0]}>
							{colors.map(color => (
								<div
									key={color}
									className="color-picker--color-cell"
									style={{ backgroundColor: color }}
									onClick={() => onClick(color)}
								/>
							))}
						</div>
					) : (
						<div
							key={colors[0]}
							className="color-picker--color-cell"
							style={{ backgroundColor: colors[0] }}
							onClick={() => onClick(colors[0])}
						/>
					)
				)}
			</div>
			{!expanded ? (
				<button className="color-picker--button" onClick={() => setExpanded(!expanded)}>
					More Color
				</button>
			) : (
				<div className="color-picker--input">
					<span backgroundColor={hex}></span>
					<input value={hex} onChange={onChange} placeholder="Hex value (Ex: #000000)" />
					<Button onClick={() => onClick('#' + hex)}>OK</Button>
				</div>
			)}
		</div>
	)
}

export default ColorPicker
