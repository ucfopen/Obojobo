import './color-picker.scss'

import React, { useState } from 'react'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'

const COLOR_MARK = 'color'
const colorChoices = [
	[
		'#000000',
		'rgb(255, 255, 255)',
		'rgb(239, 239, 239)',
		'rgb(204, 204, 204)',
		'rgb(153, 153, 153)',
		'rgb(67, 67, 67)'
	],
	[
		'#ff0000',
		'rgb(244, 204, 204)',
		'rgb(234, 153, 153)',
		'rgb(224, 102, 102)',
		'rgb(204, 0, 0)',
		'rgb(153, 0, 0)'
	],
	[
		'rgb(255, 153, 0)',
		'rgb(252, 229, 205)',
		'rgb(249, 203, 156)',
		'rgb(246, 178, 107)',
		'rgb(230, 145, 56)',
		'rgb(180, 95, 6)'
	],
	[
		'rgb(255, 255, 0)',
		'rgb(255, 242, 204)',
		'rgb(255, 229, 153)',
		'rgb(255, 217, 102)',
		'rgb(241, 194, 50)',
		'rgb(191, 144, 0)'
	],
	[
		'rgb(0, 255, 0)',
		'rgb(217, 234, 211)',
		'rgb(182, 215, 168)',
		'rgb(147, 196, 125)',
		'rgb(106, 168, 79)',
		'rgb(56, 118, 29)'
	],
	[
		'rgb(0, 0, 255)',
		'rgb(207, 226, 243)',
		'rgb(159, 197, 232)',
		'rgb(111, 168, 220)',
		'rgb(60, 120, 216)',
		'rgb(17, 85, 204)'
	],
	[
		'rgb(255, 0, 255)',
		'rgb(234, 209, 220)',
		'rgb(213, 166, 189)',
		'rgb(194, 123, 160)',
		'rgb(166, 77, 121)',
		'rgb(116, 27, 71)'
	]
]

const ColorPicker = props => {
	const [expanded, setExpanded] = useState(false)
	const [value, setValue] = useState('')

	const onClick = color => {
		const { editor } = props

		Editor.addMark(editor, COLOR_MARK, color)

		ReactEditor.focus(editor)
		props.onClose()
		editor.toggleEditable(true)
	}

	return (
		<div className="color-picker">
			<div className="color-picker--color-choices">
				{colorChoices.map(colors => {
					if (expanded) {
						return (
							<div key={colors[0]}>
								{colors.map(color => (
									<div
										key={color}
										className="color-choice"
										style={{ backgroundColor: color }}
										onClick={() => onClick(color)}
									/>
								))}
							</div>
						)
					} else {
						return (
							<div
								key={colors[0]}
								className="color-choice"
								style={{ backgroundColor: colors[0] }}
								onClick={() => onClick(colors[0])}
							/>
						)
					}
				})}
			</div>
			{!expanded ? (
				<button className="color-picker--button" onClick={() => setExpanded(!expanded)}>
					More Color
				</button>
			) : (
				<div>
					<input value={value} onChange={event => setValue(event.target.value)} />
					<button className="color-picker--button" onClick={() => onClick('#' + value)}>
						OK
					</button>
				</div>
			)}
		</div>
	)
}

export default ColorPicker
