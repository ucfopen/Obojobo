import './viewer-component.scss'
import './editor-component.scss'

import React, { memo } from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

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

const QuestionBank = props => {
	const { editor, node, children } = props
	return (
		<Node {...props}>
			<div className={'obojobo-draft--chunks--question-bank editor-bank'}>
				<Button
					className="delete-button"
					onClick={remove.bind(this, editor, node)}>
					&times;
				</Button>
				{children}
				<div className="button-bar">
					<Button
						onClick={addQuestion.bind(this, editor, node)}>
						{'Add Question'}
					</Button>
					<Button
						onClick={addQuestionBank.bind(this, editor, node)}>
						{'Add Question Bank'}
					</Button>
				</div>
			</div>
		</Node>
	)
}

export default memo(QuestionBank)
