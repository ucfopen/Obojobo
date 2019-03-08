import './editor-component.scss'

import React from 'react'

const Solution = props => {
	const deleteNode = () => {
		const editor = props.editor
		return editor.removeNodeByKey(props.node.key)
	}

	return (
		<div className="solution-editor">
			{props.children}
			<button className="editor--page-editor--delete-node-button" onClick={() => deleteNode()}>
				X
			</button>
		</div>
	)
}

export default Solution
