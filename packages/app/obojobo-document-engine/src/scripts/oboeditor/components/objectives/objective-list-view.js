import React from 'react'
import './objective-list-view.scss'

class ObjectiveListView extends React.Component{
    constructor(props){
        super(props)
    }
render(){
    let objectives = this.props.objectives
    objectives = objectives && objectives.filter(objective => objective.selected === true)
    return(
        objectives && objectives.length > 0 ? (
        <div className="objective-list-view">
			
			{ 
				objectives.map(
				    (objective) => 
                                        <div>
                                            {objective.objectiveLabel} {objective.description}
                                        </div>
                    
				)
			}
		</div>):
        null
    )
}

}
export default ObjectiveListView