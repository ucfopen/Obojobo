import './color-picker.scss'

import React, { useState } from 'react'
import { Editor } from 'slate'
import Common from '../../common'

const { Button } = Common.components
const COLOR_MARK = 'color'
const colorChoices = [
	[
		'rgb(0, 0, 0)',
		'rgb(255, 255, 255)',
		'rgb(239, 239, 239)',
		'rgb(204, 204, 204)',
		'rgb(153, 153, 153)',
		'rgb(67, 67, 67)'
	],
	[
		'rgb(255, 0, 0)',
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
	const [color, setColor] = useState('')

	const onClick = color => {
		Editor.addMark(props.editor, COLOR_MARK, color)
		props.onClose()
	}

	const onChange = event => {
		event.preventDefault()
		setColor(event.target.value)
	}

	return (
		<div className="color-picker">
			<div className="color-picker--color-choices">
				{colorChoices.map(colors =>
					expanded ? (
						<div key={colors[0]}>
							{colors.map(color => (
								<button
									key={color}
									className="color-picker--color-cell"
									style={{ backgroundColor: color }}
									onClick={() => onClick(color)}
								/>
							))}
						</div>
					) : (
						<button
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
					More Colors
				</button>
			) : (
				<div className="color-picker--input">
					<input type="color" value={color} onChange={onChange} />
					<Button onClick={() => onClick(color)}>OK</Button>
				</div>
			)}
		</div>
	)
}

export default ColorPicker
