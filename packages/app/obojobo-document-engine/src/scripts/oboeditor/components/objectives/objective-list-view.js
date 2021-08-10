import React from 'react'
import './objective-list-view.scss'

class ObjectiveListView extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		const objectives = this.props.objectives
		const globalObjectives = this.props.globalObjectives

		if (!objectives) {
			return null
		}

		return (
			<div className="objective-list-view">
				{globalObjectives.map(objective => {
					if (objectives.includes(objective.objectiveId)) {
						return (
							<div key={objective.objectiveId}>
								{objective.objectiveLabel} {objective.description}
							</div>
						)
					}

					return null
				})}
			</div>
		)
	}
}
export default ObjectiveListView
