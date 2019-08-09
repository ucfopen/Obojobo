import './viewer-component.scss'
import './editor-component.scss'

import React, { memo } from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import emptyQB from './empty-node.json'
import emptyQuestion from 'obojobo-chunks-question/empty-node.json'

const { Button } = Common.components

const remove = (editor, node) => {
	editor.removeNodeByKey(node.key)
}

const addQuestion = (editor, node) => {
	const newQuestion = Block.create(emptyQuestion)
	editor.insertNodeByKey(node.key, node.nodes.size, newQuestion)
}

const addQuestionBank = (editor, node) => {
	const newQuestion = Block.create(emptyQB)
	editor.insertNodeByKey(node.key, node.nodes.size, newQuestion)
}

const QuestionBank = ({ editor, node, children }) => (
	<div className={'obojobo-draft--chunks--question-bank editor-bank'}>
		<Button
			className="delete-button"
			onClick={() => {
				remove(editor, node)
			}}
		>
			&times;
		</Button>
		{children}
		<Button
			className="buffer"
			onClick={() => {
				addQuestion(editor, node)
			}}
		>
			{'Add Question'}
		</Button>
		<Button
			className="buffer"
			onClick={() => {
				addQuestionBank(editor, node)
			}}
		>
			{'Add Question Bank'}
		</Button>
	</div>
)

export default memo(QuestionBank)
