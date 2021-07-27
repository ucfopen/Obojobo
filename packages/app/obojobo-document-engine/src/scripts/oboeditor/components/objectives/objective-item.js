import './objective-item.scss'
import React from 'react'

class ObjectiveItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editMode: false,
			objectiveId: null,
			objectiveDescription: '',
			objectiveLetter: '',
			selected: false
		}

		this.sendData = this.sendData.bind(this)
		this.deleteObjective = this.deleteObjective.bind(this)
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
	}

	componentDidMount() {
		this.setState({
			objectiveDescription: this.props.description,
			objectiveId: this.props.id,
			objectiveLetter: this.props.letter,
			selected: this.props.selected
		})
	}

	sendData() {
		this.props.onUpdate(this.state.objectiveId, this.state.objectiveDescription)
		this.setState({ editMode: false })
	}

	deleteObjective() {
		this.props.delete(this.state.objectiveId)
	}

	handleCheckboxChange() {
		const status = !this.state.selected
		this.setState({ selected: status })
		this.props.onCheck(this.state.objectiveId, status)
	}

	render() {
		const closeButton = (
			<button className="close-btn" onClick={this.deleteObjective}>
				✕
			</button>
		)
		const editButton = (
			<button
				className="edit-btn"
				onClick={() =>
					this.props.onEdit({
						id: this.state.objectiveId,
						letter: this.state.objectiveLetter,
						description: this.state.objectiveDescription,
						selected: false
					})
				}
			>
				✎
			</button>
		)

		return (
			<div className="objective-block">
				<div className="objective-content" name="objective-content">
					<input
						type="checkbox"
						id={this.state.objectiveId}
						name="objectives[]"
						checked={this.state.selected}
						onClick={this.handleCheckboxChange}
					/>
					<p className="objective-label" onClick={this.handleCheckboxChange}>
						{this.state.objectiveDescription}
					</p>
				</div>
				<div className="objective-options">
					<span>{editButton}</span>
					<span>{closeButton}</span>
				</div>
			</div>
		)
	}
}

export default ObjectiveItem
