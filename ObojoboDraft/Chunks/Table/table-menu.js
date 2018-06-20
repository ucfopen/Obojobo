import './table-menu.scss'

export default class TableMenu extends React.Component {
	static get defaultProps() {
		return {
			row: null,
			col: null,
			type: null,
			onMenuCommand() {}
		}
	}

	onClick(cmd, event) {
		event.preventDefault()
		event.stopPropagation()

		this.props.onMenuCommand({
			row: this.props.row,
			col: this.props.col,
			command: cmd
		})

		return false
	}

	render() {
		switch (this.props.type) {
			case 'row':
				return this.renderRow()
			case 'col':
				return this.renderCol()
			default:
				return null
		}
	}

	renderRow() {
		return (
			<div className="obojobo-draft--chunks--table--table-menu row">
				<ul>
					<li className="insert-above" onClick={this.onClick.bind(this, 'insertRowAbove')}>
						Insert 1 row above
					</li>
					<li className="insert-below" onClick={this.onClick.bind(this, 'insertRowBelow')}>
						Insert 1 row below
					</li>
					<li className="delete" onClick={this.onClick.bind(this, 'deleteRow')}>
						Delete this row
					</li>
				</ul>
			</div>
		)
	}

	renderCol() {
		return (
			<div className="obojobo-draft--chunks--table--table-menu col">
				<ul>
					<li className="insert-left" onClick={this.onClick.bind(this, 'insertColLeft')}>
						Insert 1 column left
					</li>
					<li className="insert-right" onClick={this.onClick.bind(this, 'insertColRight')}>
						Insert 1 column right
					</li>
					<li className="delete" onClick={this.onClick.bind(this, 'deleteCol')}>
						Delete this column
					</li>
				</ul>
			</div>
		)
	}
}
