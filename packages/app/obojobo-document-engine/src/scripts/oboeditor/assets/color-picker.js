import './color-picker.scss'

import React, { useState, useRef } from 'react'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from '../../common'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

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

const getSelectionColor = editor => {
	return ((Editor.marks(editor) && Editor.marks(editor).color) || '').toLowerCase()
}

// Returns true if the color of the selected text is set, but isn't one of the first row of colors.
// This is used to determine if we should start the display at the expanded state.
// This does not handle the case where a user has input one of our color choices but in a non-hex
// format. However I'm not sure the fix is worth it, and leaving that as is for now.
const isAnExpandedColorSelected = selectedColor => {
	if (selectedColor === '') {
		return false
	}

	if (colorChoices.map(colors => colors[0]).indexOf(selectedColor) > -1) {
		return false
	}

	return true
}

// This tests the user-inputted color string by setting that color on an HTML element. If the
// color is updated we know that the user-inputted string was valid color syntax, and we return it.
// Otherwise we return the empty string.
const getSafeColorString = userColorString => {
	const d = document.createElement('div')
	d.style.color = userColorString

	// We cover a special case - If the user-inputted color string is not valid there's a chance
	// they're entering hex but forgot the '#'. We silently add it and see if it results in valid
	// color syntax - if so, we use that value
	if (d.style.color === '') {
		userColorString = `#${userColorString}`
		d.style.color = userColorString
	}

	return d.style.color === '' ? '' : userColorString
}

const ColorPicker = props => {
	const selectedColor = getSelectionColor(props.editor)

	// userColorString is the text that the user has inputted into the document or into the
	// input text box. safeColorString is set to "" if userColorString is invalid, otherwise it is
	// the value of userColorString (although prefixed with a '#' if missing and results in a valid
	// hex color value).
	const [userColorString, setUserColorString] = useState(selectedColor)
	const [safeColorString, setSafeColorString] = useState(selectedColor)
	const [expanded, setExpanded] = useState(isAnExpandedColorSelected(selectedColor))
	const colorRef = useRef()

	const updateColorState = userColorString => {
		setUserColorString(userColorString)
		setSafeColorString(getSafeColorString(userColorString))
	}

	const updateEditorSelectedTextColorAndClose = userColorString => {
		const { editor } = props

		props.close()

		// Special case - If the user has input the empty string we assume they want to erase the
		// color options for the selected text, so we do that instead.
		if (userColorString === '') {
			Editor.removeMark(editor, COLOR_MARK)
		} else {
			const safeColorString = getSafeColorString(userColorString)

			// We only update the selected text if the user-inputted color is valid color syntax:
			if (safeColorString !== '') {
				Editor.addMark(editor, COLOR_MARK, safeColorString)
			}
		}

		ReactEditor.focus(editor)
	}

	const onChangeColorValue = event => {
		updateColorState(event.target.value)
	}

	const onSubmit = event => {
		event.preventDefault()

		updateEditorSelectedTextColorAndClose(userColorString)
	}

	return (
		<div className="editor--components--color-picker" onClick={e => e.stopPropagation()}>
			<div className="color-choices">
				{colorChoices.map(colors =>
					expanded ? (
						<div className="color-row" key={colors[0]}>
							{colors.map(color => (
								<button
									key={color}
									className={`color-cell${isOrNot(safeColorString === color, 'selected')}`}
									style={{ backgroundColor: color }}
									onClick={() => updateEditorSelectedTextColorAndClose(color)}
								/>
							))}
						</div>
					) : (
						<button
							key={colors[0]}
							className={`color-cell${isOrNot(safeColorString === colors[0], 'selected')}`}
							style={{ backgroundColor: colors[0] }}
							onClick={() => updateEditorSelectedTextColorAndClose(colors[0])}
						/>
					)
				)}
			</div>
			{!expanded ? (
				<button className="expand-button" onClick={() => setExpanded(!expanded)}>
					More Colors...
				</button>
			) : (
				<form onSubmit={onSubmit}>
					<span
						className="custom-color-icon"
						style={{ backgroundColor: safeColorString }}
						onClick={() => {
							colorRef.current.click()
						}}
					>
						<input
							className="color-input"
							type="color"
							ref={colorRef}
							value={safeColorString}
							onChange={onChangeColorValue}
						/>
					</span>
					<input
						className="color-string-input"
						type="text"
						value={userColorString}
						onChange={onChangeColorValue}
						placeholder="#000000"
					/>
					<Button className="ok-button" disabled={userColorString !== '' && safeColorString === ''}>
						OK
					</Button>
				</form>
			)}
		</div>
	)
}

export default ColorPicker
