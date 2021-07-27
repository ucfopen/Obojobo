import './objective-item.scss'
import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

class ObjectiveItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editMode: false,
			objectiveId: null,
			objectiveDescription: '',
			objectiveLetter: ''
		}

		this.sendData = this.sendData.bind(this)
		this.deleteObjective = this.deleteObjective.bind(this)
	}

	componentDidMount() {
		this.setState({
			objectiveDescription: this.props.description,
			objectiveId: this.props.id,
			objectiveLetter: this.props.letter
		})
	}

	sendData() {
		this.props.onUpdate(this.state.objectiveId, this.state.objectiveDescription)
		this.setState({ editMode: false })
	}

	deleteObjective() {
		this.props.delete(this.state.objectiveId)
	}

	render() {
		const { editMode } = this.state
		const closeButton = (
			<button className="close-btn" onClick={this.deleteObjective}>
				✕
			</button>
		)

		return (
			<div className="objective-block">
				<label className="label" htmlFor="objective">
					Objective {this.props.letter}
				</label>
				{closeButton}
				<div className="objective-content" name="objective-content">
					<input
						type="text"
						className="input-item"
						defaultValue={this.state.objectiveDescription}
						onChange={e => this.setState({ objectiveDescription: e.target.value })}
						onFocus={() => this.setState({ editMode: true })}
					/>
					{editMode && (
						<div className="objective--edit-options">
							<span>Edit Objective Id</span>
							<Button onClick={this.sendData}>Done</Button>
						</div>
					)}
				</div>
			</div>
		)
	}
}

export default ObjectiveItem
