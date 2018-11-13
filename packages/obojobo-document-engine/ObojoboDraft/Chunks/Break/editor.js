import React from 'react'
import { Block } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'

import OboEditorStore from '../../../src/scripts/oboeditor/store'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

const insertNode = change => {
	change
		.insertBlock(Block.fromJSON(emptyNode))
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {
		width: node.data.get('content').width
	}
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }

	if (!json.data.content.width) json.data.content.width = 'normal'

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case BREAK_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Break': {
				isVoid: true
			}
		}
	}
}

const Break = {
	name: BREAK_NODE,
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

OboEditorStore.registerModel('ObojoboDraft.Chunks.Break', {
	name: 'Break',
	icon: Icon,
	isInsertable: true,
	componentClass: Node,
	insertJSON: emptyNode,
	plugins
})

export default Break
