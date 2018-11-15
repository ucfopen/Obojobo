import React from 'react'
import { Block } from 'slate'

import emptyNode from './empty-node'
import Icon from './icon'
import Node from './editor-component'
import Common from 'Common'

const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

const insertNode = change => {
	change
		.insertBlock(Block.fromJSON(emptyNode))
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}
	json.content.html = node.text
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type

	json.nodes = [
		{
			object: 'text',
			leaves: [
				{
					text: node.content.html
				}
			]
		}
	]

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case HTML_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.HTML': {
				nodes: [
					{
						match: [{ object: 'text' }],
						min: 1
					}
				]
			}
		}
	}
}

const HTML = {
	name: HTML_NODE,
	components: {
		Node,
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

Common.Store.registerEditorModel('ObojoboDraft.Chunks.HTML', {
	name: 'HTML',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo,
	oboToSlate,
	plugins
})

export default HTML
