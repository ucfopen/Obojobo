import React from 'react'
import './objective-list-view.scss'

class ObjectiveListView extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const objectives = this.props.objectives
		const globalObjectives = this.props.globalObjectives
		const type = this.props.type
		const moduleType = 'ObojoboDraft.Modules.Module'

		if (!objectives) return null

		return (
			<div className="objective-list-view">
				<ul>
					{globalObjectives.map(objective => {
						if (
							type === moduleType ||
							objectives.filter(o => o.objectiveId === objective.objectiveId).length > 0
						) {
							return (
								<li key={objective.objectiveId}>
									<label>{objective.objectiveLabel}</label>
									<p>{objective.description}</p>
								</li>
							)
						}

						return null
					})}
				</ul>
			</div>
		)
	}
}
export default ObjectiveListView
