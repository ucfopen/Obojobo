import '../../viewer-component.scss'

import React from 'react'
import { Transforms, Node, Editor, Path } from 'slate'
import { ReactEditor } from 'slate-react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

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
		this.returnFocusOnShiftTab = this.returnFocusOnShiftTab.bind(this)
	}

	toggleOpen() {
		this.setState(prevState => ({ isOpen: !prevState.isOpen }))
	}

	addRowAbove() {
		const editor = this.props.editor

		const cellPath = ReactEditor.findPath(editor, this.props.element)
		const [rowParent, rowPath] = Editor.parent(editor, cellPath)
		const [tableParent] = Editor.parent(editor, rowPath)
		const rowIndex = rowPath[rowPath.length - 1]
		const isHeader = tableParent.content.header

		// Remove any existing header marks on the current row
		if (isHeader) {
			const noHeader = { header: false }
			for (const [sibling, siblingPath] of Node.children(editor, rowPath)) {
				Transforms.setNodes(
					editor,
					{
						content: { ...sibling.content, ...noHeader }
					},
					{ at: siblingPath }
				)
			}

			Transforms.setNodes(
				editor,
				{
					content: { ...rowParent.content, ...noHeader }
				},
				{ at: rowPath }
			)
		}

		// Add in the new row once the existing row is finished with its updates
		Transforms.insertNodes(
			editor,
			{
				type: TABLE_NODE,
				subtype: TABLE_ROW_NODE,
				content: {
					header: rowIndex === 0 && isHeader,
					numCols: tableParent.content.numCols
				},
				children: [{ text: '' }]
			},
			{ at: rowPath }
		)
	}

	addRowBelow() {
		const editor = this.props.editor

		const cellPath = ReactEditor.findPath(editor, this.props.element)
		const [, rowPath] = Editor.parent(editor, cellPath)
		const [tableParent] = Editor.parent(editor, rowPath)

		Transforms.insertNodes(
			editor,
			{
				type: TABLE_NODE,
				subtype: TABLE_ROW_NODE,
				content: {
					header: false,
					numCols: tableParent.content.numCols
				},
				children: [{ text: '' }]
			},
			{ at: Path.next(rowPath) }
		)
	}

	addColLeft() {
		const editor = this.props.editor

		const cellPath = ReactEditor.findPath(editor, this.props.element)
		const [, rowPath] = Editor.parent(editor, cellPath)
		const [tableParent, tablePath] = Editor.parent(editor, rowPath)
		const colIndex = cellPath[cellPath.length - 1]

		// Do all the edits before normalizing to prevent the new column from being
		// added on to the end of every row
		return Editor.withoutNormalizing(editor, () => {
			const colIncrease = { numCols: tableParent.content.numCols + 1 }
			Transforms.setNodes(
				editor,
				{
					content: { ...tableParent.content, ...colIncrease }
				},
				{ at: tablePath }
			)

			for (const [row, path] of Node.children(editor, tablePath)) {
				Transforms.setNodes(
					editor,
					{
						content: { ...row.content, ...colIncrease }
					},
					{ at: path }
				)

				Transforms.insertNodes(
					editor,
					{
						type: TABLE_NODE,
						subtype: TABLE_CELL_NODE,
						content: {
							header: row.content.header
						},
						children: [{ text: '' }]
					},
					{ at: path.concat(colIndex) }
				)
			}
		})
	}

	addColRight() {
		const editor = this.props.editor

		const cellPath = ReactEditor.findPath(editor, this.props.element)
		const [, rowPath] = Editor.parent(editor, cellPath)
		const [tableParent, tablePath] = Editor.parent(editor, rowPath)
		const colIndex = cellPath[cellPath.length - 1]

		// Do all the edits before normalizing to prevent the new column from being
		// added on to the end of every row
		return Editor.withoutNormalizing(editor, () => {
			const colIncrease = { numCols: tableParent.content.numCols + 1 }
			Transforms.setNodes(
				editor,
				{
					content: { ...tableParent.content, ...colIncrease }
				},
				{ at: tablePath }
			)

			for (const [row, path] of Node.children(editor, tablePath)) {
				Transforms.setNodes(
					editor,
					{
						content: { ...row.content, ...colIncrease }
					},
					{ at: path }
				)

				Transforms.insertNodes(
					editor,
					{
						type: TABLE_NODE,
						subtype: TABLE_CELL_NODE,
						content: {
							header: row.content.header
						},
						children: [{ text: '' }]
					},
					{ at: path.concat(colIndex + 1) }
				)
			}
		})
	}

	deleteRow() {
		const editor = this.props.editor

		const cellPath = ReactEditor.findPath(editor, this.props.element)
		const [, rowPath] = Editor.parent(editor, cellPath)
		const [tableParent, tablePath] = Editor.parent(editor, rowPath)
		const rowIndex = rowPath[rowPath.length - 1]

		if (rowIndex === 0) {
			// If this is the only row in the table, delete the table
			if (tableParent.children.length === 1) {
				return Transforms.removeNodes(editor, { at: tablePath })
			}

			// Set sibling as new header
			const sibling = tableParent.children[1]
			const siblingPath = tablePath.concat(rowIndex + 1)
			const header = { header: tableParent.content.header }

			for (const [child, childPath] of Node.children(editor, siblingPath)) {
				Transforms.setNodes(
					editor,
					{
						content: { ...child.content, ...header }
					},
					{ at: childPath }
				)
			}

			Transforms.setNodes(
				editor,
				{
					content: { ...sibling.content, ...header }
				},
				{ at: siblingPath }
			)
		}

		Transforms.setNodes(
			editor,
			{
				content: { ...tableParent.content, numRows: tableParent.content.numRows - 1 }
			},
			{ at: tablePath }
		)

		return Transforms.removeNodes(editor, { at: rowPath })
	}

	deleteCol() {
		const editor = this.props.editor

		const cellPath = ReactEditor.findPath(editor, this.props.element)
		const [rowParent, rowPath] = Editor.parent(editor, cellPath)
		const [tableParent, tablePath] = Editor.parent(editor, rowPath)
		const colIndex = cellPath[cellPath.length - 1]

		// If there is only one column, delete the whole table
		if (rowParent.children.length === 1) {
			return Transforms.removeNodes(editor, { at: tablePath })
		}

		return Editor.withoutNormalizing(editor, () => {
			const colDecrease = { numCols: tableParent.content.numCols - 1 }
			Transforms.setNodes(
				editor,
				{
					content: { ...tableParent.content, ...colDecrease }
				},
				{ at: tablePath }
			)

			for (const [row, path] of Node.children(editor, tablePath)) {
				Transforms.setNodes(
					editor,
					{
						content: { ...row.content, ...colDecrease }
					},
					{ at: path }
				)

				Transforms.removeNodes(editor, { at: path.concat(colIndex) })
			}
		})
	}

	returnFocusOnShiftTab(event) {
		if (event.key === 'Tab' && event.shiftKey) {
			event.preventDefault()
			this.setState({ isOpen: false })
			return ReactEditor.focus(this.props.editor)
		}
	}

	renderDropdown() {
		return (
			<div className="dropdown-cell" contentEditable={false}>
				<button
					className={isOrNot(this.state.isOpen, 'open')}
					onClick={this.toggleOpen}
					onKeyDown={this.returnFocusOnShiftTab}
				>
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
		if (this.props.element.content.header) {
			return (
				<th>
					{this.props.selected ? this.renderDropdown() : null}
					{this.props.children}
				</th>
			)
		}
		return (
			<td>
				{this.props.selected ? this.renderDropdown() : null}
				{this.props.children}
			</td>
		)
	}
}

export default withSlateWrapper(Cell)
