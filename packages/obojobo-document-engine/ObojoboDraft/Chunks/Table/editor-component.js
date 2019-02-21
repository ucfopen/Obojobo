import React from 'react'
import { Block } from 'slate'

const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

class Table extends React.Component {
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
			<div className={'obojobo-draft--chunks--table viewer pad'}>
				<div className={'container'}>
					<table className="view" key="table">
						<tbody>
							{this.props.children}
							{this.renderColDelete()}
						</tbody>
					</table>
				</div>
				<div className={'table-editor-buttons'}>
					<button onClick={() => this.addRow()}>{'Add Row'}</button>
					<button onClick={() => this.addCol()}>{'Add Column'}</button>
					<button onClick={() => this.toggleHeader()}>{'Toggle Header'}</button>
				</div>
			</div>
		)
	}
}

export default Table
