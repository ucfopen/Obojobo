import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Question from '../Question/editor'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

class Node extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.node.data.get('content')
	}
	delete() {
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}
	addQuestion() {
		const editor = this.props.editor
		const change = editor.value.change()

		const newQuestion = Block.create({
			type: QUESTION_NODE,
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)

		editor.onChange(change)
	}
	addQuestionBank() {
		const editor = this.props.editor
		const change = editor.value.change()

		const newQuestion = Block.create({
			type: QUESTION_BANK_NODE,
			data: { content: { choose: 1, select: 'sequential'}}
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)

		editor.onChange(change)
	}
	handleSelectChange(event){
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ select: event.target.value })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			select: event.target.value,
			choose: this.state.choose
		}}})
		editor.onChange(change)
	}
	handleChooseChange(event){
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ choose: event.target.value })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			choose: event.target.value,
			select: this.state.select
		}}})
		editor.onChange(change)
	}
	render() {
		return (
			<div className={'obojobo-draft--chunks--question-bank'} {...this.props.attributes}>
				<button className={'delete'} onClick={() => this.delete()}>X</button>
				<span contentEditable={false}>{'Choose: '}</span>
				<input
					className={'choose-input'}
					type={'number'}
					value={this.state.choose}
					onChange={event => this.handleChooseChange(event)}
					onClick={event => event.stopPropagation()}/>
				<span contentEditable={false}>{'Select: '}</span>
				<select
					name={'Select'}
					value={this.state.select}
					onChange={event => this.handleSelectChange(event)}
					onClick={event => event.stopPropagation()}>
					<option value={'sequential'}>{'Sequential'}</option>
					<option value={'random'}>{'Random'}</option>
					<option value={'random-unseen'}>{'Random Unseen'}</option>
				</select>
				{this.props.children}
				<button onClick={() => this.addQuestion()}>Add Question</button>
				<button onClick={() => this.addQuestionBank()}>Add QuestionBank</button>
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: QUESTION_BANK_NODE,
			data: { content: { choose: 1, select: 'sequential'}}
		})
		.collapseToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	node.nodes.forEach(child => {
		if(child.type === QUESTION_BANK_NODE) {
			json.children.push(slateToObo(child))
		}else {
			json.children.push(Question.helpers.slateToObo(child))
		}
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }
	json.nodes = []

	node.children.forEach(child => {
		// If the current Node is a registered OboNode, use its custom converter
		if(child.type === QUESTION_BANK_NODE) {
			json.nodes.push(oboToSlate(child))
		}else {
			json.nodes.push(Question.helpers.oboToSlate(child))
		}
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case QUESTION_BANK_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.QuestionBank': {
				nodes: [{ types: [QUESTION_NODE, QUESTION_BANK_NODE], min: 1 }],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: QUESTION_NODE,
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(
								child.key,
								{
									type: QUESTION_NODE,
								}
							)
						}
					}
				}
			}
		}
	}
}

const QuestionBank = {
	components: {
		Node,
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default QuestionBank
