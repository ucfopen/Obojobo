import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
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

	const hasFeedback = props.node.nodes.size === 2
	const className = 'numeric-choice ' + isOrNot(props.isSelected, 'selected')
	return (
		<div className={className}>
			{props.children}
			{!hasFeedback ? (
				<div contentEditable={false}>
					<Button
						className="pad obojobo-draft--components--button alt-action is-not-dangerous align-center add-feedback-btn"
						onClick={addFeedback}
					>
						Add Feedback
					</Button>
				</div>
			) : null}
			<div contentEditable={false}>
				<Button className="delete-button" onClick={onDelete}>
					×
				</Button>
			</div>
		</div>
	)
}

export default NumericInput
