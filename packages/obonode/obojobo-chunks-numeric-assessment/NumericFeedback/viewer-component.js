import './viewer-component.scss'

import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components

const NumericFeedback = props => (
	<OboComponent
		model={props.model}
		moduleData={props.moduleData}
		className={`obojobo-draft--chunks--numeric-assessment--numeric-feedback`}
	>
		<span className="for-screen-reader-only">. Feedback for this answer:</span>
		{props.model.children.models.map(child => {
			const Component = child.getComponentClass()
			return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
		})}
	</OboComponent>
)

export default NumericFeedback
