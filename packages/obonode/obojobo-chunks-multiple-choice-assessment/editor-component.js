import React from 'react'

import './editor-component.scss'

const MCAssessment = props => {
	const questionType = props.node.data.get('questionType') || 'default'

	return (
		<div
			className={`component obojobo-draft--chunks--mc-assessment editor--mc-assessment is-type-${questionType}`}
		>
			{props.children}
		</div>
	)
}

export default MCAssessment
