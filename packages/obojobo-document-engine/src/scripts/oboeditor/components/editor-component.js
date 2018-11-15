import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_UNKNOWN } from 'slate-schema-violations'
import Common from 'Common'

import DropMenu from './drop-menu'

import './editor-component.scss'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const COMPONENT_NODE = 'oboeditor.component'

class Node extends React.Component {
	insertBlockAtStart(item) {
		const editor = this.props.editor
		const change = editor.value.change()

		change.insertNodeByKey(this.props.node.key, 0, Block.create(item.insertJSON))

		editor.onChange(change)
	}

	insertBlockAtEnd(item) {
		const editor = this.props.editor
		const change = editor.value.change()

		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, Block.create(item.insertJSON))

		editor.onChange(change)
	}

	convertItemsToArray(items){
		return Array.from(items.values())
	}

	render(){
		return (
			<div className={'oboeditor-component component'}>
				{this.props.isSelected ? <div className={'component-toolbar'}>
					<DropMenu
						dropOptions={Common.Store.getItems(this.convertItemsToArray)}
						className={'align-left top'}
						icon="+"
						masterOnClick={this.insertBlockAtStart.bind(this)}/>
					<DropMenu
						dropOptions={Common.Store.getItems(this.convertItemsToArray)}
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
		json = Common.Store.getItemForType(child.type).slateToObo(child)
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.type = COMPONENT_NODE
	json.nodes = []

	const editorModel = Common.Store.getItemForType(node.type)
	json.nodes.push(editorModel.oboToSlate(node))
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
					const { node, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: TEXT_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
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

const ComponentNode = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default ComponentNode
