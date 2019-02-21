import React from 'react'

import SimpleDialog from './simple-dialog'

import './prompt.scss'

class Prompt extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			text: this.props.value || ''
		}
	}

	componentDidMount() {
		this.refs.input.focus()
		this.refs.input.select()
	}

	handleTextChange(event) {
		const text = event.target.value

		return this.setState({ text })
	}

	focusOnFirstElement() {
		this.refs.input.focus()
		this.refs.input.select()
	}

	render() {
		return (
			<SimpleDialog
				cancelOk
				title={this.props.title}
				onConfirm={() => this.props.onConfirm(this.state.text)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
				className="prompt"
			>
				<label htmlFor="common--components--modal--prompt--input">{this.props.message}</label>
				<input
					type="text"
					id="common--components--modal--prompt--input"
					value={this.state.text}
					onChange={this.handleTextChange.bind(this)}
					ref={'input'}
					size="50"
				/>
			</SimpleDialog>
		)
	}
}

export default Prompt
