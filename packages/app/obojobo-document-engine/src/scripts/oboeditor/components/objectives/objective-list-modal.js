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
		this.state = {
			objectives: this.props.content.objectives ?? [],
			globalObjectives: this.props.objectiveContext.objectives ?? []
		}

		this.state.newObjective = false

		this.state.editMode = false
		this.state.editData = null

		this.addObjective = this.props.objectiveContext.addObjective
		this.removeObjective = this.props.objectiveContext.removeObjective
		this.updateObjective = this.props.objectiveContext.updateObjective

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
		this.setState(prevState => {
			const objectives = prevState.objectives.filter(objective => objective !== objectiveID)
			return {
				...prevState,
				objectives
			}
		})

		this.setState(prevState => {
			const globalObjectives = prevState.globalObjectives.filter(
				objective => objective.objectiveId !== objectiveID
			)
			return {
				...prevState,
				globalObjectives
			}
		})

		this.removeObjective(objectiveID)

		// // The nested loop insures that React's immutable state is updated properly
		// return this.setState(prevState => ({
		// 	objectivess: prevState.objectives
		// 		.map((objective, listIndex) => (index === listIndex ? null : objective))
		// 		.filter(Boolean)
		// }))
	}

	createNewObjective({ label, description }) {
		const id = uuid()

		const newObjectiveObject = {
			objectiveId: id,
			objectiveLabel: label,
			description
		}

		this.addObjective(newObjectiveObject)

		this.setState(prevState => ({
			objectives: prevState.objectives.concat(id),
			globalObjectives: prevState.globalObjectives.concat(newObjectiveObject),
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
		this.setState(prevState => {
			return {
				globalObjectives: prevState.globalObjectives.map(objective =>
					objective.objectiveId === id
						? Object.assign(objective, { objectiveLabel: label, description })
						: objective
				)
			}
		})

		this.updateObjective(id, label, description)
	}

	onCheck(id) {
		if (this.state.objectives.includes(id)) {
			this.setState(prevState => ({
				objectives: prevState.objectives.filter(objective => objective !== id)
			}))
		} else {
			this.setState(prevState => ({
				objectives: prevState.objectives.concat(id)
			}))
		}
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
					onConfirm={state => this.createNewObjective(state)}
				/>
			)
		}

		return (
			<SimpleDialog addOrCancel title="Objectives" onConfirm={() => this.props.onClose(this.state)}>
				{this.state.globalObjectives.length > 0 && this.objectiveListHeader}
				<div className="objective-list-modal">
					{this.state.globalObjectives.map(objective => {
						return (
							<div key={objective.objectiveId}>
								<ObjectiveItem
									id={objective.objectiveId}
									label={objective.objectiveLabel}
									description={objective.description}
									selected={this.state.objectives.includes(objective.objectiveId)}
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
