import './viewer-component.scss'

import React from 'react'

const QuestionContent = props => (
	<div className="obojobo-draft--chunks--mc-question--content">
		{props.model.children.models.slice(0, -1).map(child => {
			const Component = child.getComponentClass()
			return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
		})}
	</div>
)

export default QuestionContent
