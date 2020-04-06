import './editor-title-input.scss'

import React from 'react'

const EditorTitleInput = props => (
	<input
		className="editor--components--editor-title-input"
		value={props.title}
		onChange={event => props.onChange(event.target.value)}
		onBlur={() => props.renameModule(props.title)}
		onKeyDown={event => {
			if (event.key === 'Enter') {
				event.target.blur()
			}
		}}
		aria-label="Rename Module"
	/>
)

export default EditorTitleInput
