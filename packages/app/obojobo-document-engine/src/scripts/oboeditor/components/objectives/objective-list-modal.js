import './objective-list-modal.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import uuid from 'obojobo-document-engine/src/scripts/common/util/uuid'
import ObjectiveItem from './objective-item'
import ObjectiveInput from './objective-input'

const { SimpleDialog } = Common.components.modal
const { Button } = Common.components

class ObjectiveListModal extends React.Component {
	constructor(props) {
		super(props)
		this.inputRef = React.createRef()
		this.state = { ...JSON.parse(JSON.stringify(props.content)) }
		if (!this.state.objectives) {
			this.state.objectives = []
		}
		this.state.newObjective = false
		this.state.newObjectiveInput = ''

		this.createNewObjective = this.createNewObjective.bind(this)
		this.handleObjectiveInput = this.handleObjectiveInput.bind(this)
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

	createNewObjective() {
		const id = uuid()
		const length = this.state.objectives.length
		const letter = length < 26 ? String.fromCharCode(65 + length) : String.fromCharCode(97 + length)

		const newObjectiveObject = {
			objectiveId: id,
			objectiveLetter: letter,
			description: this.state.newObjectiveInput
		}

		this.setState(prevState => ({
			objectives: prevState.objectives.concat(newObjectiveObject),
			newObjective: false
		}))
	}

	handleObjectiveInput(objective) {
		this.setState({ newObjectiveInput: objective.target.value })
	}

	onUpdate(id, des) {
		const description = des
		// The nested loop insures that React's immutable state is updated properly
		return this.setState(prevState => {
			return {
				objectives: prevState.objectives.map(objective =>
					objective.objectiveId === id ? Object.assign(objective, { description }) : objective
				)
			}
		})
	}

	render() {
		return !this.state.newObjective ? (
			<SimpleDialog ok title="Objectives" onConfirm={() => this.props.onClose(this.state)}>
				<div className="objective-list-modal">
					{this.state.objectives.map(objective => {
						return (
							<div key={objective.objectiveId}>
								<ObjectiveItem
									id={objective.objectiveId}
									letter={objective.objectiveLetter}
									description={objective.description}
									onUpdate={(objectiveId, description) => this.onUpdate(objectiveId, description)}
									delete={this.deleteObjective.bind(this, objective.objectiveId)}
								/>
							</div>
						)
					})}
					<Button onClick={() => this.setState({ newObjective: true })}>+ Add Objective</Button>
				</div>
			</SimpleDialog>
		) : (
			<ObjectiveInput
				onCancel={() => this.setState({ newObjective: false })}
				onConfirm={this.createNewObjective}
				handleObjectiveInput={this.handleObjectiveInput}
			/>
		)
	}
}

export default ObjectiveListModal
