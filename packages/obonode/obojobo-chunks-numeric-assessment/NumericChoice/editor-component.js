import './editor-component.scss'

import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import Common from 'obojobo-document-engine/src/scripts/common'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

import { NUMERIC_FEEDBACK_NODE } from '../constants'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const { Button } = Common.components

const NumericInput = props => {
	const addFeedback = () => {
		// const editor = props.editor
		const path = ReactEditor.findPath(props.editor, props.element)

		const newFeedback = {
			type: NUMERIC_FEEDBACK_NODE,
			content: {},
			children: [
				{
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							children: [{ text: '' }],
							content: { indent: 0 }
						}
					]
				}
			]
		}
		return Transforms.insertNodes(props.editor, newFeedback, { at: path.concat(1) })
		// return editor.insertNodeByKey(props.node.key, props.node.nodes.size, newFeedback)
	}

	const onDelete = event => {
		event.stopPropagation()
		// const editor = props.editor
		// return editor.removeNodeByKey(props.node.key)

		const path = ReactEditor.findPath(props.editor, props.element)
		return Transforms.removeNodes(props.editor, { at: path })
	}

	const hasFeedback = props.element.children.length === 2
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
				<Button className="delete-button" onClick={onDelete} ariaLabel="Delete answer choice">
					×
				</Button>
			</div>
		</div>
	)
}

export default withSlateWrapper(NumericInput)
