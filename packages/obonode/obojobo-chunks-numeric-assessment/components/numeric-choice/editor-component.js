import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'

import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import { NUMERIC_FEEDBACK_NODE } from '../../constants'

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
	const className = 'numeric-choice ' + isOrNot(props.isSelected, 'selected')
	return (
		<div className={className}>
			{props.children}
			{!hasFeedback ? (
				<Button
					className="pad obojobo-draft--components--button alt-action is-not-dangerous align-center add-feedback-btn"
					onClick={addFeedback}
				>
					Add Feedback
				</Button>
			) : null}
			<Button className="delete-button" onClick={onDelete}>
				×
			</Button>
		</div>
	)
}

export default NumericInput
