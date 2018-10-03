import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'
import Common from 'Common'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const HTML_NODE = 'ObojoboDraft.Chunks.HTML'
const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const MATH_NODE = 'ObojoboDraft.Chunks.MathEquation'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

import Break from '../Break/editor'
import Code from '../Code/editor'
import Figure from '../Figure/editor'
import Heading from '../Heading/editor'
import HTML from '../HTML/editor'
import IFrame from '../IFrame/editor'
import List from '../List/editor'
import MathEquation from '../MathEquation/editor'
import Table from '../Table/editor'
import Text from '../Text/editor'
import YouTube from '../YouTube/editor'
import MCAssessment from '../MCAssessment/editor'
import Page from '../../Pages/Page/editor'
import DefaultNode from '../../../src/scripts/oboeditor/components/default-node'

const { Button } = Common.components
const nodes = {
	'ObojoboDraft.Chunks.Break': Break,
	'ObojoboDraft.Chunks.Code': Code,
	'ObojoboDraft.Chunks.Figure': Figure,
	'ObojoboDraft.Chunks.Heading': Heading,
	'ObojoboDraft.Chunks.IFrame': IFrame,
	'ObojoboDraft.Chunks.List': List,
	'ObojoboDraft.Chunks.MathEquation': MathEquation,
	'ObojoboDraft.Chunks.Table': Table,
	'ObojoboDraft.Chunks.Text': Text,
	'ObojoboDraft.Chunks.YouTube': YouTube,
	'ObojoboDraft.Chunks.MCAssessment': MCAssessment,
	'ObojoboDraft.Chunks.HTML': HTML
}

const Solution = props => {
	const deleteNode = () => {
		const editor = props.editor
		const change = editor.value.change()
		change.removeNodeByKey(props.node.key)

		editor.onChange(change)
	}

	return (
		<div className={'solution-editor'} {...props.attributes}>
			{props.children}
			<button className={'delete'} onClick={() => deleteNode()}>
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
			<div
				className={
					'component flip-container obojobo-draft--chunks--question  is-active is-mode-practice'
				}
				{...this.props.attributes}
			>
				<div className={'flipper'}>
					<div className={'content back'}>
						{this.props.children}
						{hasSolution ? null : (
							<Button className={'add-solution'} onClick={() => this.addSolution()}>
								{'Add Solution'}
							</Button>
						)}
					</div>
				</div>
				<button className={'delete'} onClick={() => this.delete()}>
					X
				</button>
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: QUESTION_NODE
		})
		.moveToStartOfNextText()
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
		} else if (nodes.hasOwnProperty(child.type)) {
			json.children.push(nodes[child.type].helpers.slateToObo(child))
		} else {
			json.children.push(DefaultNode.helpers.slateToObo(child))
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
		if (nodes.hasOwnProperty(child.type)) {
			json.nodes.push(nodes[child.type].helpers.oboToSlate(child))
		} else {
			json.nodes.push(DefaultNode.helpers.oboToSlate(child))
		}
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
				return <Node {...props} />
			case SOLUTION_NODE:
				return <Solution {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Question': {
				nodes: [
					{
						match: [
							{ type: BREAK_NODE },
							{ type: CODE_NODE },
							{ type: FIGURE_NODE },
							{ type: HEADING_NODE },
							{ type: IFRAME_NODE },
							{ type: LIST_NODE },
							{ type: MATH_NODE },
							{ type: TEXT_NODE },
							{ type: TABLE_NODE },
							{ type: YOUTUBE_NODE },
							{ type: HTML_NODE }
						],
						min: 1
					},
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
								type: TEXT_NODE,
								data: { content: { indent: 0 } }
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							if (child.object !== 'text') return
							return change.wrapBlockByKey(child.key, {
								type: TEXT_NODE,
								data: { content: { indent: 0 } }
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
	components: {
		Node,
		Solution
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Question
