import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'

const NumericFeedback = props => {
	const onDelete = () => {
		props.editor.removeNodeByKey(props.node.key)
	}

	return (
		<div className="component numeric-feedback-editor">
			<button className="feedback-delete-button" onClick={() => onDelete()}>
				×
			</button>
			{props.children}
		</div>
	)
}

export default NumericFeedback
