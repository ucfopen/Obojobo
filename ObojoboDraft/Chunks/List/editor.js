import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID, PARENT_TYPE_INVALID } from 'slate-schema-violations'

import TextUtil from '../../../src/scripts/oboeditor/util/text-util'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const unorderedBullets = ['disc', 'circle', 'square']

const orderedBullets = ['decimal', 'upper-alpha', 'upper-roman', 'lower-alpha', 'lower-roman']

const Line = props => {
	return (
		<div {...props.attributes}>
			<li>{props.children}</li>
		</div>
	)
}

class Level extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.node.data.get('content')
	}

	getListStyle() {
		return {
			listStyleType: this.state.bulletStyle
		}
	}

	renderList() {
		if (this.state.type === 'unordered') {
			return <ul style={this.getListStyle()}>{this.props.children}</ul>
		} else {
			return <ol style={this.getListStyle()}>{this.props.children}</ol>
		}
	}

	render() {
		return <div {...this.props.attributes}>{this.renderList()}</div>
	}
}

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.node.data.get('content')
	}

	toggleType() {
		const newType = this.state.listStyles.type === 'unordered' ? 'ordered' : 'unordered'

		this.state.listStyles.type = newType

		const levels = this.props.node.filterDescendants(desc => desc.type === LIST_LEVEL_NODE)

		const { editor } = this.props
		const change = editor.value.change()

		levels.forEach(levelNode => {
			const levelContent = levelNode.data.get('content')
			levelContent.type = newType

			// convert between unordered and ordered bullet styles
			const bulletList = newType === 'unordered' ? unorderedBullets : orderedBullets
			const oldList = newType !== 'unordered' ? unorderedBullets : orderedBullets
			levelContent.bulletStyle =
				bulletList[oldList.indexOf(levelContent.bulletStyle) % bulletList.length]

			// modify the level node
			change.setNodeByKey(levelNode.key, {
				data: { content: levelContent }
			})

			editor.onChange(change)
		})

		this.forceUpdate()
	}

	render() {
		const type = this.props.node.data.get('content').listStyles.type
		const other = type === 'ordered' ? 'Unordered' : 'Ordered'
		return (
			<div className={'component'}>
				<div className={'text-chunk obojobo-draft--chunks--list pad'} {...this.props.attributes}>
					{this.props.children}
					<button onClick={() => this.toggleType()}>{'Swap to ' + other}</button>
				</div>
			</div>
		)
	}
}

const isType = change => {
	return change.value.blocks.some(block => {
		return !!change.value.document.getClosest(block.key, parent => {
			return parent.type === LIST_NODE
		})
	})
}

const insertNode = change => {
	change
		.insertBlock({
			type: LIST_NODE,
			data: { content: { listStyles: { type: 'unordered' } } }
		})
		.collapseToStartOfNextText()
		.focus()
}

const flattenLevels = (node, currLevel, textGroup, indents) => {
	const indent = node.data.get('content')

	node.nodes.forEach(child => {
		if (child.type === LIST_LEVEL_NODE) {
			flattenLevels(child, currLevel + 1, textGroup, indents)
			return
		}

		const listLine = {
			text: { value: child.text, styleList: [] },
			data: { indent: currLevel }
		}

		child.nodes.forEach(text => {
			TextUtil.slateToOboText(text, listLine)
		})

		textGroup.push(listLine)
	})

	indents['' + currLevel] = indent
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content')
	json.content.textGroup = []
	json.content.listStyles.indents = []

	node.nodes.forEach(level => {
		flattenLevels(level, 0, json.content.textGroup, json.content.listStyles.indents)
	})
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type

	// make sure that indents exists
	if (!node.content.listStyles.indents) node.content.listStyles.indents = {}
	json.data = { content: node.content }

	json.nodes = []

	const type = node.content.listStyles.type
	const bulletList = type === 'unordered' ? unorderedBullets : orderedBullets

	node.content.textGroup.forEach(line => {
		let indent = line.data ? line.data.indent : 0
		let style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }
		let listLine = {
			object: 'block',
			type: LIST_LEVEL_NODE,
			data: { content: style },
			nodes: [
				{
					object: 'block',
					type: LIST_LINE_NODE,
					nodes: [
						{
							object: 'text',
							leaves: TextUtil.parseMarkings(line)
						}
					]
				}
			]
		}

		while (indent > 0) {
			indent--
			style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }

			listLine = {
				object: 'block',
				type: LIST_LEVEL_NODE,
				data: { content: style },
				nodes: [listLine]
			}
		}

		json.nodes.push(listLine)
	})

	return json
}

