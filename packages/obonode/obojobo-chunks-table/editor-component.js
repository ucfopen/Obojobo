import './viewer-component.scss'
import './editor-component.scss'

import { Block } from 'slate'
import React from 'react'

const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'

class Table extends React.Component {
	constructor(props) {
		super(props)
	}

	addRow() {
		const editor = this.props.editor
		const content = this.props.node.data.get('content')

		const newRow = Block.create({
			type: TABLE_ROW_NODE,
			data: { content: { header: false, numCols: content.numCols } }
		})

		editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newRow)
	}

	addCol() {
		const editor = this.props.editor
		const content = this.props.node.data.get('content')

		content.numCols++

		editor.setNodeByKey(this.props.node.key, { data: { content }})

		this.props.node.nodes.forEach(row => {
			const rowContent = row.data.get('content')
			rowContent.numCols = content.numCols

			return editor.setNodeByKey(
				row.key,
				{ data: { content: rowContent }}
			)
		})
	}

	deleteCol(index) {
		const editor = this.props.editor

		this.props.node.nodes.forEach(row => {
			const cell = row.nodes.get(index)

			return editor.removeNodeByKey(cell.key)
		})
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

		const topRow = this.props.node.nodes.get(0)
		const content = topRow.data.get('content')
		const toggledHeader = !content.header

		content.header = toggledHeader

		// change the header flag on the top row
		editor.setNodeByKey(topRow.key, {
			data: { content }
		})

		// change the header flag on each cell of the top row
		topRow.nodes.forEach(cell => {
			return editor.setNodeByKey(cell.key, {
				data: { content: { header: toggledHeader } }
			})
		})
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
