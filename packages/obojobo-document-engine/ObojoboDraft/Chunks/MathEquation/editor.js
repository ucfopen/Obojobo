import React from 'react'
import { Block } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Common from 'Common'

const MATH_NODE = 'ObojoboDraft.Chunks.MathEquation'

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
	json.isVoid = true

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MATH_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.MathEquation': {
				isVoid: true
			}
		}
	}
}

const MathEquation = {
	name: MATH_NODE,
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

Common.Store.registerEditorModel('ObojoboDraft.Chunks.MathEquation', {
	name: 'Math Equation',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo,
	oboToSlate,
	plugins
})

export default MathEquation
