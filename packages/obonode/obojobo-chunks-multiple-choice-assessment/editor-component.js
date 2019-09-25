import React from 'react'

import './editor-component.scss'

const MCAssessment = props => {
	const questionType = props.node.data.get('questionType') || 'default'

	return (
		<div
			className={`component obojobo-draft--chunks--mc-assessment is-response-type-pick-one-multiple-correct is-mode-practice is-not-showing-explanation is-not-scored is-type-${questionType}`}
		>
			{props.children}
		</div>
	)
}

export default MCAssessment
