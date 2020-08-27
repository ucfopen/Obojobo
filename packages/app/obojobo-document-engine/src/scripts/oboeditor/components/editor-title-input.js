import './editor-title-input.scss'

import React, { useState, useEffect } from 'react'

const EditorTitleInput = ({ renameModule, title }) => {
	title = title || '' // in case title is null or undefined

	// eslint-disable-next-line prefer-const
	let [stateTitle, setStateTitle] = useState(title)
	const [emptyTitleError, setEmptyTitleError] = useState(false)

	// update state.title when props.title changes
	// because useState doesn't do that
	useEffect(() => {
		setStateTitle(title)
	}, [title])

	let emptyTitleErrorRender = null
	if (emptyTitleError) {
		emptyTitleErrorRender = (
			<div className="empty-title-warning">Module title can not be empty!</div>
		)
	}

	return (
		<div className="editor--components--editor-title-input-parent">
			<input
				className="editor--components--editor-title-input"
				value={stateTitle}
				placeholder="Module Title"
				onChange={event => {
					if (emptyTitleError && event.target.value !== '') setEmptyTitleError(false)
					setStateTitle(event.target.value)
				}}
				onBlur={event => {
					if (stateTitle !== title) {
						const newTitle = stateTitle.trim()

						if (newTitle !== '') {
							renameModule(newTitle)
						} else {
							// refocus the input, aria labels and class change will indicate error
							setEmptyTitleError(true)
							event.target.focus()
						}
					}
				}}
				onKeyDown={event => {
					switch (event.key) {
						case 's':
							if (!event.ctrlKey && !event.metaKey) break
							event.preventDefault() // prevent browser save menu
							event.target.blur() // blur to allow renameModule to run
							break

						case 'Enter':
							// will cause onBlur to be called
							event.target.blur()
							break

						case 'Escape':
							// reset to original title
							stateTitle = title
							setStateTitle(title)
							setEmptyTitleError(false)
							event.target.blur()
							break
						default:
							break
					}
				}}
				aria-label={`Rename Module ${emptyTitleError ? '. Module title must not be empty.' : ''}`}
				aria-invalid={emptyTitleError}
			/>
			{emptyTitleErrorRender}
		</div>
	)
}

export default EditorTitleInput
