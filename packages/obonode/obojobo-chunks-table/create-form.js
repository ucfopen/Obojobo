import React from 'react'

export default class CreateForm {
	constructor() {
		this.state = {
			rows: this.props.rows,
			cols: this.props.cols
		}

		this.onUpdateRows = this.onUpdateRows.bind(this)
	}

	onUpdateRows(event) {
		this.setState({
			rows: ~~event.target.updated
		})

		return this.props.onChange(~~event.target.updated, this.state.cols)
	}

	onUpdateCols(event) {
		this.setState({
			cols: ~~event.target.updated
		})

		return this.props.onChange(this.state.rows, ~~event.target.updated)
	}

	render() {
		return (
			<div>
				<label>rows:</label>
				<input type="number" updated={this.state.rows} onChange={this.onUpdateRows} />
				<label>cols:</label>
				<input type="number" updated={this.state.cols} onChange={this.onUpdateCols} />
			</div>
		)
	}
}
