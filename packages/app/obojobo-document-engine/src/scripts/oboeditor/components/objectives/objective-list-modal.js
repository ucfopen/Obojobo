import './objective-list-modal.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import ObjectiveInput from './objective-input'
import {v4 as uuidv4 } from 'uuid';

const { SimpleDialog } = Common.components.modal
const { Button } = Common.components

class ObjectiveListModal extends React.Component {
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();
		this.state = { ...JSON.parse(JSON.stringify(props.content))};
		if(!this.state.objecvites) {
			this.state.objectives = [];
		}

		this.createObjective = this.createObjective.bind(this)
	}

	componentWillUnmount() {
		if (this.props.onClose) this.props.onClose()
	}

	deleteObjective(objectiveID) {
		let letters = [];
		this.state.objectives.forEach((objective) => {
			letters.push(objective.objectiveLetter);
		});

		let objectives = [...this.state.objectives];
		objectives = objectives
			.map((objective) => (objectiveID === objective.objectiveID ? null : objective));

		let newObj = objectives.filter(Boolean);

		newObj = newObj.map((objective, index) => {
			const obj = { objectiveLetter: letters[index] };
			return Object.assign(objective,  obj );
		});

		this.setState({ objectives: newObj });

		// // The nested loop insures that React's immutable state is updated properly
		// return this.setState(prevState => ({
		// 	objectivess: prevState.objectives
		// 		.map((objective, listIndex) => (index === listIndex ? null : objective))
		// 		.filter(Boolean)
		// }))
	}

	createObjective() {
		let id = uuidv4();
        let length = this.state.objectives.length;
		let letter = length < 26 ? String.fromCharCode(65 + length) : String.fromCharCode(97 + length);
		// The nested loop insures that React's immutable state is updated properly
		return this.setState(prevState => ({
			objectives: prevState.objectives.concat({
				objectiveLetter: letter,
				description: "Objective Content",
				objectiveID: id
			})
		}))
	}
	
	onUpdate(id, des) {
		const description = des;
		// The nested loop insures that React's immutable state is updated properly
		return this.setState(prevState => ({
			objectives: prevState.objectives.map((objective) =>
				objective.objectiveID === id ? Object.assign(objective, { description }) : objective
			)
		}))
	}

	render() {

		return (
			<SimpleDialog ok title="Objectives" onConfirm={() => this.props.onClose(this.state)}>
				<div className="objective-list-modal">
					{this.state.objectives.map((objective, objectiveIndex) => {
						return (
						<div key={objective.objectiveID}>
							<ObjectiveInput
								id={objective.objectiveID}
								letter={objective.objectiveLetter}
								description={objective.description}
								onUpdate={(objectiveID, description) => this.onUpdate(objectiveID, description)}
								delete={this.deleteObjective.bind(this, objective.objectiveID)}
							/>
						</div>
					)})}	
					<Button onClick={this.createObjective}>+ Add Objective</Button>
				</div>
			</SimpleDialog>
		)
	}
}

export default ObjectiveListModal
