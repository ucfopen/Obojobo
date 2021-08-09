import './objective-input.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'

const { SimpleDialog } = Common.components.modal

class ObjectiveInput extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			label: '',
			description: '',
			error: ''
		}
	}
	handleConfirm() {
		const { label, description } = this.state

		if (label === '' && description === '') {
			this.setState({
				error: 'Please enter a label and a objective'
			})
			return
		}

		if (label === '' && description !== '') {
			this.setState({
				error: 'Please enter a label'
			})
			return
		}

		if (label !== '' && description === '') {
			this.setState({
				error: 'Please enter a objective'
			})
			return
		}

		// all good
		this.props.onConfirm(this.state)
	}
	render() {
		return (
			<SimpleDialog
				title="Objective"
				onCancel={this.props.onCancel}
				onConfirm={this.handleConfirm.bind(this)}
			>
				<div className="objective-container">
					<div>
						<label htmlFor="objective-label">Label:</label>
						<input
							type="text"
							placeholder="Add label as 1.0, 1.2, A, B, etc.,"
							value={this.state.label}
							id="objective-label"
							className={
								'objective-input' +
								(this.state.label === '' && this.state.error !== ''
									? ' objective-input--error'
									: '')
							}
							onChange={event => {
								this.setState({ label: event.target.value })
							}}
						/>
					</div>
					<div>
						<label htmlFor="objective-input">Objective:</label>
						<input
							type="text"
							placeholder="Add objective here"
							value={this.state.description}
							id="objective-input"
							className={
								'objective-input' +
								(this.state.description === '' && this.state.error !== ''
									? ' objective-input--error'
									: '')
							}
							onChange={event => this.setState({ description: event.target.value })}
						/>
					</div>
					<span className="objective-error">{this.state.error}</span>
				</div>
			</SimpleDialog>
		)
	}
}

export default ObjectiveInput