import './viewer-component.scss'
import './editor-component.scss'

import React, { memo } from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

import emptyQB from './empty-node.json'

const { Button } = Common.components
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

const remove = (editor, node) => {
	editor.removeNodeByKey(node.key)
}

const addQuestion = (editor, node) => {
	const Question = Common.Registry.getItemForType(QUESTION_NODE)
	const newQuestion = Block.create(Question.insertJSON)
	editor.insertNodeByKey(node.key, node.nodes.size, newQuestion)
}

const addQuestionBank = (editor, node) => {
	const newQuestion = Block.create(emptyQB)
	editor.insertNodeByKey(node.key, node.nodes.size, newQuestion)
}

const QuestionBank = props => {
	const { editor, node, children } = props
	return (
		<Node {...props}>
			<div className={'obojobo-draft--chunks--question-bank editor-bank'}>
				<Button
					className="delete-button"
					onClick={() => {remove(editor, node)}}>
					&times;
				</Button>
				{children}
				<div className="button-bar">
					<Button
						onClick={() => {addQuestion(editor, node)}}>
						Add Question
					</Button>
					<Button
						onClick={() => {addQuestionBank(editor, node)}}>
						Add Question Bank
					</Button>
				</div>
			</div>
		</Node>
	)
}

export default memo(QuestionBank)
