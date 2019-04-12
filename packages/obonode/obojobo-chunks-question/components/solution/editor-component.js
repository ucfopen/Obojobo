import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

const Solution = props => {
	const deleteNode = () => {
		const editor = props.editor
		return editor.removeNodeByKey(props.node.key)
	}

	return (
		<div className="solution-editor">
			{props.children}
			<Button className="delete-button" onClick={() => deleteNode()}>
				×
			</Button>
		</div>
	)
}

export default Solution
