import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import TextUtil from '../../../src/scripts/oboeditor/util/text-util'

import emptyNode from './empty-node.json'
import Icon from './icon'

import OboEditorStore from '../../../src/scripts/oboeditor/store'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const Line = props => {
	return (
		<span
			className={'text align-' + props.node.data.get('align')}
			data-indent={props.node.data.get('indent')}
		>
			{props.children}
		</span>
	)
}

const Node = props => {
	return (
		<div className={'text-chunk obojobo-draft--chunks--single-text pad'}>
			{props.children}
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
		.insertBlock(emptyNode)
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}

	json.content.textGroup = []
	node.nodes.forEach(line => {
		const textLine = {
			text: { value: line.text, styleList: [] },
			data: { indent: line.data.get('indent'), align: line.data.get('align') }
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
		const textLine = {
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

		json.nodes.push(textLine)
	})

	return json
}

const plugins = {
	onKeyDown(event, change) {
		const isText = isType(change)
		if (!isText) return

		// Delete empty text node
		if (event.key === 'Backspace' || event.key === 'Delete') {
			const last = change.value.endBlock
			let parent
			change.value.blocks.forEach(block => {
				parent = change.value.document.getClosest(block.key, parent => {
					return parent.type === TEXT_NODE
				})
			})

			if (last.text === '' && parent.nodes.size === 1) {
				event.preventDefault()
				change.removeNodeByKey(parent.key)
				return true
			}
		}

		// Enter
		if (event.key === 'Enter') {
			event.preventDefault()
			const last = change.value.endBlock
			// Double Enter
			if (last.text === '') {
				change.removeNodeByKey(last.key)
				change.splitBlock(2)
				return true
			}

			return
		}

		// Shift Tab
		if (event.key === 'Tab' && event.shiftKey) {
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

		// Alt Tab
		if (event.key === 'Tab' && event.altKey) {
			event.preventDefault()
			change.value.blocks.forEach(block =>
				change.setNodeByKey(block.key, {
					data: { indent: block.data.get('indent') + 1 }
				})
			)
			return true
		}

		// Tab insert
		if (event.key === 'Tab') {
			event.preventDefault()
			change.insertText('\t')
			return true
		}
	},
	renderNode(props) {
		switch (props.node.type) {
			case TEXT_NODE:
				return <Node {...props} {...props.attributes} />
			case TEXT_LINE_NODE:
				return <Line {...props} {...props.attributes} />
		}
	},
	renderPlaceholder(props) {
		const { node } = props
		if (node.object !== 'block' || node.type !== TEXT_LINE_NODE) return
		if (node.text !== '') return

		return (
			<span className={'placeholder align-' + node.data.get('align')} contentEditable={false}>
				{'Type Your Text Here'}
			</span>
		)
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Text': {
				nodes: [
					{
						match: [{ type: TEXT_LINE_NODE }],
						min: 1
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_TYPE_INVALID: {
							// Allow inserting of new nodes by unwrapping unexpected blocks at end and beginning
							const isAtEdge = index === node.nodes.size - 1 || index === 0
							if (child.object === 'block' && isAtEdge) {
								return change.unwrapNodeByKey(child.key)
							}

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
				nodes: [{ match: [{ object: 'text' }] }],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_TYPE_INVALID: {
							// Allow inserting of new nodes by unwrapping unexpected blocks at end and beginning
							const isAtEdge = index === node.nodes.size - 1 || index === 0
							if (child.object === 'block' && isAtEdge) {
								return change.unwrapNodeByKey(child.key)
							}
						}
					}
				}
			}
		}
	}
}

const Text = {
	name: TEXT_NODE,
	components: {
		Node,
		Line,
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

OboEditorStore.registerModel('ObojoboDraft.Chunks.Text', {
	name: 'Text',
	icon: Icon,
	isInsertable: true,
	componentClass: Node,
	insertJSON: emptyNode,
	plugins
})

export default Text
