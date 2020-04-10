import './editor-title-input.scss'

import React, { useState, useEffect } from 'react'

const EditorTitleInput = ({ renameModule, title }) => {
	title = title || '' // in case title is null or undefined

	// eslint-disable-next-line prefer-const
	let [stateTitle, setStateTitle] = useState(title)

	// update state.title when props.title changes
	// because useState doesn't do that
	useEffect(() => {
		setStateTitle(title)
	}, [title])

	return (
		<input
			className="editor--components--editor-title-input"
			value={stateTitle}
			placeholder="(Untitled Module)"
			onChange={event => {
				setStateTitle(event.target.value)
			}}
			onBlur={() => {
				if (stateTitle !== title) renameModule(stateTitle.trim())
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
						event.target.blur()
						break
				}
			}}
			aria-label="Rename Module"
		/>
	)
}

export default EditorTitleInput
