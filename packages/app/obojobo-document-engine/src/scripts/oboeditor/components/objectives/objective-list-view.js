import React from 'react'
import './objective-list-view.scss'

class ObjectiveListView extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		const objectives = this.props.objectives.filter(o => o.selected === true)
		if (objectives && objectives.length === 0) {
			return null
		}

		return (
			<div className="objective-list-view">
				{objectives.map(
					objective =>
						objective.selected && (
							<div key={objective.objectiveId}>
								{objective.objectiveLabel} {objective.description}
							</div>
						)
				)}
			</div>
		)
	}
}
export default ObjectiveListView
