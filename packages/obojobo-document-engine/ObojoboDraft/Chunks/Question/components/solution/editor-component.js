import React from 'react'

const Solution = props => {
	const deleteNode = () => {
		const editor = props.editor
		return editor.removeNodeByKey(props.node.key)
	}

	return (
		<div className={'solution-editor'}>
			{props.children}
			<button className={'delete-node'} onClick={() => deleteNode()}>
				X
			</button>
		</div>
	)
}

export default Solution
