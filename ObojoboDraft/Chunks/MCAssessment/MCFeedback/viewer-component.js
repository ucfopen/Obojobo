import './viewer-component.scss'

import React from 'react'

import Common from 'Common'

const { OboComponent } = Common.components

const MCFeedback = props => (
	<OboComponent
		model={props.model}
		moduleData={props.moduleData}
		className={`obojobo-draft--chunks--mc-assessment--mc-feedback${
			props.model.parent.modelState.score === 100
				? ' is-correct-feedback'
				: ' is-not-correct-feedback'
		}`}
		data-choice-label={props.label}
	>
		{props.model.children.models.map(child => {
			const Component = child.getComponentClass()
			return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
		})}
	</OboComponent>
)

export default MCFeedback
