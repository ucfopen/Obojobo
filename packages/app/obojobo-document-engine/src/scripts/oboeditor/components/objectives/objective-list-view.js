import React from 'react'
import './objective-list-view.scss'

class ObjectiveListView extends React.Component{
    constructor(props){
        super(props)
    }

render(){
    const objectives = this.props.objectives
	const globalObjectives = this.props.globalObjectives
    return(
        objectives && objectives.length > 0 ? (
        <div className="objective-list-view">
            {/* <ol>{globalObjectives.map(objective => {
        if (objectives.includes(objective.objectiveId)) {
            return (
                           <li key={objective.objectiveId}>
                                {objective.objectiveLabel} {objective.description}
                            </li>
                    )
                }
                return null })}</ol> */}
            <table>
					<tbody>
						{globalObjectives.map(objective => {
							if (objectives.includes(objective.objectiveId)) {
								return (
									<tr key={objective.objectiveId}>
                                    <td>
                                        <ul>
                                            <li>{objective.objectiveLabel}</li>
                                        </ul>
                                    </td>
                                    <td>{objective.description}</td>
                                    </tr>
									
								)
							}

							return null
						})}
					</tbody>
				</table>    
		</div>):
        null
    )
}

}
export default ObjectiveListView