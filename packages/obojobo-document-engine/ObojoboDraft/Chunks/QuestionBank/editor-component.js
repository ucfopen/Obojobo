import React from 'react'
import { Block } from 'slate'
import Common from 'Common'

const { Button } = Common.components

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

class QuestionBank extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.node.data.get('content')
	}
	delete() {
		const editor = this.props.editor
		return editor.removeNodeByKey(this.props.node.key)
	}
	addQuestion() {
		const editor = this.props.editor
		const newQuestion = Block.create({
			type: QUESTION_NODE
		})
		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)
	}
	addQuestionBank() {
		const editor = this.props.editor

		const newQuestion = Block.create({
			type: QUESTION_BANK_NODE,
			data: { content: { choose: 1, select: 'sequential' } }
		})
		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)
	}
	render() {
		return (
			<div className={'obojobo-draft--chunks--question-bank editor-bank'}>
				<button className={'delete-node'} onClick={() => this.delete()}>
					X
				</button>
				{this.props.children}
				<Button className={'buffer'} onClick={() => this.addQuestion()}>
					{'Add Question'}
				</Button>
				<Button className={'buffer'} onClick={() => this.addQuestionBank()}>
					{'Add Question Bank'}
				</Button>
			</div>
		)
	}
}

export default QuestionBank
