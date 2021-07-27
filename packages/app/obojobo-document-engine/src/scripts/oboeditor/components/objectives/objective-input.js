import './objective-input.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'

const { SimpleDialog } = Common.components.modal

class ObjectiveInput extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<SimpleDialog
				title="Objective"
				onCancel={this.props.onCancel}
				onConfirm={this.props.onConfirm}
			>
				<div className="objective-container">
					<label htmlFor="objective-input">Objective:</label>
					<input
						type="text"
						placeholder="1.0 Add your objective here"
						id="objective-input"
						className="objective-input"
						onChange={this.props.handleObjectiveInput}
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

export default ObjectiveInput
