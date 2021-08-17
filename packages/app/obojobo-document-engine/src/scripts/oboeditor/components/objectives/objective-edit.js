import './objective-input.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'

const { SimpleDialog } = Common.components.modal

class ObjectiveEdit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			id: '',
			label: '',
			description: '',
			error: ''
		}
	}

	componentDidMount() {
		this.setState({
			id: this.props.data.id,
			label: this.props.data.label,
			description: this.props.data.description
		})
	}
	handleConfirm() {
		const { label, description } = this.state

		if (label === '' && description === '') {
			this.setState({
				error: 'Please enter a label and a description'
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
				error: 'Please enter a description'
			})
			return
		}

		// all good
		this.props.onConfirm(this.state)
	}

	render() {
		return (
			<SimpleDialog
				title="Edit Objective"
				onCancel={this.props.onCancel}
				onConfirm={this.handleConfirm.bind(this)}
			>
				<div className="objective-container">
					<div>
						<label htmlFor="objective-label" style={{marginRight:'1.5em'}}>Label:</label>
						<input
							type="text"
							placeholder="This objective's label (1.2, A, B, etc...) "
							value={this.state.label}
							id="objective-label"
							className="objective-input"
							onChange={event => {
								this.setState({ label: event.target.value })
							}}
						/>
					</div>
					<div>
						<label htmlFor="objective-input" style={{marginRight:'1.5em'}}>Objective:</label>
						<input
							type="text"
							placeholder="Type your objective here..."
							value={this.state.description}
							id="objective-input"
							className="objective-input--objective"
							onChange={event => this.setState({ description: event.target.value })}
						/>
					</div>
					<span className="objective-error">{this.state.error}</span>
				</div>
			</SimpleDialog>
		)
	}
}

export default ObjectiveEdit