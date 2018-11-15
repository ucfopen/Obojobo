import React from 'react'
import { Block } from 'slate'
import Common from 'Common'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Component from '../../../src/scripts/oboeditor/components/editor-component'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const Node = props => {
	return <div className={'page-editor'}>{props.children}</div>
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	if (node.data) json.content = node.data.get('content') || {}
	json.children = []

	node.nodes.forEach(child => {
		json.children.push(Component.helpers.slateToObo(child))
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
		json.nodes.push(Component.helpers.oboToSlate(child))
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case PAGE_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Pages.Page': {
				nodes: [{ match: [ { type: 'oboeditor.component' } ], min: 1 }],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								object: 'block',
								type: 'oboeditor.component',
								nodes: [
									{
										object: 'block',
										type: TEXT_NODE
									}
								]
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							const block = Block.fromJSON({
								object: 'block',
								type: 'oboeditor.component',
								nodes: [
									{
										object: 'block',
										type: TEXT_NODE
									}
								]
							})
							return change.withoutNormalization(c => {
								c.removeNodeByKey(child.key)
								return c.insertNodeByKey(node.key, index, block)
							})
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
