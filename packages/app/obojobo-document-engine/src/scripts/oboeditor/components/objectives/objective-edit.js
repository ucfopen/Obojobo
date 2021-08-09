import './objective-input.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'

const { SimpleDialog } = Common.components.modal

class ObjectiveEdit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			id: null,
			description: null
		}
	}

	componentDidMount() {
		this.setState({
			id: this.props.data.id,
			label: this.props.data.label,
			description: this.props.data.description
		})
	}

	render() {
		return (
			<SimpleDialog
				title="Objective"
				onCancel={this.props.onCancel}
				onConfirm={() => this.props.onConfirm(this.state)}
			>
				<div className="objective-container">
					<div>
						<label htmlFor="objective-label">Label:</label>
						<input
							type="text"
							placeholder="Add label as 1.0, 1.2, A, B, etc"
							value={this.state.label}
							id="objective-label"
							className="objective-input"
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
							className="objective-input"
							onChange={event => this.setState({ description: event.target.value })}
						/>
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default ObjectiveEdit