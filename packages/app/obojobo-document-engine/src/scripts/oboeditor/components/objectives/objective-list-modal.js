import './objective-list-modal.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import uuid from 'obojobo-document-engine/src/scripts/common/util/uuid'
import ObjectiveItem from './objective-item'
import ObjectiveInput from './objective-input'
import ObjectiveEdit from './objective-edit'

const { SimpleDialog } = Common.components.modal
const { Button } = Common.components

class ObjectiveListModal extends React.Component {
	constructor(props) {
		super(props)
		this.inputRef = React.createRef()
		this.state = { ...JSON.parse(JSON.stringify(props.content)) }
		if (!this.state.objectives) {
			this.state.objectives = []
		} else {
			this.state.objectives = this.state.objectives.map(objective => {
				return {
					objectiveId: objective.objectiveId,
					objectiveLabel: objective.objectiveLabel,
					description: objective.description,
					selected: objective.selected
				}
			})
		}

		this.state.newObjective = false

		this.state.editMode = false
		this.state.editData = null

		this.createNewObjective = this.createNewObjective.bind(this)
		this.handleObjectiveInput = this.handleObjectiveInput.bind(this)

		this.objectiveListHeader = (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '0.5em 1.25em',
					margin: '0em 0.5em 0.1em 0em',
					fontWeight: 'bold'
				}}
			>
				<div>
					<p style={{ margin: 0, fontSize: '0.6em' }}>
						<span>Select&nbsp;&nbsp;</span>
						Objective
					</p>
				</div>
				<div style={{ fontSize: '0.6em' }}>
					<span>Edit&nbsp;</span>
					<span>&nbsp;&nbsp;Delete</span>
				</div>
			</div>
		)
	}

	componentWillUnmount() {
		if (this.props.onClose) this.props.onClose()
	}

	deleteObjective(objectiveID) {
		const letters = []
		this.state.objectives.forEach(objective => {
			letters.push(objective.objectiveLetter)
		})

		let objectives = [...this.state.objectives]
		objectives = objectives.map(objective =>
			objectiveID === objective.objectiveId ? null : objective
		)

		let newObj = objectives.filter(Boolean)

		newObj = newObj.map((objective, index) => {
			const obj = { objectiveLetter: letters[index] }
			return Object.assign(objective, obj)
		})

		this.setState({ objectives: newObj })

		// // The nested loop insures that React's immutable state is updated properly
		// return this.setState(prevState => ({
		// 	objectivess: prevState.objectives
		// 		.map((objective, listIndex) => (index === listIndex ? null : objective))
		// 		.filter(Boolean)
		// }))
	}
	deleteBulkObjective(obj){
		console.log(obj)
		let objectives = obj && obj.filter(objective => objective.selected === true)
		console.log(objectives)
		objectives.map(objective => {console.log(objective.objectiveId)
			this.deleteObjective(objective.objectiveID)})
		// this.props.onClose(this.state)
	}

	createNewObjective({ label, description }) {
		const id = uuid()
		const length = this.state.objectives.length
		const letter = length < 26 ? String.fromCharCode(65 + length) : String.fromCharCode(97 + length)

		const newObjectiveObject = {
			objectiveId: id,
			objectiveLabel: label,
			description
		}

		this.setState(prevState => ({
			objectives: prevState.objectives.concat(newObjectiveObject),
			newObjective: false
		}))
	}

	handleObjectiveInput(objective) {
		this.setState({ newObjectiveInput: objective.target.value })
	}

	initializeEdit(data) {
		this.setState({ editMode: true, editData: data })
	}

	onUpdate({ id, label, description }) {
		// The nested loop insures that React's immutable state is updated properly
		return this.setState(prevState => {
			return {
				objectives: prevState.objectives.map(objective =>
					objective.objectiveId === id
						? Object.assign(objective, { objectiveLabel: label, description })
						: objective
				)
			}
		})
	}

	onCheck(id, status) {
		this.setState(prevState => {
			return {
				objectives: prevState.objectives.map(objective =>
					objective.objectiveId === id ? Object.assign(objective, { selected: status }) : objective
				)
			}
		})
	}

	render() {
		if (this.state.editMode) {
			// Edit Dialog Popup
			return (
				<ObjectiveEdit
					data={this.state.editData}
					onCancel={() => this.setState({ editMode: false })}
					onConfirm={state => {
						this.onUpdate(state)
						this.setState({ editMode: false })
					}}
				/>
			)
		}

		if (this.state.newObjective) {
			// New Objective Dialog Popup
			return (
				<ObjectiveInput
					onCancel={() => this.setState({ newObjective: false })}
					onConfirm={des => this.createNewObjective(des)}
				/>
			)
		}

		return (
			
			<SimpleDialog addOrCancel title="Objective Library" 
				onConfirm={() => {this.props.onClose(this.state)}}
				onDelete ={() => {this.deleteBulkObjective(this.state.objectives)}}
				>
				{this.state.objectives.length > 0 && this.objectiveListHeader}
				<div className="objective-list-modal">
					{this.state.objectives.map(objective => {
						return (
							<div key={objective.objectiveId}>
								<ObjectiveItem
									id={objective.objectiveId}
									label={objective.objectiveLabel}
									description={objective.description}
									selected={objective.selected}
									onEdit={this.initializeEdit.bind(this)}
									delete={this.deleteObjective.bind(this, objective.objectiveId)}
									onCheck={this.onCheck.bind(this)}
								/>
							</div>
						)
					})}
					<Button onClick={() => this.setState({ newObjective: true })}>+ Create Objective</Button>
				</div>
			</SimpleDialog>
		)
	}
}

export default ObjectiveListModal