const plugins = {
	onKeyDown(event, change) {
		// See if any of the selected nodes have a CODE_NODE parent
		const isLine = isType(change)
		if (!isLine) return

		// Delete empty code node
		if (event.key === 'Backspace' || event.key === 'Delete') {
			const last = change.value.endBlock
			let parent
			change.value.blocks.forEach(block => {
				parent = change.value.document.getClosest(block.key, parent => {
					return parent.type === LIST_NODE
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
			change.insertBlock({
				type: LIST_LINE_NODE,
				data: { content: { indent: 1, bullet: '*' } }
			})
			return true
		}

		// Shift Tab
		if (event.key === 'Tab' && event.shiftKey) {
			event.preventDefault()
			change.unwrapBlock(LIST_LEVEL_NODE)
			return true
		}

		// Tab indent
		if (event.key === 'Tab') {
			event.preventDefault()
			let bullet = 'disc'
			let type = 'unordered'

			// get the bullet and type of the closest parent level
			change.value.blocks.forEach(block => {
				const level = change.value.document.getClosest(block.key, parent => {
					return parent.type === LIST_LEVEL_NODE
				})
				const content = level.data.get('content')
				bullet = content.bulletStyle
				type = content.type
			})

			// get the proper bullet for the next level
			const bulletList = type === 'unordered' ? unorderedBullets : orderedBullets
			const nextBullet = bulletList[(bulletList.indexOf(bullet) + 1) % bulletList.length]

			// add in the new level around the lines
			change.wrapBlock({
				type: LIST_LEVEL_NODE,
				data: { content: { type: type, bulletStyle: nextBullet } }
			})
			return true
		}
	},
	renderNode(props) {
		switch (props.node.type) {
			case LIST_NODE:
				return <Node {...props} />
			case LIST_LINE_NODE:
				return <Line {...props} />
			case LIST_LEVEL_NODE:
				return <Level {...props} />
		}
	},
	validateNode(node) {
		if (node.object !== 'block' || node.type !== LIST_NODE) return

		const invalids = node.nodes
			.map((child, i) => {
				const next = node.nodes.get(i + 1)
				if (child.type !== LIST_LEVEL_NODE) return false
				if (!next || next.type !== LIST_LEVEL_NODE) return false
				return next
			})
			.filter(Boolean)

		if (!invalids.size) return

		return change => {
			change.withoutNormalization(c => {
				// Reverse the list to handle consecutive merges, since the earlier nodes
				// will always exist after each merge.
				invalids.reverse().forEach(n => {
					c.mergeNodeByKey(n.key)
				})
			})
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.List': {
				nodes: [{ types: [LIST_LEVEL_NODE], min: 1 }],
				normalize: (change, violation, { node, child, index }) => {
					// find type and bullet style
					const type = node.data.get('content').listStyles.type
					const bulletList = type === 'unordered' ? unorderedBullets : orderedBullets

					switch (violation) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: LIST_LEVEL_NODE,
								data: { content: { type: type, bulletStyle: bulletList[0] } }
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: LIST_LEVEL_NODE,
								data: { content: { type: type, bulletStyle: bulletList[0] } }
							})
						}
					}
				}
			},
			'ObojoboDraft.Chunks.List.Level': {
				nodes: [{ types: [LIST_LEVEL_NODE, LIST_LINE_NODE], min: 1 }],
				parent: { types: [LIST_LEVEL_NODE, LIST_NODE] },
				normalize: (change, violation, { node, child, parent, index }) => {
					switch (violation) {
						case PARENT_TYPE_INVALID: {
							return change.withoutNormalization(c => {
								let childIndex = parent.nodes.indexOf(node)
								node.nodes.forEach(childNode => {
									if (childNode.type === LIST_LINE_NODE) {
										c.setNodeByKey(childNode.key, {
											type: TEXT_NODE,
											data: { content: { indent: 0 } }
										})
									}
									c.moveNodeByKey(childNode.key, parent.key, childIndex)
									childIndex++
								})
								return c.removeNodeByKey(node.key)
							})
						}
						case CHILD_TYPE_INVALID: {
							if (child.object === 'block') {
								return change.setNodeByKey(child.key, LIST_LINE_NODE)
							}

							return change.wrapBlockByKey(child.key, {
								type: LIST_LINE_NODE
							})
						}
						case CHILD_REQUIRED: {
							const block = Block.create(LIST_LINE_NODE)
							return change.insertNodeByKey(node.key, index, block)
						}
					}
				}
			},
			'ObojoboDraft.Chunks.List.Line': {
				nodes: [{ objects: ['text'] }]
			}
		}
	}
}

const List = {
	components: {
		Node,
		Level,
		Line
	},
	helpers: {
		isType,
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default List
