import React from 'react'

import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const TABLE_NODE = 'ObojoboDraft.Chunks.Table'

const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

const Cell = props => {
	if (props.node.data.get('content').header) {
		return <th>{props.children}</th>
	}
	return <td>{props.children}</td>
}

class Row extends React.Component {
	deleteRow() {
		const editor = this.props.editor
		const change = editor.value.change()

		const parent = editor.value.document.getDescendant(this.props.parent.key)
		// get reference to content (which will be mutated)
		const content = parent.data.get('content')
		// mutate
		content.textGroup.numRows--

		if (parent.nodes.get(0).key === this.props.node.key) {
			const sibling = parent.nodes.get(1)

			// If this is the only row in the table, delete the table
			if (!sibling) {
				change.removeNodeByKey(parent.key)
				editor.onChange(change)
				return
			}

			sibling.nodes.forEach(cell => {
				change.setNodeByKey(cell.key, { data: { content: { header: content.header } } })
			})
			change.setNodeByKey(sibling.key, { data: { content: { header: content.header } } })
		}

		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}

	render() {
		return (
			<tr>
				{this.props.children}
				<td className={'delete-cell'}>
					<button onClick={() => this.deleteRow()}>{'X'}</button>
				</td>
			</tr>
		)
	}
}

class Node extends React.Component {
	constructor(props) {
		super(props)
	}

	addRow() {
		const editor = this.props.editor
		const change = editor.value.change()
		// get reference to content (which will be mutated)
		const content = this.props.node.data.get('content')
		// mutate
		content.textGroup.numRows++

		const newRow = Block.create({
			type: TABLE_ROW_NODE,
			data: { content: { header: false } }
		})

		change.insertNodeByKey(this.props.node.key, content.textGroup.numRows - 1, newRow)

		// Insert the cells for the new row, minus the cell that was inserted by normalization
		for (let i = 0; i < content.textGroup.numCols - 1; i++) {
			change.insertNodeByKey(
				newRow.key,
				i,
				Block.create({
					type: TABLE_CELL_NODE,
					data: { content: { header: false } }
				})
			)
		}

		editor.onChange(change)
	}

	addCol() {
		const editor = this.props.editor
		const change = editor.value.change()
		// get reference to content (which will be mutated)
		const content = this.props.node.data.get('content')
		// mutate
		content.textGroup.numCols++

		this.props.node.nodes.forEach(row => {
			const header = row.data.get('content').header
			change.insertNodeByKey(
				row.key,
				content.textGroup.numCols - 1,
				Block.create({
					type: TABLE_CELL_NODE,
					data: { content: { header } }
				})
			)
		})

		editor.onChange(change)
	}

	deleteCol(index) {
		const editor = this.props.editor
		const change = editor.value.change()
		// get reference to content (which will be mutated)
		const content = this.props.node.data.get('content')
		// mutate
		content.textGroup.numCols--

		this.props.node.nodes.forEach(row => {
			const cell = row.nodes.get(index)

			change.removeNodeByKey(cell.key)
		})

		editor.onChange(change)
	}

	renderColDelete() {
		const buttons = new Array(this.props.node.data.get('content').textGroup.numCols)
		buttons.fill('X')

		return (
			<tr>
				{buttons.map((col, index) => {
					return (
						<td key={index} className={'delete-cell'}>
							<button onClick={() => this.deleteCol(index)}>{col}</button>
						</td>
					)
				})}
			</tr>
		)
	}

	toggleHeader() {
		const editor = this.props.editor
		const change = editor.value.change()

		const topRow = this.props.node.nodes.get(0)
		const toggledHeader = !topRow.data.get('content').header

		// change the header flag on the top row
		change.setNodeByKey(topRow.key, {
			data: { content: { header: toggledHeader } }
		})

		// change the header flag on each cell of the top row
		topRow.nodes.forEach(cell => {
			change.setNodeByKey(cell.key, {
				data: { content: { header: toggledHeader } }
			})
		})

		editor.onChange(change)
	}

	render() {
		return (
			<div className={'component'}>
				<div className={'obojobo-draft--chunks--table viewer pad'}>
					<div className={'container'}>
						<table className="view" ref="table" key="table">
							<tbody>
								{this.props.children}
								{this.renderColDelete()}
							</tbody>
						</table>
					</div>
				</div>
				<div className={'table-editor'}>
					<button onClick={() => this.addRow()}>{'Add Row'}</button>
					<button onClick={() => this.addCol()}>{'Add Column'}</button>
					<button onClick={() => this.toggleHeader()}>{'Toggle Header'}</button>
				</div>
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: TABLE_NODE,
			data: { content: { header: true, textGroup: { numRows: 1, numCols: 1 } } }
		})
		.moveToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || { textGroup: {} }
	json.content.textGroup.textGroup = []

	node.nodes.forEach(row => {
		row.nodes.forEach(cell => {
			const codeLine = {
				text: { value: cell.text, styleList: [] }
			}

			let currIndex = 0

			cell.nodes.forEach(text => {
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

			json.content.textGroup.textGroup.push(codeLine)
		})
	})
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
	const cols = node.content.textGroup.numCols
	const hasHeader = node.content.header
	let currRow

	node.content.textGroup.textGroup.forEach((line, index) => {
		if (index % cols === 0) {
			currRow = {
				object: 'block',
				type: TABLE_ROW_NODE,
				data: { content: { header: hasHeader && json.nodes.length === 0 } },
				nodes: []
			}
			json.nodes.push(currRow)
		}

		const tableCell = {
			object: 'block',
			type: TABLE_CELL_NODE,
			data: { content: { header: hasHeader && index < cols } },
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

		currRow.nodes.push(tableCell)
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case TABLE_NODE:
				return <Node {...props} {...props.attributes} />
			case TABLE_ROW_NODE:
				return <Row {...props} {...props.attributes} />
			case TABLE_CELL_NODE:
				return <Cell {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Table': {
				nodes: [
					{
						match: [{ type: TABLE_ROW_NODE }],
						min: 1
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					const header = index === 0 && node.data.get('content').header
					switch (error) {
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: TABLE_ROW_NODE,
								data: { content: { header } }
							})
						}
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: TABLE_ROW_NODE,
								data: { content: { header } }
							})
							return change.insertNodeByKey(node.key, index, block)
						}
					}
				}
			},
			'ObojoboDraft.Chunks.Table.Row': {
				nodes: [
					{
						match: [{ type: TABLE_CELL_NODE }],
						min: 1
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					const header = node.data.get('content').header
					switch (error.code) {
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: TABLE_CELL_NODE,
								data: { content: { header } }
							})
						}
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: TABLE_CELL_NODE,
								data: { content: { header } }
							})
							return change.insertNodeByKey(node.key, index, block)
						}
					}
				}
			}
		}
	}
}

const Table = {
	components: {
		Node,
		Row,
		Cell
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Table
