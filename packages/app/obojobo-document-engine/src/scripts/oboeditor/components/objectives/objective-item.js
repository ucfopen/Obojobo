import './objective-item.scss'
import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'


const { SimpleDialog } = Common.components.modal

class ObjectiveItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editMode: false,
			objectiveId: null,
			objectiveDescription: '',
			objectiveLabel: '',
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
			objectiveLabel: this.props.label,
			selected: this.props.selected
		})
	}

	sendData() {
		this.props.onUpdate(this.state.objectiveId, this.state.objectiveDescription)
		this.setState({ editMode: false })
	}

	deleteObjective() {
		if(confirm("Are you sure you want to delete this objective? This action can't be undone!"))
			{
				this.props.delete(this.state.objectiveId)
			}
		
	}

	handleCheckboxChange() {
		this.props.onCheck(this.state.objectiveId)
		this.setState({ selected: !this.state.selected })
	}

	render() {
		const closeButton = (
			<button className="close-btn" onClick={this.deleteObjective}>
				×
			</button>
		)
		const editButton = (
			<a
				className="edit-link"
				onClick={() =>
					this.props.onEdit({
						id: this.state.objectiveId,
						label: this.state.objectiveLabel,
						description: this.state.objectiveDescription,
						selected: false
					})
				}
			>
				Edit
			</a>
		)

		return (
			<div className={"objective-block"  +
								(this.state.selected
									? ' objective-label-select'
									: '')}
			style = {{backgroundColor: this.state.selected? '#93c6ff' : '#ffffff'}}
			>
				<div className="objective-content" name="objective-content">
					<input
						type="checkbox"
						id={this.state.objectiveId}
						name="objectives[]"
						checked={this.state.selected}
						onChange={this.handleCheckboxChange}
					/>
					<div className= "objective-label"
						onClick={this.handleCheckboxChange}>
						<span>{this.state.objectiveLabel}</span> 
						<span className = "objective-label-span">{this.state.objectiveDescription}</span>
					</div>
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