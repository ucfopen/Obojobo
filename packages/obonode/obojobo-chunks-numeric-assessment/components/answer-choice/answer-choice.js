import './numeric-input.scss'

import React from 'react'
import { Block } from 'slate'
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

	const hasFeedback = props.children.length >= 2

	return (
		<div className="numeric-answer">
			{props.children}
			{!hasFeedback ? (
				<div className="pad obojobo-draft--components--button alt-action is-not-dangerous align-center add-feedback-btn">
					<button className="button" onClick={addFeedback} contentEditable={false}>
						Add Feedback
					</button>
				</div>
			) : null}
		</div>
	)
}

export default NumericInput
