import React from 'react'

import SimpleDialog from './simple-dialog'

import './prompt.scss'

class Prompt extends React.Component {
	constructor(props) {
		super(props)

		this.inputRef = React.createRef()

		this.state = {
			text: this.props.value || ''
		}
	}

	componentDidMount() {
		this.inputRef.current.focus()
		this.inputRef.current.select()
	}

	handleTextChange(event) {
		const text = event.target.value

		return this.setState({ text })
	}

	focusOnFirstElement() {
		this.inputRef.current.focus()
		this.inputRef.current.select()
	}

	onKeyDown(event) {
		if (event.key === 'Enter') {
			event.preventDefault()
			this.props.onConfirm(this.state.text)
		}
	}

	render() {
		return (
			<SimpleDialog
				cancelOk
				title={this.props.title}
				onConfirm={() => this.props.onConfirm(this.state.text)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
			>
				<div className="prompt">
					<label htmlFor="common--components--modal--prompt--input">{this.props.message}</label>
					<input
						type="text"
						id="common--components--modal--prompt--input"
						value={this.state.text}
						onChange={this.handleTextChange.bind(this)}
						ref={this.inputRef}
						size="50"
						onKeyDown={this.onKeyDown.bind(this)}
					/>
				</div>
			</SimpleDialog>
		)
	}
}

export default Prompt
