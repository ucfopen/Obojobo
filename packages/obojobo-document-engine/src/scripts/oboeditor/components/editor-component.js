import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID, CHILD_UNKNOWN } from 'slate-schema-violations'

import ActionButton from '../../../../ObojoboDraft/Chunks/ActionButton/editor'
import Break from '../../../../ObojoboDraft/Chunks/Break/editor'
import Code from '../../../../ObojoboDraft/Chunks/Code/editor'
import Figure from '../../../../ObojoboDraft/Chunks/Figure/editor'
import Heading from '../../../../ObojoboDraft/Chunks/Heading/editor'
import HTML from '../../../../ObojoboDraft/Chunks/HTML/editor'
import IFrame from '../../../../ObojoboDraft/Chunks/IFrame/editor'
import List from '../../../../ObojoboDraft/Chunks/List/editor'
import MathEquation from '../../../../ObojoboDraft/Chunks/MathEquation/editor'
import Table from '../../../../ObojoboDraft/Chunks/Table/editor'
import Text from '../../../../ObojoboDraft/Chunks/Text/editor'
import YouTube from '../../../../ObojoboDraft/Chunks/YouTube/editor'
//import QuestionBank from '../../../../ObojoboDraft/Chunks/QuestionBank/editor'
//import Question from '../../../../ObojoboDraft/Chunks/Question/editor'
import DefaultNode from './default-node'

import OboEditorStore from '../store'
OboEditorStore.getModels()

import DropMenu from './drop-menu'

import './editor-component.scss'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const COMPONENT_NODE = 'oboeditor.component'

const nodes = {
	'ObojoboDraft.Chunks.ActionButton': ActionButton,
	'ObojoboDraft.Chunks.Break': Break,
	'ObojoboDraft.Chunks.Code': Code,
	'ObojoboDraft.Chunks.Figure': Figure,
	'ObojoboDraft.Chunks.Heading': Heading,
	'ObojoboDraft.Chunks.HTML': HTML,
	'ObojoboDraft.Chunks.IFrame': IFrame,
	'ObojoboDraft.Chunks.List': List,
	'ObojoboDraft.Chunks.MathEquation': MathEquation,
	'ObojoboDraft.Chunks.Table': Table,
	'ObojoboDraft.Chunks.Text': Text,
	'ObojoboDraft.Chunks.YouTube': YouTube,
}

class Node extends React.Component {
	insertBlockAtStart(item) {
		const editor = this.props.editor
		const change = editor.value.change()

		change.insertNodeByKey(this.props.node.key, 0, Block.create(item.json.emptyNode))

		editor.onChange(change)
	}

	insertBlockAtEnd(item) {
		const editor = this.props.editor
		const change = editor.value.change()

		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, Block.create(item.json.emptyNode))

		editor.onChange(change)
	}

	render(){
		return (
			<div className={'oboeditor-component component'}>
				{this.props.isSelected ? <div className={'component-toolbar'}>
					<DropMenu
						dropOptions={Object.values(nodes)}
						className={'align-left top'}
						icon="+"
						masterOnClick={this.insertBlockAtStart.bind(this)}/>
					<DropMenu
						dropOptions={Object.values(nodes)}
						className={'align-left bottom'}
						icon="+"
						masterOnClick={this.insertBlockAtEnd.bind(this)}/>
				</div> : null}
				{this.props.children}
			</div>
		)
	}
}

const slateToObo = node => {
	let json = {}

	node.nodes.forEach(child => {
		if (nodes.hasOwnProperty(child.type)) {
			json = nodes[child.type].helpers.slateToObo(child)
		} else {
			json = DefaultNode.helpers.slateToObo(child)
		}
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.type = COMPONENT_NODE
	json.nodes = []

	if (nodes.hasOwnProperty(node.type)) {
		json.nodes.push(nodes[node.type].helpers.oboToSlate(node))
	} else {
		json.nodes.push(DefaultNode.helpers.oboToSlate(node))
	}

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case COMPONENT_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'oboeditor.component': {
				nodes: [
					{
						match: [
							{ type: 'ObojoboDraft.Chunks.ActionButton' },
							{ type: 'ObojoboDraft.Chunks.Break' },
							{ type: 'ObojoboDraft.Chunks.Code' },
							{ type: 'ObojoboDraft.Chunks.Figure' },
							{ type: 'ObojoboDraft.Chunks.Heading' },
							{ type: 'ObojoboDraft.Chunks.HTML' },
							{ type: 'ObojoboDraft.Chunks.IFrame' },
							{ type: 'ObojoboDraft.Chunks.List' },
							{ type: 'ObojoboDraft.Chunks.MathEquation' },
							{ type: 'ObojoboDraft.Chunks.Table' },
							{ type: 'ObojoboDraft.Chunks.Text' },
							{ type: 'ObojoboDraft.Chunks.YouTube' },
							{ type: 'ObojoboDraft.Chunks.QuestionBank' },
							{ type: 'ObojoboDraft.Chunks.Question' }
						],
						min: 1, max: 1
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: TEXT_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}

						case CHILD_TYPE_INVALID: {
							const block = Block.create({
								type: TEXT_NODE
							})
							return change.wrapBlockByKey(child.key, block)
						}
						// Occurs when multiple valid nodes are found within a
						// component
						case CHILD_UNKNOWN: {
							return change.splitNodeByKey(node.key, 1)
						}
					}
				}
			}
		}
	}
}

const PageNode = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default PageNode
