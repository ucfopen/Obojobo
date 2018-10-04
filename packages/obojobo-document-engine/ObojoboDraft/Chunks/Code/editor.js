import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

const Line = props => {
	return (
		<span className={'text align-left'} data-indent={props.node.data.get('content').indent}>
			{props.children}
		</span>
	)
}

const Node = props => {
	return (
		<div className={'component'}>
			<div className={`text-chunk obojobo-draft--chunks--code pad`}>
				<pre>
					<code>{props.children}</code>
				</pre>
			</div>
		</div>
	)
}

const isType = change => {
	return change.value.blocks.some(block => {
		return !!change.value.document.getClosest(block.key, parent => {
			return parent.type === CODE_NODE
		})
	})
}

const insertNode = change => {
	change.insertBlock(CODE_NODE).focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}

	json.content.textGroup = []
	node.nodes.forEach(line => {
		const codeLine = {
			text: { value: line.text, styleList: [] },
			data: { indent: line.data.get('content').indent }
		}

		let currIndex = 0

		line.nodes.forEach(text => {
			text.leaves.forEach(textRange => {
				textRange.marks.forEach(mark => {
					const style = {
						start: currIndex,
						end: currIndex + textRange.text.length,
						type: mark.type,
						data: JSON.parse(JSON.stringify(mark.data))
					}
					codeLine.text.styleList.push(style)
				})
				currIndex += textRange.text.length
			})
		})

		json.content.textGroup.push(codeLine)
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
		const codeLine = {
			object: 'block',
			type: CODE_LINE_NODE,
			data: { content: { indent } },
			nodes: [
				{
					object: 'text',
					leaves: [
						{
							text: line.text.value
						}
					]
				}
			]
		}

		json.nodes.push(codeLine)
	})

	return json
}

const plugins = {
	// Basic functions, will probably want to replace with slate-edit-code
	onKeyDown(event, change) {
		// See if any of the selected nodes have a CODE_NODE parent
		const isCode = isType(change)

		// Enter
		if (isCode && event.key === 'Enter') {
			event.preventDefault()
			change.insertBlock({ type: CODE_LINE_NODE, data: { content: { indent: 0 } } })
			return true
		}

		// Shift Tab
		if (isCode && event.key === 'Tab' && event.shiftKey) {
			event.preventDefault()
			change.value.blocks.forEach(block => {
				let newIndent = block.data.get('content').indent - 1
				if (newIndent < 1) newIndent = 0

				return change.setNodeByKey(block.key, {
					data: { content: { indent: newIndent } }
				})
			})
			return true
		}

		// Tab indent
		if (isCode && event.key === 'Tab') {
			event.preventDefault()
			change.value.blocks.forEach(block =>
				change.setNodeByKey(block.key, {
					data: { content: { indent: block.data.get('content').indent + 1 } }
				})
			)
			return true
		}
	},
	renderNode(props) {
		switch (props.node.type) {
			case CODE_NODE:
				return <Node {...props} {...props.attributes} />
			case CODE_LINE_NODE:
				return <Line {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Code': {
				nodes: [
					{
						match: [{ type: CODE_LINE_NODE }],
						min: 1
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: CODE_LINE_NODE,
								data: { content: { indent: 0 } }
							})
						}
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: CODE_LINE_NODE,
								data: { content: { indent: 0 } }
							})
							return change.insertNodeByKey(node.key, index, block)
						}
					}
				}
			},
			'ObojoboDraft.Chunks.Code.CodeLine': {
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

const Code = {
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

export default Code
