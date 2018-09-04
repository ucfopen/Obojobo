import './table-controls.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import TableMenu from './table-menu'

class TableControls extends React.Component {
	addRow(event) {
		event.preventDefault()
		event.stopPropagation()

		return this.props.addRow()
	}

	addCol(event) {
		event.preventDefault()
		event.stopPropagation()

		return this.props.addCol()
	}

	getCellPosition(type, position) {
		const el = this.props.chunk.getDomEl()
		const bbox = this.refs.self.getBoundingClientRect()

		const cellBbox = (() => {
			switch (type) {
				case 'row':
					return el.querySelector(`.row-${position}.col-0`).getBoundingClientRect()
				case 'col':
					return el.querySelector(`.row-0.col-${position}`).getBoundingClientRect()
			}
		})()

		return {
			left: cellBbox.left - bbox.left,
			top: cellBbox.top - bbox.top,
			right: cellBbox.right - bbox.right,
			bottom: cellBbox.bottom - bbox.bottom,
			width: cellBbox.width,
			height: cellBbox.height
		}
	}

	componentDidMount() {
		return this.positionMenus()
	}

	componentDidUpdate() {
		return this.positionMenus()
	}

	positionMenus() {
		const { refs } = this
		const { getCellPosition } = this

		__range__(0, this.props.chunk.modelState.textGroup.numRows, false).map(function(index) {
			const el = ReactDOM.findDOMNode(refs[`menu_row_${index}`])
			const pos = getCellPosition('row', index)

			el.style.left = `${pos.left}px`
			return (el.style.top = `${pos.top}px`)
		})

		return __range__(0, this.props.chunk.modelState.textGroup.numCols, false).map(function(index) {
			const el = ReactDOM.findDOMNode(refs[`menu_col_${index}`])
			const pos = getCellPosition('col', index)

			el.style.left = `${pos.left}px`
			return (el.style.top = `${pos.top}px`)
		})
	}

	render() {
		const { onTableMenuCommand } = this.props

		const rows = __range__(0, this.props.chunk.modelState.textGroup.numRows, false).map(index => (
			<TableMenu
				key={index}
				onMenuCommand={onTableMenuCommand}
				type="row"
				row={index}
				ref={`menu_row_${index}`}
			/>
		))

		const cols = __range__(0, this.props.chunk.modelState.textGroup.numCols, false).map(index => (
			<TableMenu
				key={index}
				onMenuCommand={onTableMenuCommand}
				type="col"
				col={index}
				ref={`menu_col_${index}`}
			/>
		))

		return (
			<div className="obojobo-draft--chunks--table--table-controls" ref="self">
				<div className="rows">{rows}</div>
				<div className="cols">{cols}</div>
				<button className="add-row" key="0" onMouseDown={this.addRow.bind(this)}>
					Add a row
				</button>
				<button className="add-col" key="1" onMouseDown={this.addCol.bind(this)}>
					Add a column
				</button>
			</div>
		)
	}
}

function __range__(left, right, inclusive) {
	const range = []
	const ascending = left < right
	// eslint-disable-next-line no-nested-ternary
	const end = !inclusive ? right : ascending ? right + 1 : right - 1
	for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
		range.push(i)
	}
	return range
}

export default TableControls
