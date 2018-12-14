import '../../viewer-component.scss'

import React from 'react'

const Solution = props => {
	const deleteNode = () => {
		const editor = props.editor
		const change = editor.value.change()
		change.removeNodeByKey(props.node.key)

		editor.onChange(change)
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
