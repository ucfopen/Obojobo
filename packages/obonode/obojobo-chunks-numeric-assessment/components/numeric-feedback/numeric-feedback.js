import './numeric-feedback.scss'

import React from 'react'

const NumericFeedback = props => {
	const onDelete = event => {
		event.stopPropagation()

		// Remove feedback node
		const editor = props.editor
		editor.removeNodeByKey(props.node.key)

		// Set hasFeedback of parent node to false
		const numericRule = props.parent.data.get('numericRule')
		numericRule.hasFeedback = false
		editor.setNodeByKey(props.parent.key, {
			data: { numericRule }
		})
	}

	return (
		<div className="numeric-feedback-editor" contentEditable={true}>
			<button className="feedback-delete-button" onClick={onDelete} contentEditable={false}>
				X
			</button>
			{props.children}
		</div>
	)
}

export default NumericFeedback
