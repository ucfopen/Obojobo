import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID, LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const MATH_NODE = 'ObojoboDraft.Chunks.MathEquation'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

import Break from '../Break/editor'
import Code from '../Code/editor'
import Figure from '../Figure/editor'
import Heading from '../Heading/editor'
import IFrame from '../IFrame/editor'
import List from '../List/editor'
import MathEquation from '../MathEquation/editor'
import Table from '../Table/editor'
import Text from '../Text/editor'
import YouTube from '../YouTube/editor'
import MCAssessment from '../MCAssessment/editor'
import DefaultNode from '../../../src/scripts/oboeditor/default-node'

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
	'ObojoboDraft.Chunks.MCAssessment': MCAssessment
}

class Node extends React.Component {
	delete() {
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}
	render(){
		return (
			<div className={'component flip-container obojobo-draft--chunks--question  is-active is-mode-practice'} {...this.props.attributes}>
				<div className={'flipper'}>
					<div className={'content back'}>
						<button className={'delete'} onClick={() => this.delete()}>X</button>
						{this.props.children}
					</div>
				</div>
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: QUESTION_NODE
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
		if(nodes.hasOwnProperty(child.type)){
			json.children.push(nodes[child.type].helpers.slateToObo(child))
		} else {
			json.children.push(DefaultNode.helpers.slateToObo(child))
		}
	})

	console.log(JSON.stringify(node.toJSON()))

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: {} }

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case QUESTION_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Question': {
				nodes: [
					{ types: [
						BREAK_NODE,
						CODE_NODE,
						FIGURE_NODE,
						HEADING_NODE,
						IFRAME_NODE,
						LIST_NODE,
						MATH_NODE,
						TEXT_NODE,
						TABLE_NODE,
						YOUTUBE_NODE
					], min: 1 },
					{ types: [MCASSESSMENT_NODE], min: 1, max: 1}
				],

				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							// If we are missing the last node,
							// it should be a MCAssessemnt
							if (index === node.nodes.size){
								const block = Block.create({
									type: MCASSESSMENT_NODE,
									data: { content: { responseType: 'pick-one', shuffle: true }}
								})
								return change.insertNodeByKey(node.key, index, block)
							}

							// Otherwise, just add a text node
							const block = Block.create({
								type: TEXT_NODE,
								data: { content: { indent: 0 }}
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							if(child.object !== 'text') return
							return change.wrapBlockByKey(
								child.key,
								{
									type: TEXT_NODE,
									data: { content: { indent: 0 }}
								}
							)
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
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate,
	},
	plugins
}

export default Question
