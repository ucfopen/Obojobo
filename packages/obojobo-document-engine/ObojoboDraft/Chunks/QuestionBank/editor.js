import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'
import Common from 'Common'

import Question from '../Question/editor'
import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

const { Button } = Common.components

const Settings = props => {
	return (
		<div {...props.attributes} className={'qb-settings'}>
			<div>{props.children}</div>
		</div>
	)
}

class Node extends React.Component {
	constructor(props) {
		super(props)
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
			type: QUESTION_NODE
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)

		editor.onChange(change)
	}
	addQuestionBank() {
		const editor = this.props.editor
		const change = editor.value.change()

		const newQuestion = Block.create({
			type: QUESTION_BANK_NODE,
			data: { content: { choose: 1, select: 'sequential' } }
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)

		editor.onChange(change)
	}
	render() {
		return (
			<div
				className={'obojobo-draft--chunks--question-bank editor-bank'}
				{...this.props.attributes}
			>
				<button className={'delete'} onClick={() => this.delete()}>
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

const insertNode = change => {
	change
		.insertBlock({
			type: QUESTION_BANK_NODE,
			data: { content: { choose: 1, select: 'sequential' } }
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
		switch (child.type) {
			case QUESTION_BANK_NODE:
				json.children.push(slateToObo(child))
				break
			case QUESTION_NODE:
				json.children.push(Question.helpers.slateToObo(child))
				break
			case SETTINGS_NODE:
				json.content.choose = child.nodes.first().text
				json.content.select = child.nodes.last().data.get('current')
				break
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

	const settings = {
		object: 'block',
		type: SETTINGS_NODE,
		nodes: []
	}

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'choose',
			value: node.content.choose + '',
			display: 'Choose'
		})
	)

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'select',
			value: node.content.select,
			display: 'Select',
			options: ['sequential', 'random', 'random-unseen']
		})
	)

	json.nodes.push(settings)

	node.children.forEach(child => {
		// If the current Node is a registered OboNode, use its custom converter
		if (child.type === QUESTION_BANK_NODE) {
			json.nodes.push(oboToSlate(child))
		} else {
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
			case SETTINGS_NODE:
				return <Settings {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.QuestionBank': {
				nodes: [
					{ types: [SETTINGS_NODE], min: 1, max: 1 },
					{ types: [QUESTION_NODE, QUESTION_BANK_NODE], min: 1 }
				],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							if (index === 0) {
								const block = Block.create({
									type: SETTINGS_NODE
								})
								return change.insertNodeByKey(node.key, index, block)
							}
							const block = Block.create({
								type: QUESTION_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							if (index === 0) {
								const block = Block.create({
									type: SETTINGS_NODE
								})
								return change.wrapBlockByKey(child.key, block)
							}
							return change.wrapBlockByKey(child.key, {
								type: QUESTION_NODE
							})
						}
					}
				}
			},
			'ObojoboDraft.Chunks.QuestionBank.Settings': {
				nodes: [{ types: ['Parameter'], min: 2, max: 2 }],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							if (index === 0) {
								const block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'choose',
										value: Infinity + '',
										display: 'Choose'
									})
								)
								return change.insertNodeByKey(node.key, index, block)
							}
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'select',
									value: 'sequential',
									display: 'Select',
									options: ['sequential', 'random', 'random-unseen']
								})
							)
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.withoutNormalization(c => {
								c.removeNodeByKey(child.key)
								if (index === 0) {
									const block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'choose',
											value: Infinity + '',
											display: 'Choose'
										})
									)
									return c.insertNodeByKey(node.key, index, block)
								}
								const block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'select',
										value: 'sequential',
										display: 'Select',
										options: ['sequential', 'random', 'random-unseen']
									})
								)
								return c.insertNodeByKey(node.key, index, block)
							})
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
		Settings
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default QuestionBank
