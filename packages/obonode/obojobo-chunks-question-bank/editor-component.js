import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import emptyQB from './empty-node.json'
import emptyQuestion from 'obojobo-chunks-question/empty-node.json'

const { Button } = Common.components

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
		const newQuestion = Block.create(emptyQuestion)
		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)
	}
	addQuestionBank() {
		const editor = this.props.editor

		const newQuestion = Block.create(emptyQB)

		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)
	}
	render() {
		return (
			<div className={'obojobo-draft--chunks--question-bank editor-bank'}>
				<Button className="delete-button" onClick={() => this.delete()}>
					×
				</Button>
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
