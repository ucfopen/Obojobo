import React from 'react'

import SimpleDialog from './simple-dialog'

class Prompt extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			text: ""
		}
	}

	onKeyUp(event) {
		if (event.keyCode === 27) {
			console.log("escape")
		}

		if (event.key === "Enter") {
			console.log("Enter")
		}
	}

	handleTextChange(event) {
		const text = event.target.value

		return this.setState({text})
	}

	render() {
		return (
			<SimpleDialog
				cancelOk
				title={this.props.title}
				onConfirm={() => this.props.onConfirm(this.state.text)}>
				<form>
					<label htmlFor="promptInput">{this.props.message}</label>
					<input
						type="text"
						id="promptInput"
						value={this.props.value}
						onChange={event => this.handleTextChange(event)}/>
				</form>
			</SimpleDialog>
		)
	}
}

export default Prompt
