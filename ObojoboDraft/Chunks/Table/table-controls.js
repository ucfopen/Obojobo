import './tablecontrols.scss'

import TableMenu from './table-menu'

import insertButton from 'svg-url-loader?noquotes!./assets/table-insert.svg'

import Common from 'Common'

export default class TableControls extends React.Component {
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
		let el = this.props.chunk.getDomEl()
		let bbox = this.refs.self.getBoundingClientRect()

		let cellBbox = (() => {
			switch (type) {
				case 'row':
					let cell = el.querySelector(`.row-${position}.col-0`)
					return cell.getBoundingClientRect()
				case 'col':
					cell = el.querySelector(`.row-0.col-${position}`)
					return cell.getBoundingClientRect()
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
		let { refs } = this
		let { getCellPosition } = this

		__range__(0, this.props.chunk.modelState.textGroup.numRows, false).map(function(index) {
			let el = ReactDOM.findDOMNode(refs[`menu_row_${index}`])
			let pos = getCellPosition('row', index)

			el.style.left = `${pos.left}px`
			return (el.style.top = `${pos.top}px`)
		})

		return __range__(0, this.props.chunk.modelState.textGroup.numCols, false).map(function(index) {
			let el = ReactDOM.findDOMNode(refs[`menu_col_${index}`])
			let pos = getCellPosition('col', index)

			el.style.left = `${pos.left}px`
			return (el.style.top = `${pos.top}px`)
		})
	}

	render() {
		let { onTableMenuCommand } = this.props
		let bgInsert = Common.util.getBackgroundImage(insertButton)
		let { getCellPosition } = this

		let rows = __range__(0, this.props.chunk.modelState.textGroup.numRows, false).map(index => (
			<TableMenu
				onMenuCommand={onTableMenuCommand}
				type="row"
				row={index}
				ref={`menu_row_${index}`}
			/>
		))

		let cols = __range__(0, this.props.chunk.modelState.textGroup.numCols, false).map(index => (
			<TableMenu
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
				<button
					className="add-row"
					key="0"
					onMouseDown={this.addRow.bind(this)}
					style={{
						backgroundImage: bgInsert
					}}
				>
					Add a row
				</button>
				<button
					className="add-col"
					key="1"
					onMouseDown={this.addCol.bind(this)}
					style={{
						backgroundImage: bgInsert
					}}
				>
					Add a column
				</button>
			</div>
		)
	}
}

function __range__(left, right, inclusive) {
	let range = []
	let ascending = left < right
	let end = !inclusive ? right : ascending ? right + 1 : right - 1
	for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
		range.push(i)
	}
	return range
}
