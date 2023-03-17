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
		this.state.editData = { id: '', label: '', description: '' }

		this.addObjective = this.props.objectiveContext.addObjective
		this.removeObjective = this.props.objectiveContext.removeObjective
		this.updateObjective = this.props.objectiveContext.updateObjective

		this.createNewObjective = this.createNewObjective.bind(this)
		// this.handleObjectiveInput = this.handleObjectiveInput.bind(this)

		this.objectiveListHeader = (
			<div className="objective-list-header">
				<div className="objective-list-subheader">
					<p>Select one or more objectives that apply to this item</p>
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
			objectives: prevState.objectives.concat(newObjectiveObject),
			globalObjectives: prevState.globalObjectives.concat(newObjectiveObject),
			newObjective: false
		}))
	}

	// handleObjectiveInput(objective) {
	// 	this.setState({ newObjectiveInput: objective.target.value })
	// }

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

	onCheck({ id, label, description }) {
		if (this.state.objectives.filter(o => o.objectiveId === id).length) {
			// local objectives contain objective with objectiveId = 'id' so remove it, since deselecting it
			this.setState(prevState => ({
				objectives: prevState.objectives.filter(o => o.objectiveId !== id)
			}))
		} else {
			// local doesn't contain objective with objectiveId = 'id' so add it
			this.setState(prevState => ({
				objectives: prevState.objectives.concat({ objectiveId: id, objectiveLabel: label, description })
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
					onConfirm={des => this.createNewObjective(des)}
				/>
			)
		}

		return (
			<SimpleDialog
				done
				title="Objective Library"
				onConfirm={() => {
					this.props.onClose(this.state)
				}}
			>
				{this.state.globalObjectives.length > 0 && this.objectiveListHeader}
				<div
					className={
						'objective-list-modal' +
						(this.state.globalObjectives.length === 0 ? ' no-global-objectives' : '')
					}
				>
					{this.state.globalObjectives.map(objective => {
						return (
							<div key={objective.objectiveId}>
								<ObjectiveItem
									id={objective.objectiveId}
									label={objective.objectiveLabel}
									description={objective.description}
									selected={
										this.state.objectives.filter(o => o.objectiveId === objective.objectiveId)
											.length > 0
									}
									onEdit={this.initializeEdit.bind(this)}
									delete={this.deleteObjective.bind(this, objective.objectiveId)}
									onCheck={this.onCheck.bind(this)}
								/>
							</div>
						)
					})}
					{/* TODO: Center the button at the bottom on the modal irrespective of the size or contents of the Objectives modal */}
					<div className="button">
						<Button onClick={() => this.setState({ newObjective: true })}>
							+ Create Objective
						</Button>
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default ObjectiveListModal
