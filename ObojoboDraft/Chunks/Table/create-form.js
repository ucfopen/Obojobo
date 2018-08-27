import React from 'react'

export default class CreateForm {
	constructor() {
		this.state = {
			rows: this.props.rows,
			cols: this.props.cols
		}
	}

	onUpdateRows(event) {
		this.setState({
			rows: ~~event.target.value
		})

		return this.props.onChange(~~event.target.value, this.state.cols)
	}

	onUpdateCols(event) {
		this.setState({
			cols: ~~event.target.value
		})

		return this.props.onChange(this.state.rows, ~~event.target.value)
	}

	render() {
		return (
			<div>
				<label>rows:</label>
				<input type="number" value={this.state.rows} onChange={this.onUpdateRows.bind(this)} />
				<label>cols:</label>
				<input type="number" value={this.state.cols} onChange={this.onUpdateCols.bind(this)} />
			</div>
		)
	}
}
