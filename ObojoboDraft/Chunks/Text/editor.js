import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import TextUtil from '../../../src/scripts/oboeditor/util/text-util'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const Line = props => {
	return (
		<span
			className={'text align-' + props.node.data.get('align')}
			{...props.attributes}
			data-indent={props.node.data.get('indent')}
		>
			{props.children}
		</span>
	)
}

const Node = props => {
	return (
		<div className={'component'}>
			<div className={'text-chunk obojobo-draft--chunks--single-text pad'}>{props.children}</div>
		</div>
	)
}

const isType = change => {
	return change.value.blocks.some(block => {
		return !!change.value.document.getClosest(block.key, parent => {
			return parent.type === TEXT_NODE
		})
	})
}

const insertNode = change => {
	change
		.insertBlock(TEXT_NODE)
		.collapseToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}

	json.content.textGroup = []
	node.nodes.forEach(line => {
		const textLine = {
			text: { value: line.text, styleList: [] },
			data: { indent: line.data.get('indent') }
		}

		line.nodes.forEach(text => {
			TextUtil.slateToOboText(text, textLine)
		})

		json.content.textGroup.push(textLine)
	})
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: {} }

	json.nodes = []
	node.content.textGroup.forEach(line => {
		const indent = line.data ? line.data.indent : 0
		const align = line.data ? line.data.align : 0
		const codeLine = {
			object: 'block',
			type: TEXT_LINE_NODE,
			data: { indent, align },
			nodes: [
				{
					object: 'text',
					leaves: TextUtil.parseMarkings(line)
				}
			]
		}

		json.nodes.push(codeLine)
	})

	return json
}

const plugins = {
	onKeyDown(event, change) {
		const isText = isType(change)

		// Enter
		if (isText && event.key === 'Enter') {
			event.preventDefault()
			const last = change.value.endBlock
			// Double Enter
			if (last.text === '') {
				change.removeNodeByKey(last.key)
				change.splitBlock(2)
				return true
			}
			change.insertBlock({ type: TEXT_LINE_NODE, data: { indent: 0 } })
			return true
		}

		// Shift Tab
		if (isText && event.key === 'Tab' && event.shiftKey) {
			event.preventDefault()
			change.value.blocks.forEach(block => {
				let newIndent = block.data.get('indent') - 1
				if (newIndent < 1) newIndent = 0

				return change.setNodeByKey(block.key, {
					data: { indent: newIndent }
				})
			})
			return true
		}

		// Tab indent
		if (isText && event.key === 'Tab') {
			event.preventDefault()
			change.value.blocks.forEach(block =>
				change.setNodeByKey(block.key, {
					data: { indent: block.data.get('indent') + 1 }
				})
			)
			return true
		}
	},
	renderNode(props) {
		switch (props.node.type) {
			case TEXT_NODE:
				return <Node {...props} />
			case TEXT_LINE_NODE:
				return <Line {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Text': {
				nodes: [{ types: [TEXT_LINE_NODE] }],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: TEXT_LINE_NODE,
								data: { indent: 0 }
							})
						}
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: TEXT_LINE_NODE,
								data: { indent: 0 }
							})
							return change.insertNodeByKey(node.key, index, block)
						}
					}
				}
			},
			'ObojoboDraft.Chunks.Text.TextLine': {
				nodes: [{ objects: ['text'] }]
			}
		}
	}
}

const Text = {
	components: {
		Node,
		Line
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Text
