import './editable-hidden-text.scss'

import React from 'react'

const EditableHiddenText = props => (
	<div contentEditable={true} suppressContentEditableWarning className="editor--hidden-text">
		{props.children}
	</div>
)

export default EditableHiddenText
