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
		this.setState({ id: this.props.data.id, description: this.props.data.description })
	}

	render() {
		return (
			<SimpleDialog
				title="Objective"
				onCancel={this.props.onCancel}
				onConfirm={() => this.props.onConfirm(this.state.id, this.state.description)}
			>
				<div className="objective-container">
					<label htmlFor="objective-input">Objective:</label>
					<input
						type="text"
						placeholder="1.0 Add your objective here"
						value={this.state.description}
						id="objective-input"
						className="objective-input"
						onChange={event => this.setState({ description: event.target.value })}
					/>
				</div>
				<div className="objective-tips">
					<p>* Tips for writing an objective in Obojobo</p>
					<ul>
						<li>Add numeric value to the objective</li>
						<li>Start your objective with a verb</li>
						<li>Limit your objective text</li>
					</ul>
				</div>
			</SimpleDialog>
		)
	}
}

export default ObjectiveEdit
