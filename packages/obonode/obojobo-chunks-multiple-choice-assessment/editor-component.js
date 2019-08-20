import React from 'react'

import './editor-component.scss'

class MCAssessment extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const questionType = this.props.node.data.get('questionType') || 'default'

		return (
			<div
				className={`component obojobo-draft--chunks--mc-assessment is-response-type-pick-one-multiple-correct is-mode-practice is-not-showing-explanation is-not-scored is-type-${questionType}`}
			>
				{this.props.children}
			</div>
		)
	}
}

export default MCAssessment
