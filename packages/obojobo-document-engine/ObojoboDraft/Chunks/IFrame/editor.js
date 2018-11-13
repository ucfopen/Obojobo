import React from 'react'
import { Block } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'

import OboEditorStore from '../../../src/scripts/oboeditor/store'

const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'

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

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case IFRAME_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.IFrame': {
				isVoid: true
			}
		}
	}
}

const IFrame = {
	name: IFRAME_NODE,
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

OboEditorStore.registerModel('ObojoboDraft.Chunks.IFrame', {
	name: 'IFrame',
	icon: Icon,
	isInsertable: true,
	componentClass: Node,
	insertJSON: emptyNode,
	plugins
})

export default IFrame
