import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'

const NumericFeedback = props => {
	const onDelete = () => props.editor.removeNodeByKey(props.node.key)

	return (
		<div className="component numeric-feedback-editor" contentEditable={true}>
			<button className="feedback-delete-button" onClick={onDelete} contentEditable={false}>
				×
			</button>
			{props.children}
		</div>
	)
}

export default NumericFeedback
