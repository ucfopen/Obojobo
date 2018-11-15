import React from 'react'
import { Block } from 'slate'
import TextUtil from '../../../src/scripts/oboeditor/util/text-util'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Common from 'Common'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

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
	json.content.headingLevel = node.data.get('content').level
	json.content.textGroup = []

	const line = {
		text: { value: node.text, styleList: [] },
		data: { align: node.data.get('content').align }
	}

	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, line)
	})

	json.content.textGroup.push(line)
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: {} }
	json.data.content.level = node.content.headingLevel

	json.nodes = []
	node.content.textGroup.forEach(line => {
		json.data.content.align = line.data ? line.data.align : 'left'
		const headingline = {
			object: 'text',
			leaves: TextUtil.parseMarkings(line)
		}

		json.nodes.push(headingline)
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case HEADING_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	renderPlaceholder(props) {
		const { node } = props
		if (node.object !== 'block' || node.type !== HEADING_NODE) return
		if (node.text !== '') return

		return (
			<span
				className={'placeholder align-' + node.data.get('content').align}
				contentEditable={false}
			>
				{'Type Your Heading Here'}
			</span>
		)
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Heading': {
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

const Heading = {
	name: HEADING_NODE,
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

Common.Store.registerEditorModel('ObojoboDraft.Chunks.Heading', {
	name: 'Heading',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo,
	oboToSlate,
	plugins
})

export default Heading
