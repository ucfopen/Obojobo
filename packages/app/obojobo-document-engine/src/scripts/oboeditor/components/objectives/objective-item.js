import './objective-item.scss'
import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

class ObjectiveItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			handleDelete: false,
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
		this.props.delete(this.state.objectiveId)
		this.setState({handleDelete: false})
	}

	handleCheckboxChange() {
		const status = !this.state.selected
		this.setState({ selected: status })
		this.props.onCheck(this.state.objectiveId, status)
	}

	render() {
		const closeButton = (
			<button className="close-btn" onClick={() => {this.setState({handleDelete: true})}}>
				✕
			</button>
		)
		const editButton = (
			<button
				className="edit-btn"
				onClick={() =>
					this.props.onEdit({
						id: this.state.objectiveId,
						label: this.state.objectiveLabel,
						description: this.state.objectiveDescription,
						selected: false
					})
				}
			>
				✎
			</button>
		)
		if(this.state.handleDelete){
			return(
				<SimpleDialog
				delete
				title="Delete Confirmation"
				onCancel={() => {this.setState({handleDelete: false})}}
				onDelete={this.deleteObjective}
			>
				<div> Are you sure you want to delete the objective "{this.state.objectiveLabel} {this.state.objectiveDescription}"? You cannot undo this action.</div>
			<div> </div>	
			</SimpleDialog>
			)
		}

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
						{this.state.objectiveLabel} {this.state.objectiveDescription}
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