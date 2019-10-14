import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'

import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import { NUMERIC_FEEDBACK_NODE } from '../../constant'

const { Button } = Common.components

const NumericInput = props => {
	const addFeedback = () => {
		const editor = props.editor

		const newFeedback = Block.create({
			type: NUMERIC_FEEDBACK_NODE
		})
		return editor.insertNodeByKey(props.node.key, props.node.nodes.size, newFeedback)
	}

	const onDelete = event => {
		event.stopPropagation()
		const editor = props.editor
		return editor.removeNodeByKey(props.node.key)
	}

	const hasFeedback = props.children.length >= 2
	const className = 'numeric-answer ' + isOrNot(props.isSelected, 'selected')
	return (
		<div className={className}>
			{props.children}
			{!hasFeedback ? (
				<div className="pad obojobo-draft--components--button alt-action is-not-dangerous align-center add-feedback-btn">
					<button className="button" onClick={addFeedback} contentEditable={false}>
						Add Feedback
					</button>
				</div>
			) : null}
			<Button className="delete-button" onClick={onDelete} contentEditable={false}>
				×
			</Button>
		</div>
	)
}

export default NumericInput
