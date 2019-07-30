import './viewer-component.scss'

import React from 'react'
import { useSelector } from 'react-redux'

import { Registry } from 'Common'

const QuestionContent = props => {
	const childrenIndexes = useSelector(state => state.adjList[props.index])
	const oboNodeList = useSelector(state => state.oboNodeList)

	return (
		<div className="obojobo-draft--chunks--mc-question--content">
			{/* {props.model.children.models.slice(0, -1).map(child => {
				const Component = child.getComponentClass()
				return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
			})} */}
			{childrenIndexes.slice(0, -1).map(oboNodeIndex => {
				const model = oboNodeList[oboNodeIndex]
				const Component = Registry.getItemForType(model.attributes.type).componentClass
				return <Component key={model.attributes.id} model={model} moduleData={props.moduleData} />
			})}
		</div>
	)
}

export default QuestionContent
