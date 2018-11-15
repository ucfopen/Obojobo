import React from 'react'
import { Block } from 'slate'
import TextUtil from '../../../src/scripts/oboeditor/util/text-util'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Common from 'Common'

const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

const insertNode = change => {
	change
		.insertBlock(Block.fromJSON(emptyNode))
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content')

	json.content.textGroup = []
	const captionLine = {
		text: { value: node.text, styleList: [] },
		data: null
	}

	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, captionLine)
	})

	json.content.textGroup.push(captionLine)
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }

	json.nodes = []
	// If there is currently no caption, add one
	if (!node.content.textGroup) {
		const caption = {
			object: 'text',
			leaves: [
				{
					text: ''
				}
			]
		}
		json.nodes.push(caption)
		return json
	}

	node.content.textGroup.forEach(line => {
		const caption = {
			object: 'text',
			leaves: TextUtil.parseMarkings(line)
		}

		json.nodes.push(caption)
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case FIGURE_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	renderPlaceholder(props) {
		const { node } = props
		if (node.object !== 'block' || node.type !== FIGURE_NODE) return
		if (node.text !== '') return

		return (
			<span className={'placeholder align-center'} contentEditable={false}>
				{'Type Your Caption Here'}
			</span>
		)
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Figure': {
				nodes: [
					{
						match: [{ object: 'text' }],
						min: 0
					}
				]
			}
		}
	}
}

const Figure = {
	name: FIGURE_NODE,
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

Common.Store.registerEditorModel('ObojoboDraft.Chunks.Figure', {
	name: 'Figure',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo,
	oboToSlate,
	plugins
})

export default Figure
