import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

const NumericFeedback = props => {
	const onDelete = event => {
		event.stopPropagation()
		// const editor = props.editor
		// return editor.removeNodeByKey(props.node.key)

		const path = ReactEditor.findPath(props.editor, props.element)
		return Transforms.removeNodes(props.editor, { at: path })
	}

	return (
		<div className="component obojobo-draft--chunks--numeric-assessment--numeric-feedback editor-feedback">
			<Button className="delete-button" onClick={onDelete} contentEditable={false}>
				×
			</Button>
			<span className="label" contentEditable={false}>
				Feedback
			</span>
			{props.children}
		</div>
	)
}

export default NumericFeedback
