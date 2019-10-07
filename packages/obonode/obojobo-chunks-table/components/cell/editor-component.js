import '../../viewer-component.scss'

import React from 'react'
import { Block } from 'slate'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

class Cell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isOpen: false
		}

		// this.handleClick = this.handleClick.bind(this)
		this.toggleOpen = this.toggleOpen.bind(this)
		this.setOpen = this.setOpen.bind(this)
	}

	toggleOpen() {
		this.setState(prevState => ({ isOpen: !prevState.isOpen}))
	}

	setOpen(isOpen) {
		this.setState({ isOpen })
	}

	addRowAbove() {
		const editor = this.props.editor

		const doc = editor.value.document
		const tableParent = doc.getClosest(this.props.node.key, node => node.type === TABLE_NODE)
		const rowIndex = tableParent.getPath(this.props.parent.key).get(0)
		const isHeader = this.props.parent.data.get('content').header

		const newRow = Block.create({
			type: TABLE_ROW_NODE,
			data: { content: { header: rowIndex === 0 && isHeader, numCols: tableParent.data.get('content').numCols } }
		})

		editor.insertNodeByKey(tableParent.key, rowIndex, newRow)

		if(isHeader) {
			const noHeader = { header: false }
			this.props.parent.nodes.forEach(cell => {
				editor.setNodeByKey(cell.key, { data: { content: { ...cell.data.get('content'), ...noHeader } } })
			})
			editor.setNodeByKey(this.props.parent.key, { data: { content: { ...this.props.parent.data.get('content'), ...noHeader } } })
		}
	}

	addRowBelow() {
		const editor = this.props.editor

		const doc = editor.value.document
		const tableParent = doc.getClosest(this.props.node.key, node => node.type === TABLE_NODE)
		const rowIndex = tableParent.getPath(this.props.parent.key).get(0)

		const newRow = Block.create({
			type: TABLE_ROW_NODE,
			data: { content: { header: false, numCols: tableParent.data.get('content').numCols } }
		})

		editor.insertNodeByKey(tableParent.key, rowIndex + 1, newRow)
	}

	addColLeft() {
		const editor = this.props.editor
		const doc = editor.value.document
		const tableParent = doc.getClosest(this.props.node.key, node => node.type === TABLE_NODE)
		const colIndex = this.props.parent.getPath(this.props.node.key).get(0)

		tableParent.nodes.forEach(row => {
			const newCell = Block.create({
				type: TABLE_CELL_NODE,
				data: { content: { header: row.data.get('content').header } }
			})
			return editor.insertNodeByKey(row.key, colIndex, newCell)
		})
	}

	addColRight() {
		const editor = this.props.editor
		const doc = editor.value.document
		const tableParent = doc.getClosest(this.props.node.key, node => node.type === TABLE_NODE)
		const colIndex = this.props.parent.getPath(this.props.node.key).get(0)

		tableParent.nodes.forEach(row => {
			const newCell = Block.create({
				type: TABLE_CELL_NODE,
				data: { content: { header: row.data.get('content').header } }
			})
			return editor.insertNodeByKey(row.key, colIndex + 1, newCell)
		})
	}

	deleteRow() {
		const editor = this.props.editor
		const doc = editor.value.document
		const tableParent = doc.getClosest(this.props.node.key, node => node.type === TABLE_NODE)
		const rowIndex = tableParent.getPath(this.props.parent.key).get(0)
		const isHeader = this.props.parent.data.get('content').header

		if (rowIndex === 0) {
			const sibling = tableParent.nodes.get(1)

			// If this is the only row in the table, delete the table
			if (!sibling) {
				return editor.removeNodeByKey(tableParent.key)
			}

			// Set sibling as new header
			sibling.nodes.forEach(cell => {
				editor.setNodeByKey(cell.key, { data: { content: { header: isHeader } } })
			})
			editor.setNodeByKey(sibling.key, { data: { content: { header: isHeader } } })
		}

		return this.props.editor.removeNodeByKey(this.props.parent.key)
	}

	deleteCol() {
		const editor = this.props.editor
		const doc = editor.value.document
		const tableParent = doc.getClosest(this.props.node.key, node => node.type === TABLE_NODE)
		const colIndex = this.props.parent.getPath(this.props.node.key).get(0)

		// If there is only one column, delete the whole table
		if (this.props.parent.nodes.size === 1) {
			return editor.removeNodeByKey(tableParent.key)
		}

		tableParent.nodes.forEach(row => {
			const cell = row.nodes.get(colIndex)
			return editor.withoutNormalizing(() => {
				editor.setNodeByKey(row.key, { 
					data: { 
						content: {
							...row.data.get('content'),
							numCols: row.nodes.size - 1
						} 

					} 
				})
				editor.removeNodeByKey(cell.key)
			})
		})
	}

	renderDropdown() {
		return (
			<div className="dropdown-cell" contentEditable={false}>
					<button onClick={this.toggleOpen}>{(this.state.isOpen ? '▲' : '▼')}</button>
					<div className={'drop-content-cell ' + isOrNot(this.state.isOpen, 'open')}>
						<button onClick={this.addRowAbove.bind(this)}>
							Insert Row Above
						</button>
						<button onClick={this.addRowBelow.bind(this)}>
							Insert Row Below
						</button>
						<button onClick={this.addColLeft.bind(this)}>
							Insert Column Left
						</button>
						<button onClick={this.addColRight.bind(this)}>
							Insert Column Right
						</button>
						<button onClick={this.deleteRow.bind(this)}>
							Delete Row
						</button>
						<button onClick={this.deleteCol.bind(this)}>
							Delete Column
						</button>
					</div>
				</div>
		)
	}

	render() {
		if (this.props.node.data.get('content').header) {
			return (
				<th>
					{this.props.isSelected ? this.renderDropdown() : null}
					{this.props.children}
				</th>
			)
		}
		return <td>{this.props.isSelected ? this.renderDropdown() : null}{this.props.children}</td>
	}
}

export default Cell
