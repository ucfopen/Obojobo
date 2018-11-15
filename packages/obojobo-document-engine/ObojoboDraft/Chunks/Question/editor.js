import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'
import Common from 'Common'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

import Page from '../../Pages/Page/editor'
import Component from '../../../src/scripts/oboeditor/components/editor-component'

import emptyNode from './empty-node.json'
import Icon from './icon'

const { Button } = Common.components

const Solution = props => {
	const deleteNode = () => {
		const editor = props.editor
		const change = editor.value.change()
		change.removeNodeByKey(props.node.key)

		editor.onChange(change)
	}

	return (
		<div className={'solution-editor'}>
			{props.children}
			<button className={'delete-node'} onClick={() => deleteNode()}>
				X
			</button>
		</div>
	)
}

class Node extends React.Component {
	delete() {
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}
	addSolution() {
		const editor = this.props.editor
		const change = editor.value.change()

		const newQuestion = Block.create({
			type: SOLUTION_NODE
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)

		editor.onChange(change)
	}
	render() {
		const hasSolution = this.props.node.nodes.last().type === SOLUTION_NODE
		return (
			<div className={'component obojobo-draft--chunks--question is-viewed is-mode-practice pad'}>
				<div className={'flipper question-editor'}>
					<div className={'content-back'}>
						{this.props.children}
						{hasSolution ? null : (
							<Button className={'add-solution'} onClick={() => this.addSolution()}>
								{'Add Solution'}
							</Button>
						)}
					</div>
				</div>
				<button className={'delete-node'} onClick={() => this.delete()}>
					X
				</button>
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock(Block.fromJSON(emptyNode))
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	delete json.content.solution

	node.nodes.forEach(child => {
		if (child.type === SOLUTION_NODE) {
			json.content.solution = Page.helpers.slateToObo(child.nodes.get(0))
		} else if (child.type === MCASSESSMENT_NODE) {
			json.children.push(Common.Store.getItemForType(child.type).slateToObo(child))
		} else {
			json.children.push(Component.helpers.slateToObo(child))
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
		if(child.type === MCASSESSMENT_NODE) {
			json.nodes.push(Common.Store.getItemForType(child.type).oboToSlate(child))
		}
		json.nodes.push(Component.helpers.oboToSlate(child))
	})

	if (json.data.content.solution) {
		const solution = {
			object: 'block',
			type: SOLUTION_NODE,
			nodes: []
		}

		solution.nodes.push(Page.helpers.oboToSlate(json.data.content.solution))
		json.nodes.push(solution)
	}

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case QUESTION_NODE:
				return <Node {...props} {...props.attributes} />
			case SOLUTION_NODE:
				return <Solution {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Question': {
				nodes: [
					{ match: [ { type: 'oboeditor.component' } ], min: 1 },
					{ match: [MCASSESSMENT_NODE], min: 1, max: 1 },
					{ match: [SOLUTION_NODE], max: 1 }
				],

				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							// If we are missing the last node,
							// it should be a MCAssessment
							if (index === node.nodes.size) {
								const block = Block.create({
									type: MCASSESSMENT_NODE,
									data: { content: { responseType: 'pick-one', shuffle: true } }
								})
								return change.insertNodeByKey(node.key, index, block)
							}

							// Otherwise, just add a text node
							const block = Block.create({
								object: 'block',
								type: 'oboeditor.component',
								nodes: [
									{
										object: 'block',
										type: TEXT_NODE
									}
								]
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							if (child.object !== 'text') return
							const block = Block.fromJSON({
								object: 'block',
								type: 'oboeditor.component',
								nodes: [
									{
										object: 'block',
										type: TEXT_NODE
									}
								]
							})
							return change.withoutNormalization(c => {
								c.removeNodeByKey(child.key)
								return c.insertNodeByKey(node.key, index, block)
							})
						}
					}
				}
			},
			'ObojoboDraft.Chunks.Question.Solution': {
				nodes: [
					{
						match: [{ type: PAGE_NODE }],
						min: 1,
						max: 1
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: PAGE_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: PAGE_NODE
							})
						}
					}
				}
			}
		}
	}
}

const Question = {
	name: QUESTION_NODE,
	components: {
		Node,
		Solution,
		Icon
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	json: {
		emptyNode
	},
	plugins
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.Question', {
	name: 'Question',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo,
	oboToSlate,
	plugins
})

export default Question
