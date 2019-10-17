import './viewer-component.scss'

import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components

const MCFeedback = props => (
	<OboComponent
		model={props.model}
		moduleData={props.moduleData}
		className={`obojobo-draft--chunks--numeric-assessment--numeric-feedback${
			3
			// props.model.parent.modelState.score === 100
			// 	? ' is-correct-feedback'
			// 	: ' is-not-correct-feedback'
		}`}
	>
		<span className="for-screen-reader-only">. Feedback for your answer:</span>
		{props.model.children.models.map(child => {
			const Component = child.getComponentClass()
			return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
		})}
	</OboComponent>
)

export default MCFeedback
