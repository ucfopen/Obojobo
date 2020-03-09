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

		this.toggleOpen = this.toggleOpen.bind(this)
		this.addRowAbove = this.addRowAbove.bind(this)
		this.addRowBelow = this.addRowBelow.bind(this)
		this.addColLeft = this.addColLeft.bind(this)
		this.addColRight = this.addColRight.bind(this)
		this.deleteRow = this.deleteRow.bind(this)
		this.deleteCol = this.deleteCol.bind(this)
	}

	toggleOpen() {
		this.setState(prevState => ({ isOpen: !prevState.isOpen }))
	}

	addRowAbove() {
		const editor = this.props.editor

		const doc = editor.value.document
		const tableParent = doc.getClosest(this.props.node.key, node => node.type === TABLE_NODE)
		const rowIndex = tableParent.getPath(this.props.parent.key).get(0)
		const isHeader = this.props.parent.data.get('content').header

		const newRow = Block.create({
			type: TABLE_ROW_NODE,
			data: {
				content: {
					header: rowIndex === 1 && isHeader,
					numCols: tableParent.data.get('content').numCols
				}
			}
		})

		editor.insertNodeByKey(tableParent.key, rowIndex, newRow)

		if (isHeader) {
			const noHeader = { header: false }
			this.props.parent.nodes.forEach(cell => {
				editor.setNodeByKey(cell.key, {
					data: { content: { ...cell.data.get('content'), ...noHeader } }
				})
			})
			editor.setNodeByKey(this.props.parent.key, {
				data: { content: { ...this.props.parent.data.get('content'), ...noHeader } }
			})
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

		return editor.withoutNormalizing(() => {
			const tableContent = tableParent.data.get('content')
			editor.setNodeByKey(tableParent.key, {
				data: {
					content: {
						...tableParent.data.get('content'),
						numCols: tableContent.numCols + 1
					}
				}
			})

			tableParent.nodes.forEach(row => {
				if (row.type === 'ObojoboDraft.Chunks.Table.Caption') return // Table Caption
				const newCell = Block.create({
					type: TABLE_CELL_NODE,
					data: { content: { header: row.data.get('content').header } }
				})

				editor.setNodeByKey(row.key, {
					data: {
						content: {
							...row.data.get('content'),
							numCols: tableContent.numCols + 1
						}
					}
				})
				editor.insertNodeByKey(row.key, colIndex, newCell)
			})
		})
	}

	addColRight() {
		const editor = this.props.editor
		const doc = editor.value.document
		const tableParent = doc.getClosest(this.props.node.key, node => node.type === TABLE_NODE)
		const colIndex = this.props.parent.getPath(this.props.node.key).get(0)

		return editor.withoutNormalizing(() => {
			const tableContent = tableParent.data.get('content')
			editor.setNodeByKey(tableParent.key, {
				data: {
					content: {
						...tableParent.data.get('content'),
						numCols: tableContent.numCols + 1
					}
				}
			})

			tableParent.nodes.forEach(row => {
				if (row.type === 'ObojoboDraft.Chunks.Table.Caption') return // Table Caption

				const newCell = Block.create({
					type: TABLE_CELL_NODE,
					data: { content: { header: row.data.get('content').header } }
				})

				editor.setNodeByKey(row.key, {
					data: {
						content: {
							...row.data.get('content'),
							numCols: tableContent.numCols + 1
						}
					}
				})
				editor.insertNodeByKey(row.key, colIndex + 1, newCell)
			})
		})
	}

	deleteRow() {
		const editor = this.props.editor
		const doc = editor.value.document
		const tableParent = doc.getClosest(this.props.node.key, node => node.type === TABLE_NODE)
		const rowIndex = tableParent.getPath(this.props.parent.key).get(0)

		if (rowIndex === 0) {
			const sibling = tableParent.nodes.get(1)

			// If this is the only row in the table, delete the table
			if (!sibling) {
				return editor.removeNodeByKey(tableParent.key)
			}

			// Set sibling as new header

			const yesHeader = { header: true }
			sibling.nodes.forEach(cell => {
				editor.setNodeByKey(cell.key, {
					data: { content: { ...cell.data.get('content'), ...yesHeader } }
				})
			})
			editor.setNodeByKey(sibling.key, {
				data: { content: { ...sibling.data.get('content'), ...yesHeader } }
			})
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

		return editor.withoutNormalizing(() => {
			const tableContent = tableParent.data.get('content')
			editor.setNodeByKey(tableParent.key, {
				data: {
					content: {
						...tableParent.data.get('content'),
						numCols: tableContent.numCols - 1
					}
				}
			})

			tableParent.nodes.forEach(row => {
				const cell = row.nodes.get(colIndex)
				editor.setNodeByKey(row.key, {
					data: {
						content: {
							...row.data.get('content'),
							numCols: tableContent.numCols - 1
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
				<button className={isOrNot(this.state.isOpen, 'open')} onClick={this.toggleOpen}>
					{'⌃'}
				</button>
				<div className={'drop-content-cell ' + isOrNot(this.state.isOpen, 'open')}>
					<button onClick={this.addRowAbove}>Insert Row Above</button>
					<button onClick={this.addRowBelow}>Insert Row Below</button>
					<button onClick={this.addColLeft}>Insert Column Left</button>
					<button onClick={this.addColRight}>Insert Column Right</button>
					<button onClick={this.deleteRow}>Delete Row</button>
					<button onClick={this.deleteCol}>Delete Column</button>
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
		return (
			<td>
				{this.props.isSelected ? this.renderDropdown() : null}
				{this.props.children}
			</td>
		)
	}
}

export default Cell
