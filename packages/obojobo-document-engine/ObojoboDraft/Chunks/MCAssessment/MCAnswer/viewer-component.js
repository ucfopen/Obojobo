import './viewer-component.scss'

import React from 'react'

import Common from 'Common'

const { OboComponent } = Common.components

const MCAnswer = props => (
	<OboComponent
		model={props.model}
		moduleData={props.moduleData}
		className="obojobo-draft--chunks--mc-assessment--mc-answer"
	>
		{props.model.children.models.map(child => {
			const Component = child.getComponentClass()
			return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
		})}
	</OboComponent>
)

export default MCAnswer
